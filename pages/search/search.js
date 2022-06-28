import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
Page({
    data: {
        goods:[],
        // 按钮隐藏
        isfalse:false,
        // 输入为空
        isvalue:''
    },
    timeid:0,
    handleinput(e){
        // 1.获取输入绑定值
        const {value} = e.detail;
        // 2.检验合法性
        // trim()函数去掉字符串两端的空白
        if(!value.trim()){
            this.setData({
                goods:[],
                isfalse:false
            })
            // 为防止删除过快导致计时器已经结束
            clearTimeout(this.timeid);
            return;
        }
        this.setData({
            isfalse:true
        })
        // 3.发送请求
        clearTimeout(this.timeid);
        this.timeid = setTimeout(()=>{
            this.getsearch(value);
        },300)
    },
    cancle(){
        this.setData({
            isvalue:'',
            goods:[],
            isfalse:false
        })
    },
    async getsearch(query){
        const res = await request({url:"/goods/qsearch",data:{query}})
        const goods = res.data.message;
        console.log(goods)
        this.setData({
            goods
        })
    }
})