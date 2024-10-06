'use client';

import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";


const MapBox = ({accessToken, marker, changeMarker}: {accessToken: string | null, marker: mapboxgl.Marker | null, changeMarker: (newMarker: any) => void}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);


    // const markerRef = useRef<mapboxgl.Marker | null>(null);

    // useImperativeHandle(ref, () => {
    //     container: mapContainerRef.current;
    //     marker: markerRef.current
    // })

    useEffect(() => {
        mapboxgl.accessToken = accessToken!!;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!!, // container ID
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-79.3832, 43.6532], // starting [lat, lng]
            zoom: 5, // starting zoom
        });

        map.on('click', (e) => {
            let [lat, long] = [e.lngLat.lat, e.lngLat.lng]
            // let popup = new mapboxgl.Popup().setText(`Lat: ${lat} <br> Long: ${long}`);
            // let el = document.createElement('div');
            // el.className = "mapboxgl-marker";

            // if (markerRef.current) {
            //     markerRef.current.remove()
            // }
            const marker = new mapboxgl.Marker()
                .setLngLat(e.lngLat)
                // .setPopup(popup)
                .addTo(map);
            if (marker) {
                marker.remove()
            }
            changeMarker(marker)

            // markerRef.current = marker;
            // // Log the current marker coordinates
            // console.log("Marker added at: ", e.lngLat);
        })

        return () => {
            map.remove();
        }
    }, []);
    

    

    return (
        <>
            <div id="map-container" ref={mapContainerRef} className="block min-h-screen min-w-full mapboxgl-map" />
        </>
    )
}

export default MapBox