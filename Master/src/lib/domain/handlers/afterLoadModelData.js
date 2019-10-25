
const afterLoadModelData=function(args){
    var self=this;
    return self.invokePlugIn('afterLoadModelData',args);
  };

export default afterLoadModelData;