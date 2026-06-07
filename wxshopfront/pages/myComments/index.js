// pages/myComments/index.js
import { request } from "../../request/index.js";
import { config } from "../../request/config.js";

Page({
  data: {
    commentList: [] // 我的评价列表
  },

  onLoad() {
    this.loadMyComments();
  },

  onShow() {
    // 页面显示时重新加载，以便修改后能及时更新
    this.loadMyComments();
  },

  /**
   * 加载我的评价列表
   * 由于后端没有直接通过userid查询的接口，我们获取所有评价后在前端过滤
   */
  loadMyComments() {
    const user = wx.getStorageSync("user");
    if (!user) {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      });
      wx.navigateBack();
      return;
    }

    // 使用分页接口获取所有评价，然后在前端过滤
    // 接口格式：/commentInfo/page/{name}?pageNum=1&pageSize=1000
    request({
      url: "/commentInfo/page/all?pageNum=1&pageSize=1000",
      method: "GET"
    }).then(res => {
      if (res.code === "0") {
        // 过滤出当前用户的评价
        let allComments = res.data.list || [];
        let myComments = allComments.filter(item => item.userid === user.id);
        
        // 为每个评价获取商品信息（包括图片）
        this.loadGoodsInfo(myComments);
      } else {
        wx.showToast({
          title: res.msg || "加载失败",
          icon: "none"
        });
      }
    }).catch(err => {
      wx.showToast({
        title: "加载失败",
        icon: "none"
      });
    });
  },

  /**
   * 为评价列表加载商品信息
   */
  loadGoodsInfo(comments) {
    if (comments.length === 0) {
      this.setData({
        commentList: []
      });
      return;
    }

    // 批量获取商品信息
    const promises = comments.map(comment => {
      return request({
        url: "/goodsInfo/" + comment.goodsid,
        method: "GET"
      }).then(res => {
        if (res.code === "0") {
          const goods = res.data;
          let imgSrc = "../../imgs/default.png";
          if (goods.fields) {
            try {
              const fields = JSON.parse(goods.fields);
              if (fields.length) {
                imgSrc = config.baseFileUrl + fields[0];
              }
            } catch (e) {
              imgSrc = "../../imgs/default.png";
            }
          }
          return {
            ...comment,
            goodsName: goods.name || "商品已下架",
            goodsImg: imgSrc,
            goodsPrice: goods.price || 0
          };
        } else {
          return {
            ...comment,
            goodsName: "商品已下架",
            goodsImg: "../../imgs/default.png",
            goodsPrice: 0
          };
        }
      }).catch(err => {
        return {
          ...comment,
          goodsName: "商品已下架",
          goodsImg: "../../imgs/default.png",
          goodsPrice: 0
        };
      });
    });

    Promise.all(promises).then(commentList => {
      // 按时间倒序排列
      commentList.sort((a, b) => {
        if (a.createtime && b.createtime) {
          return new Date(b.createtime) - new Date(a.createtime);
        }
        return 0;
      });
      this.setData({
        commentList: commentList
      });
    });
  },

  /**
   * 删除评价
   */
  deleteComment(e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: "提示",
      content: "确认删除该评价吗？",
      success(res) {
        if (res.confirm) {
          request({
            url: "/commentInfo/" + id,
            method: "DELETE"
          }).then(r => {
            if (r.code === "0") {
              wx.showToast({
                title: "删除成功",
                icon: "success"
              });
              that.loadMyComments();
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
  },

  /**
   * 修改评价
   */
  editComment(e) {
    const comment = e.currentTarget.dataset.comment;
    const currentContent = comment.content || "";
    
    // 跳转到评价编辑页面
    const url = `/pages/comment/index?goodsId=${comment.goodsid}&commentId=${comment.id}&mode=edit&content=${encodeURIComponent(currentContent)}`;
    wx.navigateTo({
      url: url
    });
  }
});
