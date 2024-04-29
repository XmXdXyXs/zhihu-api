const Router = require("@koa/router");
const router = new Router({ prefix: "/question" });
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
const {
  find,
  findById,
  create,
  update,
  del,
} = require("../controllers/question");
const {
  checkQuestionExist,
  checkQuestionUser,
} = require("../middleware/index");

router.get("/", find);
router.get("/findById/:id", checkQuestionExist, findById);
router.post("/create", auto, create);
router.patch(
  "/update/:id",
  auto,
  checkQuestionExist,
  checkQuestionUser,
  update
);
router.delete("/del/:id", auto, checkQuestionExist, checkQuestionUser, del);
module.exports = router;
