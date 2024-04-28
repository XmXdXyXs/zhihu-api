const Router = require("@koa/router");
const router = new Router({ prefix: "/users" });
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");
const auto = async (ctx, next) => {
  try {
    let authorization = ctx.header["authorization"];
    let token = authorization.replace("Bearer ", "");
    const user = jwt.verify(token, secretKey);
    ctx.state.user = user;
  } catch (e) {
    ctx.throw(401, "token 令牌无效或者篡改");
  }
  await next();
};

const checkOwner = async (ctx, next) => {
  if (ctx.params.id !== ctx.state.user.id) {
    ctx.throw(403, "没有权限");
  }
  await next();
};
const {
  find,
  create,
  findById,
  update,
  delete: del,
  login,
} = require("../controllers/users");

router.get("/", find);

router.post("/", create);

router.get("/:id", findById);

router.patch("/:id", auto, checkOwner, update);

router.delete("/:id", auto, checkOwner, del);

router.post("/login", login);

module.exports = router;
