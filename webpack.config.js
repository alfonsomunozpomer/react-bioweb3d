module.exports = Object.assign(require('./webpack.config.package-test-build.js'),
    {
        entry: {
            reactBioWeb3D: ['whatwg-fetch', './index.js'],
            dependencies: ['react', 'react-dom', 'react-three-renderer', 'three']
        }
    }
);
