/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
Page({

    data: {
        // 选择的图片
        changeimg:[],
        // 文本域的值
        inputVal:'',
        tabs:[{
            id:1,
            name:"体验问题",
            isactive:true
        },
        {
            id:2,
            name:"商品，商家投诉",
            isactive:false
        }]
    },
    // 传入服务器的图片地址
    urlimage:[],
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
    // 获取图片
    handleimg(){
        wx.chooseImage({
            count: 9,
            // 原生 压缩
            sizeType: ['original', 'compressed'],
            // 相机 相册
            sourceType: ['album', 'camera'],
            success: (result) => {
                console.log(result);
                this.setData({
                    // 数组拼接,防止重置掉数组
                    changeimg:[...this.data.changeimg,...result.tempFilePaths]
                })
            },
        });
          
    },
    // 删除图片
    cancleimg(e){
        console.log(e);
        // 获取索引
        const {index} = e.currentTarget.dataset;
        // 获取图片
        const {changeimg} = this.data;
        // 进行删除
        changeimg.splice(index,1);
        // 重新设置回去
        this.setData({
            changeimg
        })
    },
    // 获取文本域
    handleinput(e){
        const inputVal = e.detail.value;
        this.setData({
            inputVal
        })
    },
    // 提交功能
    handlejiao(){
        // 1.获取文本数组
        const {changeimg,inputVal} = this.data;
        // 2.校验内容合法性
        if(!inputVal.trim()){
            wx.showToast({
                title: '没有提交内容',
                mask:true,
            });
              return;
        }
        // 3 准备上传图片 到专门的图片服务器 
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        if(changeimg.length!=0){
        changeimg.forEach((v,i)=>{
             wx.uploadFile({
                // 地址
                url: 'http://img.coolcr.cn/api/upload',
                // 文件路径
                filePath: v,
                // 文件名称
                name: "image",
                formData: {},
                success: (result) => {
                    let url = JSON.parse(result.data).data.url;
                    // 进行服务器传送
                    this.urlimage.push(url);
                    console.log(this.urlimage);
                    // 判断图片是否传完
                    if(i===changeimg.length-1){
                        wx.hideLoading();
                        this.setData({
                            inputVal:'',
                            changeimg:[]
                        })
                        wx.navigateBack({
                            delta: 1
                        });
                          
                    }
                },
            });    
        })
    }else{
        console.log("只传输文本");
        wx.hideLoading();
        wx.navigateBack({
            delta: 1
        });
          
    }
    
    }
})
