module.exports = Object.assign(require('./webpack.config.package-test-build.js'),
    {
        entry: {
            reactBioWeb3D: './index.js',
            dependencies: ['react', 'react-dom', 'react-three-renderer', 'three']
        }
    }
);
