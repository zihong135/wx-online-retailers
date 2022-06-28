/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */

import {showModal,showToast,zhifu} from "../../lib/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
Page({
    data: {
        address:{},
        cart:{},
        totalprice:0,
        totalnum:0
    },
    onShow(){
        // 1.获取缓存中的地址信息
        const address = wx.getStorageSync("address");
         let page =getCurrentPages();
        this.goodid = page[page.length-1].options.goods_id
        console.log(this.goodid)
        if(this.goodid){
          let pay = wx.getStorageSync("pay")
          this.setbottom(pay)
        }else{
        // 2.获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart")||[];
        // 3.对选中的购物进行过滤
        cart = cart.filter(v=>v.check);
        this.setbottom(cart);
        }
        this.setData({
            address
        })
    },
    onLoad: function (options) {

    },
// 底部的计算价格变化
setbottom(cart){
  let totalprice = 0;
  let totalnum=0;
  cart.forEach(v => {
    totalprice += v.num*v.goods_price;
    totalnum +=v.num;
  });
  this.setData({
      totalprice,
      totalnum,
      cart
  })  
},
//添加地址
address(){
    wx.chooseAddress({
        success: (result) => {
            let address = result;
            address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
            wx.setStorageSync("address", address);             
        },
    });
      
},
async handlepay(){
  try{
  const token = wx.getStorageSync("token");
  // 判断是否有token
  if(!token){
    wx.navigateTo({
      url: '/pages/auth/auth'
    });    
    return;
  }
  // 1.给请求头进行key:value配对
//  const header = {Authorization: token};
//  2.获取请求体参数
 const order_price = this.data.totalprice;
 const consignee_addr =this.data.address.all;
 let goods=[];
 const {cart} = this.data;
 cart.forEach(v => {
   goods.push({
    goods_id:v.goods_id,
    goods_number:v.num,
    goods_price:v.goods_price
   })
 });
//  3.封装请求体
 const allparams={order_price,consignee_addr,goods}
//  4.发送请求
  const res = await request({url:"/my/orders/create",method:"POST",data:allparams});
  let {order_number}=res.data.message;
//  5.发送预支付请求
const  res2  = await request({ url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
const pay =res2.data.message.pay;
// 6.微信支付
  await zhifu(pay);
   // 7 查询后台 订单状态
   const res3 = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
   console.log(res3);
   await showToast({ title: "支付成功" });
   // 8 手动删除缓存中 已经支付了的商品
   let newCart=wx.getStorageSync("cart");
   newCart=newCart.filter(v=>!v.checked);
   wx.setStorageSync("cart", newCart);
   // 8 支付成功了 跳转到订单页面
   wx.navigateTo({
     url: '/pages/order/order'
   });
  }catch(error){
    await showToast({ title :"支付失败"})
    console.log(error);
  }
}
})