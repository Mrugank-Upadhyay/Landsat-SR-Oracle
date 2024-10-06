"use client"

import { Sheet, SheetContent, SheetPortal, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <Sheet modal={false} defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
      >
        <SheetTitle>Title</SheetTitle>
      </SheetContent>
    </Sheet>
  )
}
