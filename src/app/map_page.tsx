"use client";

import React, { useState } from "react";
import { FillLayerSpecification, LngLat } from "mapbox-gl";
import Map, {
  Layer,
  MapMouseEvent,
  Marker,
  Source,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGlobalStore, SceneSearchImage } from "./store/globalStore";
import { SceneSearchResponse } from "./api/scene-search/route";

// import { assert } from 'console';

type WRS2ApiResponse = {
  path: number;
  row: number;
  geometry: {
    type: string;
    coordinates: [];
  };
};

export type WRS2Boundary = {
  pathRows: PathRow[];
  boundary: {
    type: string;
    features: {
      type: string;
      geometry: {
        type: string;
        coordinates: [];
      };
    }[];
  };
};

export type PathRow = {
  path: number;
  row: number;
};

const MapPage = ({ accessToken }: { accessToken: string }) => {
  const [wrs2BoundaryList, setWRS2BoundaryList] = useState<WRS2Boundary | null>(
    null
  );

  const layerStyle: FillLayerSpecification = {
    id: "wrs2BoundaryLayer",
    type: "fill",
    source: "mapbox",
    paint: {
      "fill-color": "#25C7F8",
      "fill-opacity": 0.2,
      "fill-outline-color": "#084d8a",
    },
  };

  const updatePathRows = useGlobalStore((state) => state.updatePathRows);

  const markerLngLat = useGlobalStore((state) => state.markerLngLat);
  const updateMarkerLngLat = useGlobalStore(
    (state) => state.updateMarkerLngLat
  );

  const updateSceneSearch = useGlobalStore((state) => state.updateSceneSearch);

  const handleMarker = async (e: MapMouseEvent) => {
    updateMarkerLngLat(new LngLat(e.lngLat.lng, e.lngLat.lat));

    if (e.lngLat) {
      const pathRowAPIResponse = await fetch("/api/latlng-to-wrs", {
        method: "POST",
        body: JSON.stringify(e.lngLat),
      });

      const features: WRS2ApiResponse[] = await pathRowAPIResponse.json();
      if (features.length == 0) {
        updatePathRows([]);
        setWRS2BoundaryList(null);
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
          })),
        },
      };

      if (features.length > 1) {
        features.slice(1).forEach((feature) => {
          wrs2BoundaryFeatures.pathRows.push({
            path: feature.path,
            row: feature.row,
          });
          wrs2BoundaryFeatures.boundary.features.push({
            type: "Feature",
            geometry: {
              type: feature.geometry.type,
              coordinates: feature.geometry.coordinates,
            },
          });
        });
      }

      updatePathRows(wrs2BoundaryFeatures.pathRows);
      setWRS2BoundaryList(wrs2BoundaryFeatures);

      try {
        const cloudMax = 20;
        const path = features[0].path;
        const row = features[0].row;
        const sceneSearchResponse: SceneSearchResponse = await (
          await fetch("/api/scene-search", {
            method: "POST",
            body: JSON.stringify({
              path,
              row,
              cloudMax,
            }),
          })
        ).json();
        const sceneSearchResults: SceneSearchImage[] =
          sceneSearchResponse.data.results;
        
        
        /* Save the scene search to global store to display the images in side bar
         * These are currently just the natural color images (RGB), not the individual band images
         * For now, we will display these, and have the options default to natural colors. 
         * Afterwards, if the user selects different options (like single band images, or other important band combinations (infrared, agriculture))
         * We will grab the Landsat L2 Product ID and query the files (perform post-processing if needed, and then display them) 
         */
        updateSceneSearch(sceneSearchResults);

        
      } catch (e) {
        // TODO: Render a notice if scene search fails to retrieve anything
        console.log(e);
      }
    }
  };

  const deactivateMarker = () => {
    updatePathRows([]);
    updateMarkerLngLat(null);
    setWRS2BoundaryList(null);
  };

  return (
    <Map
      initialViewState={{
        longitude: -79.38,
        latitude: 43.65,
        zoom: 5,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={accessToken}
      onClick={handleMarker}
    >
      <ScaleControl style={{ fontSize: "13px" }} position="bottom-right" />
      {markerLngLat ? (
        <Marker
          longitude={markerLngLat.lng}
          latitude={markerLngLat.lat}
          draggable
          onDragStart={deactivateMarker}
        />
      ) : null}

      {wrs2BoundaryList ? (
        <Source
          id="WRS2_Boundaries"
          type="geojson"
          data={wrs2BoundaryList.boundary}
        >
          <Layer {...layerStyle} />
        </Source>
      ) : null}
    </Map>
  );
};

export default MapPage;
