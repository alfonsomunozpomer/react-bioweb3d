import React from 'react';
import * as THREE from 'three';
import { connect, PromiseState } from 'react-refetch';

class DataSet extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {datasetFetch, informationLayerFetch} = this.props;
        const allFetches = PromiseState.all([datasetFetch, informationLayerFetch]);

        if (allFetches.pending) {
            this.props.setSceneCaptionsCallback(`Loading...`, `Please wait`);
            return (null);
        } else if (allFetches.rejected) {
            this.props.setSceneCaptionsCallback(`Error!`);
            return (null);
        } else if (allFetches.fulfilled) {
            const [dataset, informationLayer] = allFetches.value;

            const centerFunc = this._computeCenterFunction(dataset.dataset.points);

            const clusteredPoints = [];
            for (let i = 0; i < informationLayer.numClass; i++) {
                clusteredPoints.push([]);
            }
            informationLayer.values.forEach((clusterIndex, pointIndex) => clusteredPoints[clusterIndex - 1].push(dataset.dataset.points[pointIndex]));

            const clusters = clusteredPoints.map((pointsCluster, clusterIndex) =>
                <points key={`cluster_${clusterIndex}`}>
                    <geometry
                        vertices={pointsCluster.map(centerFunc).map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))}/>
                    <pointsMaterial color={this._colorGradient(clusterIndex)} size={this._pointSize(clusterIndex)}
                                    opacity={0.8} transparent={true}/>
                </points>
            );

            this.props.setSceneCaptionsCallback(dataset.dataset.name, informationLayer.name);
            return (
                <group>
                    {clusters}
                </group>
            );
        }

        // // It would be weird to have the information layer without the data set, but it could happen
        // if (this.state.dataset && this.state.informationLayer) {
        //
        // } else if (this.state.dataset) {
        //     return (
        //         <points>
        //             <geometry
        //                 vertices={this._centerAll(points).map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))}/>
        //             <pointsMaterial color={0xffffff} size={2.0} opacity={0.2} transparent={true}/>
        //         </points>
        //     );
        // } else {
        //     return (null);
        // }
    }

    _computeCenterFunction = (points) => {
        const means =
            points.reduce(
                (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1], acc[2] + cur[2]], [0.0, 0.0, 0.0])
            .map(m => m / points.length);

        return (point) => [point[0] - means[0], point[1] - means[1], point[2] - means[2]];
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
    datasetFileUrl: React.PropTypes.string,
    informationLayerFileUrl: React.PropTypes.string,
    setSceneCaptionsCallback: React.PropTypes.func,
    datasetFetch: React.PropTypes.instanceOf(PromiseState).isRequired,
    informationLayerFetch: React.PropTypes.instanceOf(PromiseState).isRequired,
    updateStatus: React.PropTypes.func.isRequired,
    updateStatusResponse: React.PropTypes.instanceOf(PromiseState) // will not be set until after `updateStatus()` is called
};

export default connect(props => ({
    datasetFetch: props.datasetFileUrl,
    informationLayerFetch: props.informationLayerFileUrl
}))(DataSet)
