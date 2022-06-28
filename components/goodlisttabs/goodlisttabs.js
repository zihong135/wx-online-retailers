// components/goodlisttabs/goodlisttabs.js
Component({
    properties: {
        tabs:{
            type:Array,
            value:[]
        }
    },

    data: {

    },

    methods: {
        // 子传父事件
        handletabs(e){
            const {index} =e.currentTarget.dataset;
             this.triggerEvent('tabsitem',index);
        }
    }
})
