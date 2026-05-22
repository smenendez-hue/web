import { api } from "../core/api.js";
import { auth } from "../core/auth.js";
import { store } from "../core/store.js";

import "../elements/yiqi-table.js";
import "../elements/yiqi-form.js";
import "../elements/yiqi-metric.js";
import "../elements/yiqi-card.js";

window.yiqi = { api, auth, store };
