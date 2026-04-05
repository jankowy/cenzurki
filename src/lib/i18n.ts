import { addMessages, init } from "svelte-i18n";
import pl from "../locales/pl.json";

addMessages("pl", pl);

init({
  fallbackLocale: "pl",
  initialLocale: "pl",
});
