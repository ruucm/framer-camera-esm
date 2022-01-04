import * as React from "react"
import { Frame, addPropertyControls, ControlType } from "framer"
// @ts-ignore
import { createData, addActionControls, ActionHandler } from "framer"
import { placeholderState } from "./placeholderState"

// Shared Camera Imports
import {
  defaultViewId,
  defaultLensId,
  getCameraId,
  useCameraViewState,
  useCameraCaptureState,
  getFusedRadius,
  LensConfig,
  ViewConfig,
  ViewCanvasDisplay,
  INDENT,
  REQUIRED,
  EMPTY_DATA_STATE,
  isCanvas,
  isPreview,
} from "./index"

const displayName = "Camera View"

////////////////////////////////////////////////////////////////////////////////
//
// TODO
// * Allow Canvas Image (Also backup?)
// * Document & Organize
// * Move Action Controls out to stop count of components
//
// DONE
//
// * Radius
// * ACTION: Clear View Data
// * EVENT: Clear View
//

////////////////////////////////////////////////////////////////////////////////
// ENUMS & ENUM KEYS & VALS

// @ts-ignore - Framer doesn't know about .values on Object
const viewConfigVals = Object.values(ViewConfig)
const viewConfigKeys = Object.keys(ViewConfig)

// @ts-ignore - Framer doesn't know about .values on Object
const lensConfigVals = Object.values(LensConfig)
const lensConfigKeys = Object.keys(LensConfig)

// @ts-ignore - Framer doesn't know about .values on Object
const viewCanvasDisplayVals = Object.values(ViewCanvasDisplay)
const viewCanvasDisplayKeys = Object.keys(ViewCanvasDisplay)

////////////////////////////////////////////////////////////////////////////////
// COMPONENT

export function View(props) {
  // Props ///////////////////////////////////////////////////////////////////////
  const {
    viewId,
    viewConfig,
    canvasDisplay,
    background,
    radius,
    isRadiusMixed,
    radiusTL,
    radiusTR,
    radiusBR,
    radiusBL,
    onTap,
    onClear,
    ...rest
  } = props

  // Config & Default Id /////////////////////////////////////////////////////////

  const configId = viewConfig === LensConfig.Default ? defaultViewId : viewId

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
  const [viewData, setViewData] = useCameraViewState(id)
  const [image, setImage] = React.useState("")

  // STYLE ///////////////////////////////////////////////////////////////////////

  const styleView: React.CSSProperties = {
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50%",
    backgroundSize: "cover",
  }

  // LIFECYCLE ///////////////////////////////////////////////////////////////////

  React.useEffect(() => {
    setImage(viewData.image ? viewData.image : "")
    if (viewData === EMPTY_DATA_STATE) handleOnClear()
  }, [viewData])

  // EVENT HANDLERS //////////////////////////////////////////////////////////////

  const handleOnTap = (event) => {
    if (onTap) onTap(event)
  }

  const handleOnClear = () => {
    if (onClear) onClear()
  }

  // Canvas rendering

  const isInstructions =
    isCanvas && canvasDisplay === ViewCanvasDisplay.Instructions
  const isHidden = isCanvas && canvasDisplay === ViewCanvasDisplay.Hidden

  const [capture, setCapture] = useCameraCaptureState("CameraLens")
  //   const [viewData, setViewData] = useCameraViewState(configViewId)

  ////////////////////////////////////////////////////////////////////////////////
  // RENDER //////////////////////////////////////////////////////////////////////

  if (isInstructions) {
    return React.createElement(placeholderState, {
      icon: defaultViewId,
      title: "Camera View",
      label: "Use interaction trigger events to send lens data to this view",
    })
  }

  return (
    <Frame
      {...rest}
      radius={radius}
      name={displayName}
      background={background}
      onTap={onTap ? handleOnTap : null}
      image={image}
      style={styleView}
      visible={!isHidden}
      onClick={() => {
        setCapture({
          lensId: "CameraLens",
          viewId: "CameraView",
          time: Date.now(),
          dataCallback: (data) => {
            setImage(data.image || "")
          },
        })
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `center / cover no-repeat url(${image})`,
        }}
      />
    </Frame>
  )
}

////////////////////////////////////////////////////////////////////////////////
// DEFAULT SETTINGS ////////////////////////////////////////////////////////////

const defaultProps = {
  height: 200,
  width: 200,
  radius: 0,
  background: "#808080",
  viewId: defaultViewId,
  lensId: defaultLensId,
  viewConfig: ViewConfig.Default,
  lensConfig: LensConfig.Default,
  canvasDisplay: ViewCanvasDisplay.Instructions,
}

View.defaultProps = defaultProps
View.displayName = displayName

////////////////////////////////////////////////////////////////////////////////
// PROPERTY CONTROLS ///////////////////////////////////////////////////////////

addPropertyControls(View, {
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
  viewConfig: {
    title: "Config",
    type: ControlType.Enum,
    options: viewConfigVals,
    optionTitles: viewConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.viewConfig,
  },
  viewId: {
    title: `${INDENT}View ID`,
    type: ControlType.String,
    defaultValue: defaultProps.viewId,
    placeholder: REQUIRED,
    hidden: (props) => props.viewConfig === ViewConfig.Default,
  },
  canvasDisplay: {
    title: "On Canvas",
    type: ControlType.Enum,
    options: viewCanvasDisplayKeys,
    optionTitles: viewCanvasDisplayVals,
    defaultValue: defaultProps.canvasDisplay,
  },
  // EVENTS //////////////////////////////////////////////////////////////////////
  onTap: {
    type: ControlType.EventHandler,
  },
  onClear: {
    type: ControlType.EventHandler,
  },
})

////////////////////////////////////////////////////////////////////////////////
// ACTION CONTROL HANDLERS /////////////////////////////////////////////////////

export function syncCameraLensAndView({
  lensConfig,
  lensId,
  viewConfig,
  viewId,
  ...rest
}): ActionHandler {
  const configLensId =
    lensConfig === LensConfig.Default ? defaultLensId : lensId
  const configViewId =
    viewConfig === ViewConfig.Default ? defaultViewId : viewId
  const [capture, setCapture] = useCameraCaptureState(configLensId)
  const [viewData, setViewData] = useCameraViewState(configViewId)

  return function () {
    setCapture({
      lensId: configLensId,
      viewId: configViewId,
      time: Date.now(),
      dataCallback: setViewData,
    })
  }
}

export function clearCameraView({
  viewConfig,
  viewId,
  ...rest
}): ActionHandler {
  const configViewId =
    viewConfig === ViewConfig.Default ? defaultViewId : viewId
  const [viewData, setViewData] = useCameraViewState(configViewId)
  return function () {
    setViewData(EMPTY_DATA_STATE)
  }
}

////////////////////////////////////////////////////////////////////////////////
// ACTION CONTROLS /////////////////////////////////////////////////////////////

addActionControls(syncCameraLensAndView, "Send Lens to View", {
  lensConfig: {
    title: "Lens Config",
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
  viewConfig: {
    title: "View Config",
    type: ControlType.Enum,
    options: viewConfigVals,
    optionTitles: viewConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.viewConfig,
  },
  viewId: {
    title: `${INDENT}View ID`,
    type: ControlType.String,
    defaultValue: defaultProps.viewId,
    placeholder: REQUIRED,
    hidden: (props) => props.viewConfig === ViewConfig.Default,
  },
})

addActionControls(clearCameraView, "Clear View", {
  viewConfig: {
    title: "View Config",
    type: ControlType.Enum,
    options: viewConfigVals,
    optionTitles: viewConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.viewConfig,
  },
  viewId: {
    title: `${INDENT}View ID`,
    type: ControlType.String,
    defaultValue: defaultProps.viewId,
    placeholder: REQUIRED,
    hidden: (props) => props.viewConfig === ViewConfig.Default,
  },
})
