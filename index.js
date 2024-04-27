const Koa = require("koa");
const Router = require("@koa/router");
const app = new Koa();
const router = new Router();
const usersRouter = new Router({ prefix: "/users" }); // 添加前缀
app.use(router.routes()).use(router.allowedMethods());
app.use(usersRouter.routes()).use(usersRouter.allowedMethods());

router.get("/", (ctx) => {
  ctx.body = "这是主页";
});
usersRouter.get("/", (ctx) => {
  ctx.body = [{ name: "李雷" }, { name: "韩梅梅" }];
});

usersRouter.post("/", (ctx) => {
  ctx.body = { name: "李雷" };
});

usersRouter.get("/:id", (ctx) => {
  ctx.body = { name: "李雷" };
});

usersRouter.put("/:id", (ctx) => {
  ctx.body = { name: "李雷2" };
});

usersRouter.delete("/:id", (ctx) => {
  ctx.stale = 204;
});

app.listen(3000);
