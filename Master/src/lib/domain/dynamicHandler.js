import menuItemClick from './handlers/menuItemClick';
import initUiModel from './handlers/initUiModel';
import beforeDoOperation from './handlers/beforeDoOperation';
import afterDoOperation from './handlers/afterDoOperation';
import afterLoadModelData from './handlers/afterLoadModelData';
import customEvent from './handlers/customEvent';
import { Promise } from 'es6-promise';

export default {
    menuItemClick : menuItemClick,
    initUiModel : initUiModel,
    beforeDoOperation : beforeDoOperation,
    afterDoOperation : afterDoOperation,
    customEvent : customEvent,
    afterLoadModelData:afterLoadModelData,

    log:function(title,args){
      console.log(title);
      console.log(args);
    },
  
    // 处理内部操作请求，分发标准领域操作
    invokeFormOperation:function(args){
      var self=this;
      var ops=this.ops;
      if(!ops){
        ops=this.$ops;
      }
      if(!ops){
        return Promise.reject("没有为领域模型提供操作通讯组件：/domain/handlers/oplist/xoputil.js");
      }
      // 补齐操作调用参数
      if(!args.domainType){
        args.domainType=this.formCtx.domainType;
      }     
      if(!args.formId){
        args.formId=this.formCtx.formId;
      }   
      if(!args.param){
        args.param={
          pageId:self.formCtx.pageId,
          simpleData:{

          },
          selectedRows:[
          ]
        };
      }
      args.param=args.param||{};
      if(!args.param.pageId){
        args.param.pageId=self.formCtx.pageId;
      }
      
      var opcode=args.opcode;
      if(!opcode) return;
      var opHandler=ops[opcode];
      if(!opHandler){
        //取得万能操作
        opHandler=ops.anyop;
      }
      
      return self.beforeDoOperation(args)
        .then(data=>{
          return opHandler.bind(self)(data)
            .then(resp=>{
              args.response=resp.data;
              return self.afterDoOperation(args);                          
            })
            .catch(error=>{
              return Promise.reject(error);
            });   
        })
        .catch(error=>{
          return Promise.reject(error);
        });            
    },
    
    // 提供统一的调用插件方法接口
    invokePlugIn:function(name,args){
      var self=this;
      if(!name) 
      {
        console.log('插件调用失败：方法名为空！');
        return Promise.resolve(args);
      }
      
      var plugs=self.$options.plugs;

      if(!plugs) return Promise.resolve(args);
      var allPromise=[];
      self._.forIn(plugs, p => {
        // 插件方法名默认在领域处理器名前加on。
        name= 'on'+self._.upperFirst(name);
        if(self._.isFunction(p[name])){
          var promise =Promise.resolve(p[name].bind(self)(args));
            allPromise.push(promise);
        }          
      });      
      return Promise.all(allPromise)
        .then(successPromise=>{
          var result=successPromise.pop();
          return Promise.resolve(result);
        })
        .catch(failPromise=>{
          return Promise.reject(failPromise);
        });
    }  
};