import { auth } from "./auth.js";
import { config } from "./config.js";

export async function http(path) {
  const res = await fetch(config.baseURL + path, {
    headers: {
      Authorization: `Bearer ${auth.getToken()}`,
    },
  });
  return res.json();
}
