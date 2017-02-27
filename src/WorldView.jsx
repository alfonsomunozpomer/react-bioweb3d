import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import TrackballControls from '../lib/trackball';

import DataSet from './DataSet.jsx';
import InformationLayer from './InformationLayer.jsx';

class WorldView extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            mainCameraPosition: new THREE.Vector3(1, 200, 0.2),
            paused: false,
            rotation: new THREE.Euler()
        };
    }

    render() {
        const width = this.props.width; // canvas width
        const height = this.props.height; // canvas height

        return (
            <div>
                <div style={{position:`absolute`, color:`white`}}>
                    <div>
                        <p style={{fontSize: `20px`, fontWeight: `bold`}}>{this.props.title}</p>
                    </div>
                    <div>
                        <p>{this.props.subHeader}</p>
                    </div>
                </div>
                <React3 ref={react3 => { this.react3 = react3; }}
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
                        <group rotation={this.state.rotation}>
                            {this.props.dataset}
                            {this.props.informationLayer}
                        </group>
                    </scene>
                </React3>
            </div>
        );
    }

    componentDidMount() {
        const controls = new TrackballControls(this.mainCamera, ReactDOM.findDOMNode(this.react3));
        controls.rotateSpeed = 3.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 3.0;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.addEventListener(`change`, () => {
            this.setState({
                mainCameraPosition: this.mainCamera.position
            });
        });

        controls.addEventListener(`change`, () => {
            this.setState({
                paused: true
            })
        });

        this.controls = controls;
    }

    componentWillUnmount() {
        this.controls.dispose();
        delete this.controls;
    }

    _onAnimate = () => {
        this.controls.update();

        if (this.state.paused) {
            return;
        }

        this.setState({
            rotation: new THREE.Euler(
                this.state.rotation.x + 0.012,
                0,
                0
            )
        });
    }
}

WorldView.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string.isRequired,
    subHeader: React.PropTypes.string.isRequired,
    dataset: React.PropTypes.element,
    informationLayer: React.PropTypes.element
};

WorldView.defaultProps = {
    width: 800,
    height: 600
};

export default WorldView;