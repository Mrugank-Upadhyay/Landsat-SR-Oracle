'use client';

import React, { CSSProperties, useState } from 'react';
import Map, {MapLayerMouseEvent, MapMouseEvent, Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LngLat } from 'react-map-gl/dist/esm/types';
import { Popup } from 'mapbox-gl';

async function getCycles() {
    const res = await fetch("https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json")
    return res.json()
}

// Calculate upcoming and previous aquisitions for a path row across landsat 8 & 9
async function calculateAquisitionTimes(path: number, row: number, datetime: Date) {

}

const MapPage: React.FC<{ accessToken: string }> = ({ accessToken }) => {

    const [activePinMarker, setActivePinMarker] = useState(false)
    const [markerProps, setMarkerProps] = useState<{
        longitude: number,
        latitude: number,
    } | null>(null)

    const handleMarker = async (e: MapMouseEvent) => {
        if (!markerProps) {
            setActivePinMarker(true)
        }
        setMarkerProps({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
        })
        if (e.lngLat) {
            const features = await fetch("/api/latlng-to-wrs", {
                method: "POST",
                body: JSON.stringify(e.lngLat)
            })
            console.dir(features, {
                depth: null,
                colors: true
            })
        }
        console.log(`marker pos = ${JSON.stringify(markerProps)}`)
    }

    return (
        <div>
            <Map
                initialViewState={{
                    longitude: -79.38,
                    latitude: 43.65,
                    zoom: 5
                }}
                style={{width: '100%', height: '100%', position: 'absolute'}}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={accessToken}
                onClick={handleMarker}
            >
                {
                    activePinMarker && markerProps
                        ? <Marker longitude={markerProps!.longitude} latitude={markerProps!.latitude}/>
                        : null
                }
            </Map>
        </div>
    )
};

export default MapPage;
