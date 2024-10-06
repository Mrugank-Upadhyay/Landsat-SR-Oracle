'use client';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

  import { Button } from "@/components/ui/button"
  

export default function SideDrawer() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Drawer direction="left">
                <DrawerTrigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-zinc-800 px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#2c2a2a]">Open</DrawerTrigger>
                <DrawerPortal>
                    <DrawerOverlay className="fixed inset-0 bg-zinc-800" />
                    <DrawerContent className="left-0 top-0 bottom-0 fixed z-10 flex outline-none">
                        {/* <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button>Submit</Button>
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                        </DrawerFooter> */}
                    </DrawerContent>
                </DrawerPortal>
            </Drawer>
        </div>

    )
}