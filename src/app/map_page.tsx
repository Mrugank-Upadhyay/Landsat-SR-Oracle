'use client';

import React, { useRef, useState } from 'react';
import MapBox from './mapbox';

const MapPage: React.FC<{ accessToken: string }> = ({ accessToken }) => {
    // const mapRef = useRef<{ container: HTMLDivElement | null; marker: mapboxgl.Marker | null }>({
    //     container: null,
    //     marker: null,
    // });
    
    // const handleButtonClick = () => {
    //     if (mapRef.current) {
    //         console.log('Map container ref:', mapRef.current.container);
    //         console.log('Current Marker ref:', mapRef.current.marker);
    //     }
    // };

    const [marker, setMarker] = useState<mapboxgl.Marker | null>(null)
    
    const handleMarkerChange = (newMarker: mapboxgl.Marker) => {
        setMarker(newMarker)
        console.log(`new marker lat long = ${newMarker?.getLngLat()}`)
    }



    return (
        <div className='flex-col-1 min-h-screen min-w-full'>
            <MapBox accessToken={accessToken} marker={marker} changeMarker={handleMarkerChange}/>
            {/* <button onClick={handleButtonClick}>Display Marker Refs</button> */}
        </div>
    );
};

export default MapPage;