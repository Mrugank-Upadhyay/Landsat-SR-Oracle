'use client';

import React, { useState } from 'react';
import Map, { MapMouseEvent, Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// import { assert } from 'console';

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
