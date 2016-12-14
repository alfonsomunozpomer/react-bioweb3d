import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import TrackballControls from '../lib/trackball';

import DataSet from './DataSet.jsx'

const {name, chain, points} = require(`../data/platynereis.json`).dataset;

class World extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            mainCameraPosition: new THREE.Vector3(100, 100, 100)
        };

        this._onAnimate = () => {
            this.controls.update();
        };
    }

    render() {
        const width = this.props.width; // canvas width
        const height = this.props.height; // canvas height

        return (
            <React3 ref="react3"
                    mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
                    width={width}
                    height={height}
                    onAnimate={this._onAnimate}>
                <scene>
                    <perspectiveCamera name="camera"
                                       ref="mainCamera"
                                       fov={75}
                                       aspect={width / height}
                                       near={0.1}
                                       far={1000}
                                       position={this.state.mainCameraPosition} />
                    <DataSet name={name} chain={chain} points={points} />
                </scene>
            </React3>
        );
    }

    componentDidMount() {
        // document.addEventListener('keydown', this._onKeyDown, false);

        const controls = new TrackballControls(this.refs.mainCamera, ReactDOM.findDOMNode(this.refs.react3));
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 3.0;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.addEventListener('change', () => {
            this.setState({
                mainCameraPosition: this.refs.mainCamera.position
            });
        });

        this.controls = controls;
    }

    componentWillUnmount() {
        // document.removeEventListener('keydown', this._onKeyDown, false);
        this.controls.dispose();
        delete this.controls;
    }
}

World.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number
};

World.defaultProps = {
    width: 800,
    height: 600
};


export default World;