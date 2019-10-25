
/*
处理表单菜单点击事件
参数(args)结构：
        |--target 为dom元素对象
        |--opcode 为菜单绑定的操作码标识，比如：save
        |--result (boolean)为函数返回值
        |--option
            |--参数(option)结构：用于控制菜单操作的交互对话框选项，可参考：yiDialog.d方法要求					
*/
const menuItemClick=function(args) {
    var self=this;
    
    return self.invokePlugIn('menuItemClick',args)
        .then(resp=>{
            if(resp.result===true) return Promise.resolve({cancel:true,message:''});
            
            return self.invokeFormOperation(args)
                .then(data=>{
                    return Promise.resolve(data);
                })
                .catch(error=>{
                    return Promise.reject(error);
                });
        })
        .catch(error=>{
            return Promise.reject(error);
        });    
};
export default menuItemClick;