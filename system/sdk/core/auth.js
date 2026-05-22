import { store } from "./store.js";

export const auth = {
  login({ user, password }) {
    const token = "demo-token";
    store.set("token", token);
    return token;
  },
  getToken() {
    return store.get("token");
  },
};
