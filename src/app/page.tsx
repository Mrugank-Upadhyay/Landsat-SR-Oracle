
import MapPage from "./map_page";
import SideDrawer from "./SideDrawer";

const mapboxAccessToken = process.env.MAPBOX_GL_ACCESS_TOKEN || "";

export default async function Home() {
  return (
    <main className="flex flex-col-1 min-h-screen min-w-full">
      {/* <MapPage accessToken={mapboxAccessToken} /> */}
      <div className="w-full flex-none md:w-64">
        <SideDrawer />
      </div>
      <div>
        <MapPage accessToken={mapboxAccessToken}/>
      </div>

    </main>
  );
}
