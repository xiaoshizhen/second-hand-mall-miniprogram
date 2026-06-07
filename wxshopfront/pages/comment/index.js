// pages/pay/index.js
import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:0,
    content:"",
    commentId:0,  // 评价ID，编辑模式时使用
    mode:"add"    // add: 添加模式, edit: 编辑模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    this.setData({
      goodsId:options.goodsId || 0,
      commentId:options.commentId || 0,
      content:options.content ? decodeURIComponent(options.content) : "",
      mode:options.mode || "add"
    })
  },

  /**
   * 绑定输入评价内容
   */
  onComment(e) {
    this.setData({
      content: e.detail.value
    })
  },

  /**
   * 提交评价
   */
  comment(e) {
    if(!this.data.content || !this.data.content.trim()) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      })
      return;
    }
    
    let user = wx.getStorageSync('user');
    if(!user) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return;
    }

    // 如果是编辑模式，先删除旧评价再创建新评价
    if(this.data.mode === "edit" && this.data.commentId) {
      this.updateComment();
    } else {
      // 添加模式
      let data = {userid: user.id, content:this.data.content.trim(), goodsid:this.data.goodsId, level:3};
      request({url:"/commentInfo",data:data,method:"POST"}).then(res => {
        if(res.code === "0") {
          wx.showToast({
            title: '评价成功',
          })
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })
    }
  },

  /**
   * 更新评价（通过删除+创建实现）
   */
  updateComment() {
    const that = this;
    const commentId = this.data.commentId;
    const user = wx.getStorageSync('user');
    
    // 先删除旧评价
    request({
      url: "/commentInfo/" + commentId,
      method: "DELETE"
    }).then(deleteRes => {
      if(deleteRes.code === "0") {
        // 创建新评价
        let data = {
          userid: user.id,
          content: this.data.content.trim(),
          goodsid: this.data.goodsId,
          level: 3
        };
        request({
          url: "/commentInfo",
          data: data,
          method: "POST"
        }).then(createRes => {
          if(createRes.code === "0") {
            wx.showToast({
              title: "修改成功",
              icon: "success"
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } else {
            wx.showToast({
              title: createRes.msg || "修改失败",
              icon: "none"
            });
          }
        }).catch(err => {
          wx.showToast({
            title: "修改失败",
            icon: "none"
          });
        });
      } else {
        wx.showToast({
          title: deleteRes.msg || "修改失败",
          icon: "none"
        });
      }
    }).catch(err => {
      wx.showToast({
        title: "修改失败",
        icon: "none"
      });
    });
  }


  
})