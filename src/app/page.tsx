import MapPage from "./map_page";

const mapboxAccessToken = process.env.MAPBOX_GL_ACCESS_TOKEN || "";

export default async function Home() {
  return (
    <main className="flex flex-col-1 min-h-screen min-w-full">
      <MapPage accessToken={mapboxAccessToken} />
    </main>
  );
}
