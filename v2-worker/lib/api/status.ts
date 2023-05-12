const apiStatus = () => {
  return {
    path: "status",
    method: "GET",
    handler: async (request: Request, env: Env) => {
      return {
        cf: request.cf,
      };
    },
  };
};

interface Env {
  DB: D1Database;
}

export { apiStatus };
