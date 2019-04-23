const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'twitch_streams.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'twitch_streams'        
    },
    module: {
        rules:[
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use:[
                    "file-loader"
                ]
            }
        ]
    },
    //mode: 'development',
    mode: 'production',
    //watch: true
};