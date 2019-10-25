const listHandler={};

// 添加bill独有的处理器
listHandler.listInitialized = function(args){
    var self=this;

    return self.invokePlugIn('listInitialized',args);
};



export default listHandler;