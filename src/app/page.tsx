import MapPage from "./map_page";
import SideDrawer from "./side_drawer"
import { addDays, addSeconds, format, parse, subDays } from 'date-fns';
import { useGlobalStore, GlobalState } from "./store/globalStore";
import { LandsatCyclesFull, LandsatSatelliteCycles } from "./acquisitions_table";


const mapboxAccessToken = process.env.MAPBOX_GL_ACCESS_TOKEN || "";

async function getCycles(): Promise<LandsatSatelliteCycles> {
  const res = await fetch("https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json")
  const cycles_full: {
    "landsat_8": LandsatCyclesFull,
    "landsat_9": LandsatCyclesFull,
  } = await res.json()
  const ret = {}
  for (const landsat in cycles_full) {
    const cycles = cycles_full[landsat as keyof typeof cycles_full]
    // @ts-ignore
    ret[landsat] = {}
    for (const day in cycles) {
      const cycle = cycles[day]

      // @ts-ignore
      ret[landsat][day] = {
        path: cycle.path.split(",").map(Number),
        cycle: Number(cycle.cycle)
      }
    }
  }
  return new Promise((resolve) => {
    resolve(ret as LandsatSatelliteCycles)
  })
}

export default async function Home() {
  const cycles = await getCycles()

  return (
    <main className="w-screen h-screen relative">
      <div className="w-screen h-screen">
        <MapPage accessToken={mapboxAccessToken} />
      </div>
      <div className="p-4 absolute top-0 left-0">
        <SideDrawer cycles={cycles}/>
      </div>
    </main>
  );
}
