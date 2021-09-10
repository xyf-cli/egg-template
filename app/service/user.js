const Service = require("egg").Service;


class UserService extends Service {

  async login(params) {
    const { ctx } = this;
    const { phone } = params;
    const user = await ctx.model.User.findOne({
      where: {
        phone
      },
    });
    if (user) {
      return user
    } else {
      let newUser = new ctx.model.User()
      newUser.phone = phone;
      await newUser.save();
      newUser.setDataValue('isNew',true)
      return newUser;
    }
  }

}
module.exports = UserService;
