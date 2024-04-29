const Question = require("../models/question");

class QuestionCtl {
  // 获取所有问题
  async find(ctx) {
    let { page = 1, pageNum = 10, files = "", q } = ctx.query;
    page = Math.max(page, 1) - 1;
    pageNum = Math.max(pageNum, 1);
    files = files
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");

    ctx.body = await Question.find({
      $or: [{ title: new RegExp(q) }, { description: new RegExp(q) }],
    })
      .limit(pageNum)
      .skip(page * pageNum);
  }
  // 获取特定话题
  async findById(ctx) {
    let { files = "" } = ctx.query;
    files = files
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    ctx.body = await Question.findById(ctx.params.id)
      .select(files)
      .populate("questioner");
  }
  // 创建问题
  async create(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false },
    });
    const topic = new Question({
      ...ctx.request.body,
      questioner: ctx.state.user.id,
    }).save();
    ctx.body = topic;
  }
  // 更新话题
  async update(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: false },
      description: { type: "string", required: false },
    });

    const topic = await Question.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }
  // 删除话题
  async del(ctx) {
    await Question.findByIdAndDelete(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new QuestionCtl();
