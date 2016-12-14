import React from 'react';
import ReactDOM from 'react-dom';
import World from './World.jsx';

// https://alfonsomunozpomer.github.io/react-bioweb3d/data/platynereis_32203.json
// https://alfonsomunozpomer.github.io/react-bioweb3d/data/Cell_type_clusters_for_Platynereis_dumerilii_32203.json

export default function() {
    ReactDOM.render(<World />, document.getElementById("container"));
};
