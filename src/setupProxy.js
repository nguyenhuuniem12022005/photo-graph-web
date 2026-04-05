const fs = require("fs");
const path = require("path");

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

module.exports = function setupProxy(app) {
  app.get("/test/info", (request, response) => {
    response.status(200).json(models.schemaInfo());
  });

  app.get("/user/list", (request, response) => {
    response.status(200).json(models.userListModel());
  });

  app.get("/user/:id", (request, response) => {
    const user = models.userModel(request.params.id);
    if (!user) {
      response.status(404).json({ error: `User ${request.params.id} not found` });
      return;
    }

    response.status(200).json(user);
  });

  app.get("/photosOfUser/:id", (request, response) => {
    response.status(200).json(models.photoOfUserModel(request.params.id));
  });
};
