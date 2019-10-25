
const beforeDoOperation=function(args){
    var self=this;
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

export default beforeDoOperation;