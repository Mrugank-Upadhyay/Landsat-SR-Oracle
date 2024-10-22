import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SceneSearchImage, useGlobalStore } from "./store/globalStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ImageFilterOptions from "./image_filter_options_form";

export default function ScenesViewer() {

  const scenes = useGlobalStore((state) => state.sceneSearch)

  // Filter the list of scenes by search options
  const sceneFilter = (_scene: SceneSearchImage) => {

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
          <CardContent className="p-2">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 gap-2 pr-3 max-h-[42rem] overflow-y-scroll overflow-x-auto">
                {
                  scenes
                  ? scenes.filter((scene) => sceneFilter(scene)).map((scene) => {
                      const path = parseInt(scene.metadata.find((metadatum) => (metadatum.fieldName == "WRS Path"))?.value || -1, 10)
                      const row = parseInt(scene.metadata.find((metadatum) => (metadatum.fieldName == "WRS Row"))?.value || -1, 10)
                      return <img 
                        // TODO: How would this change if we use the query url for landsatlook instead of this browsePath?
                          // Maybe set source depending on options selected (natural color would be default?)
                        src={scene.browse[0].browsePath}
                        // Add "Color Option {natural, infrared, single band X, etc} before 'Satellite Image'"
                        // Add dates and satellite name/number
                        alt={`Satellite Image for Path ${path} 
                          Row ${row}`}
                        className="h-auto m-w-full rounded-lg"
                      />
                    })
                  : <h2>
                    No Images Found
                  </h2>
                }
                </div>
              </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Options">
        <Card>
          <CardContent className="p-2">
            <ImageFilterOptions />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}