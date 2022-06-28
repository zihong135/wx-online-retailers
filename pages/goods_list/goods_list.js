import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
Page({
data: {
        tabs:[{
            id:1,
            name:"综合",
            isactive:true
        },
        {
            id:2,
            name:"销量",
            isactive:false
        },
        {
            id:3,
            name:"价格",
            isactive:false
        }],
        goodlist:[]
    },
    // 页面数
    pagelist:1,
queryparams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
},
    onLoad: function (options) {
        // 判断cid跳转还是query跳转
        this.queryparams.cid=options.cid||"";
        this.queryparams.query = options.query||"";
        this.getgoodlist();
    },
    // 页面触底事件，是生命周期函数
    onReachBottom(){
        if( this.queryparams.pagenum >this.pagelist){
            wx:wx.showToast({title: '没有下一页了'});      
        }else{
            this.queryparams.pagenum++;
            this.getgoodlist();
        }
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
    // 获取商品列表
async getgoodlist(){
    const res=await request({url:"/goods/search",data:this.queryparams});
    // let goodlist = res.data.message.goods;
    // 获取总数量
    let total = res.data.message.total;
    // 获取页数，Math.ceil代表最小取整,总页数 = Math.ceil(总条数 /  页容量  pagesize)
    this.pagelist = Math.ceil(total / this.queryparams.pagesize);
    this.setData({
        // 拼接数组
        goodlist:[...this.data.goodlist,...res.data.message.goods]
    })
    // 停止下拉刷新,第一次打开也不会影响
    wx.stopPullDownRefresh();
      
},
// 下拉触发事件
onPullDownRefresh(){
    // 重置商品数据
    this.setData({
        goodlist:[]
    })
    // 重置页码
    this.queryparams.pagenum=1;
    // 重新发送请求
    this.getgoodlist();
}
})