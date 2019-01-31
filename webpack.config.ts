import * as HtmlWebPackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as Uglify from 'uglifyjs-webpack-plugin';
// @ts-ignore
import * as StartServerPlugin from 'start-server-webpack-plugin';
import * as nodeExternals from 'webpack-node-externals';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
// @ts-ignore
import * as LiveReloadPlugin from 'webpack-livereload-plugin';

const ROOT_PATH = path.join(__dirname);
const DIST_PATH = path.join(ROOT_PATH, 'dist');
const SRC_PATH = path.join(ROOT_PATH, 'src');
const PUBLIC_PATH = path.join(DIST_PATH, 'public');
const SERVER_PATH = path.join(DIST_PATH, 'server');
const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  context: SRC_PATH,
  output: {
    filename: 'js/[name].js',
    path: PUBLIC_PATH,
    publicPath: '/'
  },
  parallelism: 4,

  devtool: false,

  resolve: {
    extensions: ['.js', '.tsx', '.ts']
  },

  mode: NODE_ENV,

  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'tslint-loader',
        test: /\.(ts|tsx)$/
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      },
      {
        exclude: [/\/application\//],
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        exclude: [/\/vendors\//],
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'null-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                importLoaders: 1,
                localIdentName:
                  NODE_ENV === 'development'
                    ? '[local]-[hash:base64:2]'
                    : '[hash:base64:4]',
                modules: true
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'null-loader',
          use: ['css-loader']
        })
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              publicPath: '/'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '10000',
              minetype: 'application/font-woff',
              name: 'fonts/[name].[ext]',
              publicPath: '/'
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: ['svg-sprite-loader']
      },
      {
        test: /\.(png|jpeg|jpg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]',
              publicPath: '/'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: NODE_ENV === 'production',
    minimizer: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new Uglify({
        uglifyOptions: {
          compress: {
            drop_console: false,
            drop_debugger: true
          },
          warnings: false
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          filename: `js/static${
            NODE_ENV === 'production' ? '.[chunkhash:4]' : ''
          }.js`,
          name: 'static',
          test: /node_modules|vendors\//
        }
      }
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.DefinePlugin({
      'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
      'process.env.SSL': JSON.stringify(process.env.SSL)
    })
  ],
  watchOptions: {
    ignored: [PUBLIC_PATH, 'node_modules']
  }
};

const browser = {
  ...config,
  entry: {
    browser: path.join(SRC_PATH, 'browser', 'browser.tsx'),
    vendors: path.join(SRC_PATH, 'vendors', 'index.ts')
  },
  plugins: [
    new CleanWebpackPlugin([DIST_PATH]),
    ...config.plugins,
    new webpack.DefinePlugin({
      'global.IS_BROWSER': true
    }),
    new HtmlWebPackPlugin({
      excludeChunks: ['vendors'],
      filename: '../server/views/index.html',
      template: 'server/views/index.html'
    })
  ]
};

if (NODE_ENV === 'development') {
  browser.plugins.push(
    new LiveReloadPlugin({
      appendScriptTag: true
    })
  );
}

const server = {
  ...config,
  entry: {
    server: path.join(SRC_PATH, 'server', 'server.tsx')
  },
  externals: [nodeExternals()],
  optimization: {
    ...config.optimization,
    splitChunks: {}
  },
  output: {
    filename: '[name].js',
    path: path.join(SERVER_PATH)
  },
  plugins: [
    ...config.plugins,
    new webpack.DefinePlugin({
      'process.env.ROOT_PATH': JSON.stringify(ROOT_PATH)
    })
  ],
  target: 'node'
};

if (NODE_ENV === 'development' || process.env.NODE_RUN === 'true') {
  server.plugins.push(
    new StartServerPlugin({
      name: 'server.js'
    })
  );
}

module.exports = [browser, server];
