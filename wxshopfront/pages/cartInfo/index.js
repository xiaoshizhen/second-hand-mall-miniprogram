// pages/cartInfo/index.js
import {request} from "../../request/index.js";
import { config } from "../../request/config.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImageUrl: '../../imgs/default.png',
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCartInfo();
  },

  /**
   * 获取购物车商品列表
   */
  getCartInfo() {
    let user = wx.getStorageSync('user');
    if(!user) {
      wx.navigateTo({
        url: '/pages/login/index?isTabBar=1&url=/pages/cartInfo/index'
      })
      return;
    }
    request({url: '/cartInfo?userId=' + user.id}).then(res => {
      if(res.code === '0') {
        let cartList = res.data;
        let totalPrice = 0;
        let totalNum = 0;
        cartList.forEach(item => {
          totalNum += item.count;
          totalPrice += item.count * item.price * item.discount;
          let imgSrc = this.data.defaultImageUrl;
          if(item.fields) {
            let fields = JSON.parse(item.fields)[0];
            imgSrc = config.baseFileUrl + fields;
          }
          item.url = imgSrc;
        })
        this.setData({
          cart: cartList,
          totalNum: totalNum,
          totalPrice: totalPrice.toFixed(2)
        })
      }
    })
  },
  /**
   * 商品数量
   */
  handleItemNumEdit(e){
    // 获取传来的参数（dataset 中 id/operation 常为字符串，需与后端返回的 id 对齐）
    const id = e.currentTarget.dataset.id;
    const operation = Number(e.currentTarget.dataset.operation) || 0;
    // 获取到购物车数组
    let cart = this.data.cart;
    // 获取到需要修改的商品的索引（避免 number / string 严格不等导致 -1）
    const index = cart.findIndex(v => String(v.id) === String(id));
    if (index < 0) {
      return;
    }
    const curCount = Number(cart[index].count) || 0;
    // 判断是否要删除
    if (curCount === 1 && operation === -1) {
      // 弹窗提示
      wx.showModal({
        content: '您是否要删除该商品',
        success: (res) => {
          if (res.confirm) {
            let user = wx.getStorageSync('user');
            request({
              url: '/cartInfo/goods/' + user.id + '/' + id,
              method: 'DELETE'
            }).then(res => {
              if (res.code === '0') {
                let cart = this.data.cart;
                cart.splice(index, 1);
                let totalPrice = 0;
                let totalNum = 0;
                cart.forEach(item => {
                  totalNum += item.count;
                  totalPrice += item.count * item.price * item.discount;              
                })
                this.setData({
                  cart: cart,
                  totalNum: totalNum,
                  totalPrice: totalPrice.toFixed(2)
                })
              }else{
                wx.showToast({
                  title: res.msg,
                  icon:'error'
                })
              }
            })
          }
        }
      })
    }else{
      // 修改数量
      let cart = this.data.cart;
      cart[index].count = curCount + operation;

      // 重新计算一下总价格和总数量
      let totalPrice = 0;
      let totalNum = 0;
      cart.forEach(item => {
        totalNum += item.count;
        totalPrice += item.count * item.price * item.discount;
      })

      this.setData({
        cart: cart,
        totalNum: totalNum,
        totalPrice: totalPrice.toFixed(2)
      })
    }
  },

  /**
   * 下单
   */
  handlePay() {
    if (this.data.cart.length === 0) {
      wx.showToast({
        title: '购物车空空如~',
        icon: 'none'
      })
      return;
    }
    let user = wx.getStorageSync('user');
    let data = {
      userid: user.id,
      level: user.level,
      totalprice: this.data.totalPrice,
      goodsList: this.data.cart
    };
    request({
      url: '/orderInfo',
      method: 'POST',
      data: data
    }).then(res => {
      if (res.code === '0') {
        wx.showToast({
          title: '提交订单成功，请付款',
        });
        // 跳转到支付页面
        wx.navigateTo({
          url: '/pages/orderInfo/index?state=待付款',
        })
      }else{
        wx.showToast({
          title: 'res.msg',
          icon:'error'
        })
      }
    })
  }
})