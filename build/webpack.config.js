// ./webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: {
    app: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: 'index.js',
    chunkFilename: '[id].js',
    libraryExport: 'default',
    library: 'LIMBO',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:7].css',
      ignoreOrder: true
    }),
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json']
  },
  externals: {
    vue: 'vue',
    'element-ui': 'element-ui',
    'limbo-common-css': 'limbo-common-css'
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules|utils\/popper\.js|utils\/date\.js|utils\/lodash\.js/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // exclude: [/node_modules/],
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        // exclude: [/node_modules/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !process.env.NODE_ENV !== 'development'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('autoprefixer')({
                  overrideBrowserslist: [
                    'Android 4.1',
                    'iOS 7.1',
                    'Chrome > 31',
                    'ff > 31',
                    'ie >= 8'
                  ]
                }),
                require('cssnano')
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        // exclude: [/node_modules/],
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
