import React from 'react';
import ReactDOM from 'react-dom';
import World from './World.jsx';

export default function(datasetFileUrl = `/data/platynereis_dumerilii_32203/dataset.json`,
                        informationLayerFileUrl = `/data/platynereis_dumerilii_32203/C5x79.1M.json`) {
    ReactDOM.render(<World datasetFileUrl={datasetFileUrl} informationLayerFileUrl={informationLayerFileUrl}/>,
        document.getElementById("container"));
};
