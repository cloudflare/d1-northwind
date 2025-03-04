import { createSQLLog, prepareStatements } from "../tools";

const apiEmployees = () => {
  return {
    path: "employees",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const count = searchParams.get("count");
      const page = parseInt(searchParams.get("page") as string) || 1;
      const itemsPerPage = 20;
      const [stmts, sql] = prepareStatements(
        session,
        count ? "Employee" : false,
        [
          "SELECT Id, LastName, FirstName, Title, TitleOfCourtesy, BirthDate, HireDate, Address, City, Region, PostalCode, Country, HomePhone, Extension, Photo, Notes, ReportsTo, PhotoPath FROM Employee LIMIT ?1 OFFSET ?2",
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
        const total =
          count && first.results ? (first.results[0] as any).total : 0;
        const employees: any = count
          ? response.slice(1)[0].results
          : response[0].results;
        return {
          page: page,
          pages: count ? Math.ceil(total / itemsPerPage) : 0,
          items: itemsPerPage,
          total: count ? total : 0,
          stats: {
            queries: stmts.length,
            results: employees.length + (count ? 1 : 0),
            select: stmts.length,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, response, overallTimeMs),
          },
          employees: employees,
        };
      } catch (e: any) {
        return { error: 404, msg: e.toString() };
      }
    },
  };
};

const apiEmployee = () => {
  return {
    path: "employee",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      const session = env.DB.withSession("first-unconstrained");
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("Id");
      const [stmts, sql] = prepareStatements(
        session,
        false,
        [
          "SELECT Report.Id AS ReportId, Report.FirstName AS ReportFirstName, Report.LastName AS ReportLastName, Employee.Id, Employee.LastName, Employee.FirstName, Employee.Title, Employee.TitleOfCourtesy, Employee.BirthDate, Employee.HireDate, Employee.Address, Employee.City, Employee.Region, Employee.PostalCode, Employee.Country, Employee.HomePhone, Employee.Extension, Employee.Photo, Employee.Notes, Employee.ReportsTo, Employee.PhotoPath FROM Employee LEFT JOIN Employee AS Report ON Report.Id = Employee.ReportsTo WHERE Employee.Id = ?1",
        ],
        [[id]]
      );
      try {
        const startTime = Date.now();
        const employee: any = await (stmts[0] as D1PreparedStatement).all();
        const overallTimeMs = Date.now() - startTime;

        return {
          stats: {
            queries: 1,
            results: 1,
            select_leftjoin: 1,
            overallTimeMs: overallTimeMs,
            log: createSQLLog(sql, [employee], overallTimeMs),
          },
          employee: employee.results[0],
        };
      } catch (e: any) {
        return { error: 404, msg: e.toString() };
      }
    },
  };
};

interface Env {
  DB: D1Database;
}

export { apiEmployees, apiEmployee };
