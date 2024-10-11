'use client';

import React, { useState } from 'react';
import { FillLayerSpecification, LngLat } from 'mapbox-gl'
import Map, { Layer, MapMouseEvent, Marker, Source, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { featureCollection } from '@turf/turf';
import { useGlobalStore, GlobalState } from './store/globalStore';
import { SceneSearchResponse } from './api/scene-search/route';

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
        features: {
            type: string,
            geometry: {
                type: string,
                coordinates: []
            }
        }[]
    }
}

export type PathRow = {
    path: number,
    row: number
}

enum WRSFilterID {
    WRSPathFilterId = "5e83d14fb9436d88",
    WRSRowFilterId = "5e83d14ff1eda1b8"
}

const m2mAPIBaseURL = "https://m2m.cr.usgs.gov/api/api/json/stable";


const MapPage = ({ accessToken, m2mUsername, m2mLoginToken }: { accessToken: string, m2mUsername: string, m2mLoginToken: string }) => {
    
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

        updateMarkerLngLat(new LngLat(e.lngLat.lng, e.lngLat.lat))

        if (e.lngLat) {
            const pathRowAPIResponse = await fetch("/api/latlng-to-wrs", {
                method: "POST",
                body: JSON.stringify(e.lngLat)
            })

            const features: WRS2ApiResponse[] = await pathRowAPIResponse.json()
            if (features.length == 0) {
                updatePathRows([])
                setWRS2BoundaryList(null)
                return;
            }

            const wrs2BoundaryFeatures: WRS2Boundary = {
                pathRows: features.map(({ path, row }) => ({ path, row })),
                boundary: {
                    type: "FeatureCollection",
                    features: features.map(({ geometry }) => ({
                        type: "Feature",
                        geometry: {
                            type: geometry.type,
                            coordinates: geometry.coordinates,
                        },
                    }))
                }
            }

            try {
                const m2mLoginTokenRes = await fetch("/api/m2m-login-token", {
                    method: "POST",
                    body: JSON.stringify({
                        url: "https://m2m.cr.usgs.gov/api/api/json/stable/login-token",
                        username: m2mUsername,
                        token: m2mLoginToken
                    }),
                    cache: 'force-cache',
                    next: { revalidate: 2 * 3600}, // revalidate in 2 hours (auth token expires every 2 hours )
                });
                
                const m2mAuthToken = (await m2mLoginTokenRes.json()).data;
                
                const cloudMax = 20;
                const sceneSearchPath = features[0].path;
                const sceneSearchRow = features[0].row;
                const sceneSearchResponse: SceneSearchResponse = await (await fetch("/api/scene-search", {
                    method: "POST",
                    body: JSON.stringify({
                        url: m2mAPIBaseURL + "/scene-search",
                        headers: {'X-Auth-Token': m2mAuthToken},
                        datasetName: "landsat_ot_c2_l2",
                        maxResults: 5,
                        metadataType: "full",
                        sceneFilter: {
                            metadataFilter: {
                                filterType: "and",
                                childFilters: [
                                    {
                                        filterId: WRSFilterID.WRSPathFilterId,
                                        filterType: "between",
                                        firstValue: sceneSearchPath.toString(),
                                        secondValue: sceneSearchPath.toString()
                                    },
                                    {
                                        filterId: WRSFilterID.WRSRowFilterId,
                                        filterType: "between",
                                        firstValue: sceneSearchRow.toString(),
                                        secondValue: sceneSearchRow.toString()
                                    }
                                ]
                            },
                            cloudCoverFilter: {
                                min: 0,
                                max: cloudMax
                            }
                        }
                    })
                })).json()
                const sceneSearchResults = sceneSearchResponse.data.results;
                // TODO: Save the browsePaths and accompanying information somewhere to use later to display the images
            } catch (e) {
                console.log(e)
            }
            


            updatePathRows(wrs2BoundaryFeatures.pathRows)
            setWRS2BoundaryList(wrs2BoundaryFeatures)
        }
    }

    const deactivateMarker = () => {
        updatePathRows([])
        updateMarkerLngLat(null)
        setWRS2BoundaryList(null)
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
                markerLngLat
                    ? <Marker longitude={markerLngLat.lng} latitude={markerLngLat.lat} draggable onDragStart={deactivateMarker} />
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
