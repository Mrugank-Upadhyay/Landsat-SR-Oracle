'use client';

import React, { useState } from 'react';
import { FillLayerSpecification, LngLat } from 'mapbox-gl'
import Map, { Layer, MapMouseEvent, Marker, Source, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { featureCollection } from '@turf/turf';
import { useGlobalStore, GlobalState } from './store/globalStore';


// import { assert } from 'console';

type WRS2ApiResponse = {
    path: number,
    row: number,
    geometry: {
        type: string,
        coordinates: []
    }
}

export type WRS2Boundary = {
    pathRows: PathRow[]
    boundary: {
        type: string,
        features: [{
            type: string,
            geometry: {
                type: string,
                coordinates: []
            }
        }]
    }
}

export type PathRow = {
    path: number,
    row: number
}

const MapPage: React.FC<{ accessToken: string}> = ({ accessToken }) => {
    const [activePinMarker, setActivePinMarker] = useState(false)
    
    const [wrs2BoundaryList, setWRS2BoundaryList] = useState<WRS2Boundary | null>(null)
    
    const layerStyle: FillLayerSpecification = {
        id: "wrs2BoundaryLayer",
        type: "fill",
        source: "mapbox",
        paint: {
            'fill-color': '#25C7F8',
            'fill-opacity': 0.2,
            'fill-outline-color': '#084d8a'
        }
    }

    const pathRows = useGlobalStore((state) => state.pathRows)
    const updatePathRows = useGlobalStore((state) => state.updatePathRows)

    const markerLngLat = useGlobalStore((state) => state.markerLngLat)
    const updateMarkerLngLat = useGlobalStore((state) => state.updateMarkerLngLat)

    const handleMarker = async (e: MapMouseEvent) => {
        if (!markerLngLat) {
            setActivePinMarker(true)
        }

        
        updateMarkerLngLat(new LngLat(e.lngLat.lng, e.lngLat.lat))

        if (e.lngLat) {
            const response = await fetch("/api/latlng-to-wrs", {
                method: "POST",
                body: JSON.stringify(e.lngLat)
            })
            
            const features: WRS2ApiResponse[] = await response.json()
            if (features.length == 0) {
                updatePathRows([])
                setWRS2BoundaryList(null)
                return;
            }
            
            let wrs2BoundaryFeatures: WRS2Boundary = {
                pathRows: [{path: features[0].path, row: features[0].row}],
                boundary: {
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        geometry: {
                            type: features[0].geometry.type,
                            coordinates: features[0].geometry.coordinates
                        }
                    }]
                }
            }
            if (features.length > 1) {
                features.slice(1).forEach((feature) => {
                    wrs2BoundaryFeatures.pathRows.push({path: feature.path, row: feature.row})
                    wrs2BoundaryFeatures.boundary.features.push({
                        type: "Feature",
                        geometry: {
                            type: feature.geometry.type,
                            coordinates: feature.geometry.coordinates
                        }
                    })
                })
            }

            updatePathRows(wrs2BoundaryFeatures.pathRows)
            console.log(`global store path rows: ${pathRows}`)
            setWRS2BoundaryList(wrs2BoundaryFeatures)
            console.log(wrs2BoundaryFeatures.pathRows.length)
            console.log(wrs2BoundaryFeatures)
            console.log(wrs2BoundaryList)
        }
    }

    return (
        <Map
            initialViewState={{
                longitude: -79.38,
                latitude: 43.65,
                zoom: 5
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={accessToken}
            onClick={handleMarker}
        >
            <ScaleControl style={{fontSize: '13px'}} position='bottom-right'/>
            {
                activePinMarker && markerLngLat
                    ? <Marker longitude={markerLngLat.lng} latitude={markerLngLat.lat}/>
                    : null
            }
            
            {   wrs2BoundaryList
                ? <Source id="WRS2_Boundaries" type="geojson" data={wrs2BoundaryList.boundary}>
                    <Layer {...layerStyle} />
                  </Source>
                : null
            }
            
        </Map>
    )
};

export default MapPage;
