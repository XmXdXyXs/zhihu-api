const User = require("../models/users");
const Question = require("../models/question");
const userIsExist = async (ctx, next) => {
  const user = await User.findById(ctx.params.id);
  if (!user) {
    ctx.throw(404, "用户不存在");
  }
  await next();
};

// 判断问题是否存在
const checkQuestionExist = async (ctx, next) => {
  const question = await Question.findById(ctx.params.id).select("+questioner");
  if (!question) {
    ctx.throw(404, "问题不存在");
  }
  ctx.state.question = question;
  await next();
};

// 判断提问者是不是自己
const checkQuestionUser = async (ctx, next) => {
  const { question } = ctx.state;
  console.log(question);
  console.log(ctx.state.user.id);
  if (question.questioner.toString() !== ctx.state.user.id) {
    ctx.throw(403, "无权修改");
  }
  await next();
};

exports.userIsExist = userIsExist;
exports.checkQuestionExist = checkQuestionExist;
exports.checkQuestionUser = checkQuestionUser;
