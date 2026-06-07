// 同时发送异步请求的次数,统一访问后台
let ajaxTimes = 0;
export const request = (params) => {
  ajaxTimes ++;
  wx.showLoading({
    title: '正在加载。。。',
    mask: true
  })
  const baseUrl = "http://localhost:8080";
  return new Promise((resolve,reject)=>{//一个正确执行，一个错误执行
    wx.request({
      url: baseUrl+params.url,

      
      method: params.method || "GET",
      data: params.data || {},
      header: {
        'content-type': 'application/json' // 默认 JSON 格式，若后端需要表单格式可改为 'application/x-www-form-urlencoded'
      },


      success:(result)=>{
        resolve(result.data);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes==0){
          wx.hideLoading();
        }
      }
    })
  });
}