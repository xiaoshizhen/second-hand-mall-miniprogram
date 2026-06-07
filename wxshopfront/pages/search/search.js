import { request } from "../../request/index.js";
import { config } from "../../request/config.js";
Page({
  data:{
    defaultImageUrl:'../../imgs/default.png',
    goodsInfoGoodsList:[],        //所有商品
  },
  onLoad: function() {
    this.getGoodsInfoGoodsList('all');
  },

  //获取所有商品
  getGoodsInfoGoodsList(name){
    if(name==null||name==''||name==' '){
      name='all';
    }
    request({url: '/goodsInfo/page/'+name+'?pageNum=1&pageSize=100'}).then(res => {
      if(res.code === '0'){
        let goodsInfoGoodsList = res.data.list;
        goodsInfoGoodsList.forEach(item=>{
          if(!item.fields||item.fields==='[]'){
            item.url=this.data.defaultImageUrl;
          }else{
            let fileArr = JSON.parse(item.fields);
            item.url=config.baseFileUrl+fileArr[0];
          }
        });
        this.setData({
          goodsInfoGoodsList
        })  
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },

  /*
  * 根据商品名称模糊搜索
  */
  search: function(e) {
    var name = e.detail.value;
    this.getGoodsInfoGoodsList(name);
  }
});