import * as React from "react"
import { Frame, addPropertyControls, ControlType, useAnimation } from "framer"
// @ts-ignore
import { createData, addActionControls, ActionHandler } from "framer"
import { placeholderState } from "./placeholderState"

// Shared Camera Imports
import {
  defaultLensId,
  getCameraId,
  useCameraLensState,
  useCameraCaptureState,
  getFusedRadius,
  LensConfig,
  LensCanvasDisplay,
  INDENT,
  REQUIRED,
  isCanvas,
  isPreview,
  isDesktop,
} from "./index"

const VIDEOINPUT = "videoinput"

////////////////////////////////////////////////////////////////////////////////
//
// TODO
//
// * Integrate Face Detection (Shared Stream)
// * Allow Override Integration
// * Add Error State
// * Allow Backup Image
// * Allow Canvas Image (Also backup?)
// * Send Backup Image if not supported
// * Action to Stop Using Canvas Stream
// * Action to Start Using Canvas Stream
//
// DONE
//
// * Get working on the iPad / iPhone / Android
// * Shutter Animation
// * Fade In Camera when starts
// * Detect when camera starts
// * Add Tap Events
// * Add Capture Events
// * Add Multiple Camera Sources (Front & Back)
// * Reset Camera Data Action?
// * Make Sure on unmount Data is cleared?
// * Make sure to not fire capture events until the video is animated in
// * Add Capture Action

const displayName = "Camera Lens"

////////////////////////////////////////////////////////////////////////////////
// ENUMS

enum ShutterVariant {
  Closed = "closed",
  Open = "open",
}

// @ts-ignore - Framer doesn't know about .values on Object
const lensConfigVals = Object.values(LensConfig)
const lensConfigKeys = Object.keys(LensConfig)

enum LensPreference {
  Default = "default",
  Front = "user",
  Back = "environment",
  First = "first",
  Second = "second",
}

// @ts-ignore - Framer doesn't know about .values on Object
const lensPrefVals = Object.values(LensPreference)
const lensPrefKeys = Object.keys(LensPreference)

// Camera Display Options //////////////////////////////////////////////////////

let removeCanvasDisplayIndex = -1

// @ts-ignore - Framer doesn't know about .values on Object
const lensCanvasDisplayVals = Object.values(LensCanvasDisplay).filter(
  (value, index) => {
    // Get rid of Canvas Camera option on Desktop
    if (isCanvas && isDesktop && value == LensCanvasDisplay.Camera) {
      removeCanvasDisplayIndex = index
      return false
    } else {
      return true
    }
  }
)
const lensCanvasDisplayKeys = Object.keys(LensCanvasDisplay).filter(
  (value, index) => index != removeCanvasDisplayIndex
)

////////////////////////////////////////////////////////////////////////////////
// COMPONENT

export function Lens(props) {
  // Props ///////////////////////////////////////////////////////////////////////
  const {
    lensId,
    lensConfig,
    canvasDisplay,
    background,
    radius,
    isRadiusMixed,
    radiusTL,
    radiusTR,
    radiusBR,
    radiusBL,
    lensPreference,
    shutter,
    onTap,
    onCapture,
    ...rest
  } = props

  // Config & Default Id /////////////////////////////////////////////////////////

  const configId = lensConfig === LensConfig.Default ? defaultLensId : lensId

  // Radius //////////////////////////////////////////////////////////////////////
  const fusedRadius = getFusedRadius(
    radius,
    isRadiusMixed,
    radiusTL,
    radiusTR,
    radiusBR,
    radiusBL
  )

  // STATE ///////////////////////////////////////////////////////////////////////

  const [id, setId] = React.useState(getCameraId(configId))
  const [lensData, setLensData] = useCameraLensState(id)
  const [capture, setCapture] = useCameraCaptureState(id)
  const [canvasDisplayState, setcanvasDisplayState] =
    React.useState(canvasDisplay)

  // REFS ///////////////////////////////////////////////////////////////////////

  const video: any = React.useRef<HTMLVideoElement>()
  const stream = React.useRef<MediaStream>()
  const mediaDevices = React.useRef([])
  const intialized = React.useRef(false)

  ////////////////////////////////////////////////////////////////////////////////
  // STYLE ///////////////////////////////////////////////////////////////////////

  const styleVideo: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "50% 50%",
    display: "block",
  }

  ////////////////////////////////////////////////////////////////////////////////
  // ANIMATION CONTROLS //////////////////////////////////////////////////////////

  const shutterVariants = {}
  shutterVariants[ShutterVariant.Closed] = {
    opacity: 1,
    transition: { duration: 0 },
  }
  shutterVariants[ShutterVariant.Open] = {
    opacity: 0,
    transition: { duration: 0.3 },
  }

  const shutterAnimationControls = useAnimation()

  ////////////////////////////////////////////////////////////////////////////////
  // LIFECYCLE ///////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    if (navigator.mediaDevices) {
      let mDevices = []
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (device) {
          // @ts-ignore
          if (device.kind == VIDEOINPUT) mDevices.push(device.deviceId)
        })
        mediaDevices.current = mDevices
        initCamera()
      })
    }
  }, [])

  React.useEffect(() => {
    if (capture.lensId == id && capture.time != lensData.time) {
      captureImage({ ...capture })
      handleOnCapture()
      if (shutter) snapShutter()
    }
  }, [capture])

  React.useEffect(() => {
    setcanvasDisplayState(canvasDisplay)
  }, [canvasDisplay])

  // CONTROLS ////////////////////////////////////////////////////////////////////

  const initCamera = () => {
    const facingMode = getFacingMode()
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
          ...facingMode,
        },
        audio: false,
      })
      .then((feed) => {
        stream.current = feed
        video.current.srcObject = stream.current
        video.current.play()
        return new Promise((resolve) => {
          if (!isBackground) {
            video.current.onplaying = resolve
            setTimeout(openShutterInitial, 500)
          }
        })
      })
      .catch(function (err) {
        // Find relialbe Error Display
        console.log(err)
      })
  }

  const getImageDataURL = () => {
    const canvas: any = document.createElement("canvas")
    canvas.width = video.current.videoWidth
    canvas.height = video.current.videoHeight
    canvas.getContext("2d").drawImage(video.current, 0, 0)
    return canvas.toDataURL("image/png")
  }

  const captureImage = (captureData) => {
    if (!intialized.current) return
    const time = captureData.time
    const image = getImageDataURL()
    const data = { id: id, image: image, time: time }
    setLensData(data)
    if (
      captureData.dataCallback &&
      typeof captureData.dataCallback === "function"
    ) {
      captureData.dataCallback(data)
    }
  }

  const getFacingMode = () => {
    switch (lensPreference) {
      case LensPreference.First:
        return { deviceId: mediaDevices.current[0] }
      case LensPreference.Second:
        return { deviceId: mediaDevices.current[1] }
      case LensPreference.Front:
        return { facingMode: "user" }
      case LensPreference.Back:
        return { facingMode: "environment" }
      default:
        return {}
    }
  }

  // EVENT HANDLERS //////////////////////////////////////////////////////////////

  const handleOnTap = (event) => {
    if (onTap) onTap(event)
  }

  const handleOnCapture = () => {
    if (onCapture) onCapture()
  }

  // ANIMATION CONTROLS //////////////////////////////////////////////////////////

  const openShutter = () => {
    intialized.current = true
    shutterAnimationControls.start(ShutterVariant.Open)
  }

  const closeShutter = () => {
    shutterAnimationControls.start(ShutterVariant.Closed)
  }

  async function snapShutter() {
    await closeShutter()
    return await openShutter()
  }

  async function openShutterInitial() {
    await openShutter()
    // return (intialized.current = true) // Can we safely remove this?
    return
  }

  ////////////////////////////////////////////////////////////////////////////////
  // RENDER //////////////////////////////////////////////////////////////////////

  // Canvas rendering

  const isInstructions =
    isCanvas && canvasDisplay === LensCanvasDisplay.Instructions
  const isHidden = isCanvas && canvasDisplay === LensCanvasDisplay.Hidden
  const isBackground =
    isCanvas && canvasDisplay === LensCanvasDisplay.Background
  const isCanvasCamera = isCanvas && canvasDisplay === LensCanvasDisplay.Camera

  ////////////////////////////////////////////////////////////////////////////////
  // RENDER //////////////////////////////////////////////////////////////////////

  if (isInstructions) {
    return React.createElement(placeholderState, {
      icon: defaultLensId,
      title: "Camera Lens",
      label: "Connect and view your camera lens in the preview",
    })
  }

  return (
    <Frame
      {...rest}
      name={displayName}
      background={background}
      radius={fusedRadius}
      overflow={"hidden"}
      onTap={onTap ? handleOnTap : null}
      visible={!isHidden}
    >
      <Frame
        name={"Shutter"}
        size={"100%"}
        background={background}
        variants={shutterVariants}
        initial={ShutterVariant.Closed}
        animate={shutterAnimationControls}
        visible={!isCanvasCamera}
      />
      <video
        ref={video}
        autoPlay={true}
        muted={true}
        controls={false}
        preload={"auto"}
        playsInline
        style={styleVideo}
      ></video>
    </Frame>
  )
}

////////////////////////////////////////////////////////////////////////////////
// DEFAULT SETTINGS ////////////////////////////////////////////////////////////

const defaultProps = {
  height: 200,
  width: 200,
  radius: 0,
  background: "#000",
  lensConfig: LensConfig.Default,
  lensId: defaultLensId,
  lensPreference: LensPreference.Default,
  shutter: true,
  canvasDisplay: LensCanvasDisplay.Instructions,
}

Lens.defaultProps = defaultProps
Lens.displayName = displayName

////////////////////////////////////////////////////////////////////////////////
// PROPERTY CONTROLS ///////////////////////////////////////////////////////////

addPropertyControls(Lens, {
  lensPreference: {
    title: "Preference",
    type: ControlType.Enum,
    options: lensPrefVals,
    optionTitles: lensPrefKeys,
    defaultValue: defaultProps.lensPreference,
  },
  background: {
    title: "Background",
    type: ControlType.Color,
    defaultValue: defaultProps.background,
  },
  radius: {
    type: ControlType.FusedNumber,
    title: `Radius`,
    defaultValue: defaultProps.radius,
    toggleKey: "isRadiusMixed",
    toggleTitles: ["All", "Individual"],
    valueKeys: ["radiusTL", "radiusTR", "radiusBR", "radiusBL"],
    valueLabels: ["TL", "TR", "BR", "BL"],
    min: 0,
  },
  shutter: {
    title: "Shutter",
    type: ControlType.Boolean,
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  lensConfig: {
    title: "Config",
    type: ControlType.Enum,
    options: lensConfigVals,
    optionTitles: lensConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.lensConfig,
  },
  lensId: {
    title: `${INDENT}Lens ID`,
    type: ControlType.String,
    defaultValue: defaultProps.lensId,
    placeholder: REQUIRED,
    hidden: (props) => props.lensConfig === LensConfig.Default,
  },
  canvasDisplay: {
    title: "On Canvas",
    type: ControlType.Enum,
    options: lensCanvasDisplayKeys,
    optionTitles: lensCanvasDisplayVals,
    defaultValue: defaultProps.canvasDisplay,
  },
  onTap: {
    type: ControlType.EventHandler,
  },
  onCapture: {
    type: ControlType.EventHandler,
  },
})

// https://stackoverflow.com/questions/27420581/get-maximum-video-resolution-with-getusermedia
