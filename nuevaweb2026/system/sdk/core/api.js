import { http } from "./http.js";

export const api = {
  get(entity) {
    return http(`/api/${entity}/search`);
  },
};
