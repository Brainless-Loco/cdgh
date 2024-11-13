import React, { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material';
import Papa from 'papaparse';
import { GoogleMap, LoadScript, Marker,InfoWindow, useJsApiLoader  } from '@react-google-maps/api';

const containerStyle = {
    width: "400px",
    height: "400px"
  };

export default function MyGoogleMap() {
    const [locations, setLocations] = useState([]);
    const mapStyles = { height: "86vh", width: "95vw" };
    const defaultCenter = { lat: 23.685, lng: 90.3563 }; // Center of Bangladesh
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I"
      });
    
      const position = {
        lat: 37.772,
        lng: -122.214
      };
    // Load CSV data on component mount
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
            <LoadScript googleMapsApiKey="AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I">
                {isLoaded ?
                    (<GoogleMap
                            mapContainerStyle={mapStyles} zoom={7}
                            center={defaultCenter}>
                            {locations.map((location, index) => {
                                const lat = parseFloat(location.Latitude);
                                const lng = parseFloat(location.Longitude);
                                const tempPosition = {lat, lng}

                                console.log(tempPosition)
                                
                                if (!isNaN(lat) && !isNaN(lng)) {
                                    return (
                                        <Marker
                                            position={tempPosition}
                                        />
                                    );
                                } else {
                                    console.warn("Invalid coordinates:", location);
                                    return null;
                                }
                            })}
                            {/* <Marker position={position} /> */}
                        </GoogleMap>)  : (
                                <>Loading ...</>
                            )
                }
            </LoadScript>
        </Box>
    );
}

// AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I