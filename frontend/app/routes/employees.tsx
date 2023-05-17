import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paginate } from "~/components";
import { useStatsDispatch } from "~/components/StatsContext";

import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const page = Number(url.searchParams.get("page")) || 1;
  const count = url.searchParams.get("count");
  const search = url.searchParams.get("search");

  const rand = Math.floor(Math.random() * 1000001);
  const path = `${
    process.env.NODE_ENV === "production"
      ? "https://api.northwind.d1sql.com"
      : "http://127.0.0.1:8787"
  }/api/employees?page=${page}${Number(count) > 0 ? `` : `&count=true`}${
    search ? `&search=${search}` : ""
  }&rand=${rand}`;

  const res = await fetch(path);
  const result = (await res.json()) as any;

  return json({ ...result });
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

const Employees = () => {
  const data = useLoaderData<LoaderType>();
  const navigate = useNavigate();
  const { employees, page, pages } = data;
  const dispatch = useStatsDispatch();

  useEffect(() => {
    dispatch && data.stats && dispatch(data.stats);
  }, [dispatch, data.stats]);

  const setPage = (page: number) => {
    navigate(`/employees?page=${page}`);
  };

  return (
    <>
      {employees.length ? (
        <div className="card has-table">
          <header className="card-header">
            <p className="card-header-title">Employees</p>
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
                  <th>Name</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="image-cell">
                        <div className="image">
                          <img
                            alt="employee avatar"
                            src={`https://avatars.dicebear.com/v2/initials/${employee.FirstName[0]}-${employee.LastName[0]}.svg`}
                            className="rounded-full"
                          />
                        </div>
                      </td>
                      <td data-label="Name">
                        <Link
                          className="link"
                          to={`/employee/${employee.Id}`}
                        >{`${employee.FirstName} ${employee.LastName}`}</Link>
                      </td>
                      <td data-label="Title">{employee.Title}</td>
                      <td data-label="City">{employee.City}</td>
                      <td data-label="Phone">{employee.HomePhone}</td>
                      <td data-label="Country">{employee.Country}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Paginate pages={pages} page={page} setPage={setPage} />
          </div>
        </div>
      ) : (
        <div className="card-content">
          <h2>No results</h2>
        </div>
      )}
    </>
  );
};

export default Employees;
