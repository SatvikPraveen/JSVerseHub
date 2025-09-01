// webpack.config.js - Webpack Build Configuration for JSVerseHub

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    main: "./src/main.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "js/[name].[contenthash].js" : "js/[name].js",
    chunkFilename: isProduction
      ? "js/[name].[contenthash].chunk.js"
      : "js/[name].chunk.js",
    clean: true,
    publicPath: "./",
  },

  mode: isProduction ? "production" : "development",

  devtool: isProduction ? "source-map" : "eval-source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["> 1%", "last 2 versions", "not dead"],
                  },
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },

      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("autoprefixer"),
                  ...(isProduction ? [require("cssnano")] : []),
                ],
              },
            },
          },
        ],
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash][ext]",
        },
      },

      {
        test: /\.(woff|woff2|ttf|eot)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash][ext]",
        },
      },

      {
        test: /\.(wav|mp3|ogg)$/i,
        type: "asset/resource",
        generator: {
          filename: "sounds/[name].[hash][ext]",
        },
      },

      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          sources: {
            list: [
              {
                tag: "img",
                attribute: "src",
                type: "src",
              },
              {
                tag: "audio",
                attribute: "src",
                type: "src",
              },
            ],
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      inject: "body",
      minify: isProduction
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
        : false,
    }),

    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash].css",
            chunkFilename: "css/[name].[contenthash].chunk.css",
          }),
        ]
      : []),
  ],

  resolve: {
    extensions: [".js", ".css"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@engine": path.resolve(__dirname, "src/engine"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@concepts": path.resolve(__dirname, "src/concepts"),
    },
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 20,
        },
        engine: {
          test: /[\\/]src[\\/]engine[\\/]/,
          name: "engine",
          priority: 15,
        },
        components: {
          test: /[\\/]src[\\/]components[\\/]/,
          name: "components",
          priority: 10,
        },
        utils: {
          test: /[\\/]src[\\/]utils[\\/]/,
          name: "utils",
          priority: 5,
        },
        default: {
          minChunks: 2,
          priority: 1,
          reuseExistingChunk: true,
        },
      },
    },

    ...(isProduction && {
      minimize: true,
      usedExports: true,
      sideEffects: false,
    }),
  },

  performance: {
    hints: isProduction ? "warning" : false,
    maxEntrypointSize: 500000,
    maxAssetSize: 300000,
  },

  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: "/index.html" },
        { from: /^\/planet\//, to: "/index.html" },
        { from: /^\/concept\//, to: "/index.html" },
        { from: /^\/exercise\//, to: "/index.html" },
        { from: /^\/quiz\//, to: "/index.html" },
        { from: /./, to: "/index.html" },
      ],
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};
