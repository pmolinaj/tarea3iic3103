import React , { Component } from 'react';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
function MyMap() {
    const position = [1,35, 103.8]
    return(
        <MapContainer className="map"
        center={position}
        zoom={10}
            style={{height:300, width:"100%"}}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        </MapContainer>
    )

}

export default MyMap