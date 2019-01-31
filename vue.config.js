module.exports = {
    publicPath: '',
    pages: {
        popup: {
            entry: 'src/popup/main.js',
            template: 'public/popup.html',
            filename: 'popup.html'
        }
    },
    runtimeCompiler: true,
    chainWebpack: (config) => {
        config
            .entry('background').add('./src/background/main.js').end()
            .entry('content').add('./src/content/main.js').add('./src/content/main.scss').end()
            .entry('inject').add('./src/inject/main.js');

        config.module.rules.delete('eslint');

        config.output
            .filename("js/[name].js")
            .chunkFilename("js/[name].js");

        config.performance.hints(false);

        config.optimization.delete('splitChunks');

        if (process.env.NODE_ENV === "development") {
            config.devtool("source-map");
        }
    },
}