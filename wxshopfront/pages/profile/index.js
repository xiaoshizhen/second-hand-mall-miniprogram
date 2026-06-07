import { request } from "../../request/index.js";

Page({
  data: {
    form: {
      id: null,
      name: "",
      nickname: "",
      sex: "男",
      age: "",
      phone: "",
      address: ""
    }
  },

  onShow() {
    const user = wx.getStorageSync("user");
    if (!user) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      });
      wx.navigateBack();
      return;
    }
    this.loadUserInfo(user.id);
  },

  loadUserInfo(id) {
    request({ url: `/userInfo/${id}` }).then(res => {
      if (res.code === "0") {
        const data = res.data || {};
        this.setData({
          form: {
            id: data.id,
            name: data.name || "",
            nickname: data.nickname || "",
            sex: data.sex || "男",
            age: data.age || "",
            phone: data.phone || "",
            address: data.address || ""
          }
        });
      } else {
        wx.showToast({
          title: res.msg || "加载失败",
          icon: "none"
        });
      }
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const form = this.data.form;
    form[field] = value;
    this.setData({ form });
  },

  onSexChange(e) {
    const sex = e.detail.value;
    const form = this.data.form;
    form.sex = sex;
    this.setData({ form });
  },

  onSave() {
    const form = this.data.form;
    if (!form.name) {
      wx.showToast({
        title: "请填写姓名",
        icon: "none"
      });
      return;
    }
    request({
      url: "/userInfo",
      data: form,
      method: "PUT"
    }).then(res => {
      if (res.code === "0") {
        wx.showToast({
          title: "更新成功"
        });
        // 同步本地 user 缓存中的显示信息（如 name、nickname）
        const user = wx.getStorageSync("user") || {};
        const newUser = { ...user, ...form };
        wx.setStorageSync("user", newUser);
        setTimeout(() => {
          wx.navigateBack();
        }, 500);
      } else {
        wx.showToast({
          title: res.msg || "更新失败",
          icon: "none"
        });
      }
    });
  }
});

