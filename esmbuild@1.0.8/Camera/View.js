var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/Camera/View.tsx
import {
  createElement,
  useEffect,
  useState
} from "react";
import { Frame, addPropertyControls, ControlType } from "framer";
import { addActionControls } from "framer";
import { placeholderState } from "./placeholderState.js";
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
  isCanvas
} from "./index.js";
var displayName = "Camera View";
var viewConfigVals = Object.values(ViewConfig);
var viewConfigKeys = Object.keys(ViewConfig);
var lensConfigVals = Object.values(LensConfig);
var lensConfigKeys = Object.keys(LensConfig);
var viewCanvasDisplayVals = Object.values(ViewCanvasDisplay);
var viewCanvasDisplayKeys = Object.keys(ViewCanvasDisplay);
function View(props) {
  const _a = props, {
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
    onClear
  } = _a, rest = __objRest(_a, [
    "viewId",
    "viewConfig",
    "canvasDisplay",
    "background",
    "radius",
    "isRadiusMixed",
    "radiusTL",
    "radiusTR",
    "radiusBR",
    "radiusBL",
    "onTap",
    "onClear"
  ]);
  const configId = viewConfig === LensConfig.Default ? defaultViewId : viewId;
  const fusedRadius = getFusedRadius(radius, isRadiusMixed, radiusTL, radiusTR, radiusBR, radiusBL);
  const [id, setId] = useState(getCameraId(configId));
  const [viewData, setViewData] = useCameraViewState(id);
  const [image, setImage] = useState("");
  const styleView = {
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50%",
    backgroundSize: "cover"
  };
  useEffect(() => {
    setImage(viewData.image ? viewData.image : "");
    if (viewData === EMPTY_DATA_STATE)
      handleOnClear();
  }, [viewData]);
  const handleOnTap = (event) => {
    if (onTap)
      onTap(event);
  };
  const handleOnClear = () => {
    if (onClear)
      onClear();
  };
  const isInstructions = isCanvas && canvasDisplay === ViewCanvasDisplay.Instructions;
  const isHidden = isCanvas && canvasDisplay === ViewCanvasDisplay.Hidden;
  const [capture, setCapture] = useCameraCaptureState("CameraLens");
  if (isInstructions) {
    return createElement(placeholderState, {
      icon: defaultViewId,
      title: "Camera View",
      label: "Use interaction trigger events to send lens data to this view"
    });
  }
  return /* @__PURE__ */ createElement(Frame, __spreadProps(__spreadValues({}, rest), {
    radius,
    name: displayName,
    background,
    onTap: onTap ? handleOnTap : null,
    image,
    style: styleView,
    visible: !isHidden,
    onClick: () => {
      setCapture({
        lensId: "CameraLens",
        viewId: "CameraView",
        time: Date.now(),
        dataCallback: (data) => {
          setImage(data.image || "");
        }
      });
    }
  }), /* @__PURE__ */ createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      background: `center / cover no-repeat url(${image})`
    }
  }));
}
var defaultProps = {
  height: 200,
  width: 200,
  radius: 0,
  background: "#808080",
  viewId: defaultViewId,
  lensId: defaultLensId,
  viewConfig: ViewConfig.Default,
  lensConfig: LensConfig.Default,
  canvasDisplay: ViewCanvasDisplay.Instructions
};
View.defaultProps = defaultProps;
View.displayName = displayName;
addPropertyControls(View, {
  background: {
    title: "Background",
    type: ControlType.Color,
    defaultValue: defaultProps.background
  },
  radius: {
    type: ControlType.FusedNumber,
    title: `Radius`,
    defaultValue: defaultProps.radius,
    toggleKey: "isRadiusMixed",
    toggleTitles: ["All", "Individual"],
    valueKeys: ["radiusTL", "radiusTR", "radiusBR", "radiusBL"],
    valueLabels: ["TL", "TR", "BR", "BL"],
    min: 0
  },
  viewConfig: {
    title: "Config",
    type: ControlType.Enum,
    options: viewConfigVals,
    optionTitles: viewConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.viewConfig
  },
  viewId: {
    title: `${INDENT}View ID`,
    type: ControlType.String,
    defaultValue: defaultProps.viewId,
    placeholder: REQUIRED,
    hidden: (props) => props.viewConfig === ViewConfig.Default
  },
  canvasDisplay: {
    title: "On Canvas",
    type: ControlType.Enum,
    options: viewCanvasDisplayKeys,
    optionTitles: viewCanvasDisplayVals,
    defaultValue: defaultProps.canvasDisplay
  },
  onTap: {
    type: ControlType.EventHandler
  },
  onClear: {
    type: ControlType.EventHandler
  }
});
function syncCameraLensAndView(_a) {
  var _b = _a, {
    lensConfig,
    lensId,
    viewConfig,
    viewId
  } = _b, rest = __objRest(_b, [
    "lensConfig",
    "lensId",
    "viewConfig",
    "viewId"
  ]);
  const configLensId = lensConfig === LensConfig.Default ? defaultLensId : lensId;
  const configViewId = viewConfig === ViewConfig.Default ? defaultViewId : viewId;
  const [capture, setCapture] = useCameraCaptureState(configLensId);
  const [viewData, setViewData] = useCameraViewState(configViewId);
  return function() {
    setCapture({
      lensId: configLensId,
      viewId: configViewId,
      time: Date.now(),
      dataCallback: setViewData
    });
  };
}
function clearCameraView(_a) {
  var _b = _a, {
    viewConfig,
    viewId
  } = _b, rest = __objRest(_b, [
    "viewConfig",
    "viewId"
  ]);
  const configViewId = viewConfig === ViewConfig.Default ? defaultViewId : viewId;
  const [viewData, setViewData] = useCameraViewState(configViewId);
  return function() {
    setViewData(EMPTY_DATA_STATE);
  };
}
addActionControls(syncCameraLensAndView, "Send Lens to View", {
  lensConfig: {
    title: "Lens Config",
    type: ControlType.Enum,
    options: lensConfigVals,
    optionTitles: lensConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.lensConfig
  },
  lensId: {
    title: `${INDENT}Lens ID`,
    type: ControlType.String,
    defaultValue: defaultProps.lensId,
    placeholder: REQUIRED,
    hidden: (props) => props.lensConfig === LensConfig.Default
  },
  viewConfig: {
    title: "View Config",
    type: ControlType.Enum,
    options: viewConfigVals,
    optionTitles: viewConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.viewConfig
  },
  viewId: {
    title: `${INDENT}View ID`,
    type: ControlType.String,
    defaultValue: defaultProps.viewId,
    placeholder: REQUIRED,
    hidden: (props) => props.viewConfig === ViewConfig.Default
  }
});
addActionControls(clearCameraView, "Clear View", {
  viewConfig: {
    title: "View Config",
    type: ControlType.Enum,
    options: viewConfigVals,
    optionTitles: viewConfigKeys,
    displaySegmentedControl: true,
    defaultValue: defaultProps.viewConfig
  },
  viewId: {
    title: `${INDENT}View ID`,
    type: ControlType.String,
    defaultValue: defaultProps.viewId,
    placeholder: REQUIRED,
    hidden: (props) => props.viewConfig === ViewConfig.Default
  }
});
export {
  View,
  clearCameraView,
  syncCameraLensAndView
};
