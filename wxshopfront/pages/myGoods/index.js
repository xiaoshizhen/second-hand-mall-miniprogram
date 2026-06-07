// pages/myGoods/index.js
import { request } from "../../request/index.js";

Page({
  data: {
    id: null,          // 商品id，编辑时使用
    name: "",
    description: "",
    price: "",
    discount: "",
    count: "",
    recommend: "否",
    typeList: [],
    typeIndex: 0
  },

  onLoad(options) {
    this.checkLogin();
    this.loadTypes();
    if (options && options.id) {
      this.setData({ id: options.id });
      this.loadDetail(options.id);
    }
  },

  // 检查是否登录
  checkLogin() {
    const user = wx.getStorageSync("user");
    if (!user) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      });
      wx.navigateTo({
        url: "/pages/login/index"
      });
    }
  },

  // 加载商品详情（编辑时）
  loadDetail(id) {
    request({ url: "/goodsInfo/" + id }).then(res => {
      if (res.code === "0" && res.data) {
        const data = res.data;
        // 找到对应的类型下标
        let index = 0;
        const list = this.data.typeList;
        if (list && list.length > 0) {
          const foundIndex = list.findIndex(t => t.id === data.typeid);
          if (foundIndex >= 0) {
            index = foundIndex;
          }
        }
        this.setData({
          id: data.id,
          name: data.name,
          description: data.description,
          price: String(data.price),
          discount: data.discount != null ? String(data.discount) : "",
          count: String(data.count),
          recommend: data.recommend || "否",
          typeIndex: index
        });
      }
    });
  },

  // 加载商品类别
  loadTypes() {
    request({ url: "/typeInfo/page/all" }).then(res => {
      if (res.code === "0") {
        const list = res.data.list || [];
        this.setData({
          typeList: list,
          typeIndex: 0
        });
      } else {
        wx.showToast({
          title: res.msg || "加载类别失败",
          icon: "none"
        });
      }
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },

  onDiscountInput(e) {
    this.setData({ discount: e.detail.value });
  },

  onCountInput(e) {
    this.setData({ count: e.detail.value });
  },

  onTypeChange(e) {
    const index = Number(e.detail.value) || 0;
    this.setData({ typeIndex: index });
  },

  onRecommendYes() {
    this.setData({ recommend: "是" });
  },

  onRecommendNo() {
    this.setData({ recommend: "否" });
  },

  // 提交发布商品
  submitGoods() {
    const user = wx.getStorageSync("user");
    if (!user) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      });
      return;
    }

    const { id, name, description, price, discount, count, recommend, typeList, typeIndex } = this.data;

    if (!name) {
      wx.showToast({
        title: "请填写商品名称",
        icon: "none"
      });
      return;
    }
    if (!price) {
      wx.showToast({
        title: "请填写价格",
        icon: "none"
      });
      return;
    }
    if (!count) {
      wx.showToast({
        title: "请填写库存数量",
        icon: "none"
      });
      return;
    }

    const type = typeList[typeIndex];
    const typeid = type ? type.id : null;

    const payload = {
      name: name,
      description: description,
      price: Number(price),
      discount: discount ? Number(discount) : 1,
      count: Number(count),
      recommend: recommend,
      typeid: typeid,
      // 关键：将商品的所属卖家设为当前小程序登录用户
      userid: user.id,
      level: user.level
    };
    if (id) {
      payload.id = id;
    }

    const isEdit = !!id;

    request({
      url: "/goodsInfo",
      method: isEdit ? "PUT" : "POST",
      data: payload
    }).then(res => {
      if (res.code === "0") {
        wx.showToast({
          title: isEdit ? "修改成功" : "发布成功",
          icon: "success"
        });
        // 返回列表页
        wx.navigateBack();
      } else {
        wx.showToast({
          title: res.msg || "发布失败",
          icon: "none"
        });
      }
    });
  }
});

