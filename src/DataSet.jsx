import React from 'react';
import * as THREE from 'three';

class DataSet extends React.Component {
    constructor(props, context) {
        super(props, context);

        if (this.props.informationLayer) {
            console.assert(this.props.informationLayer.values.length === this.props.points.length,
                `Reference DataSet has ${this.props.points.length.toLocaleString('en')} points and information ` +
                `layer has ${this.props.informationLayer.values.length.toLocaleString('en')} points. Probably this ` +
                `information layer is for a different DataSet!`);
        }

        // Computing mean of raw data to center on 0
        this.means = this.props.points.reduce(
            (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1], acc[2] + cur[2]], [0.0, 0.0, 0.0]
        ).map(m => m / this.props.points.length);
    }

    render() {
        if (this.props.informationLayer) {
            const clusteredPoints = [];
            for (let i = 0 ; i < this.props.informationLayer.numClass ; i++) {
                clusteredPoints.push([]);
            }
            this.props.informationLayer.values.forEach((clusterIndex, pointIndex) => clusteredPoints[clusterIndex - 1].push(this.props.points[pointIndex]));

            const clusters = clusteredPoints.map((pointsCluster, clusterIndex) =>
                <points key={`cluster_${clusterIndex}`}>
                    <geometry vertices={pointsCluster.map(this._center).map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))} />
                    <pointsMaterial color={this._colorGradient(clusterIndex)} size={this._pointSize(clusterIndex)} opacity={0.8} transparent={true} />
                </points>
            );

            return (
                <group>
                    {clusters}
                </group>
            );
        } else {
            return (
                <points>
                    <geometry vertices={this.props.points.map(this._center).map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))} />
                    <pointsMaterial color={0xffffff} size={2.0} opacity={0.2} transparent={true} />
                </points>
            );
        }
    }

    _center = (point) => {
        return [point[0] - this.means[0], point[1] - this.means[1], point[2] - this.means[2]];
    }

    _colorGradient = (v) => {
        const firstRelevantClusters = 5;
        if (v > firstRelevantClusters) {
            return 0x0000ff;
        } else {
            // Red with a speck of white
            return Math.floor((255 << 16) + (v * 255 / firstRelevantClusters << 8) + (v * 255 / firstRelevantClusters));
        }
    }

    _pointSize = (v) => {
        const firstRelevantClusters = 5;
        if (v > firstRelevantClusters) {
            return 2.0;
        } else {
            return 4.0;
        }
    }

}

DataSet.propTypes = {
    chain: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    points: React.PropTypes.arrayOf(arrayOfThreeNumbers).isRequired,
    informationLayer: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        numClass: React.PropTypes.number.isRequired,
        values: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    })
};

function arrayOfThreeNumbers(propValue, key, componentName, location, propFullName) {
    if (Array.isArray(propValue[key]) && propValue[key].length === 3 && propValue[key].every(element => !Number.isNaN(element) && Number.isFinite(element))) {
        return null;
    } else {
        return new Error(`Invalid prop '${propFullName}' supplied to '${componentName}'. Validation failed.`);
    }
}

DataSet.defaultProps = {
    chain: false
};

export default DataSet;
