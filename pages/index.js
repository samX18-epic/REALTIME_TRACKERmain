// pages/index.js
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-geosearch/dist/geosearch.css";
import styles from '../styles/Home.module.css';

// Dynamic imports for all client-side components
const MapComponent = dynamic(() => import('../components/Mapcomponent'), {
  ssr: false,
});
const SearchInput = dynamic(() => import('../components/Searchinput'), {
  ssr: false,
});

export default function Home() {
  // State for the general search functionality and map center
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [searchResultPoint, setSearchResultPoint] = useState(null);

  // State for the navigation points, starting as null
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  // State for controlling the sidebar's collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // When a user selects a result from the main search
  const handleMainPlaceSelect = (result) => {
    const newLocation = [result.y, result.x];
    setMapCenter(newLocation);
    setSearchResultPoint({ lat: newLocation[0], lng: newLocation[1], label: result.label });
  };
  
  // Handle GPS location request
  const handleGpsClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setMapCenter(newLocation);
          setSearchResultPoint({ lat: newLocation[0], lng: newLocation[1], label: "My Location" });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div>
      <Head>
        <title>Maps UI</title>
      </Head>
      <div className={styles.container}>
        {/* Left Sidebar and Toggle Button Container */}
        <div className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.sidebarContent}>
            <div className={styles.controlSection}>
              <h1 className={styles.mainTitle}>S Maps</h1>
              <SearchInput
                onSelect={handleMainPlaceSelect}
                placeholder="Search for a place..."
              />
            </div>
            
            {/* Navigation Section */}
            <div className={styles.navigationSection}>
              <h3 className={styles.sectionTitle}>Navigation</h3>
              <SearchInput
                onSelect={(result) => setStartPoint({ lat: result.y, lng: result.x, label: result.label })}
                placeholder="Source"
              />
              <SearchInput
                onSelect={(result) => setEndPoint({ lat: result.y, lng: result.x, label: result.label })}
                placeholder="Destination"
              />
              {/* Show the single navigate button only when both points are selected */}
              {startPoint && endPoint && (
                <button
                  onClick={() => {
                    // This button doesn't need to do anything as the route is handled by MapComponent
                    // when startPoint and endPoint are set. This just provides a clearer UI cue.
                  }}
                  className={styles.navigateButton}
                >
                  Navigate
                </button>
              )}
              <button
                onClick={() => { setStartPoint(null); setEndPoint(null); setSearchResultPoint(null); }}
                className={styles.clearRouteButton}
              >
                Clear Route
              </button>
            </div>
          </div>
        </div>

        {/* The sidebar toggle button, now outside the sidebar for better control */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`${styles.sidebarToggle} ${isSidebarCollapsed ? styles.sidebarToggleCollapsed : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {/* Right Pane for the Map */}
        <div className={styles.mapContainer}>
          <MapComponent
            center={mapCenter}
            startPoint={startPoint}
            endPoint={endPoint}
            searchResultPoint={searchResultPoint}
          />
          {/* New GPS button, now placed over the map */}
          <button
            onClick={handleGpsClick}
            className={styles.mapGpsButton}
            title="Get current location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.gpsIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}