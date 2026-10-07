import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import "./AudioDemo.css";
import "./redesign.css";
const root = document.getElementById("root")!;
if (root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
