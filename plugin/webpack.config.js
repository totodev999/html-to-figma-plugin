const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    devtool: argv.mode === 'development' ? 'inline-source-map' : false,

    entry: {
        code: './src/figma.ts',
    },

    module: {
        rules: [
            // .ts と .tsx ファイルを ts-loader でコンパイル
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

            // // CSS ファイルの読み込み
            // {
            //     test: /\.css$/,
            //     use: ['style-loader', 'css-loader'],
            // },

            // // フォントファイルなどのアセットの読み込み
            // {
            //     test: /\.ttf$/,
            //     type: 'asset/resource',
            // },
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
        // ↓↓↓ ここを修正！ ↓↓↓
        // publicPathを'/'から'./'に変更します。
        // これにより、WorkerなどのリソースがHTMLからの相対パスで読み込まれるようになります。
        publicPath: './',
    },

    plugins: [
        // new MonacoWebpackPlugin({
        //     languages: ['html', 'css', 'javascript', 'typescript'],
        //     publicPath: './',
        // }),

        // ui.html を dist フォルダに生成
        new HtmlWebpackPlugin({
            template: './src/ui.html', // テンプレートのパス
            filename: 'index.html', // 出力ファイル名
            chunks: ['ui'], // ui.js のみをこのHTMLに含める
            cache: false,
        }),

        // JS/CSSをHTMLファイル内に直接埋め込む
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.(js|css)$/]),
    ],
});
