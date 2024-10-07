"use client"

import { Sheet, SheetContent, SheetPortal, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AcquisitionsTable, { LandsatSatelliteCycles } from "./acquisitions_table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Component({ cycles }: {
  cycles: LandsatSatelliteCycles
}) {
  return (
    <Sheet modal={false} defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[40rem] sm:max-w-full h-full"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <ScrollArea className="h-full p-4">
          <SheetTitle>Acquisitions</SheetTitle>
          <AcquisitionsTable cycles={cycles}/>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
