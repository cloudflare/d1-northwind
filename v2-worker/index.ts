import { apiStatus } from "./lib/api/status";
import { apiSuppliers, apiSupplier } from "./lib/api/suppliers";
import { apiProducts, apiProduct } from "./lib/api/products";
import { apiOrders, apiOrder } from "./lib/api/orders";
import { apiEmployees, apiEmployee } from "./lib/api/employees";
import { apiCustomer, apiCustomers } from "./lib/api/customers";
import { apiSearch } from "./lib/api/search";

interface Env {
  DB: D1Database;
}

// insert API endpoints here
const apiEndpoints: Array<any> = [];
apiEndpoints.push(apiStatus());
apiEndpoints.push(apiSupplier());
apiEndpoints.push(apiSuppliers());
apiEndpoints.push(apiProduct());
apiEndpoints.push(apiProducts());
apiEndpoints.push(apiOrders());
apiEndpoints.push(apiOrder());
apiEndpoints.push(apiEmployee());
apiEndpoints.push(apiEmployees());
apiEndpoints.push(apiCustomer());
apiEndpoints.push(apiCustomers());
apiEndpoints.push(apiSearch());

export default {
  async fetch(request: Request, env: Env) {
    try {
      return handleRequest(request, env);
    } catch (e) {
      return new Response(`${e}`);
    }
  },
};

async function jsonReply(json: object, status = 200) {
  return new Response(JSON.stringify(json), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "*",
    },
    status: status,
  });
}

async function handleRequest(request: Request, env: Env) {
  let url = new URL(request.url);
  let [path, param] = url.pathname.slice(1).split("/");

  if (!path.includes("api")) {
    return new Response("Not found", { status: 404 });
  }
  const api = apiEndpoints
    .map((ep) => `${ep.method},${ep.path}`)
    .indexOf(`${request.method},${param}`);

  const apiResult = await apiEndpoints[api].handler(request, env);
  return jsonReply(apiResult, apiResult.error ? apiResult.error : 200);
}
