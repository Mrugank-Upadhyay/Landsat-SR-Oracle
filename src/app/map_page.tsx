'use client';

import React, { CSSProperties, useState } from 'react';
import MapBox from './mapbox';

import Map, {MapLayerMouseEvent, MapMouseEvent, Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LngLat } from 'react-map-gl/dist/esm/types';
import { Popup } from 'mapbox-gl';

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

    // const [marker, setMarker] = useState<mapboxgl.Marker | null>(null)
    
    // const handleMarkerChange = (newMarker: mapboxgl.Marker) => {
    //     setMarker(newMarker)
    //     console.log(`new marker lat long = ${newMarker?.getLngLat()}`)
    // }



    // return (
    //     <div className='flex-col-1 min-h-screen min-w-full'>
    //         <MapBox accessToken={accessToken} marker={marker} changeMarker={handleMarkerChange}/>
    //         {/* <button onClick={handleButtonClick}>Display Marker Refs</button> */}
    //     </div>
    // );

    const [activePinMarker, setActivePinMarker] = useState(false)
    const [markerProps, setMarkerProps] = useState<{
        longitude: number,
        latitude: number,
    } | null>(null)

    const handleMarker = (e: MapMouseEvent) => {
        if (!markerProps) {
            setActivePinMarker(true)
        }
        setMarkerProps({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
        })
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