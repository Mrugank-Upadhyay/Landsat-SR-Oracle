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

    const [wrs2BoundaryList, setWRS2BoundaryList] = useState<WRS2Boundary | null>(null)
    
    const layerStyle: FillLayerSpecification = {
        id: "wrs2BoundaryLayer",
        type: "fill",
        source: "mapbox",
        paint: {
            'fill-color': '#25C7F8',
            'fill-opacity': 0.4
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
            if (features.length == 0) {
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
            }[0]
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
            {
                activePinMarker && markerProps
                    ? <Marker longitude={markerProps!.longitude} latitude={markerProps!.latitude}/>
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
