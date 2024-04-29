const Topics = require("../models/topics");

class TopicCtl {
  // 获取所有话题
  async find(ctx) {
    let { page = 1, pageNum = 10, files = "", q } = ctx.query;
    page = Math.max(page, 1) - 1;
    pageNum = Math.max(pageNum, 1);
    files = files
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");

    ctx.body = await Topics.find({ name: new RegExp(q) })
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
    ctx.body = await Topics.findById(ctx.params.id).select(files);
  }
  // 创建话题
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });
    const topic = new Topics(ctx.request.body).save();
    ctx.body = topic;
  }
  // 更新话题
  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    const topic = await Topics.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }
}

module.exports = new TopicCtl();
