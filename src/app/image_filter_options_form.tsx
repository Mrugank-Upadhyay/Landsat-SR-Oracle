"use client";
import React, { useEffect, useState } from "react";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "./date_range_picker";
import { DateRange } from "react-day-picker"
import path from "path";
import { SceneSearchResponse } from "./api/scene-search/route";


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

const bandKeys = Object.keys(Bands) as [keyof typeof Bands]

export const imageFilterFormSchema = z.object({
  path: z.number(),
  row: z.number(),
  acquisitionDate: z.custom<DateRange>().optional(),
  bands: z.enum(bandKeys),
  cloudCoverMin: z.number().min(0, {message: "Value cannot be lower than 0"}).max(100, {message: "Value cannot be higher than 100"}).optional(),
  cloudCoverMax: z.number().min(0, {message: "Value cannot be lower than 0"}).max(100, {message: "Value cannot be higher than 100"}).optional(),
})



export default function ImageFilterOptions() {

  const pathRows = useGlobalStore((state) => state.pathRows);
  const updateSceneSearch = useGlobalStore((state) => state.updateSceneSearch);

  // TODO: Cache these values so we have them present between tab swaps
  const form = useForm<z.infer<typeof imageFilterFormSchema>>({
    resolver: zodResolver(imageFilterFormSchema),
    defaultValues: {
      path: pathRows[0]?.path || 0,
      row: pathRows[0]?.row || 0,
      bands: "NATURAL_COLOUR", // Update to be an ENUM
      cloudCoverMin: 0,
      cloudCoverMax: 20,
    },
    values: {
      path: pathRows[0]?.path || 0,
      row: pathRows[0]?.row || 0,
      bands: "NATURAL_COLOUR",
    },
    resetOptions: {keepDefaultValues: true}
  })


  const onSubmit = async (values: z.infer<typeof imageFilterFormSchema>) => {

    // // TODO: REMOVE - FOR TESTING PURPOSES ONLY
    // console.log(values)


    const sceneSearchResponse: SceneSearchResponse = await (
      await fetch("/api/scene-search", {
        method: "POST",
        body: JSON.stringify({
          path: values.path,
          row: values.row,
          // TODO: Add acquisition date
          cloudCoverMin: values.cloudCoverMin,
          cloudCoverMax: values.cloudCoverMax
        }),
      })
    ).json();
    const sceneSearchResults: SceneSearchImage[] =
      sceneSearchResponse.data.results;

    /* Save the scene search to global store to display the images in side bar
     * These are currently just the natural color images (RGB), not the individual band images
     * For now, we will display these, and have the options default to natural colors. 
     * Afterwards, if the user selects different options (like single band images, or other important band combinations (infrared, agriculture))
     * We will grab the Landsat L2 Product ID and query the files (perform post-processing if needed, and then display them) 
     */
    updateSceneSearch(sceneSearchResults);

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="px-4">
          <div className="flex space-x-4 justify-left">
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
                  <FormLabel>Acquisition Date(s)</FormLabel>
                  <FormControl>
                    <DatePickerWithRange date={field.value} setDate={(newDate: DateRange | undefined) => form.setValue('acquisitionDate', newDate)} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
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
                    <SelectContent>
                      <SelectItem value="NATURAL_COLOUR">Natural Colour</SelectItem>
                      <SelectItem value="COLOUR_INFRARED">Colour Infrared</SelectItem>
                      <SelectItem value="FALSE_COLOUR_VEGETATION_ANALYSIS">False Colour (Vegetation Analysis)</SelectItem>
                      <SelectItem value="FALSE_COLOUR_URBAN">False Colour (Urban Analysis)</SelectItem>
                      <SelectItem value="COASTAL_AEROSOL">Coastal Aerosol</SelectItem>
                      <SelectItem value="BLUE">Blue</SelectItem>
                      <SelectItem value="GREEN">Green</SelectItem>
                      <SelectItem value="RED">Red</SelectItem>
                      <SelectItem value="NEAR_INFRARED">Near Infrared</SelectItem>
                      <SelectItem value="SWI1">Shortwave Infrared 1</SelectItem>
                      <SelectItem value="SWI2">Shortwave Infrared 2</SelectItem>
                      <SelectItem value="PANCHROMATIC">Panchromatic</SelectItem>
                      <SelectItem value="CIRRUS">Cirrus</SelectItem>
                      <SelectItem value="THERMAL">Thermal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4 justify-left mt-4">
            <FormField
                control={form.control}
                name="cloudCoverMin"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Minimum Cloud Cover</FormLabel>
                    <FormControl>
                      <Input className="w-auto text-center" type="number" 
                        value={field.value} 
                        onChange={(e) => {
                          form.setValue('cloudCoverMin', parseInt(e.target.value))
                          field.onChange(e.target.value)
                        }} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cloudCoverMax"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Maximum Cloud Cover</FormLabel>
                    <FormControl>
                      <Input className="w-auto text-center" type="number" 
                        value={field.value} 
                        onChange={(e) => {
                          form.setValue('cloudCoverMax', parseInt(e.target.value))
                          field.onChange(e.target.value)
                        }} />
                    </FormControl>
                  </FormItem>
                )}
              />
          </div>
          <Button className="mt-2" type="submit">Submit</Button>
        </div> 
      </form>
    </Form>
  )
}