const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const smp = new SpeedMeasurePlugin();
const isDev = process.env.NODE_ENV === "development";

module.exports = smp.wrap({
  mode: isDev ? "development" : "production",
  entry: {
    index: "./src/index.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash:6].js",
    publicPath: "",
  },
  devServer: {
    port: "3000", //默认是8080
    hot: true,
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // 匹配顾泽
        use: [
          "thread-loader",
          "cache-loader",
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        ],
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.(le|c|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [
                  require("autoprefixer")({
                    overrideBrowserslist: [">0.25%", "not dead"],
                  }),
                ];
              },
            },
          },
          "less-loader",
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              outputPath: "assets",
              publicPath: "../assets",
              limit: 10240, // 设置 limit 的值大小为 10240，即资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录
              esModule: false,
              name: "[name]_[hash:6].[ext]",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /.html$/,
        use: "html-withimg-loader",
      },
    ],
  },
  devtool: "cheap-module-eval-source-map", // 开发环境下使用
  plugins: [
    new HardSourceWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!dll", "!dll/**"], //不删除dll目录
    }),
    new OptimizeCssPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      publicPath: "/",
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "./public/js/*.js",
          to: path.resolve(__dirname, "dist", "js"),
          flatten: true,
        },
      ],
    }),
    new webpack.ProvidePlugin({
      React: "react",
      Component: ["react", "Component"],
      Vue: ["vue/dist/vue.esm.js", "default"],
      $: "jquery",
      _map: ["lodash", "map"],
    }),
  ],
  optimization: {
    concatenateModules: false,
    splitChunks: {
      //分割代码块
      maxInitialRequests: 6, //默认是5
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1,
          name: "vendor",
          test: /node_modules/,
          chunks: "initial",
          minSize: 100,
          minChunks: 1, //重复引入了几次
        },
        "lottie-web": {
          name: "lottie-web", // 单独将 react-lottie 拆包
          priority: 5, // 权重需大于`vendor`
          test: /[\/]node_modules[\/]lottie-web[\/]/,
          chunks: "initial",
          minSize: 100,
          minChunks: 1, //重复引入了几次
        },
      },
    },
  },
});
