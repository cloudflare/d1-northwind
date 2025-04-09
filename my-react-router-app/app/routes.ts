import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/customers", "routes/customers.tsx"),
] satisfies RouteConfig;
