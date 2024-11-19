import React, { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material';
import Papa from 'papaparse';
import { GoogleMap, LoadScript, Marker,InfoWindow, useJsApiLoader  } from '@react-google-maps/api';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default function LocationOverallInBangladesh() {
    const [locations, setLocations] = useState([]);
    const [googleMaps, setGoogleMaps] = useState(null); // Store the google object
    const mapRef = useRef(null);
    const markerClustererRef = useRef(null);

    const mapStyles = { height: "86vh", width: "95vw" };
    const defaultCenter = { lat: 23.685, lng: 90.3563 }; // Center of Bangladesh

    useEffect(() => {
        // Load and parse CSV data from the public folder
        Papa.parse('/locations.csv', {
            download: true,
            header: true,
            complete: (result) => {
                console.log("CSV Data:", result.data); // Log parsed data
                setLocations(result.data);
            },
        });
    }, []);

    const onMapLoad = (map, google) => {
        mapRef.current = map;
        setGoogleMaps(google); // Set the google object once loaded
    };

    useEffect(() => {
        // Create markers only if googleMaps is loaded and locations are available
        if (googleMaps && locations.length) {
            const markers = locations.map((location, index) => {
                const lat = parseFloat(location.Latitude);
                const lng = parseFloat(location.Longitude);

                // Ensure lat and lng are valid numbers
                if (!isNaN(lat) && !isNaN(lng)) {
                    return new googleMaps.maps.Marker({
                        position: { lat, lng },
                    });
                } else {
                    console.error(`Invalid coordinates at index ${index}:`, location);
                    return null;
                }
            }).filter(marker => marker !== null); // Remove invalid markers

            // Initialize or update MarkerClusterer with the new markers
            if (markerClustererRef.current) {
                markerClustererRef.current.clearMarkers();
            }
            markerClustererRef.current = new MarkerClusterer({
                map: mapRef.current,
                markers,
            });
        }
    }, [googleMaps, locations]);

    return (
        <Box>
            <LoadScript googleMapsApiKey="AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I">
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={7}
                    center={defaultCenter}
                    onLoad={(map) => onMapLoad(map, window.google)} // Pass map and google object
                />
            </LoadScript>
        </Box>
    );
}

// AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I