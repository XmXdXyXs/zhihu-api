const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { secretKey } = require("../config");
class UsersCtl {
  async find(ctx) {
    ctx.body = await User.find();
  }
  async findById(ctx) {
    const user = await User.findById(ctx.params.id);
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
}

module.exports = new UsersCtl();
