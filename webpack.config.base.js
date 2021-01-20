const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    /**
     *  entry 对象是用于 webpack 查找启动并构建 bundle
     *  其上下文是入口文件所处的目录的绝对路径的字符串
     *  entry 后面的内容格式为 string/array/object
     *  entry:['./src/index.js']
     *  entry:{a:'./src/index.js'}
     */
    /*entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8071',
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, './src/index.js'),
    ],*/
    entry: [
        "./src/index.js"
    ],

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
                loader: "url-loader?limit=8192"
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
     * 不要遵循/打包这些模块,而是在运行时从环境中请求他们
     * 防止将某些 import 的包(package)打包到 bundle 中
     * 而是在运行时(runtime)再去从外部获取这些扩展依赖
     */
    externals: {
        jquery: 'jQuery'
    },

};