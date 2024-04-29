const Router = require("@koa/router");
const router = new Router({ prefix: "/topics" });
const jwt = require("jsonwebtoken");
const { find, findById, create, update } = require("../controllers/topics");
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

router.get("/find", find);

router.get("/findById/:id", findById);

router.post("/create", auto, create);

router.patch("/update", auto, update);

module.exports = router;
