
export default function(resolver,http){
    // var self=this;

    return function(args){
        var self=this;
        var url=args.url;
        if(resolver){
            url=resolver(
                {
                    domainType:args.domainType,
                    formId:args.formId,
                    opcode:args.opcode
                });
        }
        if(!url || !http) {
            console.log("当前操作请求失败：url为空或者http依赖为传入");
            return;
        }
        return http.post(url,args.param)
            .then(resp=>{
                var result;
                if(resp && resp.data && resp.data.operationResult && resp.data.operationResult.srvData && resp.data.operationResult.isSuccess){
                    result=resp.data.operationResult.srvData;
                }
                if(result){
                    var billData=result[0]||{};
                    if(billData.id && self.uiData){
                        self.uiData.id=billData.id;
                    }
                }
                return Promise.resolve(resp);
            })
            .catch(error=>{
                return Promise.reject(error);
            });
    };
}