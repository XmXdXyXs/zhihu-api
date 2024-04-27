const Koa = require("koa");
const app = new Koa();
const routing = require("./routes/index");
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());
routing(app);
app.listen(3000, () => {
  console.log("3000 端口已经启动");
});
