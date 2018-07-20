const { VueLoaderPlugin } = require('vue-loader');
const webpack = require("webpack");
var path = require('path');

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [["es2015"]],
                    plugins: ["transform-react-jsx"]
                },
            },
            // moment needs to be globally exposed in order to work with fullcalendar
            { test: require.resolve('moment'), loader: 'expose-loader?moment' },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                loaders: {
                }
                // other vue-loader options go here
              }
            },
            { // if you use vue.common.js, you can remove it
              test: /\.esm.js$/,
              loader: 'babel-loader',
              include: [
                path.resolve('node_modules', 'vue/dist')
              ]
            },
            {
                test:/\.(scss|css)$/,
                use:['style-loader','css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
      alias: {
          'vue$': 'vue/dist/vue.esm.js',
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // Bundle react & react-dom into separate vendor-react bundle
                react: {
                  test: /[\\/]node_modules[\\/](react\-dom|react)[\\/]/,
                  name: 'vendor-react',
                  chunks: 'all',
                },
                vue: {
                  test: /[\\/]node_modules[\\/](vue|vue-material)[\\/]/,
                  name: 'vendor-vue',
                  chunks: 'all',
                },
            }
        },
    },
    externals: {
        "jquery": "jQuery",
        "jquery-mousewheel": "jQuery",
    },
    output: {
        path: '/',
        filename: '[name].js'
    },
    plugins: [
        // By default, moment loads aaaall the locale files, which bloats the bundle size
        // This plugin forces moment to only load the German locale
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /de/),
        new VueLoaderPlugin()
    ]
};