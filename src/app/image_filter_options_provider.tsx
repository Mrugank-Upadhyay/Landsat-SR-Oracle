import { createContext, PropsWithChildren, useContext, useState } from "react";
import { ImageFilterOptionsSchema } from "./image_filter_options_form";
import { createStore, StoreApi, useStore } from "zustand";

type ImageFilterOptionsStore = ImageFilterOptionsSchema & { 
  updateImageFilterOptions: (options: ImageFilterOptionsSchema) => void,
  updatePathRow: (path: number, row: number) => void,
}

const ImageFilterOptionsContext = createContext<StoreApi<ImageFilterOptionsStore> | undefined>(undefined)

type ImageFilterOptionsProviderProps = PropsWithChildren & {
  initialImageFilterOptions: ImageFilterOptionsSchema;
}

export default function ImageFilterOptionsProvider({children, initialImageFilterOptions}: ImageFilterOptionsProviderProps){
  const [store] = useState(() => createStore<ImageFilterOptionsStore>((set) => ({
    satellite: initialImageFilterOptions.satellite,
    path: initialImageFilterOptions.path,
    row: initialImageFilterOptions.row,
    bands: initialImageFilterOptions.bands, 
    cloudCover: initialImageFilterOptions.cloudCover,
    acquisitionDate: initialImageFilterOptions.acquisitionDate,
    updateImageFilterOptions: (options: ImageFilterOptionsSchema) => set({
        satellite: options.satellite,
        path: options.path,
        row: options.row,
        bands: options.bands,
        cloudCover: options.cloudCover,
        acquisitionDate: options.acquisitionDate,
      }),
    updatePathRow: (path: number, row: number) => set({path: path, row: row})
    }))
  );
  return <ImageFilterOptionsContext.Provider value={store}>{children }</ImageFilterOptionsContext.Provider>
}

export function useImageFilterOptionsStore<T>(selector: (state: ImageFilterOptionsStore) => T) {
  const context = useContext(ImageFilterOptionsContext);
  if (!context) {
    throw new Error("ImageFilterOptionsContext.Provider is missing");
  }
  return useStore(context, selector)
}