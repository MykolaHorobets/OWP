const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

/** @type {import('webpack').Configuration} */
const conf = {
	mode: 'development',
	context: path.resolve(__dirname, 'src'),
	entry: {
		main: './index.js',
	},
	output: {
		filename: 'scripts/[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.json'],
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	devtool: isDev && 'source-map',
	devServer: {
		port: 4200,
		// contentBase: path.join(__dirname, 'src'),
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.s[ac]ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader'],
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			filename: isDev ? 'index.html' : '[name].[contenthash].html',
			template: path.join(__dirname, '/src/index.html'),
			// inject: 'body',
			minify: {
				removeComments: true,
				collapseWhitespace: isProd,
			},
			// favicon: './assets/icons/favicon.ico',
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new FaviconsWebpackPlugin({
			logo: './assets/icons/logo.png',
			mode: 'light',
		}),
	],
};

module.exports = conf;
