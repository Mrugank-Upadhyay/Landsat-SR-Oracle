export type SceneSearchResponse = {
    data: {results: any[]},
    errorCode: string,
    errorMessage: string,
}

// We need to capture the request to the USGS Scene-Search as a POST request and then refetch it as GET
// Since routes in Next.js can't use json bodies outside of POST methods.
export async function POST(request: Request) {
    const req = await request.json();
    const {url, headers, ...rest} = req

    const res = await fetch(url, {
        headers: headers,
        method: "POST",
        body: JSON.stringify(rest)
    });

    return res
}