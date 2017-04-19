var path = require('path');
var webpack = require('webpack')

module.exports = {
	entry: path.resolve(__dirname, '../example/index.js'),
	output: {
		path: path.resolve(__dirname, '../example/build'),
		publicPath: 'http://127.0.0.3:8080/example/build',
		filename: 'bundle.js'
	},
	resolve: {
    extensions: ['.js', '.vue']
  },
	module: {
		loaders: [{
			test: /\.js?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
		},{
			test: /\.vue$/,
			loader: 'vue-loader'
		},{
			test: /\.(png|jpg|gif)$/,
			loader: 'url-loader?limit=8192'
		},{
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		},{
			test: /\.json$/,
			loader: 'json-loader'
		},{
			test: /\.md$/,
			loader: 'raw-loader'
		}]
	},
	devtool: "cheap-eval-source-map",
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		host: '127.0.0.3',
		port: 8080
		//progress: true,
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE.ENV':"development"
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}	

			