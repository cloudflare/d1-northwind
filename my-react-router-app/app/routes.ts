import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/dash", "routes/dash.tsx"),
  route("/customers", "routes/customers.tsx"),
  route("/customer/:id", "routes/customer.$id.tsx"),
] satisfies RouteConfig;
