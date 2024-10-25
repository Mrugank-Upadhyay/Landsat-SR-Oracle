import { create } from "zustand";
import { PathRow } from "../map_page";
import { LngLat } from "mapbox-gl";
import { Acquisition } from "../acquisitions_table";

export type SatelliteResolution = {
  [satellite: string]: {
    bandNum: number;
    bandName: string;
    bandCategory: string; // (Visible, Near-Infrared, Infrared, Panchromatic, Cirrus, Thermal-Infrared)
    bandResolution: number; // In meters (m)
  }[];
};

export interface SceneSearchImage {
  browse: Browse[];
  cloudCover: number;
  entityId: string;
  displayId: string;
  orderingId: any;
  metadata: Metadaum[];
  hasCustomizedMetadata: any;
  options: Options;
  selected: Selected;
  spatialBounds: SpatialBounds;
  spatialCoverage: SpatialCoverage;
  temporalCoverage: TemporalCoverage;
  publishDate: string;
}

export interface Browse {
  id: string;
  browseRotationEnabled: any;
  browseName: string;
  browsePath: string;
  overlayPath: string;
  overlayType: string;
  thumbnailPath: string;
}

export interface Metadaum {
  id: string;
  fieldName: string;
  dictionaryLink: string;
  value: any;
}

export interface Options {
  bulk: boolean;
  download: boolean;
  order: boolean;
  secondary: boolean;
}

export interface Selected {
  bulk: boolean;
  compare: boolean;
  order: boolean;
}

export interface SpatialBounds {
  type: string;
  coordinates: number[][][];
}

export interface SpatialCoverage {
  type: string;
  coordinates: number[][][];
}

export interface TemporalCoverage {
  endDate: string;
  startDate: string;
}

export interface GlobalState {
  pathRows: PathRow[];
  acquisitions: Acquisition[]; // All acquisitions (total 6 per path/row, DESC order)
  markerLngLat: LngLat | null; // LngLat for selected location by marker
  notificationLeadTime?: Date;
  cloudCoverThreshold?: number; // cloud cover under this value (inclusive),
  chosenAcquisition?: Acquisition;
  satelliteResolution: SatelliteResolution;
  sceneSearch: SceneSearchImage[];
  updatePathRows: (val: PathRow[]) => void; // I ain't explaining all of this, good luck, I'm tired
  updateAcquisitions: (val: Acquisition[]) => void;
  updateMarkerLngLat: (val: LngLat | null) => void;
  updateNotificationLeadTime: (val: Date) => void;
  updateCloudCoverThreshold: (val: number) => void;
  updateChosenAcquisition: (val: Acquisition) => void;
  updateSceneSearch: (val: SceneSearchImage[]) => void;
}

export const useGlobalStore = create<GlobalState>()((set) => ({
  pathRows: [],
  acquisitions: [],
  cloudCoverThreshold: 1,
  markerLngLat: null,
  satelliteResolution: {
    "Landsat-8": [
      {
        bandNum: 1,
        bandName: "Visible Coastal Aerosol",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 2,
        bandName: "Visible Blue",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 3,
        bandName: "Visible Green",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 4,
        bandName: "Visible Red",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 5,
        bandName: "Near-Infrared",
        bandCategory: "Near-Infrared",
        bandResolution: 30,
      },
      {
        bandNum: 6,
        bandName: "Shortwave-Infrared 1",
        bandCategory: "Infrared",
        bandResolution: 30,
      },
      {
        bandNum: 7,
        bandName: "Shortwave-Infrared 2",
        bandCategory: "Infrared",
        bandResolution: 30,
      },
      {
        bandNum: 8,
        bandName: "Panchromatic (PAN)",
        bandCategory: "Panchromatic",
        bandResolution: 15,
      },
      {
        bandNum: 9,
        bandName: "Cirrus",
        bandCategory: "Cirrus",
        bandResolution: 30,
      },
      {
        bandNum: 10,
        bandName: "Thermal-Infrared Sensor 1",
        bandCategory: "Thermal-Infrared",
        bandResolution: 100,
      },
      {
        bandNum: 11,
        bandName: "Thermal-Infrared Sensor 2",
        bandCategory: "Thermal-Infrared",
        bandResolution: 100,
      },
    ],
    "Landsat-9": [
      {
        bandNum: 1,
        bandName: "Visible Coastal Aerosol",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 2,
        bandName: "Visible Blue",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 3,
        bandName: "Visible Green",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 4,
        bandName: "Visible Red",
        bandCategory: "Visible",
        bandResolution: 30,
      },
      {
        bandNum: 5,
        bandName: "Near-Infrared",
        bandCategory: "Near-Infrared",
        bandResolution: 30,
      },
      {
        bandNum: 6,
        bandName: "Shortwave-Infrared 1",
        bandCategory: "Infrared",
        bandResolution: 30,
      },
      {
        bandNum: 7,
        bandName: "Shortwave-Infrared 2",
        bandCategory: "Infrared",
        bandResolution: 30,
      },
      {
        bandNum: 8,
        bandName: "Panchromatic (PAN)",
        bandCategory: "Panchromatic",
        bandResolution: 15,
      },
      {
        bandNum: 9,
        bandName: "Cirrus",
        bandCategory: "Cirrus",
        bandResolution: 30,
      },
      {
        bandNum: 10,
        bandName: "Thermal-Infrared Sensor 1",
        bandCategory: "Thermal-Infrared",
        bandResolution: 100,
      },
      {
        bandNum: 11,
        bandName: "Thermal-Infrared Sensor 2",
        bandCategory: "Thermal-Infrared",
        bandResolution: 100,
      },
    ],
  },
  sceneSearch: [],
  updatePathRows: (val: PathRow[]) => set({ pathRows: val }),
  updateAcquisitions: (val: Acquisition[]) => set({ acquisitions: val }),
  updateMarkerLngLat: (val: LngLat | null) => set({ markerLngLat: val }),
  updateNotificationLeadTime: (val: Date) => set({ notificationLeadTime: val }),
  updateCloudCoverThreshold: (val: number) => set({ cloudCoverThreshold: val }),
  updateChosenAcquisition: (val: Acquisition) =>
    set({ chosenAcquisition: val }),
  updateSceneSearch: (val: SceneSearchImage[]) => set({ sceneSearch: val }),
}));
