'use client';

import React, { useRef, useState } from 'react';
import MapBox from './mapbox';

async function getCycles() {
    const res = await fetch("https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json")
    return res.json()
}

// Calculate upcoming and previous aquisitions for a path row across landsat 8 & 9
async function calculateAquisitionTimes(path: number, row: number, datetime: Date) {

}

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
    
    const handleMarkerChange = async (newMarker: mapboxgl.Marker) => {
        console.log(`prev marker lat long = ${marker?.getLngLat()}`)
        setMarker(newMarker)
        console.log(`new marker lat long = ${newMarker?.getLngLat()}`)

        const latlng = newMarker?.getLngLat()
        if (latlng) {
            const features = await fetch("/api/latlng-to-wrs", {
                method: "POST",
                body: JSON.stringify(latlng)
            })
            console.dir(features, {
                depth: null,
                colors: true
            })
        }
    }



    return (
        <div className='flex-col-1 min-h-screen min-w-full'>
            <MapBox accessToken={accessToken} marker={marker} changeMarker={handleMarkerChange}/>
            {/* <button onClick={handleButtonClick}>Display Marker Refs</button> */}
        </div>
    );
};

export default MapPage;
