import React, { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material';
import Papa from 'papaparse';
import GoogleMapReact from 'google-map-react';
const Marker = ({ title }) => (
    <div style={{ color: 'red', fontSize: '24px' }}>📍{title}</div>
);
export default function MyGoogleMap() {
    const [locations, setLocations] = useState([]);
    const defaultCenter = { lat: 23.685, lng: 90.3563 }; // Center of Bangladesh
    const defaultZoom = 7;

    // Load CSV data
    useEffect(() => {
        Papa.parse('/locations.csv', {
            download: true,
            header: true,
            complete: (result) => {
                setLocations(result.data);
            },
        });
    }, []);


    return (
        <Box>
            <div style={{ height: '86vh', width: '95vw' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I' }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
            >
                {locations.map((location, index) => {
                    const lat = parseFloat(location.Latitude);
                    const lng = parseFloat(location.Longitude);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        console.log(lat)
                        return (
                            <Marker
                                key={index}
                                lat={lat}
                                lng={lng}
                                title={location.Address || location.District} // Optional: show title on marker
                            />
                        );
                    } else {
                        console.warn("Invalid coordinates:", location);
                        return null;
                    }
                })}
            </GoogleMapReact>
        </div>
        </Box>
    );
}

// AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I