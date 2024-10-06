

type CyclesFull = {

}

export async function POST(req: Request) {
    const cycles_full_resp = await fetch("https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json")
    const cycles_full = await cycles_full_resp.json()
    return Response.json({
        upcoming: [],
        previous: [],
    })
}
