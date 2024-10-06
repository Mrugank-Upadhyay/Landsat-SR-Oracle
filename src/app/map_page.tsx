'use client';

import React, { useState } from 'react';
import { FillLayerSpecification } from 'mapbox-gl'
import Map, { Layer, MapMouseEvent, Marker, Source} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { featureCollection } from '@turf/turf';

// import { assert } from 'console';

interface WRS2ApiResponse {
    path: number,
    row: number,
    geometry: {
        type: string,
        coordinates: []
    }
}

interface WRS2Boundary {
    pathRow: PathRow
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

interface PathRow {
    path: number,
    row: number
}

const MapPage: React.FC<{ accessToken: string }> = ({ accessToken }) => {
    const [activePinMarker, setActivePinMarker] = useState(false)
    const [markerProps, setMarkerProps] = useState<{
        longitude: number,
        latitude: number,
    } | null>(null)

    const [wrs2BoundaryList, setWRS2BoundaryList] = useState<WRS2Boundary[] | null>(null)
    
    const layerStyle: FillLayerSpecification = {
        id: "wrs2BoundaryLayer",
        type: "fill",
        source: "mapbox",
        paint: {
            'fill-color': '#99ccff'
        }
    }

    const handleMarker = async (e: MapMouseEvent) => {
        if (!markerProps) {
            setActivePinMarker(true)
        }
        setMarkerProps({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
        })
        if (e.lngLat) {
            const response = await fetch("/api/latlng-to-wrs", {
                method: "POST",
                body: JSON.stringify(e.lngLat)
            })
            const features: WRS2ApiResponse[] = await response.json()
            let wrs2BoundaryFeatures: WRS2Boundary[] = []
            features.forEach((feature) => {
                const wrs2Boundary: WRS2Boundary = {
                    pathRow: {path: feature.path, row: feature.row},
                    boundary: {
                        type: "FeatureCollection",
                        features: [{
                            type: "Feature",
                            geometry: feature.geometry
                        }]
                    }
                }
                wrs2BoundaryFeatures.push(wrs2Boundary)
            })
            console.log(wrs2BoundaryFeatures.length)
            setWRS2BoundaryList(wrs2BoundaryFeatures)
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
            {
                activePinMarker && markerProps
                    ? <Marker longitude={markerProps!.longitude} latitude={markerProps!.latitude}/>
                    : null
            }
            {/* {   wrs2BoundaryList && wrs2BoundaryList.map((feature) => {
                    <Source id="WRS2_Boundaries" type="geojson" data={feature.boundary}>
                        <Layer {...layerStyle} />
                    </Source>
                })

            } */}
            {   wrs2BoundaryList &&
                <Source id="WRS2_Boundaries" type="geojson" data={wrs2BoundaryList[0].boundary}>
                    <Layer {...layerStyle} />
                </Source>
            }
            {   (wrs2BoundaryList && wrs2BoundaryList.length > 1) &&
                <Source id="WRS2_Boundaries" type="geojson" data={wrs2BoundaryList[1].boundary}>
                    <Layer {...layerStyle} />
                </Source>
            }
            
            {/* {
                wrs2Boundary.length != 0
                ? <Source id="WRS2_Boundaries" type="geojson" data={wrs2Boundary}>
                    <Layer {...layerStyle} />
                  </Source>
                : null
            } */}
        </Map>
    )
};

export default MapPage;
