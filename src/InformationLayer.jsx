import React from 'react';
import * as THREE from 'three';
import {arrayOfThreeNumbers} from './PropTypes.js';

class InformationLayer extends React.Component {
    constructor(props, context) {
        super(props, context);

        console.assert(this.props.values.length === this.props.points.length,
            `Reference dataset has ${this.props.points.length.toLocaleString('en')} points and information ` +
            `layer has ${this.props.values.length.toLocaleString('en')} points. Probably this information layer is ` +
            `intended to be used with a different dataset! Rendering anyway...`);
    }

    render() {
        const clusteredPoints = [];
        for (let i = 0; i < this.props.numClass; i++) {
            clusteredPoints.push([]);
        }
        this.props.values.forEach((clusterIndex, pointIndex) => clusteredPoints[clusterIndex - 1].push(this.props.points[pointIndex]));

        const clusters = clusteredPoints.map((pointsCluster, clusterIndex) =>
            <points key={`cluster_${clusterIndex}`}>
                <geometry
                    vertices={pointsCluster.map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))}/>
                <pointsMaterial color={this._colorGradient(clusterIndex)} size={this._pointSize(clusterIndex)}
                                opacity={0.8} transparent={true}/>
            </points>
        );

        return (
            <group>
                {clusters}
            </group>
        );
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

InformationLayer.propTypes = {
    points: React.PropTypes.arrayOf(arrayOfThreeNumbers),
    numClass: React.PropTypes.number,
    values: React.PropTypes.arrayOf(React.PropTypes.number)
};

export default InformationLayer;
