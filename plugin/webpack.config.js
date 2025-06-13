const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'development' ? 'inline-source-map' : false,

    entry: {
        code: './src/figma.ts',
    },

    module: {
        rules: [
            // .ts ファイルを ts-loader でコンパイル
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // このディレクトリにある tsconfig.json を使うように明示
                        configFile: path.resolve(__dirname, 'tsconfig.json'),
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        // ビルドファイルは 'plugin/dist' フォルダに出力
        path: path.resolve(__dirname, 'dist'),
        // 出力ファイル名: ui.js と code.js
        filename: '[name].js',
        publicPath: './',
    },

    plugins: [
        // ui.html を dist フォルダに生成
        new HtmlWebpackPlugin({
            template: './src/ui.html', // テンプレートのパス
            filename: 'index.html', // 出力ファイル名
            cache: false,
        }),
    ],
});
