
import Vue from 'vue';
import ElementUI from 'element-ui';
import BaiduMap from 'vue-baidu-map'
import 'element-ui/lib/theme-chalk/index.css';

import axios from './services/axios';
import VueAxios from 'vue-axios';
import App from './app';
import router from './routes/index';
import store from './vuex/global';
import _ from 'lodash';
import injector from 'vue-inject';
//import Cookies from 'js-cookie';
import localStorage from 'vue-localstorage';
import domainOperation from './lib/domain/opservice';
import urlResolver from './services/urlResolver';
import { format } from './services/utils/stringUtil';
import comm from './services/utils/commUtil';


import agreement from 'src/components/agreement';
import breadcrumb from 'src/components/breadcrumb';
import city from 'src/components/city';
import imgrender from 'src/components/imagerender';
import menu from 'src/components/menu';
import timer from 'src/components/timer';
import upload from 'src/components/upload';
import radio from 'src/components/radio';
import verifcode from 'src/components/verifcode';
import bindcard from 'src/components/bindCard';
import paypassword from 'src/components/paypassword';


// 注册所有服务实例
require('./services/util');

// 注入lodash库至所有组件，都可以通过this._来调用此库里所有方法
Object.defineProperty(Vue.prototype, '_', { value: _ });
Object.defineProperty(Vue.prototype, '$lodash', { value: _ });
Object.defineProperty(Vue.prototype, '$util', {
  value: {
    format: format
  }
});

Object.defineProperty(Vue.prototype, 'comm', { value: comm });

var eventBus = new Vue();
Object.defineProperty(Vue.prototype, '$eventbus', { value: eventBus });
Object.defineProperty(Vue.prototype, 'eventbus', { value: eventBus });

Vue.use(localStorage);
Vue.use(injector);
Vue.use(ElementUI);
Vue.use({
  install: (Vue) => {
    Vue.component('Agreement', agreement);
    Vue.component('BreadCrumb', breadcrumb);
    Vue.component('City', city);
    Vue.component('ImgRender', imgrender);
    Vue.component('Menu', menu);
    Vue.component('Timer', timer);
    Vue.component('Upload', upload);
    Vue.component('Radio', radio);
    Vue.component('Verifcode',verifcode);
    Vue.component('BindCard',bindcard);
    Vue.component('PayPassword',paypassword);
  }
});

Vue.use(VueAxios, axios);
// 加入领域模型控制器
Vue.use(domainOperation,
  {
    http: axios,
    resolver: urlResolver
  });

//百度地图
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'puLMuid0Ml9rnDaL73H6xblymHzoC8K8'
});



window.__lendApp__ = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

// 输入框在虚拟键盘弹出时，自动滚动到可见位置
document.body.addEventListener('click', function (event) {
  var element = event.target;
  var tags = {
    'INPUT': 1,
    'TEXTAREA': 1,
  };
  if ((element.tagName in tags)) {
    setTimeout(function () {
      element.scrollIntoViewIfNeeded();
      // console.log('scrollIntoViewIfNeeded');
    }, 400);
  }
}, false);
