import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */

Page({

    data: {
        gooddetail:{},
        coactive:false
    },
    // 商品对象
    Gooddetail:{},
    goodid:0,
    onShow: function () {
      // 1. 获取当前的小程序的页面栈-数组 长度最大是10页面 
      let page =getCurrentPages();
      console.log(page);
      this.goodid = page[page.length-1].options.goods_id
      this.getgooddetail();
    },
async getgooddetail(){
    // 如果名字一样可以采用E6语法data:this.goods_id
    const res =await request({url:"/goods/detail",data:{goods_id:this.goodid}});
   const gooddetail = res.data.message;
   this.Gooddetail = gooddetail;
   console.log(this.Gooddetail);
  //  判断是否收藏
  let collect = wx.getStorageSync("collect")||[];
  // some函数是一个true就为true
  let coactive =  collect.some(v => v.goods_id === this.Gooddetail.goods_id);
   this.setData({
       gooddetail:{
        //    需要传的参数
        pics:gooddetail.pics,
        // iphone部分手机不识别webp图片格式
        // 最好找后台 让他进行修改
        // 临时自己改 确保后台存在1.webp=>1.jpg /g表示全部
        goods_introduce:gooddetail.goods_introduce.replace(/\.webp/g, '.jpg'),
        goods_name:gooddetail.goods_name,
       goods_price:gooddetail.goods_price
       },
       coactive
   })
},
preview(e){
    // 1 先构造要预览的图片数组 
    const url = this.data.gooddetail.pics.map(v=>v.pics_mid);
     // 2 接收传递过来的图片url
    const {index} = e.currentTarget.dataset;
    wx.previewImage({
        current:url[index],
        urls: url,
    });    
},
addcart(){
  // 1.获取购物车的数据，如果为空则赋予一个空数据
  const cart = wx.getStorageSync("cart")||[];
  // 2.判断商品的商品Id是否存在，这是循环index,如果不存在则index=-1
  const index  = cart.findIndex(v=>v.goods_id===this.Gooddetail.goods_id);
  //3.如果不存在 
  if(index===-1){
    // 重新设一个num属性进去，如果在data中的数据则需要this.setData
    this.Gooddetail.num=1;
    // 购物车cart是否被选中
    this.Gooddetail.check=true;
    // 第一次添加
    cart.push(this.Gooddetail);
  }else{
    // 同样在data中需要setData()
    // 不是第一次添加,需要num++
    cart[index].num++;
  }
  // 将数据本地存储
  wx.setStorageSync("cart", cart);
  // 弹窗
  wx.showToast({
    title: '成功加入购物车',
    icon: 'success',
    // 制造蒙版，防止用户手抖猛点1.5s后才能再次点击
    mask: true,
  });
    
},
handleco(){
  // 1.获取收藏缓存
  let collect = wx.getStorageSync("collect")||[];
  // 2.寻找索引
  let index = collect.findIndex(v=>v.goods_id===this.Gooddetail.goods_id);
  let coactive = false;
  // 3.判断是否已经收藏
  if(index!==-1){
    // 删除
    collect.splice(index,1);
    coactive = false;
  }else{
    // 添加
    collect.push(this.Gooddetail);
    coactive = true;
  }
  this.setData({
    coactive
  })
  wx.setStorageSync("collect", collect);
    
},
gotopay(){
  let pay = []
  this.Gooddetail.num = 1
  pay.push(this.Gooddetail)
  wx.setStorageSync("pay",pay)
  wx.navigateTo({
    url: '/pages/pay/pay?goods_id='+this.Gooddetail.goods_id,
  });
}
})
