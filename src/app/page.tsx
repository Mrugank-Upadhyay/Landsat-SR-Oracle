
import MapPage from "./map_page";
import SideDrawer from "./SideDrawer";
import { addDays, addSeconds, format, parse, subDays } from 'date-fns';


const mapboxAccessToken = process.env.MAPBOX_GL_ACCESS_TOKEN || "";

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

type LandsatSatelliteCycles = {
  "landsat_8": LandsatCycles;
  "landsat_9": LandsatCycles;
}

export async function getCycles(): Promise<LandsatSatelliteCycles> {
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
      resolve(ret as LandsatSatelliteCycles)
  })
}

const coverage_cycle_days = 16
const coverage_cycle_time = 60 * 60 * 24 * coverage_cycle_days
const total_orbits = 233
const orbit_time = coverage_cycle_time / total_orbits

// Calculate upcoming and previous aquisitions for a path row across landsat 8 & 9
export async function calculateAcquisitionTimes(cycles: LandsatSatelliteCycles, path: number, row: number, date: Date, satellites = ["landsat_8", "landsat_9"], limits: {
  upcoming: number,
  previous: number,
} = {
      upcoming: 3,
      previous: 3,
  }) {

  function calculateTime(cycle: LandsatCycle) {
      console.assert(cycle.day)
      console.assert(cycle.satellite)
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

export default async function Home() {
  const cycles = await getCycles()

  const acquisitionTimes = await calculateAcquisitionTimes(cycles, 18, 30, new Date())

  console.log(acquisitionTimes)
      
  return (
    <main className="flex flex-row min-w-full min-h-screen overflow-hidden">
      {/* <MapPage accessToken={mapboxAccessToken} /> */}
      <div className="w-64 flex-none">
        <SideDrawer />
      </div>
      <div className="flex-1 min-w-0">
        <MapPage accessToken={mapboxAccessToken}/>
      </div>

    </main>
  );
}
