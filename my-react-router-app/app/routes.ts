import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/dash", "routes/dash.tsx"),
  route("/customers", "routes/customers.tsx"),
  route("/customer/:id", "routes/customer.$id.tsx"),
  route("/employees", "routes/employees.tsx"),
  route("/employee/:id", "routes/employee.$id.tsx"),
  route("/suppliers", "routes/suppliers.tsx"),
  route("/supplier/:id", "routes/supplier.$id.tsx"),
  route("/products", "routes/products.tsx"),
  route("/product/:id", "routes/product.$id.tsx"),
  route("/orders", "routes/orders.tsx"),
  route("/order/:id", "routes/order.$id.tsx"),
  route("/search", "routes/search.tsx"),
] satisfies RouteConfig;
