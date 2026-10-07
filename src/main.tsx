import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./AudioDemo.css";
import "./site.css";
const root = document.getElementById("root")!;
if (root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
