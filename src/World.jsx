import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import TrackballControls from '../lib/trackball';
import { connect, PromiseState } from 'react-refetch';

import DataSet from './DataSet.jsx';
import InformationLayer from './InformationLayer.jsx';

class World extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            mainCameraPosition: new THREE.Vector3(1, 200, 0.2),
            rotation: new THREE.Euler()
        };
    }

    render() {
        const width = this.props.width; // canvas width
        const height = this.props.height; // canvas height
        let title = ``;
        let subHeader = ``;

        const {datasetFetch, informationLayerFetch} = this.props;

        let dataset = null;
        let informationLayer = null;
        if (datasetFetch.pending) {
            title = `Loading...`;
        } else if (datasetFetch.rejected) {
            title = `Error: the reference dataset couldn’t be loaded`;
        } else if (datasetFetch.fulfilled) {
            const datasetModel = datasetFetch.value.dataset;

            title = datasetModel.name;
            const centeredPoints = datasetModel.points.map(this._computeCenterFunction(datasetModel.points));
            dataset = <DataSet points={centeredPoints} rotation={this.state.rotation} />;

            if (informationLayerFetch.fulfilled) {
                const informationLayerModel = informationLayerFetch.value;

                subHeader = informationLayerModel.name;
                informationLayer =
                    <InformationLayer
                        points={centeredPoints}
                        numClass={informationLayerModel.numClass}
                        values={informationLayerModel.values}
                        rotation={this.state.rotation}
                    />
            }
        }

        return (
            <div>
                <div style={{position:`absolute`, color:`white`}}>
                    <div>
                        <p style={{fontSize: `20px`, fontWeight: `bold`}}>{title}</p>
                    </div>
                    <div>
                        <p>{subHeader}</p>
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
                        <group rotation={this.state.rotation}>
                            {informationLayer ? informationLayer : dataset}
                        </group>
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

    _onAnimate = () => {
        this.controls.update();

        this.setState({
            rotation: new THREE.Euler(
                this.state.rotation.x + 0.012,
                0,
                0
            )
        });
    }

    _computeCenterFunction = (points) => {
        const means =
            points.reduce(
                (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1], acc[2] + cur[2]], [0.0, 0.0, 0.0])
                .map(m => m / points.length);

        return (point) => [point[0] - means[0], point[1] - means[1], point[2] - means[2]];
    }
}

World.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    datasetFileUrl: React.PropTypes.string,
    informationLayerFileUrl: React.PropTypes.string,
    datasetFetch: React.PropTypes.instanceOf(PromiseState),
    informationLayerFetch: React.PropTypes.instanceOf(PromiseState),
    updateStatus: React.PropTypes.func,
    updateStatusResponse: React.PropTypes.instanceOf(PromiseState) // will not be set until after `updateStatus()` is called
};

World.defaultProps = {
    width: 800,
    height: 600
};

export default connect(props => ({
    datasetFetch: props.datasetFileUrl,
    informationLayerFetch: props.informationLayerFileUrl
}))(World)