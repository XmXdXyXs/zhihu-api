const Koa = require("koa");
const app = new Koa();
const path = require("path");
const routing = require("./routes/index");
const { koaBody } = require("koa-body");
const serve = require("koa-static");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const { collectionUrl } = require("./config.js");
const mongoose = require("mongoose");
let db = mongoose.connection;
mongoose.connect(collectionUrl);
db.once("open", () => {
  console.log("数据库连接成功");
});
db.on("error", (err) => {
  console.log(err);
});
app.use(serve(path.resolve(__dirname, "public")));
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.resolve(__dirname, "./public/uploads"), // 设置上传文件的目录
      keepExtensions: true, // 保持文件的扩展名
    },
  })
);
app.use(parameter(app));
routing(app);

app.listen(3000, () => {
  console.log("3000 端口已经启动");
});
