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
        config.entry('background')
            .add('./src/background/main.js');

        config.module.rules
            .delete('eslint');

        config.output
            .filename("js/[name].js")
            .chunkFilename("js/[name].js");

        config.optimization
            .delete('splitChunks');

        config.optimization
            .minimize(false);
        //     .splitChunks({
        //          chunks: function(chunk) {
        //              // TODO: ...
        //         }
        //     });

        // config.resolve.alias
        //     .set('vue$', 'vue/dist/vue.runtime.esm.js');
    },
}