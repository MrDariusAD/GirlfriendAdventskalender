(function(window) {
    window.env = window.env || {};
  
    // Environment variables
    window["env"]["GFAK_ApiUrl"] = "${GFAK_ApiUrl}";
    window["env"]["GFAK_Prod"] = "${GFAK_Prod}";
    window["env"]["GFAK_AdminMode"] = "${GFAK_AdminMode}";
  })(this);