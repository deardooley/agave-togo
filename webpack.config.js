var webpack = require('webpack');

module.exports = {
    resolve: {
        modulesDirectories: ["web", "node_modules", "bower_components"]
    },
    entry: {
        auth: "./dist/js/auth.js",
        dashboard: './dist/js/app.js',
        chat: './dist/js/chat.js',
        browser: './dist/js/browser.js',
        ide: './dist/js/chat.js',
        remote: './dist/js/remote.js'
    },
    output: {
        path: './dist/js/',
        filename: "[name].bundle.min.js",
        chunkFilename: "[id].chunk.min.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            warnings: false,
            mangle: {
                except: ['$q', '$ocLazyLoad']
            },
            sourceMap: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            filename: "commons.min.js",
            name: "commons"
        }),
        new webpack.DefinePlugin({
            ON_DEMO: process.env.NODE_ENV === 'demo'
        })
    ]
};
