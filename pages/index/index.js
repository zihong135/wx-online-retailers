import { request } from "../../request/index.js";

//Page Object
Page({
    data: {
        // 轮播图数组
        swiperlist:[],
        // 导航图数组
        navigatorlist:[],
        // 楼层数组
        loulist:[]
    },
    // 页面开始加载就会触发
    onLoad: function(options) {
        // 1.发送异步请求获取轮播图数据 为防止请求代码过多
        // 优化手段可以通过ES6的promise来解决
        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     success: (result) => {
        //         this.setData({
        //             swiperlist:result.data.message
        //         })
        //     },
        // });
        // promise写法
        this.getswiperlist();
        this.getnavigatorlist();
        this.getloulist()  
    },
    getswiperlist(){
        request({url:"/home/swiperdata"})
        .then(result =>{
        this.setData({
                        swiperlist:result.data.message
                })
            })
    },
    getnavigatorlist(){
        request({url:"/home/catitems"})
        .then(result =>{
        this.setData({
            navigatorlist:result.data.message
                })
            })
    },
    getloulist(){
        request({url:"/home/floordata"})
        .then(result =>{
        this.setData({
           loulist:result.data.message
                })
            })
    }
});
  