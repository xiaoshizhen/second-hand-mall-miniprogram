import { request } from "../../request/index.js";
import { config } from "../../request/config.js";

Page({

  data: {
    dataList: [] // 卖家订单列表
  },

  onLoad() {
    this.loadSellerOrders();
  },

  // 加载当前卖家（当前用户发布商品）的订单列表
  loadSellerOrders() {
    const user = wx.getStorageSync("user");
    if (!user) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      });
      wx.navigateTo({
        url: "/pages/login/index"
      });
      return;
    }
    let url = "/orderInfo/page/seller?pageNum=1&pageSize=100&sellerId=" + user.id;
    request({ url }).then(res => {
      if (res.code === "0") {
        let list = res.data.list || [];
        list.forEach(item => {
          const goodsInfo = (item.goodsList && item.goodsList[0]) || {};
          let imgSrc = "../../imgs/default.png";
          if (goodsInfo.fields) {
            try {
              const fields = JSON.parse(goodsInfo.fields);
              if (fields.length) {
                imgSrc = config.baseFileUrl + fields[0];
              }
            } catch (e) {
              imgSrc = "../../imgs/default.png";
            }
          }
          item.url = imgSrc;
          item.count = item.goodsList ? item.goodsList.length : 0;
        });
        this.setData({
          dataList: list
        });
      } else {
        wx.showToast({
          title: res.msg || "加载失败",
          icon: "none"
        });
      }
    });
  },

  /**
   * 卖家修改订单状态：发货、退货
   */
  changeState(e) {
    const id = e.currentTarget.dataset.id;
    const state = e.currentTarget.dataset.state;
    request({
      url: "/orderInfo/state/" + id + "/" + state,
      method: "POST"
    }).then(res => {
      if (res.code === "0") {
        wx.showToast({
          title: "操作成功"
        });
        this.loadSellerOrders();
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
  deleteOrder(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除该订单吗？",
      success(res) {
        if (res.confirm) {
          request({
            url: "/orderInfo/" + id,
            method: "DELETE"
          }).then(r => {
            if (r.code === "0") {
              wx.showToast({
                title: "删除成功",
                icon: "success"
              });
              that.loadSellerOrders();
            } else {
              wx.showToast({
                title: r.msg || "删除失败",
                icon: "none"
              });
            }
          });
        }
      }
    });
  }
});

