import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */
Page({

    data: {
        orders:[],
        tabs:[{
            id:1,
            name:"全部",
            isactive:true
        },
        {
            id:2,
            name:"待付款",
            isactive:false
        },
        {
            id:3,
            name:"代发货",
            isactive:false
        },{
            
            id:4,
            name:"退货",
            isactive:false
        }],
    },
    onShow(){
        //  1 获取当前的小程序的页面栈-数组 长度最大是10页面 
        let res =getCurrentPages();
        console.log(res);
        // 获取token值
        const token = wx.getStorageSync("token");
        // 判断token是否存在,不存在进行授权
        if(!token){
            wx.navigateTo({
                url: '/pages/auth/auth',
            });
            return;
        }
        // 2 数组中 索引最大的页面就是当前页面
        const {type} = res[res.length-1].options;
        // 判断点击那个按钮type
        this.changeIndex(type-1);
        // 3.对接口进行访问
        this.getorder({type});     
    },
    async getorder(type){
        const res = await request({url:"/my/orders/all",data:type})
        // toLocalString()：可根据本地时间把 Date 对象转换为字符串，并返回结果，返回的字符串根据本地规则格式化。
        // ...v代表原样返回
        const orders = res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
        console.log(orders);
        this.setData({
            orders
        })
    },
    changeIndex(index){
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
    tabsitem(e){
        const index = e.detail;
       this.changeIndex(index);
       this.getorder(index+1);
    },
    onLoad: function (options) {

    },
})