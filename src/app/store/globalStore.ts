import { create } from 'zustand'
import { PathRow } from '../map_page';
import { LngLat } from 'mapbox-gl';
import { Acquisition } from '../acquisitions_table';

export interface GlobalState {
    pathRows: PathRow[],
    acquisitions: Acquisition[], // All acquisitions (total 6, DESC order)
    markerLngLat?: LngLat, // LngLat for selected location by marker
    notificationLeadTime?: Date,
    cloudCoverThreshold?: number, // cloud cover under this value (inclusive),
    chosenAcquisition?: Acquisition,
    satelliteResolution?: number,
    updatePathRows: (val: PathRow[]) => void, // I ain't explaining all of this, good luck, I'm tired
    updateAcquisitions: (val: Acquisition[]) => void,
    updateMarkerLngLat: (val: LngLat) => void,
    updateNotificationLeadTime: (val: Date) => void,
    updateCloudCoverThreshold: (val: number) => void,
    updateChosenAcquisition: (val: Acquisition) => void,
    updateSatelliteResolution: (val: number) => void,
}

export const useGlobalStore =  create<GlobalState>()((set) => ({
    pathRows: [],
    acquisitions: [],
    cloudCoverThreshold: 1,
    updatePathRows: (val: PathRow[]) => set({pathRows: val}),
    updateAcquisitions: (val: Acquisition[]) => set({acquisitions: val}),
    updateMarkerLngLat: (val: LngLat) => set({markerLngLat: val}),
    updateNotificationLeadTime: (val: Date) => set({notificationLeadTime: val}),
    updateCloudCoverThreshold: (val: number) => set({cloudCoverThreshold: val}),
    updateChosenAcquisition: (val: Acquisition) => set({chosenAcquisition: val}),
    updateSatelliteResolution: (val: number) => set({satelliteResolution: val}),
}))
