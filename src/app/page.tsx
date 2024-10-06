import { addDays, startOfToday } from "date-fns";
import MapPage from "./map_page";

interface SpectatorAcquisitionData {
  type: string,
  features: {
    type: string,
    geometry: {
      type: string,
      coordinates: [[[]]]
    },
    properties: {
      row: number, // 1-indexed
      path: number, // 1-indexed
      begin_time: string, // ISO datestring
      end_time: any,
      satellite: string,
    },
  }[]
};

const spectatorAPIBaseUrl = "https://api.spectator.earth"
const spectatorAPIKey = process.env.SPECTATOR_API_KEY || "";
const mapboxAccessToken = process.env.MAPBOX_GL_ACCESS_TOKEN || "";

export default async function Home() {
  const days = [];
  const today = startOfToday();
  for (let i = 0; i < 17; i++) {
    days.push(
      // addDays(today, -i).toISOString(), // remove after (just for bug testing)
      addDays(today, i).toISOString() // Generate ISO strings for each day
    )
  };

  let acquisitionDataError = false;

  // Path & Row Properties in the features are 1-indexed
  const acquisitionPlanData: SpectatorAcquisitionData = {
    type: "FeatureCollection",
    features: []
  };

  let lenCounter = 0;

  try {
    const data: SpectatorAcquisitionData[] = await Promise.all(
      days.map(async (day) => {
        console.log(`days = ${day}`)
        // Issue here, we can only get ~6 days of acquisition plans before the API returns an empty array
        const spectatorUrl = `${spectatorAPIBaseUrl}/acquisition-plan/?api_key=${spectatorAPIKey}&satellites=Landsat-8,Landsat-9&datetime=${day}`;
        const response = await fetch(spectatorUrl, {
          headers: {
            'Cache-Control': 'public, max-age=86400', // Suggest caching the response for 24 hours
          },
          next: {revalidate: 86400 }
        });
        return await response.json();
      })
    );

    data.forEach(({features}, idx) => {
      acquisitionPlanData.features.push(...features)
      lenCounter += features.length
      console.log(`feature set ${idx} len = ${lenCounter}`)
    });
    console.log(`total len = ${lenCounter}`);
  }
  catch (e) {
    console.log(`Error: Could not correctly fetch acquisition plans.\n${e}`);
    acquisitionDataError = true;
  }


  const checkPath = 19;
  const checkRow = 30;
  const passOverPathRow = acquisitionPlanData.features.filter((feature) => {
    const path = feature.properties.path;
    const row = feature.properties.row;
    return path == checkPath && row == checkRow;
  })
  console.log(`On Path ${checkPath} and row ${checkRow}; Which Satellite? ${passOverPathRow.length > 0 ? passOverPathRow[0].properties.satellite : "None"}, how many times will it pass over Path/Row? ${passOverPathRow.length}, and when ${passOverPathRow.length > 0 ? passOverPathRow[0].properties.begin_time : "Never"}`)





  return (
    <main className="flex flex-col-1 min-h-screen min-w-full">
      <MapPage accessToken={mapboxAccessToken} />
    </main>
  );
}
