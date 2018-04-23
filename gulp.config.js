module.exports = function () {
    var config = {
        build: {
            buildDirectory: './dist/',
            mappingsOutputDirectory: ''
        },
        srcFiles: [
            './src/**/*.ts'
        ],
    }
    return config;
}