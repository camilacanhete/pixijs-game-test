/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");

const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));

module.exports = (env) => {
    const devConfig = {
        mode: env.mode,
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].[contenthash].js",
        },
        devtool: "inline-source-map",
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                },
                            },
                        },
                    },
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css",
            }),

            new ESLintPlugin(),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version + "dev"),
            }),
        ],
        devServer: {
            static: {
                directory: path.resolve(__dirname, './src'),
                publicPath: '/dist/',
            },
            host: '0.0.0.0', //enabling mobile testing
            port: 8080,
            open: true,
            historyApiFallback: true, //single page app
        },
    };

    return devConfig;
};
