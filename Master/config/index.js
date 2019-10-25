// see http://vuejs-templa
// tes.github.io/webpack for documentation.
var path = require('path');
var os = require('os');
var networkInterfaces = os.networkInterfaces();
var ip;

for (var key in networkInterfaces) {
  networkInterfaces[key].forEach(item => {
    if (!item.internal && item.family === 'IPv4') {
      ip = item.address;
    }
  });
}

//开发环境代理服务器
const ProxyServer_Dev='https://fwgl.zys6d.com';
//正式环境代理服务器
const ProxyServer_Prd='https://fwgl.zys6d.com';

module.exports = {
  
  build: {
    env: require('./prod.env'),
    port: 8082,
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all staticø assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    proxyTable: {
      '/auth/credentials': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
        cookieDomainRewrite: { 
          "*": "" 
        } 
      },
      '/auth/status': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },    
      '/fileinfo': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/bill/ydj_seritem': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/bill/ydj_merchantorder': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/dynamic': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/bill': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/list': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/report': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/auth/logout': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
        cookieDomainRewrite: { 
          "*": "" 
        } 
      },
      '/reguser': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/company':{
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
      }
    }
  },
  dev: {
    env: require('./dev.env'),
    port: 8081,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/auth/credentials': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
        cookieDomainRewrite: { 
          "*": "" 
        } 
      },
      '/fileinfo': {
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/auth/status': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },      
      '/dynamic': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/bill': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/list': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/report': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/auth/logout': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
        cookieDomainRewrite: { 
          "*": "" 
        } 
      },
      '/reguser': {
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
        // pathRewrite: {
        //   '/api': '/'
        // }
      },
      '/company':{
        target: ProxyServer_Dev,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
      },
      '/authuser':{
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
      },
      '/sms':{
        target: ProxyServer_Prd,  // 通过本地服务器将你的请求转发到这个地址
        changeOrigin: true,  // 设置这个参数可以避免跨域
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
