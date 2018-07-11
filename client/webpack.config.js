let path = require('path');

module.exports = {
	entry: ['babel-polyfill', './app/index.js'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist/public'),
    publicPath: '/'
	},
  module: {
    rules: [
      { 
        test: /\.jsx?$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/ 
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'}, 
          {loader: 'css-loader'}, 
          {loader: 'sass-loader'}
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/public'),
    historyApiFallback: true,
    proxy: {
      '/api/**': 'http://localhost:3001'
    },
  },
  mode: 'development'
}