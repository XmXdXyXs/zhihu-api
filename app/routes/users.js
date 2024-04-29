const Router = require("@koa/router");
const router = new Router({ prefix: "/users" });
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");
const { userIsExist } = require("../middleware/index");
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
  following,
  followUsers,
  unfollowUsers,
  getFans,
  getQuestion,
} = require("../controllers/users");

// 获取所有用户
router.get("/", find);

// 注册用户
router.post("/", create);

// 查找某一个用户
router.get("/:id", findById);

// 更新用户
router.patch("/:id", auto, checkOwner, update);

// 删除用户
router.delete("/:id", auto, checkOwner, del);

// 登陆用户
router.post("/login", login);

// 获取用户关注列表
router.get("/getUserFollowing/:id", userIsExist, following);

// 关注用户
router.post("/followUsers/:id", auto, userIsExist, followUsers);

// 取消关注
router.delete("/unFollowUsers/:id", auto, userIsExist, unfollowUsers);

// 获取粉丝
router.get("/fands/:id", userIsExist, getFans);

// 获取问题
router.post("/getQuestion", auto, getQuestion);

module.exports = router;
