// components/MapComponent.js
"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import dynamic from "next/dynamic";
import styles from '../styles/MapComponent.module.css';

// Dynamic import for the RoutingMachine component
const RoutingMachine = dynamic(() => import("./Routingmachine"), {
  ssr: false,
});

// A small component to update the map's view
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ center, startPoint, endPoint, searchResultPoint }) => {
  // Fix for default marker icon issues, runs only after the component mounts
  useEffect(() => {
    import('leaflet').then((L) => {
      if (typeof window !== "undefined") {
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      }
    });
  }, []);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      className={styles.mapContainer}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapUpdater center={center} />

      {/* Marker for the general search result */}
      {searchResultPoint && (
        <Marker position={searchResultPoint}>
          <Popup>{searchResultPoint.label}</Popup>
        </Marker>
      )}

      {/* Marker for the start point */}
      {startPoint && (
        <Marker position={startPoint}>
          <Popup>{startPoint.label || 'Start Point'}</Popup>
        </Marker>
      )}

      {endPoint && (
        <Marker position={endPoint}>
          <Popup>{endPoint.label || 'Destination'}</Popup>
        </Marker>
      )}

      {startPoint && endPoint && (
        <RoutingMachine start={startPoint} end={endPoint} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
