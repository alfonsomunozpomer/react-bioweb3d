import React from 'react';
import * as THREE from 'three';
import {arrayOfThreeNumbers} from './PropTypes.js';

class DataSet extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {

        return (
            <points>
                <geometry
                    vertices={this.props.points.map(triplet => new THREE.Vector3(triplet[0], triplet[1], triplet[2]))}
                />
                <pointsMaterial color={0xffffff} size={2.0} opacity={0.2} transparent={true}/>
            </points>
        );
    }

}

DataSet.propTypes = {
    points: React.PropTypes.arrayOf(arrayOfThreeNumbers)
};

export default DataSet;
