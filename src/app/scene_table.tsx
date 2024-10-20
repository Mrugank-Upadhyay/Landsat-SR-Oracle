import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalStore } from "./store/globalStore";

export default function ScenesViewer() {

  const scenes = useGlobalStore((state) => state.sceneSearch)

  const sceneFilter = () => {
    return true
  }

  return (
    <Tabs defaultValue="Images" className="min-w-full sm:py-1 md:py-4">
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="Images">Images</TabsTrigger>
          <TabsTrigger value="Options">Filter Options</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="Images">
        <Card>
          <CardContent>
            <div className="grid-col-2 col-span-1">
              {/* {
                scenes
                ? scenes.filter((scene) => sceneFilter(scene)).forEach((scene) => {
                  <img src={scene.browse.}>
                  </img>
                })
                : <h2>
                  No Images Found
                </h2>
              } */}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Options">
        <Card>
          <CardContent>
            <div className="">
  
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}