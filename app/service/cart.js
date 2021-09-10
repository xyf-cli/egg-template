const Service = require("egg").Service;

class CartService extends Service {

  /**
    * 购物车cart_data填充
    * @param {*} list [{product_id:'1',cart_num:'3'}]
    * @return {object} {list:[{id:1,cart_num:'3',product_id:'1',prod_name:'apple',prod_price:666}],total_price:999}  
    */
  async _fillCartProduct(list) {
    let totalPrice = 0;
    let productIds = list.map(item => {
      return item.product_id
    })
    let products = await this.ctx.model.Product.findAll({
      include: [{
        model: this.ctx.model.ProductFile,
        attributes: ['file_name', 'file_path']
      }],
      where: {
        id: productIds
      }
    });
    list.map(item => {
      products.map(sitem => {
        if (item.product_id == sitem.id) {
          if (item.is_checked) {
            totalPrice += sitem.prod_price*item.cart_num;
          }
          delete sitem.id;
          Object.assign(item, sitem.dataValues);
          return item;
        }
      })
    })
    return { list: list, total_price: totalPrice };
  }

  async createAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const hasCart = await ctx.model.Cart.findOne({
      where: {
        user_id: userId,
      },
    });
    if (hasCart) {
      let cartData = JSON.parse(hasCart.getDataValue('cart_data'));
      let hasSameProduct = false;
      cartData = cartData.map(item => {
        if (item.product_id === params.product_id) {
          hasSameProduct = true;
          item.is_checked = true;
          if(params.type===0){
            item.cart_num = Number(item.cart_num) - Number(params.cart_num);
          }else{
            item.cart_num = Number(item.cart_num) + Number(params.cart_num);
          }
          if(item.cart_num<1){
            item.cart_num=1;
          }
        }
        return item;
      })
      if (!hasSameProduct) {
        if(params.type===0){
          throw '无购物车数据，无法减少商品数量'
        }
        cartData.unshift(params);
      }
      await ctx.model.Cart.update({
        cart_data: JSON.stringify(cartData)
      }, {
        where: {
          user_id: userId,
        },
      })
    } else {
      if(params.type===0){
        throw '无购物车数据，无法减少商品数量'
      }
      const cart = new ctx.model.Cart();
      var d = [{ product_id: params.product_id, cart_num: params.cart_num, is_checked: !!params.is_checked }]
      cart.user_id = userId;
      cart.cart_data = JSON.stringify(d);
      await cart.save();
    }
    const result = this.indexAction();
    return result;
  }

  async deleteProductsAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const deleteProdIds = params.ids.split(',');
    const cart = await ctx.model.Cart.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!cart) {
      throw '无购物车数据信息'
    }
    let cartData = JSON.parse(cart.cart_data);
    cartData.forEach((item, index) => {
      deleteProdIds.forEach(sitem => {
        if (item.product_id == sitem) {
          cartData.splice(index, 1)
        }
      })
    })
    if (cartData.length) {
      await ctx.model.Cart.update({
        cart_data: JSON.stringify(cartData)
      }, {
        where: {
          user_id: userId,
        },
      })
    } else {
      await ctx.model.Cart.destroy({
        where: {
          user_id: userId,
        }
      })
    }
    const result = this.indexAction();
    return result;
  }

  async indexAction() {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const cart = await ctx.model.Cart.findOne({
      where: {
        user_id: userId
      }
    });
    if (!cart) {
      return cart;
    }
    let cartDataStr = cart.getDataValue('cart_data');
    let cartData = JSON.parse(cartDataStr);
    let result = await this._fillCartProduct(cartData)
    return result
  }

}
module.exports = CartService;
