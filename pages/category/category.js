import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        // 左侧的菜单数据
    leftmenulist: [],
    // 右侧的商品数据
    rightmenulist: [],
    // 左边显示的下标
    leftindex:0,
    scrolltop:0
    },
// 返回的分类数据
   catelist:[],
    onLoad: function (options) {
          /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样了 
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
      小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求 
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */

      const catelist = wx.getStorageSync("cates");
      if(!catelist){
          this.getmenulist();
      }else{
        //   如果大于10秒
          if(Date.now()-catelist.time>1000*10){
              this.getmenulist();
          }else{
              this.catelist =catelist.data;
              let leftmenulist = this.catelist.map(v=> v.cat_name);
              let rightmenulist = this.catelist[0].children;
                     this.setData({
                           leftmenulist,
                            rightmenulist
                          })
          }
      }
        
    },
    // ES7要加async
    async getmenulist(){
        // ES6语法
        // request({url:"/categories"})
        // .then(result =>{
        //     this.catelist=result.data.message;
        //         // 把接口的数据存入到本地存储中
        //     wx.setStorageSync("cates",{time:Date.now(), data:this.catelist}); 
        //     // 获取左边的菜单
        //     // Es6语法，进行循环遍历
        //     let leftmenulist = this.catelist.map(v=> v.cat_name);
        //     let rightmenulist = this.catelist[0].children;
        //     console.log(rightmenulist);
        //            this.setData({
        //                  leftmenulist,
        //                   rightmenulist,
        //                 })
        //     })
        // es7的async号称是解决回调的最终⽅案
        const res =await request({url:"/categories"})
        this.catelist=res.data.message;
                // 把接口的数据存入到本地存储中
            wx.setStorageSync("cates",{time:Date.now(), data:this.catelist}); 
            // 获取左边的菜单
            // Es6语法，进行循环遍历
            let leftmenulist = this.catelist.map(v=> v.cat_name);
            let rightmenulist = this.catelist[0].children;
            console.log(rightmenulist);
                   this.setData({
                         leftmenulist,
                          rightmenulist,
                        })         
    },
    handle(e){
        // 1.获取索引
        const { index } = e.currentTarget.dataset;
        // 2.给data中的leftindex赋值
        // 3.根据不同的索引来渲染右侧的内容
        let rightmenulist = this.catelist[index].children;
        this.setData({
                leftindex:index,
                rightmenulist,
                // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
                scrolltop: 0
        })
    }
})