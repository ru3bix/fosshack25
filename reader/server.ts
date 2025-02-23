import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5500;

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'resources' folder
app.use(express.static(path.join("./resources")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
