const billHandler={};

// 添加bill独有的处理器
billHandler.billInitialized = function(args){
    var self=this;

    return self.invokePlugIn('billInitialized',args);
};

// 覆盖基类组件的处理器
billHandler.beforeDoOperation = function(args){
    var self=this;
    switch(args.opcode.toLowerCase()){
      case 'save':
          args.param=args.param ||{};
          args.param.billData=JSON.stringify([self.uiData]);                
          break;
    }

    return self.invokePlugIn('beforeDoOperation',args)
      .then(data=>{
        if(data.cancel===true){
          return Promise.reject({cancel:true,message:'plugin cancel the operation!'});
        }        
        return Promise.resolve(data);
      })
      .catch(error=>{
        return Promise.reject(error);
      });
  };

  billHandler.afterDoOperation = function(args){
    var self=this;
    return self.invokePlugIn('afterDoOperation',args)
      .then(data=>{
        var currPath=self.$route.path;
        if(!data.cancel) {
          switch(data.opcode.toLowerCase()){
              case 'save':
                  var srvData= data.response.operationResult.srvData;
                  if(srvData && srvData[0] && srvData[0].id){
                    var targetBillPath=currPath+'/'+srvData[0].id;
					                    
                    if(data.param && data.param.path){
                    	currPath=data.param.path;
                    }
                    // self.initUiModel({id:srvData[0].id});
                    
                    //self.$router.replace({path:currPath,query:{id:srvData[0].id}});   
                    // self.$router.go(0);
                    // self.$route.param.id=srvData[0].id;
                    //self.initUiModel({pkId:srvData[0].id});
                  }
                        
                  break;
          }
        }
        return Promise.resolve(data);
      })
      .catch(error=>{
        return Promise.reject(error);
      });
  };

export default billHandler;