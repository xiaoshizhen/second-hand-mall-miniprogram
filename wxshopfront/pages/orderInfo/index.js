// pages/orderInfo/index.js
import { request } from "../../request/index.js";
import { config } from "../../request/config.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: "", //订单状态
    dataList: []//订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const state = options.state || 'all';
    this.setData({
      state: state
    })
    this.getOrderData(state);
  },
  getOrderData(state){
    let user = wx.getStorageSync('user');
    if (!user || user.id == null) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    let url = "/orderInfo/page/front?pageNum=1&pageSize=100&userId="+user.id;
    if(state && state !== 'all'){
      url = url + "&state="+encodeURIComponent(state);
    }
    request({url: url}).then(res => {
      if(res.code === '0'){
        let list = res.data.list || [];
        list.forEach((item,index) => {
          let goodsList = item.goodsList || [];
          let goodsInfo = goodsList[0];
          let imgSrc = "../../imgs/default.png";
          if (goodsInfo) {
            if(goodsInfo.fields){
              let fields = JSON.parse(goodsInfo.fields);
              if(fields.length){
                imgSrc = config.baseFileUrl+fields[0];
              }
            }
            item.description = goodsInfo.description;
          } else {
            item.description = '';
          }
          item.url = imgSrc;
          item.count = goodsList.length;
        })
        this.setData({
          dataList:list
        })
      }
    })
  },


  /**
 * 付款或取消
 */
payGoods(e) {
  let id = e.currentTarget.dataset.id;
  let state = e.currentTarget.dataset.state;
  request({
    url: "/orderInfo/state/"+id+"/"+state,
    method: "POST"
  }).then(res => {
    if(res.code === "0") {
      wx.showToast({
        title: '操作成功',
      })
      // 如果是付款操作（状态变为"待发货"），跳转到全部订单页面
      if(state === "待发货") {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/orderInfo/index?state=all'
          })
        }, 1500)
      } else {
        this.getOrderData(this.data.state);
      }
    }else{
      wx.showToast({
        title:res.msg,
        icon:"none"
      })
    }
  })
},

/**
 * 直接完成订单（未完成状态下，一键将订单置为“完成”）
 */
finishOrder(e) {
  const id = e.currentTarget.dataset.id;
  request({
    url: "/orderInfo/state/" + id + "/完成",
    method: "POST"
  }).then(res => {
    if (res.code === "0") {
      wx.showToast({
        title: "订单已完成"
      });
      this.getOrderData(this.data.state);
    } else {
      wx.showToast({
        title: res.msg || "操作失败",
        icon: "none"
      });
    }
  });
},

/**
 * 删除订单 
 */
deleteOrder(e){

}


})