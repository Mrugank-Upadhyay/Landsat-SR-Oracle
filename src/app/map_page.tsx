'use client';

import React, { CSSProperties, useState } from 'react';
import Map, {MapLayerMouseEvent, MapMouseEvent, Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LngLat } from 'react-map-gl/dist/esm/types';
import { Popup } from 'mapbox-gl';
import MapBox from './mapbox';
import { addDays, addSeconds, format, parse, subDays } from 'date-fns';
import { assert } from 'console';

type LandsatCyclesFull = {
    [day: string]: {
        path: string,
        cycle: string,
    }
}

type LandsatCycle = {
    path: [number],
    cycle: number,
    satellite?: string,
    day?: string,
    date?: Date,
}

type LandsatCycles = {
    [day: string]: LandsatCycle
}

async function getCycles(): Promise<{
    "landsat_8": LandsatCycles,
    "landsat_9": LandsatCycles,
}> {
    const res = await fetch("https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json")
    const cycles_full: {
        "landsat_8": LandsatCyclesFull,
        "landsat_9": LandsatCyclesFull,
    } = await res.json()
    const ret: object = {}
    for (const landsat in cycles_full) {
        const cycles = cycles_full[landsat as keyof typeof cycles_full]
        // @ts-ignore
        ret[landsat] = {}
        for (const day in cycles) {
            const cycle = cycles[day]

            // @ts-ignore
            ret[landsat][cycle] = {
                path: cycle.path.split(",").map(Number),
                cycle: Number(cycle.cycle)
            }
        }
    }
    return new Promise((resolve) => {
        resolve(ret as {
            "landsat_8": LandsatCycles,
            "landsat_9": LandsatCycles,
        })
    })
}

const coverage_cycle_days = 16
const coverage_cycle_time = 60 * 60 * 24 * coverage_cycle_days
const total_orbits = 233
const orbit_time = coverage_cycle_time / total_orbits

// Calculate upcoming and previous aquisitions for a path row across landsat 8 & 9
async function calculateAcquisitionTimes(cycles: LandsatCycles, path: number, row: number, date: Date, satellites = ["landsat_8", "landsat_9"], limits: {
    upcoming: number,
    previous: number,
} = {
        upcoming: 3,
        previous: 3,
    }) {

    function calculateTime(cycle: LandsatCycle) {
        assert(cycle.day)
        assert(cycle.satellite)
        const day_date = parse(cycle.day as string, "M/d/y", new Date())
        const coverage_start_day_date = subDays(day_date, cycle.cycle - 1)
        let seconds = 0
        for (let i = 0; i < cycle.cycle - 1; i++) {
            const day = format(addDays(coverage_start_day_date, i), "M/d/y")
            // @ts-ignore
            const num_of_orbits = cycles[cycle.satellite][day].path.length
            seconds += orbit_time * num_of_orbits
        }
        const orbits_before_row = cycle.path.indexOf(row)
        seconds += orbits_before_row * orbit_time
        return addSeconds(coverage_start_day_date, seconds)
    }

    function search(limit: number, increment: (offset: number) => number, compare_date: (d: Date) => boolean) {
        const results = []
        outer: for (let offset = 0; ; offset = increment(offset)) {
            const day = format(addDays(date, offset), "M/d/y")
            for (const satellite of satellites) {
                // @ts-ignore
                const cycle = cycles[satellite][day]
                if (!cycle) break outer
                if (results.length >= limit) break outer

                if (cycle.path.includes(path)) {
                    cycle.day = day
                    cycle.satellite = satellite
                    cycle.date = calculateTime(cycle)
                    if (compare_date(cycle.date)) {
                        results.push(cycle)
                    }
                }
            }
        }
        return results
    }

    const upcoming = search(limits.upcoming, (offset) => offset + 1, (d) => d.getTime() > date.getTime())
    const previous = search(limits.previous, (offset) => offset - 1, (d) => d.getTime() < date.getTime())

    return {
        upcoming,
        previous,
    }
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
