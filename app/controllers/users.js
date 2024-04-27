class UsersCtl {
  find(ctx) {
    ctx.body = [{ name: "李雷" }, { name: "韩梅梅" }];
  }
  findById(ctx) {
    ctx.body = { name: "李雷" };
  }
  create(ctx) {
    ctx.body = { name: "李雷" };
  }
  update(ctx) {
    ctx.body = { name: "李雷2" };
  }
  delete(ctx) {
    ctx.body = { name: "李雷2" };
  }
}

module.exports = new UsersCtl();
