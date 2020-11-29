export const environment = {
  production: window["env"]["GFAK_Prod"] || true,
  apiUrl: window["env"]["GFAK_ApiUrl"] || "https://api.askim.dev",
  adminMode: window["env"]["GFAK_AdminMode"] || false
};
