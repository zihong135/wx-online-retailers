// 同时发送异步代码的次数
let ajaxtime=0;
export const request=(params)=>{
    // 拼接旧的header token值
    let header = {... params.header};
    // 判断url是否携带/my
    if(params.url.includes("/my/")){
        header["Authorization"]=wx.getStorageSync("token");   
    }
    ajaxtime++;
    wx.showLoading({
        title: '加载中',
        mask:true
      })
    // 公共路径
    const baseurl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
    wx.request({
        // 解构
       ... params,
       header:header,
       url:baseurl+params.url,
    //    成功
       success:(result)=>{
           resolve(result);
       },
    //    失败
       fail:(err)=>{
           reject(err);
       },
    //    成功或失败都会执行
       complete:()=>{
        ajaxtime--;
            if(ajaxtime===0){
                      wx.hideLoading()
            }
       }
    });
})
}