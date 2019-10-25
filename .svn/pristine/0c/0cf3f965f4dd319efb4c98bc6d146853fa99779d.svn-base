export let _Vue;

export function install (Vue, options) {
    if (install.installed && _Vue === Vue) return;

    install.installed = true;
  
    _Vue = Vue;
  
    const isDef = v => v !== undefined;

    var http=Vue.$http;
    var resolver=Vue.$resolver;

    if(!http){
        http=options.http;
    }
    if(!resolver){
        resolver=options.resolver;
    }

    var ops=this.ops.bind(Vue)(resolver,http);
  
  
    Object.defineProperty(Vue.prototype, '$ops', {
      get () { return ops;}
    });
  }