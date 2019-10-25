export default function(){
    return{
        // 表单组件上下文
        formCtx: {
            domainType:'dynamic',
            formId:'',
        },
        // 表单组件页面响应式数据对象
        uiData: {},
        // 表单其他业务数据
        tagData: {
            comboStore:{}
        },
        // 表单验证规则
        rules:{},
        // 业务插件
        // plugs: []
    };
}