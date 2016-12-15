import React from 'react';
import ReactDOM from 'react-dom';
import Url from 'url';
import World from './World.jsx';

export default function({ baseUrl = ``,
                          datasetFilePath = `/data/platynereis_dumerilii_32203/dataset.json`,
                          informationLayerFilePath = ``,
                          mountNode = document.getElementById(`container`)}) {

    const datasetFileUrl = datasetFilePath ? Url.resolve(baseUrl, datasetFilePath) : ``;
    const informationLayerFileUrl = informationLayerFilePath ? Url.resolve(baseUrl, informationLayerFilePath) : ``;

    ReactDOM.render(
        <World datasetFileUrl={datasetFileUrl}
               informationLayerFileUrl={informationLayerFileUrl}
        />,
        mountNode);

};
