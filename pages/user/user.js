// pages/user/user.js
Page({

    data: {
        userInfo:{},
        shounum:0
    },
    onLoad: function (options) {

    },

    onShow: function () {
        const user = wx.getStorageSync("user");
        const {userInfo} = user;
        // 收藏数目
        let collect = wx.getStorageSync("collect")||[];
        const shounum = collect.length;   
        console.log(userInfo)
        this.setData({
            userInfo,
            shounum
        })
    },
})