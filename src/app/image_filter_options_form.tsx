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
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  path: z.number(),
  row: z.number(),
  acquisitionDate: z.date().optional(),
  bands: z.string(),
  cloudCoverMin: z.number().min(0, {message: "Value cannot be lower than 0"}).max(100, {message: "Value cannot be higher than 100"}).optional(),
  cloudCoverMax: z.number().min(0, {message: "Value cannot be lower than 0"}).max(100, {message: "Value cannot be higher than 100"}).optional(),
})

enum Bands {
  NATURAL_COLOUR,
  COLOUR_INFRARED,
  FALSE_COLOUR_VEGETATION_ANALYSIS,
  FALSE_COLOUR_URBAN,
  COASTAL_AEROSOL,
  BLUE,
  GREEN,
  RED,
  NEAR_INFRARED,
  SHORTWAVE_INFRARED_1,
  SHORTWAVE_INFRARED_2,
  PANCHROMATIC,
  CIRRUS,
  THERMAL,
  CUSTOM_RGB,
}

export default function ImageFilterOptions() {

  const pathRows = useGlobalStore((state) => state.pathRows);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      path: pathRows[0]?.path || 0,
      row: pathRows[0]?.row || 0,
      acquisitionDate: new Date(),
      bands: "natural color", // Update to be an ENUM
      cloudCoverMin: 0,
      cloudCoverMax: 20,
    }
  })

  // TODO: Remove this, we can actually use the values prop in useForm now to solve this issue of updating path/row from Marker
  useEffect(() => {
    form.setValue("path", pathRows[0]?.path || 0)
    form.setValue("row", pathRows[0]?.row || 0)
  }, [pathRows])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="path"
          render={({field}) => (
            <>
              <FormItem>
                <FormLabel>Path</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={form.getValues().path.toString()} />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Row</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={form.getValues().row.toString()} />
                </FormControl>
              </FormItem>
            </>
            
            
          )} 
        />
      </form>
    </Form>
  )
}