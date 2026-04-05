const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

function loadModelsFromSource() {
  const modelFilePath = path.join(__dirname, "modelData", "models.js");
  const source = fs.readFileSync(modelFilePath, "utf8");
  const transformedSource = source.replace(
    /export\s+default\s+models\s*;?/,
    "return models;"
  );

  if (transformedSource === source) {
    throw new Error("Unable to load models from source file.");
  }

  const buildModels = new Function(transformedSource);
  return buildModels();
}

const models = loadModelsFromSource();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/test/info", (req, res) => {
  res.status(200).json(models.schemaInfo());
});

app.get("/user/list", (req, res) => {
  res.status(200).json(models.userListModel());
});

app.get("/user/:id", (req, res) => {
  const user = models.userModel(req.params.id);
  if (!user) {
    res.status(404).json({ error: `User ${req.params.id} not found` });
    return;
  }
  res.status(200).json(user);
});

app.get("/photosOfUser/:id", (req, res) => {
  res.status(200).json(models.photoOfUserModel(req.params.id));
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
