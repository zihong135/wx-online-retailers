// pages/login/login.js
import {user} from "../../lib/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
    },
    onLoad: function (options) {
    },

    async getUserProfile(){
        // 1.获取用户信息
        const res = await user({});
        console.log(res);
        // 2.将用户信息本地存储
        wx.setStorageSync("user", res);
        // 返回上一页
        wx.navigateBack({
            delta: 1
        });
    }
})