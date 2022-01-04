// @ts-ignore
import { createData, RenderTarget } from "framer"

////////////////////////////////////////////////////////////////////////////////
//
// TO DO
//
// * Make Id handle trimming and clean up of IDs
// *
//
// DONE
//
// *

////////////////////////////////////////////////////////////////////////////////
// SHARED OBJECTS

export const EMPTY_DATA_STATE = { id: null, image: null, time: null }

////////////////////////////////////////////////////////////////////////////////
// SHARED ENUMS

export enum LensConfig {
    Default = "Default",
    Custom = "Custom",
}

export enum ViewConfig {
    Default = "Default",
    Custom = "Custom",
}

export enum FaceConfig {
    Default = "Default",
    Custom = "Custom",
}

export enum ViewCanvasDisplay {
    Instructions = "Instructions",
    Background = "Background",
    Hidden = "Hidden",
}

export enum LensCanvasDisplay {
    Instructions = "Instructions",
    Camera = "Camera",
    Background = "Background",
    Hidden = "Hidden",
}

////////////////////////////////////////////////////////////////////////////////
// DEFAULT IDs

export const defaultLensId = "CameraLens"
export const defaultViewId = "CameraView"
export const defaultFaceId = "CameraFace"

////////////////////////////////////////////////////////////////////////////////
// GLOBAL STATE DATA

export const useCameraLensState = createData(EMPTY_DATA_STATE)

export const useCameraViewState = createData(EMPTY_DATA_STATE)

export const useCameraFaceState = createData(EMPTY_DATA_STATE)

export const useCameraCaptureState = createData({
    lensId: null,
    viewId: null,
    time: null,
    dataCallback: null,
})

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS

export function getCameraId(id) {
    // TODO: Trim the string of spaces
    return id != "" ? id : generateRandomId()
}

function generateRandomId() {
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a) =>
        (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    )
}

export const getFusedRadius = (radius, isMixed, tl, tr, br, bl) => {
    return isMixed ? `${tl}px ${tr}px ${br}px ${bl}px` : `${radius}px`
}

////////////////////////////////////////////////////////////////////////////////
// SHARED TEXT & LABELS

export const INDENT = " ·  "
export const REQUIRED = "Required"

////////////////////////////////////////////////////////////////////////////////
// Environment Variables

export const isThumbnail = RenderTarget.current() === RenderTarget.thumbnail
export const isCanvas = RenderTarget.current() === RenderTarget.canvas
export const isPreview = RenderTarget.current() === RenderTarget.preview
export const isDesktop = document.location.protocol === "http:"