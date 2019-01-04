module.exports = {
    devServer: {
        proxy: {
            '/eel.js': {
                target: 'http://127.0.0.1:8081'
            },
            '/eel': {
                target: 'http://127.0.0.1:8081',
                ws: true
            }
        }
    }
}
