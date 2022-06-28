import {login} from "../../lib/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
Page({
    data: {

    },
    async handletoken(e){
        try{
        // 1.获取用户信息
       const {encryptedData,rawData,iv,signature} = e.detail;
    //    2.获取小程序登录后的code
       const {code} =await login({}); 
    //    将所有属性放在一起
       const loginParams={ encryptedData, rawData, iv, signature ,code};
    //    发送请求获取用户的token,由于不是企业appid并且加入白名单，并不能获取到
    //    const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    let token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
        //  3.放置本地存储
        wx.setStorageSync("token", token);
        // 返回上一页
        wx.navigateBack({
            delta: 1
        });
    }catch(err){
            console.log(err);
    }
    }
})
