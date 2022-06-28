// pages/collect/collect.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs:[{
            id:1,
            name:"商品收藏",
            isactive:true
        },
        {
            id:2,
            name:"品牌收藏",
            isactive:false
        },
        {
            id:3,
            name:"店铺收藏",
            isactive:false
        },
        {
            id:4,
            name:"浏览足迹",
            isactive:false
        }
    ],
    collect:[]
    },
// 组件传过来的值修改选中效果
tabsitem(e){
    //获取索引
    const index = e.detail;
    //修改数据源，如果this.tabs.forEach指的是对象不是函数
    let tabs = this.data.tabs;
    //进行遍历
    tabs.forEach((v,i)=>{
        i===index?v.isactive=true:v.isactive=false
    });
    //赋值
    this.setData({
        tabs
    })
},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        let collect = wx.getStorageSync("collect");
        this.setData({
            collect
        })
    },
})