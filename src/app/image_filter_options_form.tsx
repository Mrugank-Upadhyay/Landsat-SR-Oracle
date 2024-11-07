"use client";
import React, { useCallback, useEffect } from "react";
import _debounce from 'lodash/debounce';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useGlobalStore, SceneSearchImage } from "./store/globalStore";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "./date_range_picker";
import { DateRange } from "react-day-picker"
import { Slider } from "@/components/ui/slider"
import { SceneSearchResponse } from "./api/scene-search/route";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useImageFilterOptionsStore } from "./image_filter_options_provider";


enum Bands {
  NATURAL_COLOUR = "Natural Colour",
  COLOUR_INFRARED = "Colour Infrared",
  FALSE_COLOUR_VEGETATION_ANALYSIS = "False Colour (Vegetation Analysis)",
  FALSE_COLOUR_URBAN = "False Colour (Urban Analysis)",
  COASTAL_AEROSOL = "Coastal Aerosol",
  BLUE = "Blue",
  GREEN = "Green",
  RED = "Red",
  NEAR_INFRARED = "Near Infrared",
  SWI1 = "Shortwave Infrared 1",
  SWI2 = "Shortwave Infrared 2",
  PANCHROMATIC = "Panchromatic",
  CIRRUS = "Cirrus",
  THERMAL = "Thermal",
  // CUSTOM_RGB = "Custom RGB", // TODO: We'll add this in later (requires way more processing so it's not an immediate feature)
}

enum Satellites {
  LANDSAT_8 = "Landsat 8",
  LANDSAT_9 = "Landsat 9",
  LANDSAT_8_AND_LANDSAT_9 = "Landsat 8 and 9",
}

const satelliteKeys = Object.keys(Satellites) as [keyof typeof Satellites]
const bandKeys = Object.keys(Bands) as [keyof typeof Bands]

const imageFilterFormSchema = z.object({
  satellite: z.enum(satelliteKeys),
  path: z.number(),
  row: z.number(),
  acquisitionDate: z.custom<DateRange>().optional(),
  bands: z.enum(bandKeys),
  cloudCover: z.number(),
})

export type ImageFilterOptionsSchema = z.infer<typeof imageFilterFormSchema>;



export default function ImageFilterOptions() {

  const pathRows = useGlobalStore((state) => state.pathRows)
  const updateSceneSearch = useGlobalStore((state) => state.updateSceneSearch);
  const updateImageFilterPathRows = useImageFilterOptionsStore((state) => state.updatePathRow)
  useEffect(() => {
    updateImageFilterPathRows(pathRows[0]?.path, pathRows[0]?.row)
  }, [pathRows])

  const satellite = useImageFilterOptionsStore((state) => state.satellite)
  const path = useImageFilterOptionsStore((state) => state.path)
  const row = useImageFilterOptionsStore((state) => state.row)
  const bands = useImageFilterOptionsStore((state) => state.bands)
  const cloudCover = useImageFilterOptionsStore((state) => state.cloudCover)
  const acquisitionDate = useImageFilterOptionsStore((state) => state.acquisitionDate)



  const updateImageFilterOptions = useImageFilterOptionsStore((state) => state.updateImageFilterOptions)
  // TODO: Cache these values so we have them present between tab swaps
  const form = useForm<ImageFilterOptionsSchema>({
    resolver: zodResolver(imageFilterFormSchema),
    values: {
      satellite,
      path,
      row,
      bands,
      cloudCover,
      acquisitionDate
    },
  })


  const onSubmit = async (values: z.infer<typeof imageFilterFormSchema>) => {
    updateImageFilterOptions(values)

    const sceneSearchResponse: SceneSearchResponse = await (
      await fetch("/api/scene-search", {
        method: "POST",
        body: JSON.stringify({
          path: values.path,
          row: values.row,
          cloudCover: values.cloudCover,
          acquisitionDate: values.acquisitionDate,
        }),
      })
    ).json();

    // TODO: Add error handling
    const sceneSearchResults: SceneSearchImage[] =
      sceneSearchResponse.data.results;

    console.log(JSON.stringify(sceneSearchResponse))
    /* Save the scene search to global store to display the images in side bar
     * These are currently just the natural color images (RGB), not the individual band images
     * For now, we will display these, and have the options default to natural colors. 
     * Afterwards, if the user selects different options (like single band images, or other important band combinations (infrared, agriculture))
     * We will grab the Landsat L2 Product ID and query the files (perform post-processing if needed, and then display them) 
     */
    updateSceneSearch(sceneSearchResults);
  }

  const cloudCoverDebounceFn = useCallback(_debounce((val: number) => form.setValue("cloudCover", val), 500), [])

  return (
      <Form {...form}>
        {/* TODO: Allow satellite selection (default is both) */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="px-4">
            <div className="flex space-x-4 justify-left">
              <FormField
                control={form.control}
                name="satellite"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Satellite</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(e) => {
                          field.onChange(e)
                          form.setValue('satellite', e as keyof typeof Satellites)
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a satellite (defaults to Landsat 8 & 9)" />
                          </SelectTrigger>
                        </FormControl>
                        {/* Add sections/separators to separate presets from single bands */}
                        <SelectContent>
                          <SelectItem value="LANDSAT_8_AND_LANDSAT_9">Landsat 8 & 9</SelectItem>
                          <SelectSeparator />
                          <SelectItem value="LANDSAT_8">Landsat 8</SelectItem>
                          <SelectSeparator />
                          <SelectItem value="LANDSAT_9">Landsat 9</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="path"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Path</FormLabel>
                    <FormControl>
                      <Input className="w-auto max-w-[52px] text-center" readOnly value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="row"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Row</FormLabel>
                    <FormControl>
                      <Input className="w-auto max-w-[52px] text-center" readOnly value={field.value} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acquisitionDate"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      <>
                        Acquisition Date(s)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="pl-1 items-end">
                              <InfoCircledIcon/>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Each location will be acquired once every 8 days by either satellite, ensure you select a wide date range</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                      </FormLabel>
                    <FormControl>
                      <DatePickerWithRange date={field.value} setDate={(newDate: DateRange | undefined) => form.setValue('acquisitionDate', newDate)} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4 justify-left mt-4">
              <FormField
                control={form.control}
                name="bands"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Sensor Bands</FormLabel>
                    <Select 
                      onValueChange={(e) => {
                        field.onChange(e)
                        form.setValue('bands', e as keyof typeof Bands)
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a preset or single band visualization" />
                        </SelectTrigger>
                      </FormControl>
                      {/* Add sections/separators to separate presets from single bands */}
                      <SelectContent>
                        <SelectItem value="NATURAL_COLOUR">Natural Colour</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="COLOUR_INFRARED">Colour Infrared</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="FALSE_COLOUR_VEGETATION_ANALYSIS">False Colour (Vegetation Analysis)</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="FALSE_COLOUR_URBAN">False Colour (Urban Analysis)</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="COASTAL_AEROSOL">Coastal Aerosol</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="BLUE">Blue</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="GREEN">Green</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="RED">Red</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="NEAR_INFRARED">Near Infrared</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="SWI1">Shortwave Infrared 1</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="SWI2">Shortwave Infrared 2</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="PANCHROMATIC">Panchromatic</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="CIRRUS">Cirrus</SelectItem>
                        <SelectSeparator />
                        <SelectItem value="THERMAL">Thermal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* TODO: Make cloud cover filter into a double ended slider */}
              <FormField
                control={form.control}
                name="cloudCover"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Minimum Cloud Cover Percentage</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2 justify-left items-end">
                        <div className="w-[64%]">
                          <Slider value={[field.value]} min={0} max={100} 
                            onValueChange={(e) => {
                              field.onChange(e)
                              form.setValue('cloudCover', e[0])
                            }}
  
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">0</span>
                            <span className="text-sm text-muted-foreground">100</span>
                          </div>
                        </div>
                        <Input className="w-[36%]" type="number" value={field.value} min={0} max={100}
                          onChange={(e) => {
                            if (parseInt(e.target.value) > 100) {
                              field.onChange("100")
                            }
                            else {
                              field.onChange(parseInt(e.target.value, 10).toString())
                              cloudCoverDebounceFn(parseInt(e.target.value))
                            }
                          }} 
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="mt-3" type="submit">Submit</Button>
          </div>
        </form>
      </Form>
  )
}