const HISPANIC_COUNTRIES = [
  "CO",
  "MX",
  "AR",
  "VE",
  "BO",
  "CL",
  "GT",
  "PA",
  "PE",
];
const LUSOPHONE_COUNTRIES = ["BR", "PT", "ST"];
const DEFAULT_LANGUAGE = "en";

const setLanguage = () => {
  let language = localStorage.getItem("language");
  if (language) {
    return;
  }
  // create a new XMLHttpRequest
  var xhr = new XMLHttpRequest();
  // get a callback when the server responds
  xhr.addEventListener("load", () => {
    // catch country from response
    let country = xhr.responseText;
    // add language according to response
    if (HISPANIC_COUNTRIES.includes(country)) {
      localStorage.setItem("language", "es");
      window.location.reload();
      return false;
    } else if (LUSOPHONE_COUNTRIES.includes(country)) {
      localStorage.setItem("language", "pr");
      window.location.reload();
      return false;
    } else {
      localStorage.setItem("language", "en");
      window.location.reload();
      return false;
    }
  });
  // open the request with the verb and the url
  xhr.open("GET", "https://ipapi.co/country");
  // send the request
  xhr.send();
};
const getLanguage = () => {
  let language = localStorage.getItem("language");
  if (language) {
    return language;
  } else {
    setLanguage();
    return DEFAULT_LANGUAGE;
  }
};

export default getLanguage;
