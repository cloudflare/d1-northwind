import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/dash": {};
  "/customers": {};
  "/customer/:id": {
    "id": string;
  };
  "/employees": {};
  "/employee/:id": {
    "id": string;
  };
  "/suppliers": {};
  "/supplier/:id": {
    "id": string;
  };
  "/products": {};
  "/product/:id": {
    "id": string;
  };
  "/orders": {};
  "/order/:id": {
    "id": string;
  };
  "/search": {};
};