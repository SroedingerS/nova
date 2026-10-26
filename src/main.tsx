import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import Guide from "./Guide";
import "./AudioDemo.css";
import "./site.css";
import "./Experience.css";
const root = document.getElementById("root")!;
const page = window.location.pathname
  .replace(/index\.html$/, "")
  .endsWith("/guide/") ? (
  <Guide />
) : (
  <App />
);
if (root.firstElementChild) hydrateRoot(root, page);
else createRoot(root).render(page);
