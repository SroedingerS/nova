import { renderToString } from "react-dom/server";
import App from "./App";
import Guide from "./Guide";
export const html = renderToString(<App />);
export const guideHtml = renderToString(<Guide />);
