/**
 * 开发模式下的webpack配置
 * 在整个项目开发过程中,几乎99%的时间都是在这个模式下进行的
 * 注意.两种模式的配置有较大差异！！
 */

/**
 * 注意整个配置中我们使用 Node 内置的 path 模块,
 * 并在它前面加上 __dirname这个全局变量.
 * 可以防止不同操作系统之间的文件路径问题,
 * 并且可以使相对路径按照预期工作
 */
const STATIC_PATH = 'static';
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackDevServer = require('webpack-dev-server');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env;
const HOST = env.HOST || env.npm_package_config_host;
const PORT = env.POST || 3000;

module.exports = {
    /**
     * mode: "production", // enabled useful tools for development
     * mode: "none", // no defaults
     */
    mode: "development",

    /**
     *  entry 对象是用于 webpack 查找启动并构建 bundle
     *  其上下文是入口文件所处的目录的绝对路径的字符串
     *  entry 后面的内容格式为 string/array/object
     *  entry:['./src/index.js']
     *  entry:{a:'./src/index.js'}
     */
    entry: [
        "./src/index.js"
    ],
    /*entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8071',
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, './src/index.js'),
    ],*/

    /**
     * webpack 如何输出结果的相关选项
     */
    output: {
        /**
         *  filename: "[name].js"
         *  用于多个入口点(entry point)（出口点？）
         *  filename: "[chunkhash].js",
         *  用于长效缓存
         *「入口分块(entry chunk)」的文件名模板（出口分块？）
         */
        publicPath: '/',
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',

        /**
         * 导出库(exported library)的名称
         */
        library: "MyLibrary",
        /**
         * libraryTarget: "umd", // 通用模块定义
         * libraryTarget: "commonjs2", // exported with module.exports
         * libraryTarget: "commonjs-module", // 使用 module.exports 导出
         * libraryTarget: "commonjs", // 作为 exports 的属性导出
         * libraryTarget: "amd", // 使用 AMD 定义方法来定义
         * libraryTarget: "this", // 在 this 上设置属性
         * libraryTarget: "var", // 变量定义于根作用域下
         * libraryTarget: "assign", // 盲分配(blind assignment)
         * libraryTarget: "window", // 在 window 对象上设置属性
         * libraryTarget: "global", // property set to global object
         * libraryTarget: "jsonp", // jsonp wrapper
         * 导出库(exported library)的类型
         */
        libraryTarget: "umd",

        /**
         * 在生成代码时,引入相关的模块、导出、请求等有帮助的路径信息
         */
        pathinfo: true, // boolean
    },

    /**
     *  解析模块请求的选项
     */
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
        alias: {
            '@': `${__dirname}/src/`,
            'containers': `${__dirname}/src/containers`,
            'routes': `${__dirname}/src/routes`,
            'static': `${__dirname}/src/static/`,
            'utils': `${__dirname}/src/utils/`,
            'config': `${__dirname}/src/config/`,
            'views': `${__dirname}/src/views/`,
            'components': `${__dirname}/src/components/`,
        }
    },

    /**
     * 关于模块配置
     */
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
                //使用 cacheDirectory 选项,将babel-loader提速至少两倍.这会将转译的结果缓存到文件系统中.
                /*options: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-runtime', ['import', {
                        libraryName: 'antd',
                        style: 'css' // or true or css 这里必须是 css，否则样式不能加载
                    }]]
                }*/
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // 将 JS 字符串生成为 style 节点
                }, {
                    loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                }, {
                    loader: "less-loader" // 将 Sass 编译成 CSS
                }]
            },
            {//CSS处理
                test: /\.css$/,
                loader: "style-loader!css-loader?modules",
                exclude: /node_modules/,
            },
            {//antd样式处理
                test: /\.css$/,
                exclude: /src/,
                use: [
                    {loader: "style-loader",},
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg)$/,
                include: [
                    path.join(__dirname, 'src/images')
                ],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.ico$/,
                include: path.join(__dirname, 'src/static'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10,
                        name: `${STATIC_PATH}/[name].[ext]`
                    }
                }]
            },
            {
                test: /\.(woff|eot|ttf|js|svg|otf)$/,
                include: [
                    path.join(__dirname, 'src/fonts')
                ],
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10,
                        name: `${STATIC_PATH}/fonts/[name].[ext]`
                    }
                }] 

                /**
                 * 图片加载器
                 */
            },
            {
                test: /\.pdf/,
                use: ['file-loader']
            },
        ]
    },

    /**
     * devtool 指明了sourcemap的生成方式
     * "source-map", // enum
     * "inline-source-map", // 嵌入到源文件中
     * "eval-source-map", // 将 SourceMap 嵌入到每个模块中
     * "hidden-source-map", // SourceMap 不在源文件中引用
     * "cheap-source-map", // 没有模块映射(module mappings)的 SourceMap 低级变体(cheap-variant)
     * "cheap-module-source-map", // 有模块映射(module mappings)的 SourceMap 低级变体
     * "eval", // 没有模块映射,而是命名模块.以牺牲细节达到最快.
     * 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
     * 牺牲了构建速度的 `source-map' 是最详细的.
     */
    devtool: 'inline-source-map"',

    /**
     * 不要遵循/打包这些模块,而是在运行时从环境中请求他们
     * 防止将某些 import 的包(package)打包到 bundle 中
     * 而是在运行时(runtime)再去从外部获取这些扩展依赖
     */
    externals: {
        jquery: 'jQuery'
    },

    devServer: {
        contentBase: path.join(__dirname, 'build'),
        publicPath: '/',
        host: 'localhost',
        port: 3000,
        inline: true,
        hot: true,
        historyApiFallback: {
            index: '/index.html'
        },
        proxy: {
            "*": {
                target: "http://10.22.100.104:5073",
                changeOrigin: true,
                bypass: function (req, res, proxyOptions) {
                    if (req.headers.accept.indexOf("html") !== -1) {
                        console.log("Skipping proxy for browser request.");
                        return "/index.html";
                    }
                }
            }
        }
    },

    plugins: [
        new CleanWebpackPlugin(['build']), // 清除编译目录
        /*new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'vendor', 'd3', 'echarts', 'main1'],
            minChunks: 2
        }),*/
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.NoEmitOnErrorsPlugin(), //不提交错误
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/static',
                to: `${STATIC_PATH}/`,
                toType: 'dir'
            }
        ]), //将单个文件或整个目录复制到构建目录
    ]
};
