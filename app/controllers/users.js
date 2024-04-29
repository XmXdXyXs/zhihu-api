const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { secretKey } = require("../config");
class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find();
  }
  async findById(ctx) {
    let files = ctx.query.files
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    console.log(files);
    const user = await User.findById(ctx.params.id).select(files);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string" },
      password: { type: "string" },
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用户已经被占用");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      gender: { type: "string", required: false },
      headline: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      business: { type: "string", required: false },
      employment: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  async delete(ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.status = 204;
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string" },
      password: { type: "string" },
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    const signKeys = jwt.sign({ id: user._id, name: user.name }, secretKey, {
      expiresIn: "3h",
    });
    ctx.body = {
      token: signKeys,
      code: "00000",
    };
  }
  // 获取用户关注列表
  async following(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+following")
      .populate("following");
    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user.following;
  }

  // 关注用户
  async followUsers(ctx) {
    const user = await User.findById(ctx.state.user.id).select("+following");
    if (!user.following.map((id) => id.toString()).includes(ctx.params.id)) {
      user.following.push(ctx.params.id);
      user.save();
    }
    ctx.status = 204;
  }

  // 取消关注
  async unfollowUsers(ctx) {
    const user = await User.findById(ctx.state.user.id).select("+following");
    let index = user.following.indexOf(ctx.params.id);
    if (index > -1) {
      user.following.splice(index, 1);
      user.save();
    }
    ctx.status = 204;
  }

  // 获取粉丝
  async getFans(ctx) {
    const user = await User.find({ following: ctx.params.id });
    ctx.body = user;
  }
}

module.exports = new UsersCtl();
