import { env } from "cloudflare:workers";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { search } from "./search";

const PRODUCT_TABLE_SQL = `CREATE TABLE Product (
  Id INTEGER PRIMARY KEY,
  ProductName TEXT,
  SupplierId INTEGER NOT NULL,
  CategoryId INTEGER NOT NULL,
  QuantityPerUnit TEXT,
  UnitPrice DECIMAL NOT NULL,
  UnitsInStock INTEGER NOT NULL,
  UnitsOnOrder INTEGER NOT NULL,
  ReorderLevel INTEGER NOT NULL,
  Discontinued INTEGER NOT NULL
)`;

beforeAll(async () => {
  await env.DB.batch([
    env.DB.prepare(PRODUCT_TABLE_SQL),
    env.DB.prepare(`CREATE TABLE Customer (
      Id TEXT PRIMARY KEY,
      CompanyName TEXT,
      ContactName TEXT,
      ContactTitle TEXT,
      Address TEXT,
      City TEXT,
      Region TEXT,
      PostalCode TEXT,
      Country TEXT,
      Phone TEXT,
      Fax TEXT
    )`),
  ]);
});

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM Product"),
    env.DB.prepare("DELETE FROM Customer"),
    env.DB.prepare(
      "INSERT INTO Product VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).bind(1, "Chai", 1, 1, "10 boxes x 20 bags", 18, 39, 0, 10, 0),
    env.DB.prepare(
      "INSERT INTO Customer VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).bind(
      "ALFKI",
      "Alfreds Futterkiste",
      "Maria Anders",
      "Sales Representative",
      "Obere Str. 57",
      "Berlin",
      null,
      "12209",
      "Germany",
      "030-0074321",
      "030-0076545",
    ),
  ]);
});

describe("Search", () => {
  it("defaults a missing target to Product", async () => {
    const result = await search("product", "chai");

    expect(result).toMatchObject({
      status: "results",
      target: "product",
      query: "chai",
      truncated: false,
      items: [{ id: 1, name: "Chai", unitsOnOrder: 0 }],
    });
  });

  it("treats a whitespace-only query as idle", async () => {
    await expect(search("product", "   ")).resolves.toEqual({
      status: "idle",
      target: "product",
      query: "",
    });
  });

  it("returns Customer matches with a distinct result shape", async () => {
    const result = await search("customer", "maria");

    expect(result).toMatchObject({
      status: "results",
      target: "customer",
      query: "maria",
      items: [
        {
          id: "ALFKI",
          companyName: "Alfreds Futterkiste",
          contactName: "Maria Anders",
          contactTitle: "Sales Representative",
          city: "Berlin",
          country: "Germany",
          phone: "030-0074321",
        },
      ],
    });
  });

  it("rejects a normalized query longer than 200 characters", async () => {
    const query = "x".repeat(201);

    await expect(
      search("product", ` ${query} `),
    ).resolves.toEqual({
      status: "invalid",
      target: "product",
      query,
      message: "Search query must be 200 characters or fewer.",
    });
  });

  it("treats SQL wildcard characters as literal Search text", async () => {
    const insert = env.DB.prepare(
      "INSERT INTO Product VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    await env.DB.batch([
      insert.bind(2, "100% Bran", 1, 1, "1 box", 5, 10, 0, 0, 0),
      insert.bind(3, "100X Bran", 1, 1, "1 box", 5, 10, 0, 0, 0),
      insert.bind(4, "Under_score", 1, 1, "1 box", 5, 10, 0, 0, 0),
      insert.bind(5, "UnderXscore", 1, 1, "1 box", 5, 10, 0, 0, 0),
    ]);

    const percent = await search("product", "%");
    const underscore = await search("product", "_");

    expect(percent).toMatchObject({ items: [{ name: "100% Bran" }] });
    expect(underscore).toMatchObject({ items: [{ name: "Under_score" }] });
  });

  it("returns completed SQL activity with Search results", async () => {
    const result = await search("product", "chai");

    expect(result).toMatchObject({
      status: "results",
      activity: {
        queries: 1,
        results: 1,
        select_where: 1,
        log: {
          type: "sql",
          queries: [
            {
              query: expect.stringContaining("FROM Product"),
              served_by: expect.any(String),
              duration: expect.any(Number),
            },
          ],
          overallTimeMs: expect.any(Number),
        },
      },
    });
  });

  it("orders matches by display name and reports truncation", async () => {
    const insert = env.DB.prepare(
      "INSERT INTO Product VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    await env.DB.batch(
      Array.from({ length: 21 }, (_, index) => {
        const number = String(21 - index).padStart(2, "0");
        return insert.bind(
          index + 2,
          `Match ${number}`,
          1,
          1,
          "1 box",
          5,
          10,
          0,
          0,
          0,
        );
      }),
    );

    const result = await search("product", "match");

    expect(result).toMatchObject({
      status: "results",
      target: "product",
      truncated: true,
      activity: { results: 21 },
    });
    if (result.status !== "results" || result.target !== "product") {
      throw new Error("Expected Product Search results");
    }
    expect(result.items).toHaveLength(20);
    expect(result.items[0].name).toBe("Match 01");
    expect(result.items[19].name).toBe("Match 20");
  });

  it("searches the resolved Customer fields but not Phone", async () => {
    const insert = env.DB.prepare(
      "INSERT INTO Customer VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    );
    await env.DB.batch([
      insert.bind(
        "ADDR1",
        "Address Match",
        "No Match",
        "Owner",
        "Needle Road",
        "Pune",
        null,
        "411001",
        "India",
        "000",
        null,
      ),
      insert.bind(
        "PHONE1",
        "Phone Only",
        "No Match",
        "Owner",
        "Plain Road",
        "Pune",
        null,
        "411001",
        "India",
        "555-NEEDLE",
        null,
      ),
    ]);

    const result = await search("customer", "needle");

    expect(result).toMatchObject({
      status: "results",
      target: "customer",
      items: [{ id: "ADDR1" }],
    });
  });

  it("propagates an unexpected D1 failure", async () => {
    await env.DB.prepare("DROP TABLE Product").run();

    try {
      await expect(
        search("product", "chai"),
      ).rejects.toThrow();
    } finally {
      await env.DB.prepare(PRODUCT_TABLE_SQL).run();
    }
  });
});
