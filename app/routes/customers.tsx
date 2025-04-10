import { Link, useNavigate } from "react-router";
import { prepareStatements, createSQLLog } from "~/lib/utils";
import { Paginate } from "~/components";

import type { Route } from "./+types/customers";

interface Customer {
  Id: string;
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Country: string;
  Phone: string;
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = context.cloudflare.env.DB.withSession("first-unconstrained");
  const { searchParams } = new URL(request.url);
  const count = true;
  const page = parseInt(searchParams.get("page") as string) || 1;
  const itemsPerPage = 20;
  const [stmts, sql] = prepareStatements(
    session,
    count ? "Customer" : false,
    [
      "SELECT Id, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax FROM Customer LIMIT ?1 OFFSET ?2",
    ],
    [[itemsPerPage, (page - 1) * itemsPerPage]]
  );
  try {
    const startTime = Date.now();

    const response: D1Result<any>[] = await session.batch(
      stmts as D1PreparedStatement[]
    );
    const overallTimeMs = Date.now() - startTime;

    const first = response[0];
    const total = count && first.results ? (first.results[0] as any).total : 0;
    const customers: any = count
      ? response.slice(1)[0].results
      : response[0].results;
    return {
      page: page,
      pages: count ? Math.ceil(total / itemsPerPage) : 0,
      items: itemsPerPage,
      total: count ? total : 0,
      stats: {
        queries: stmts.length,
        results: customers.length + (count ? 1 : 0),
        select: stmts.length,
        log: createSQLLog(sql, response, overallTimeMs),
      },
      customers: customers,
    };
  } catch (e: any) {
    return { error: 404, msg: e.toString() };
  }
}

export default function Customers({ loaderData }: Route.ComponentProps) {
  const { customers, page, pages } = loaderData;

  const navigate = useNavigate();
  const setPage = (page: number) => {
    navigate(`/customers?page=${page}`);
  };

  return (
    <>
      {customers.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Customers</p>
            <button className="card-header-icon">
              <span
                className="material-icons"
                onClick={() => {
                  //eslint-disable-next-line
                  window.location.href = window.location.href;
                }}
              >
                redo
              </span>
            </button>
          </header>
          <div className="card-content">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer: Customer, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="image-cell">
                        <div className="image">
                          <img
                            alt="Customer avatar"
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                              customer.ContactName.split(" ")[0]
                            }-${customer.ContactName.split(" ").slice(-1)[0]}`}
                            className="rounded-full"
                          />
                        </div>
                      </td>
                      <td data-label="Company">
                        <Link className="link" to={`/customer/${customer.Id}`}>
                          {customer.CompanyName}
                        </Link>
                      </td>
                      <td data-label="Contact">{customer.ContactName}</td>
                      <td data-label="Title">{customer.ContactTitle}</td>
                      <td data-label="City">{customer.City}</td>
                      <td data-label="Country">{customer.Country}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {pages && page && setPage && (
              <Paginate pages={pages} page={page} setPage={setPage} />
            )}
          </div>
        </div>
      ) : (
        <div className="card-content">
          <h2>No results</h2>
        </div>
      )}
    </>
  );
}
