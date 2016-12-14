module.exports = Object.assign(require('./webpack.config.package-test-build.js'),
    {
        entry: {
            worldRenderer: './index.js',
            dependencies: ['react', 'react-dom', 'react-three-renderer', 'three']
        }
    }
);
