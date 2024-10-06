import { FeatureCollection, MultiPolygon, Polygon } from "geojson"
import data from "./WRS2_descending.json"
import * as turf from "@turf/turf"

export async function POST(request: Request) {
    const res = await request.json()

    const point = turf.point([res.lng, res.lat])

    const { features } = data as FeatureCollection

    const path_rows = []
    for (const feature of features) {
        if (turf.booleanPointInPolygon(point, feature.geometry as Polygon | MultiPolygon)) {
            path_rows.push({
                path: feature.properties?.PATH,
                row: feature.properties?.ROW,
                geometry: feature.geometry,
            })
        }
    }

    console.dir(path_rows, {
        depth: null,
        colors: true,
    })

    return Response.json(path_rows)
}
