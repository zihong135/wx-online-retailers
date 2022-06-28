// Promise形式的showModel
export const showModal =({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })
    })
}
// 购物车确认取消提示框
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success: (res) => {
              resolve(res);
            },
            fail: (err) => {
                reject(err);
            },
          });
    })
}

// 获取登录信息
export const login=({})=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {reject(err)}
        });
          
    })
}
// 支付所必要的参数
export const zhifu=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
           ...pay,
            success: (result) => {
                resolve(result);
            },
            fail:(error)=>{
                reject(error);
            }
    })
    })
}

// 获取用户参数
export const user=()=>{
    return new Promise((resolve,reject)=>{
         // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                   resolve(res)
                },
                fail: (err)=>{
                    reject(err)
                }
              })   
    })
}