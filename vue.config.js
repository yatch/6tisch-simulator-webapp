module.exports = {
    devServer: {
        host: '127.0.0.1',
        port: 8080,
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
