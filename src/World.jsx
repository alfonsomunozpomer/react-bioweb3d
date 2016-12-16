import React from 'react';
import { connect, PromiseState } from 'react-refetch';

import WorldView from './WorldView.jsx'
import DataSet from './DataSet.jsx';
import InformationLayer from './InformationLayer.jsx';


class World extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {datasetFetch, informationLayerFetch} = this.props;
        const allFetches = PromiseState.all([datasetFetch, informationLayerFetch]);

        if (allFetches.pending) {
            return <WorldView title='Loading...' subHeader='' dataset={null} />
        } else if (allFetches.rejected) {
            // Draw the dataset if possible
            if (datasetFetch.fulfilled) {
                const datasetModel = datasetFetch.value.dataset;

                const centeredPoints = datasetModel.points.map(this._computeCenterFunction(datasetModel.points));
                const dataset = <DataSet points={centeredPoints} />;
                return <WorldView title={datasetModel.name} subHeader='' dataset={dataset} informationLayer={null}/>
            }
        } else if (allFetches.fulfilled) {
            const datasetModel = datasetFetch.value.dataset;
            const informationLayerModel = informationLayerFetch.value;

            const centeredPoints = datasetModel.points.map(this._computeCenterFunction(datasetModel.points));
            const dataset = <DataSet points={centeredPoints} />;
            const informationLayer =
                <InformationLayer
                    points={centeredPoints}
                    numClass={informationLayerModel.numClass}
                    values={informationLayerModel.values}
                    colourScheme={this.props.colourScheme}
                />;

            return <WorldView title={datasetModel.name} subHeader={informationLayerModel.name} dataset={dataset} informationLayer={informationLayer}/>
        }
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
    datasetFileUrl: React.PropTypes.string,
    informationLayerFileUrl: React.PropTypes.string,
    colourScheme: React.PropTypes.oneOf([`ranked`, `rainbow`]),
    datasetFetch: React.PropTypes.instanceOf(PromiseState),
    informationLayerFetch: React.PropTypes.instanceOf(PromiseState),
    updateStatus: React.PropTypes.func,
    updateStatusResponse: React.PropTypes.instanceOf(PromiseState) // will not be set until after `updateStatus()` is called
};

export default connect(props => ({
    datasetFetch: props.datasetFileUrl,
    informationLayerFetch: props.informationLayerFileUrl
}))(World)