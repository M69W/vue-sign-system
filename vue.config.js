const path = require('path');
const resolve = (dir) => {
    path.join(__dirname, dir);
};
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
module.exports = {
    devServer: {
        port: 8001,
        open: true,
        proxy: {
            '/apis': {
                target: 'http://192.168.51.218:6335', // 开发
                // target: 'http://10.9.2.100:18001', // 袁明亮电脑 -- 电脑重启IP可能变化
                // target: 'http://192.168.51.218:6341', // 测试
                // target: 'http://192.168.51.218:9311', // 对外项目
                changeOrigin: true,
                pathRewrite: {
                    '^/apis': ''
                },
                ws: false
            },
            '/ukeyApi': {
                target: 'http://127.0.0.1:9826',
                // target: 'https://127.0.0.1:9825',
                changeOrigin: true,
                pathRewrite: {
                    '^/ukeyApi': ''
                },
                ws: false
            },
            '/apiCloudSign': {
                target: 'http://sign.oa.com/api-cloud-sign',
                changeOrigin: true,
                pathRewrite: {
                    '^/apiCloudSign': ''
                },
                ws: false
            },
        }
    },
    baseUrl: IS_PROD ? '/sign-sys' : '/',
    outputDir: 'dist',
    lintOnSave: true,
    // 是否为生产环境构建生成 source map？
    productionSourceMap: false,
    configureWebpack: (config) => {
        if (IS_PROD) {
            const plugins = [];
            plugins.push(
                //UglifyJsPlugin 1.3.0版本的写法， 2.x不支持了！！！
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log'] //移除console
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            );
            config.plugins = [...config.plugins, ...plugins];
        }
    },
    chainWebpack: (config) => {},
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        extract: IS_PROD,
        sourceMap: false,
        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},
        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },
    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1
};
