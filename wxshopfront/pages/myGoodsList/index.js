// pages/myGoodsList/index.js
import { request } from "../../request/index.js";
import { config } from "../../request/config.js";

Page({
  data: {
    goodsList: [],
    defaultImageUrl: "../../imgs/default.png"
  },

  onShow() {
    this.loadMyGoods();
  },

  // 加载当前用户的商品列表
  loadMyGoods() {
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
    request({ url: "/goodsInfo/page/all?pageNum=1&pageSize=1000" }).then(res => {
      if (res.code === "0") {
        let list = (res.data.list || []).filter(item => item.userid === user.id);
        // 处理图片地址
        list.forEach(item => {
          if (!item.fields || item.fields === "[]") {
            item.url = this.data.defaultImageUrl;
          } else {
            try {
              const fileArr = JSON.parse(item.fields);
              item.url = config.baseFileUrl + fileArr[0];
            } catch (e) {
              item.url = this.data.defaultImageUrl;
            }
          }
        });
        this.setData({
          goodsList: list
        });
      } else {
        wx.showToast({
          title: res.msg || "加载失败",
          icon: "none"
        });
      }
    });
  },

  // 添加商品，跳转到表单页
  addGoods() {
    wx.navigateTo({
      url: "/pages/myGoods/index"
    });
  },

  // 编辑商品
  editGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/myGoods/index?id=" + id
    });
  },

  // 删除商品
  deleteGoods(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除该商品吗？",
      success(res) {
        if (res.confirm) {
          request({
            url: "/goodsInfo/" + id,
            method: "DELETE"
          }).then(r => {
            if (r.code === "0") {
              wx.showToast({
                title: "删除成功",
                icon: "success"
              });
              that.loadMyGoods();
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

