import { Promise } from 'es6-promise';


const initUiModel=function(args){
    var self=this;
    return self.invokePlugIn('initUiModel',args)
      .then(data=>{
        Object.keys(data).forEach(p=>{
          var existData= self[p];
          if(existData){
            var newData=Object.assign({},existData,data[p]);
            self[p]=newData;    
          }
          else{
            self.tagData[p]=data[p];
          }
        });
        
        self.$watch('query',function(newVal,oldVal){
            self.invokePlugIn('refresh',args);
        },{
            immediate:true,
            deep:true
        });
        
        Promise.resolve(data);
      })
      .catch(error=>{
        return Promise.reject(error);
      });
  };

export default initUiModel;