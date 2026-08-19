import { env } from "cloudflare:workers";

export function getSession(): D1DatabaseSession {
  return env.DB.withSession("first-unconstrained");
}
