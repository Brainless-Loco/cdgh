import React, { useCallback, useState } from 'react'
import { GoogleMap, LoadScript, Marker, HeatmapLayer, useJsApiLoader } from '@react-google-maps/api';
import { Box } from '@mui/material';


export default function MyGoogleMap() {
    const [map, setMap] = useState(null)

    const mapStyles = { height: "86vh", width: "95vw", };
    const defaultCenter = { lat: 23.685, lng: 90.3563 }; // Center of Bangladesh

    return (
        <Box className=''>
            <LoadScript googleMapsApiKey="AIzaSyDYUDVcyIfjP-xMid-UAfMcwlqOBeii__I">
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={7}
                    center={defaultCenter}
                />
            </LoadScript>
        </Box>
    )
}
