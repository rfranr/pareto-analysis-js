const SUPPORTED_LANGS = ['ca', 'es', 'en'];

export function getLanguage(): string {
  if (typeof window !== "undefined") {
    const fromStorage = localStorage.getItem("lang");
    const fromBrowser = navigator.language?.slice(0, 2);

    const lang = fromStorage || fromBrowser || "ca";
    return SUPPORTED_LANGS.includes(lang) ? lang : "ca";
  } else {
    return "en"; 
  }
}