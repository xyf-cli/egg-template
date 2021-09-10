const Service = require("egg").Service;

class AddressService extends Service {

  async createAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const { name, tel, areaCode, province, city, county, addressDetail, isDefault } = params;
    const address = new ctx.model.Address();
    address.user_id = userId;
    address.name = name;
    address.tel = tel;
    address.area_code = areaCode;
    address.province = province;
    address.city = city;
    address.county = county;
    address.address_detail = addressDetail;
    address.is_default = isDefault;
    const addr = await address.save();
    return addr;
  }

  async destroyAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const result = await ctx.model.Address.destroy({
      where: {
        id: params.id,
        user_id: userId
      }
    })
    return result;
  }

  async updateAction(params,request) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const {name,tel,areaCode,province,city,county,addressDetail,isDefault} = request;
    const address = await ctx.model.Address.update(
      {
        user_id: userId,
        name: name,
        tel: tel,
        area_code: areaCode,
        province: province,
        city: city,
        county: county,
        address_detail: addressDetail,
        is_default: isDefault,
      },
      {
        where: {
          id: params.id,
        },
      }
    );
    return address;
  }
  async indexAction() {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const addresses = await ctx.model.Address.findAll({
      where: {
        user_id: userId
      }
    });
    return addresses;
  }
  async showAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const address = await ctx.model.Address.findOne({
      where: {
        user_id: userId,
        id: params.id
      }
    })
    return address;
  }

}
module.exports = AddressService;
