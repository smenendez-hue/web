import { createDashboardController } from "./state/dashboard-controller.js";
import { createYiqiDashboardService } from "./services/yiqi-dashboard.service.js";
import { createYiqiAuthService } from "./services/yiqi-auth.service.js";
import { createDashboardRenderer } from "./ui/render-dashboard.js";

const SESSION_STORAGE_KEY = "yiqi-panel-session";
const SCHEMA_PREFERENCE_STORAGE_KEY = "yiqi-schema-preference";
const THEME_COOKIE_KEY = "yiqi_theme";
const THEME_STORAGE_KEY = "yiqi-theme";
const RANGE_PRESET_STORAGE_KEY = "yiqi-range-preset";
const VALID_RANGE_PRESETS = ["last_7_days", "current_month", "last_30_days"];
const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const dashboardService = createYiqiDashboardService();
const authService = createYiqiAuthService();

const renderer = createDashboardRenderer({
  loadProgress: document.querySelector("#load-progress"),
  loadProgressFill: document.querySelector("#load-progress-fill"),
  loadProgressValue: document.querySelector("#load-progress-value"),
  runtimeBanner: document.querySelector("#runtime-banner"),
  runtimeTitle: document.querySelector("#runtime-title"),
  runtimeDescription: document.querySelector("#runtime-description"),
  kpiGrid: document.querySelector("#kpi-grid"),
  channelList: document.querySelector("#channel-list"),
  branchSalesList: document.querySelector("#branch-sales-list"),
  signalList: document.querySelector("#signal-list"),
  revenueTrend: document.querySelector("#revenue-trend"),
  categoryTableBody: document.querySelector("#category-table-body"),
  productTableBody: document.querySelector("#product-table-body"),
  highlightCards: document.querySelector("#highlight-cards"),
  ownerPulse: document.querySelector("#owner-pulse"),
  hourlyPerformance: document.querySelector("#hourly-performance"),
  watchlistGrid: document.querySelector("#watchlist-grid"),
  financeSummaryGrid: document.querySelector("#finance-summary-grid"),
  paymentMixList: document.querySelector("#payment-mix-list"),
  qualitySummaryGrid: document.querySelector("#quality-summary-grid"),
  returnReasonsList: document.querySelector("#return-reasons-list"),
  profitabilityTableBody: document.querySelector("#profitability-table-body"),
  slowMoversGrid: document.querySelector("#slow-movers-grid"),
  authStatus: document.querySelector("#auth-status"),
  loginScreen: document.querySelector("#login-screen"),
  dashboardApp: document.querySelector("#dashboard-app"),
  dashboardShell: document.querySelector("#dashboard-shell"),
  logoutButton: document.querySelector("#logout-button"),
});

const dashboardController = createDashboardController({
  dashboardService,
  renderer,
});

const loginForm = document.querySelector("#login-form");
const userInput = document.querySelector("#login-user");
const passwordInput = document.querySelector("#login-password");
const logoutButton = document.querySelector("#logout-button");
const loginSubmitButton = loginForm?.querySelector('button[type="submit"]');
const accountChip = document.querySelector("#account-chip");
const accountUser = document.querySelector("#account-user");
const schemaToggle = document.querySelector("#schema-toggle");
const schemaLabel = document.querySelector("#schema-label");
const schemaMenu = document.querySelector("#schema-menu");
const sessionWarning = document.querySelector("#session-warning");
const themeToggle = document.querySelector("#theme-toggle");
const rangeFilter = document.querySelector("#range-filter");
const refreshButton = document.querySelector("#refresh-button");
let isAuthenticating = false;
let currentSession = null;
let isSchemaMenuLoading = false;
let isDashboardLoading = false;

function resolveStoredRangePreset() {
  const stored = localStorage.getItem(RANGE_PRESET_STORAGE_KEY);
  return VALID_RANGE_PRESETS.includes(stored) ? stored : "last_7_days";
}

let currentRangePreset = resolveStoredRangePreset();

function setActiveRangeButton(preset) {
  if (!rangeFilter) {
    return;
  }

  rangeFilter.querySelectorAll(".range-btn").forEach((btn) => {
    const isActive = btn.getAttribute("data-range") === preset;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

function setTheme(theme) {
  const nextTheme = theme === LIGHT_THEME ? LIGHT_THEME : DARK_THEME;
  const isLight = nextTheme === LIGHT_THEME;

  document.documentElement.setAttribute("data-theme", nextTheme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-checked", String(isLight));
    themeToggle.setAttribute("data-theme", nextTheme);
    themeToggle.title = isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  }
}

function setThemePreference(theme) {
  const nextTheme = theme === LIGHT_THEME ? LIGHT_THEME : DARK_THEME;
  const maxAge = 60 * 60 * 24 * 365; // 1 ano
  const isYiqiDomain =
    typeof window !== "undefined" && window.location.hostname.endsWith("yiqi.com.ar");
  const domainPart = isYiqiDomain ? "; domain=.yiqi.com.ar" : "";

  document.cookie = `${THEME_COOKIE_KEY}=${nextTheme}; path=/; max-age=${maxAge}; samesite=lax${domainPart}`;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  setTheme(nextTheme);
}

function getCookieValue(name) {
  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1] || null;
}

function resolveInitialTheme() {
  const cookieTheme = getCookieValue(THEME_COOKIE_KEY);
  if (cookieTheme === DARK_THEME || cookieTheme === LIGHT_THEME) {
    return cookieTheme;
  }

  const localTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (localTheme === DARK_THEME || localTheme === LIGHT_THEME) {
    return localTheme;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return LIGHT_THEME;
  }

  return DARK_THEME;
}

function initThemePreference() {
  const initialTheme = resolveInitialTheme();
  setThemePreference(initialTheme);
}

function setAuthFormDisabled(disabled) {
  if (userInput) {
    userInput.disabled = disabled;
  }

  if (passwordInput) {
    passwordInput.disabled = disabled;
  }

  if (loginSubmitButton) {
    loginSubmitButton.disabled = disabled;
  }
}

function getAuthErrorMessage(error) {
  if (error?.status === 401 || error?.code === "INVALID_LOGIN") {
    return "No pudimos iniciar sesion. Verifica usuario y clave e intenta nuevamente.";
  }

  if (error?.code === "TIMEOUT") {
    return "La autenticacion tardo demasiado. Intenta nuevamente en unos segundos.";
  }

  return "No pudimos iniciar sesion en este momento. Intenta nuevamente.";
}

function persistSession(authResult) {
  const normalizedSession = normalizeSession({
    token: authResult.access_token,
    userName: authResult.userName,
    schemaId: authResult.schemaId,
    schemaName: authResult.schemaName,
  });

  currentSession = normalizedSession;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(normalizedSession));
}

function getStoredSchemaPreference() {
  const rawPreference = localStorage.getItem(SCHEMA_PREFERENCE_STORAGE_KEY);

  if (!rawPreference) {
    return null;
  }

  try {
    const parsedPreference = JSON.parse(rawPreference);
    const schemaId = Number(parsedPreference?.schemaId);

    if (!Number.isFinite(schemaId) || schemaId <= 0) {
      return null;
    }

    return {
      schemaId,
      schemaName: parsedPreference?.schemaName
        ? String(parsedPreference.schemaName)
        : null,
    };
  } catch {
    return null;
  }
}

function storeSchemaPreference(schemaId, schemaName = null) {
  const normalizedSchemaId = Number(schemaId);

  if (!Number.isFinite(normalizedSchemaId) || normalizedSchemaId <= 0) {
    return;
  }

  localStorage.setItem(
    SCHEMA_PREFERENCE_STORAGE_KEY,
    JSON.stringify({
      schemaId: normalizedSchemaId,
      schemaName: schemaName ? String(schemaName) : null,
    }),
  );
}

function applyStoredSchemaPreferenceToCurrentSession() {
  const preference = getStoredSchemaPreference();

  if (!preference || !currentSession?.token) {
    return false;
  }

  if (currentSession.schemaId === preference.schemaId) {
    return false;
  }

  currentSession = normalizeSession({
    ...currentSession,
    schemaId: preference.schemaId,
    schemaName: preference.schemaName || currentSession.schemaName,
  });

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentSession));
  return true;
}

function getStoredSession() {
  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return normalizeSession(JSON.parse(rawSession));
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

function normalizeSession(rawSession = {}) {
  return {
    token: rawSession?.token || "",
    userName: rawSession?.userName || "Usuario YiQi",
    schemaId: Number.isFinite(Number(rawSession?.schemaId)) ? Number(rawSession.schemaId) : null,
    schemaName: rawSession?.schemaName ? String(rawSession.schemaName) : null,
    loginInformationWarning: normalizeWarning(rawSession?.loginInformationWarning),
  };
}

function normalizeWarning(rawWarning) {
  if (!rawWarning || typeof rawWarning !== "object") {
    return null;
  }

  return {
    code: rawWarning.code || "LOGIN_INFORMATION_UNAVAILABLE",
    message:
      rawWarning.message || "No se pudo validar GetLoginInformation en este momento.",
  };
}

function renderSessionWarning(warning) {
  if (!sessionWarning) {
    return;
  }

  if (!warning) {
    sessionWarning.hidden = true;
    sessionWarning.textContent = "";
    return;
  }

  sessionWarning.hidden = false;
  sessionWarning.textContent = `${warning.message} (${warning.code}).`;
}

function renderAccountInfo(session) {
  if (!accountChip || !accountUser || !schemaLabel) {
    return;
  }

  const userName = session?.userName || "Usuario YiQi";
  const schemaName = session?.schemaName || "Esquema no definido";

  accountUser.textContent = userName;
  schemaLabel.textContent = schemaName;
  accountChip.hidden = !session?.token;

  if (refreshButton) {
    refreshButton.hidden = !session?.token;
  }
}

function setRefreshButtonLoading(isLoading) {
  if (!refreshButton) {
    return;
  }

  refreshButton.disabled = isLoading;
  refreshButton.textContent = isLoading ? "Actualizando..." : "Actualizar";
}

async function reloadDashboard() {
  if (!currentSession?.token || isDashboardLoading) {
    return;
  }

  isDashboardLoading = true;
  setRefreshButtonLoading(true);

  try {
    await dashboardController.load({
      schemaId: currentSession?.schemaId,
      rangePreset: currentRangePreset,
    });
  } finally {
    isDashboardLoading = false;
    setRefreshButtonLoading(false);
  }
}

function closeSchemaMenu() {
  if (!schemaMenu || !schemaToggle) {
    return;
  }

  schemaMenu.hidden = true;
  schemaToggle.setAttribute("aria-expanded", "false");
}

function openSchemaMenu() {
  if (!schemaMenu || !schemaToggle) {
    return;
  }

  schemaMenu.hidden = false;
  schemaToggle.setAttribute("aria-expanded", "true");
}

function renderSchemaLoading(message = "Cargando esquemas...") {
  if (!schemaMenu) {
    return;
  }

  schemaMenu.innerHTML = `<div class="schema-option-id">${message}</div>`;
}

function renderSchemaOptions(schemas) {
  if (!schemaMenu) {
    return;
  }

  if (!Array.isArray(schemas) || schemas.length === 0) {
    schemaMenu.innerHTML = '<div class="schema-option-id">No hay esquemas disponibles.</div>';
    return;
  }

  const activeSchemaId = currentSession?.schemaId;
  schemaMenu.innerHTML = schemas
    .map((schema) => {
      const isActive = Number(schema.schemaId) === Number(activeSchemaId);
      const activeClass = isActive ? " is-active" : "";

      return `
        <button class="schema-option${activeClass}" type="button" data-schema-id="${schema.schemaId}" data-schema-name="${schema.schemaName}">
          <span class="schema-option-name">${escapeHtml(schema.schemaName)}</span>
          <span class="schema-option-id">SchemaId ${schema.schemaId}${isActive ? " · activo" : ""}</span>
        </button>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function refreshSessionInformation(token, preferredSchemaId = null) {
  const sessionInformation = await authService.getSessionInformation({
    authToken: token,
    schemaId: preferredSchemaId,
  });
  const mergedSession = normalizeSession({
    ...currentSession,
    token,
    userName: sessionInformation.userName,
    schemaId: sessionInformation.schemaId,
    schemaName: sessionInformation.schemaName,
  });

  currentSession = mergedSession;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mergedSession));
  storeSchemaPreference(mergedSession.schemaId, mergedSession.schemaName);
  renderAccountInfo(mergedSession);
  renderSessionWarning(mergedSession.loginInformationWarning);
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  currentSession = null;
  dashboardService.setAuthToken("");
  closeSchemaMenu();
  renderAccountInfo(null);
  renderSessionWarning(null);
  renderer.renderLoggedOut();
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isAuthenticating) {
    return;
  }

  isAuthenticating = true;
  setAuthFormDisabled(true);
  renderer.renderAuthLoading("Validando credenciales YiQi...");

  try {
    const authResult = await authService.login({
      username: userInput.value.trim(),
      password: passwordInput.value,
    });

    persistSession(authResult);
    applyStoredSchemaPreferenceToCurrentSession();
    storeSchemaPreference(currentSession?.schemaId, currentSession?.schemaName);
    dashboardService.setAuthToken(authResult.access_token);
    renderAccountInfo(currentSession);
    renderSessionWarning(currentSession?.loginInformationWarning);
    renderer.renderAuthSuccess(`Sesion activa como ${authResult.userName}`);
    setActiveRangeButton(currentRangePreset);
    await reloadDashboard();
  } catch (error) {
    renderer.renderAuthError(getAuthErrorMessage(error));
  } finally {
    isAuthenticating = false;
    setAuthFormDisabled(false);
  }
});

logoutButton?.addEventListener("click", () => {
  clearSession();
  loginForm?.reset();
});

schemaToggle?.addEventListener("click", async () => {
  if (!currentSession?.token || isSchemaMenuLoading) {
    return;
  }

  if (!schemaMenu.hidden) {
    closeSchemaMenu();
    return;
  }

  isSchemaMenuLoading = true;
  openSchemaMenu();
  renderSchemaLoading();

  try {
    const schemas = await authService.getAvailableSchemas({
      authToken: currentSession.token,
    });
    renderSchemaOptions(schemas);
  } catch {
    renderSchemaLoading("No se pudo obtener GetAvailable. Reintenta.");
  } finally {
    isSchemaMenuLoading = false;
  }
});

schemaMenu?.addEventListener("click", async (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-schema-id]") : null;

  if (!target || !currentSession?.token) {
    return;
  }

  const nextSchemaId = Number(target.getAttribute("data-schema-id"));
  const nextSchemaName = target.getAttribute("data-schema-name") || `Esquema ${nextSchemaId}`;

  if (!Number.isFinite(nextSchemaId) || nextSchemaId <= 0) {
    return;
  }

  if (currentSession.schemaId === nextSchemaId) {
    closeSchemaMenu();
    return;
  }

  currentSession = normalizeSession({
    ...currentSession,
    schemaId: nextSchemaId,
    schemaName: nextSchemaName,
  });
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentSession));
  storeSchemaPreference(nextSchemaId, nextSchemaName);
  renderAccountInfo(currentSession);
  closeSchemaMenu();
  renderer.renderAuthSuccess(`Sesion activa como ${currentSession.userName} · ${nextSchemaName}`);

  await reloadDashboard();
});

document.addEventListener("click", (event) => {
  if (!schemaMenu || !schemaToggle || schemaMenu.hidden) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (schemaMenu.contains(target) || schemaToggle.contains(target)) {
    return;
  }

  closeSchemaMenu();
});

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || DARK_THEME;
  const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  setThemePreference(nextTheme);
});

rangeFilter?.addEventListener("click", async (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-range]") : null;

  if (!target || !currentSession?.token) {
    return;
  }

  const nextPreset = target.getAttribute("data-range");

  if (!VALID_RANGE_PRESETS.includes(nextPreset) || nextPreset === currentRangePreset) {
    return;
  }

  currentRangePreset = nextPreset;
  localStorage.setItem(RANGE_PRESET_STORAGE_KEY, nextPreset);
  setActiveRangeButton(nextPreset);

  await reloadDashboard();
});

refreshButton?.addEventListener("click", async () => {
  await reloadDashboard();
});

async function bootstrap() {
  initThemePreference();

  const storedSession = getStoredSession();

  if (!storedSession?.token) {
    currentSession = null;
    renderAccountInfo(null);
    renderSessionWarning(null);
    renderer.renderLoggedOut();
    return;
  }

  currentSession = storedSession;
  dashboardService.setAuthToken(storedSession.token);
  renderAccountInfo(currentSession);
  renderSessionWarning(currentSession?.loginInformationWarning);

  try {
    const schemaPreference = getStoredSchemaPreference();
    try {
      await refreshSessionInformation(storedSession.token, schemaPreference?.schemaId);
    } catch {
      await refreshSessionInformation(storedSession.token);
    }
    applyStoredSchemaPreferenceToCurrentSession();
    renderAccountInfo(currentSession);
    renderer.renderAuthSuccess(
      `Sesion activa como ${currentSession.userName} · ${
        currentSession.schemaName || "esquema sin definir"
      }`,
    );
    setActiveRangeButton(currentRangePreset);
    await reloadDashboard();
  } catch {
    clearSession();
  }
}

bootstrap();
