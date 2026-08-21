import { getSession } from "./db";
import { createSQLLog, type StatsEvent } from "./utils";

export interface ProductSearchItem {
  id: number;
  name: string;
  quantityPerUnit: string | null;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
}

export interface CustomerSearchItem {
  id: string;
  companyName: string | null;
  contactName: string | null;
  contactTitle: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
}

export type SearchTarget = "product" | "customer";

export type SearchResult =
  | {
      status: "invalid";
      target: SearchTarget;
      query: string;
      message: string;
    }
  | { status: "idle"; target: SearchTarget; query: "" }
  | {
      status: "results";
      target: "product";
      query: string;
      truncated: boolean;
      items: ProductSearchItem[];
      activity: StatsEvent;
    }
  | {
      status: "results";
      target: "customer";
      query: string;
      truncated: boolean;
      items: CustomerSearchItem[];
      activity: StatsEvent;
    };

interface ProductSearchRow {
  Id: number;
  ProductName: string;
  QuantityPerUnit: string | null;
  UnitPrice: number;
  UnitsInStock: number;
  UnitsOnOrder: number;
}

interface CustomerSearchRow {
  Id: string;
  CompanyName: string | null;
  ContactName: string | null;
  ContactTitle: string | null;
  City: string | null;
  Country: string | null;
  Phone: string | null;
}

function literalLikePattern(query: string): string {
  return `%${query.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
}

async function executeSearch<T>(sql: string, pattern: string) {
  const startTime = Date.now();
  const response = await getSession()
    .prepare(sql)
    .bind(pattern)
    .all<T>();
  const overallTimeMs = Date.now() - startTime;

  return {
    response,
    activity: {
      queries: 1,
      results: response.results.length,
      select_where: 1,
      log: createSQLLog([sql], [response], overallTimeMs),
    } satisfies StatsEvent,
  };
}

export async function search(
  target: SearchTarget,
  rawQuery: string | null,
): Promise<SearchResult> {
  const query = (rawQuery ?? "").trim();
  if (query.length > 200) {
    return {
      status: "invalid",
      target,
      query,
      message: "Search query must be 200 characters or fewer.",
    };
  }

  if (!query) return { status: "idle", target, query: "" };

  const pattern = literalLikePattern(query);

  if (target === "customer") {
    const sql =
      "SELECT Id, CompanyName, ContactName, ContactTitle, City, Country, Phone FROM Customer WHERE CompanyName LIKE ?1 ESCAPE '\\' OR ContactName LIKE ?1 ESCAPE '\\' OR ContactTitle LIKE ?1 ESCAPE '\\' OR Address LIKE ?1 ESCAPE '\\' ORDER BY CompanyName, Id LIMIT 21";
    const { response, activity } = await executeSearch<CustomerSearchRow>(
      sql,
      pattern,
    );

    return {
      status: "results",
      target,
      query,
      truncated: response.results.length > 20,
      items: response.results.slice(0, 20).map((row) => ({
        id: row.Id,
        companyName: row.CompanyName,
        contactName: row.ContactName,
        contactTitle: row.ContactTitle,
        city: row.City,
        country: row.Country,
        phone: row.Phone,
      })),
      activity,
    };
  }

  const sql =
    "SELECT Id, ProductName, QuantityPerUnit, UnitPrice, UnitsInStock, UnitsOnOrder FROM Product WHERE ProductName LIKE ?1 ESCAPE '\\' ORDER BY ProductName, Id LIMIT 21";
  const { response, activity } = await executeSearch<ProductSearchRow>(
    sql,
    pattern,
  );

  return {
    status: "results",
    target: "product",
    query,
    truncated: response.results.length > 20,
    items: response.results.slice(0, 20).map((row) => ({
      id: row.Id,
      name: row.ProductName,
      quantityPerUnit: row.QuantityPerUnit,
      unitPrice: row.UnitPrice,
      unitsInStock: row.UnitsInStock,
      unitsOnOrder: row.UnitsOnOrder,
    })),
    activity,
  };
}
