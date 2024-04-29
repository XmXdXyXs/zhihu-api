const User = require("../models/users");
const userIsExist = async (ctx, next) => {
  const user = await User.findById(ctx.params.id);
  if (!user) {
    ctx.throw(404, "用户不存在");
  }
  await next();
};
exports.userIsExist = userIsExist;
