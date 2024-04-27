const fs = require("fs");
const path = require("path");
module.exports = (app) => {
  fs.readdirSync(path.resolve(__dirname)).forEach((file) => {
    if (file === "index.js") {
      return;
    }
    const route = require(`./${file}`);
    app.use(route.routes()).use(route.allowedMethods());
  });
};
