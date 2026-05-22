const state = {};

export const store = {
  get: (k) => state[k],
  set: (k, v) => (state[k] = v),
};
