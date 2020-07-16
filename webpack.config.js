const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const config = require("./public/config")[isDev ? "dev" : "build"];

module.exports = {
  mode: isDev ? "development" : "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[hash].js",
    publicPath: "",
  },
  devServer: {
    port: "3000", //默认是8080
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // 匹配顾泽
        use: {
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
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c|sc)ss$/,
        use: [
          "style-loader",
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
  devtool: "cheap-module-eval-source-map", // 开发华宁下使用
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      config: config.template,
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
};
