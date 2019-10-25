var path = require('path');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');
var vueLoaderConfig = require('./vue-loader.conf');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    
    app:['babel-polyfill','./src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.json'],
    // fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'views': path.resolve(__dirname, '../src/views'),
      'routes': path.resolve(__dirname, '../src/routes'),
      'store': path.resolve(__dirname, '../src/store'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  // resolveLoader: {
  //   fallback: [path.join(__dirname, '../node_modules')]
  // },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        exclude: /node_modules/      
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: []
};
