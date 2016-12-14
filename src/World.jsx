import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import TrackballControls from '../lib/trackball';

import DataSet from './DataSet.jsx'

const {name, chain, points} = require(`../data/platynereis_32203.json`).dataset;
const informationLayer = require(`../data/C4x13.1M.json`).information[0];

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

        console.log(this.state.mainCameraPosition);

        return (
            <div>
                <div style={{position:`absolute`, color:`white`}}>
                    <div>
                        <p style={{fontSize: `20px`, fontWeight: `bold`}}>{name}</p>
                    </div>
                    <div>
                        <p>{informationLayer.name}</p>
                    </div>
                </div>
                <React3 ref={react3 =>  { this.react3 = react3; }}
                        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
                        width={width}
                        height={height}
                        antialias={true}
                        onAnimate={this._onAnimate}>
                    <scene>
                        <perspectiveCamera name="camera"
                                           ref={mainCamera => { this.mainCamera = mainCamera; }}
                                           aspect={width / height}
                                           near={1}
                                           far={10000}
                                           position={this.state.mainCameraPosition} />
                        <DataSet name={name} chain={chain} points={points} informationLayer={informationLayer} />
                    </scene>
                </React3>
            </div>
        );
    }

    componentDidMount() {
        // document.addEventListener('keydown', this._onKeyDown, false);

        const controls = new TrackballControls(this.mainCamera, ReactDOM.findDOMNode(this.react3));
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 3.0;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        // Avoid re-rendering the whole scene again
        // controls.addEventListener(`change`, () => {
        //     this.setState({
        //         mainCameraPosition: this.mainCamera.position
        //     });
        // });

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