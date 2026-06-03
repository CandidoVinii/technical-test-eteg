import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3333;
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${port}`);
});
