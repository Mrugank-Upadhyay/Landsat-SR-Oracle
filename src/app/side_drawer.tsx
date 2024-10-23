"use client";

import {
  Sheet,
  SheetContent,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AcquisitionsTable, {
  LandsatSatelliteCycles,
} from "./acquisitions_table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CaretSortIcon, DividerHorizontalIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import ScenesViewer from "./scene_table";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Component({
  cycles,
}: {
  cycles: LandsatSatelliteCycles;
}) {
  return (
    <Sheet modal={false} defaultOpen >
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[45rem] pt-10 resize-x sm:max-w-full h-full"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <ScrollArea className="h-full p-4">
          {/* <SheetTitle>Acquisitions</SheetTitle> */}
          <Collapsible defaultOpen className="px-0 pb-2">
            <CollapsibleTrigger>
              <Button variant="ghost" className="pl-0 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                <span>Acquisitions</span>
                <CaretSortIcon className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AcquisitionsTable cycles={cycles} />
            </CollapsibleContent>
          </Collapsible>
          <Separator />
          <Collapsible className="px-0 py-2">
            <CollapsibleTrigger>
              <Button variant="ghost" className="pl-0 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                <span>Scenes</span>
                <CaretSortIcon className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ScenesViewer /> 
            </CollapsibleContent>
          </Collapsible>
          <Separator />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
