'use client';

import React, { useEffect, useRef } from 'react';
import MapBox from './mapbox';

const MapPage: React.FC<{ accessToken: string }> = ({ accessToken }) => {
    const mapRef = useRef<{ container: HTMLDivElement | null; marker: mapboxgl.Marker | null }>(null);
    
    const handleButtonClick = () => {
        if (mapRef.current) {
            console.log('Map container ref:', mapRef.current.container);
            console.log('Current Marker ref:', mapRef.current.marker);
        }
    };

    useEffect(() => {
        console.log(`mapRef marker latlong: ${mapRef.current?.marker?.getLngLat}`)
    }, [mapRef.current?.marker?.getLngLat])
    

    return (
        <div className='flex-col-1 min-h-screen min-w-full'>
            <MapBox ref={mapRef} accessToken={accessToken}/>
            <button onClick={handleButtonClick}>Log Map and Marker Refs</button>
        </div>
    );
};

export default MapPage;