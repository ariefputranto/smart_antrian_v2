// webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // This is the "main" file which should include all other modules
  entry: './src/view/main.js',
  mode: 'development',
  // Where should the compiled file go?
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'public/js')
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      '@': path.join(__dirname, 'src/view')
    }
  },
  module: {
    // Special compilation rules
    rules: [
      {
        // Ask webpack to check: If this file ends with .js, then apply some transforms
        test: /\.js$/,
        // directory
        include: path.join(__dirname, 'src/view'),
        // Transform it with babel
        loader: 'babel-loader',
      },
      {
        // Ask webpack to check: If this file ends with .vue, then apply some transforms
        test: /\.vue$/,
        // directory
        include: path.join(__dirname, 'src/view'),
        // Transform it with vue
        loader: 'vue-loader'
      },
      {
        // this will apply to both plain `.css` files
        test: /\.css$/,
        // Transform it with vue
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        // this will apply to asset
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../img',
              publicPath: 'public/img',
              name: '[name].[ext]',
            },
          },
        ],
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ]
}