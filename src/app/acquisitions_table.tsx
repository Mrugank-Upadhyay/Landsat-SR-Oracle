"use client"

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { addDays, addSeconds, format, parse, subDays } from 'date-fns';
import { useGlobalStore } from "./store/globalStore";
import { useEffect } from "react";

export type LandsatCyclesFull = {
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

export type LandsatSatelliteCycles = {
  "landsat_8": LandsatCycles;
  "landsat_9": LandsatCycles;
}


const coverage_cycle_days = 16
const coverage_cycle_time = 60 * 60 * 24 * coverage_cycle_days
const total_orbits = 233
const orbit_time = coverage_cycle_time / total_orbits
const num_rows = 248
const correction_offset = {
  "landsat_8": -9577,
  "landsat_9": -24410,
}

// Calculate upcoming and previous aquisitions for a path row across landsat 8 & 9
export function calculateAcquisitionTimes(cycles: LandsatSatelliteCycles, path: number, row: number, date: Date, satellites = ["landsat_8", "landsat_9"], limits: {
  upcoming: number,
  previous: number,
} = {
    upcoming: 3,
    previous: 3,
  }): Acquisition[] {

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
    const orbits_before_path = cycle.path.indexOf(path)
    seconds += orbits_before_path * orbit_time
    seconds += (orbit_time / num_rows) * (row - 1)
    seconds += correction_offset[cycle.satellite as keyof typeof correction_offset]
    return addSeconds(coverage_start_day_date, seconds)
  }

  function search(limit: number, increment: (offset: number) => number, compare_date: (d: Date) => boolean, status: (cycle: LandsatCycle) => string) {
    const results = []
    outer: for (let offset = 0; ; offset = increment(offset)) {
      const day = format(addDays(date, offset), "M/d/y")

      for (const satellite of satellites) {
        // @ts-ignore
        const cycle: LandsatCycle = cycles[satellite][day]
        if (!cycle) break outer
        if (results.length >= limit) break outer

        if (cycle.path.includes(path)) {
          cycle.day = day
          cycle.satellite = satellite
          cycle.date = calculateTime(cycle)
          if (compare_date(cycle.date)) {
            results.push({
              satellite: cycle.satellite,
              status: status(cycle),
              date: cycle.date,
              path,
              row,
            })
          }
        }
      }
    }
    return results
  }

  const upcoming = search(limits.upcoming, (offset) => offset + 1, (d) => d.getTime() > date.getTime(), (_) => "upcoming")
  upcoming.reverse()
  const previous = search(limits.previous, (offset) => offset - 1, (d) => d.getTime() < date.getTime(), (_) => "processed")

  return [
    ...upcoming, ...previous
  ]
}

export type Acquisition = {
  satellite: string,
  status: string,
  date: Date,
  path: number,
  row: number,
}

const columns: ColumnDef<Acquisition>[] = [
  {
    accessorKey: "satellite",
    header: "Satellite",
  },
  {
    accessorKey: "path",
    header: "Path",
  },
  {
    accessorKey: "row",
    header: "Row",
  },
  {
    accessorKey: "date",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]

export default function AcquisitionsTable({ cycles }: {
  cycles: LandsatSatelliteCycles
}) {
  const data = useGlobalStore((state) => state.acquisitions)
  const updateData = useGlobalStore((state) => state.updateAcquisitions)
  const pathRows = useGlobalStore((state) => state.pathRows)
  useEffect(() => {
    updateData(pathRows.flatMap((pathRow) => calculateAcquisitionTimes(
      cycles,
      pathRow.path,
      pathRow.row,
      new Date()
    )).toSorted((a, b) => b.date.valueOf() - a.date.valueOf()))
  }, [pathRows])

  return (
    <div className="container mx-auto py-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
