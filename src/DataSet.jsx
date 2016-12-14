import React from 'react';
import * as THREE from 'three';

class DataSet extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <points>
                <geometry vertices={this._center().map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))} />
                <pointsMaterial color={0xffffff} size={2.0} opacity={0.2} transparent={true} />
            </points>
        );
    }

    _computeMeans() {
        //Computing mean of raw data to center on 0
        return this.props.points.reduce(
            (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1], acc[2] + cur[2]], [0.0, 0.0, 0.0]
        ).map(m => m / this.props.points.length);
    }

    _center() {
        //Centering data on 0
        const means = this._computeMeans();

        return this.props.points.map(p => {
            return [p[0] - means[0], p[1] - means[1], p[2] - means[2]]
        });
    }
}

DataSet.propTypes = {
    chain: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    points: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired
};

DataSet.defaultProps = {
    chain: false
};

export default DataSet;
