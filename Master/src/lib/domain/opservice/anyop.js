export default function(resolver,http){
    // var self=this;

    return function(args){
        var self=this;
        if(!args) return;

        var url='';
        if(resolver){
            url=resolver(
                {
                    domainType:args.domainType,
                    formId:args.formId,
                    opcode:args.opcode
                });
        }
        if(args && args.url){
            url=args.url;
        }
        if(!url || !http) {
            console.log("当前操作请求失败：url为空或者http依赖为传入");
            return;
        }
        return http.post(url,args.param);
    };
}