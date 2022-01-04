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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/Camera/Lens.tsx
import {
  createElement,
  useEffect,
  useRef,
  useState
} from "react";
import { Frame, addPropertyControls, ControlType, useAnimation } from "framer";
import { placeholderState } from "./placeholderState.js";
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
  isDesktop
} from "./index.js";
var VIDEOINPUT = "videoinput";
var displayName = "Camera Lens";
var ShutterVariant;
(function(ShutterVariant2) {
  ShutterVariant2["Closed"] = "closed";
  ShutterVariant2["Open"] = "open";
})(ShutterVariant || (ShutterVariant = {}));
var lensConfigVals = Object.values(LensConfig);
var lensConfigKeys = Object.keys(LensConfig);
var LensPreference;
(function(LensPreference2) {
  LensPreference2["Default"] = "default";
  LensPreference2["Front"] = "user";
  LensPreference2["Back"] = "environment";
  LensPreference2["First"] = "first";
  LensPreference2["Second"] = "second";
})(LensPreference || (LensPreference = {}));
var lensPrefVals = Object.values(LensPreference);
var lensPrefKeys = Object.keys(LensPreference);
var removeCanvasDisplayIndex = -1;
var lensCanvasDisplayVals = Object.values(LensCanvasDisplay).filter((value, index) => {
  if (isCanvas && isDesktop && value == LensCanvasDisplay.Camera) {
    removeCanvasDisplayIndex = index;
    return false;
  } else {
    return true;
  }
});
var lensCanvasDisplayKeys = Object.keys(LensCanvasDisplay).filter((value, index) => index != removeCanvasDisplayIndex);
function Lens(props) {
  const _a = props, {
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
    onCapture
  } = _a, rest = __objRest(_a, [
    "lensId",
    "lensConfig",
    "canvasDisplay",
    "background",
    "radius",
    "isRadiusMixed",
    "radiusTL",
    "radiusTR",
    "radiusBR",
    "radiusBL",
    "lensPreference",
    "shutter",
    "onTap",
    "onCapture"
  ]);
  const configId = lensConfig === LensConfig.Default ? defaultLensId : lensId;
  const fusedRadius = getFusedRadius(radius, isRadiusMixed, radiusTL, radiusTR, radiusBR, radiusBL);
  const [id, setId] = useState(getCameraId(configId));
  const [lensData, setLensData] = useCameraLensState(id);
  const [capture, setCapture] = useCameraCaptureState(id);
  const [canvasDisplayState, setcanvasDisplayState] = useState(canvasDisplay);
  const video = useRef();
  const stream = useRef();
  const mediaDevices = useRef([]);
  const intialized = useRef(false);
  const styleVideo = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "50% 50%",
    display: "block"
  };
  const shutterVariants = {};
  shutterVariants[ShutterVariant.Closed] = {
    opacity: 1,
    transition: { duration: 0 }
  };
  shutterVariants[ShutterVariant.Open] = {
    opacity: 0,
    transition: { duration: 0.3 }
  };
  const shutterAnimationControls = useAnimation();
  useEffect(() => {
    if (navigator.mediaDevices) {
      let mDevices = [];
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
        devices.forEach(function(device) {
          if (device.kind == VIDEOINPUT)
            mDevices.push(device.deviceId);
        });
        mediaDevices.current = mDevices;
        initCamera();
      });
    }
  }, []);
  useEffect(() => {
    if (capture.lensId == id && capture.time != lensData.time) {
      captureImage(__spreadValues({}, capture));
      handleOnCapture();
      if (shutter)
        snapShutter();
    }
  }, [capture]);
  useEffect(() => {
    setcanvasDisplayState(canvasDisplay);
  }, [canvasDisplay]);
  const initCamera = () => {
    const facingMode = getFacingMode();
    navigator.mediaDevices.getUserMedia({
      video: __spreadValues({
        width: { ideal: 4096 },
        height: { ideal: 2160 }
      }, facingMode),
      audio: false
    }).then((feed) => {
      stream.current = feed;
      video.current.srcObject = stream.current;
      video.current.play();
      return new Promise((resolve) => {
        if (!isBackground) {
          video.current.onplaying = resolve;
          setTimeout(openShutterInitial, 500);
        }
      });
    }).catch(function(err) {
      console.log(err);
    });
  };
  const getImageDataURL = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.current.videoWidth;
    canvas.height = video.current.videoHeight;
    canvas.getContext("2d").drawImage(video.current, 0, 0);
    return canvas.toDataURL("image/png");
  };
  const captureImage = (captureData) => {
    if (!intialized.current)
      return;
    const time = captureData.time;
    const image = getImageDataURL();
    const data = { id, image, time };
    setLensData(data);
    if (captureData.dataCallback && typeof captureData.dataCallback === "function") {
      captureData.dataCallback(data);
    }
  };
  const getFacingMode = () => {
    switch (lensPreference) {
      case LensPreference.First:
        return { deviceId: mediaDevices.current[0] };
      case LensPreference.Second:
        return { deviceId: mediaDevices.current[1] };
      case LensPreference.Front:
        return { facingMode: "user" };
      case LensPreference.Back:
        return { facingMode: "environment" };
      default:
        return {};
    }
  };
  const handleOnTap = (event) => {
    if (onTap)
      onTap(event);
  };
  const handleOnCapture = () => {
    if (onCapture)
      onCapture();
  };
  const openShutter = () => {
    intialized.current = true;
    shutterAnimationControls.start(ShutterVariant.Open);
  };
  const closeShutter = () => {
    shutterAnimationControls.start(ShutterVariant.Closed);
  };
  function snapShutter() {
    return __async(this, null, function* () {
      yield closeShutter();
      return yield openShutter();
    });
  }
  function openShutterInitial() {
    return __async(this, null, function* () {
      yield openShutter();
      return;
    });
  }
  const isInstructions = isCanvas && canvasDisplay === LensCanvasDisplay.Instructions;
  const isHidden = isCanvas && canvasDisplay === LensCanvasDisplay.Hidden;
  const isBackground = isCanvas && canvasDisplay === LensCanvasDisplay.Background;
  const isCanvasCamera = isCanvas && canvasDisplay === LensCanvasDisplay.Camera;
  if (isInstructions) {
    return createElement(placeholderState, {
      icon: defaultLensId,
      title: "Camera Lens",
      label: "Connect and view your camera lens in the preview"
    });
  }
  return /* @__PURE__ */ createElement(Frame, __spreadProps(__spreadValues({}, rest), {
    name: displayName,
    background,
    radius: fusedRadius,
    overflow: "hidden",
    onTap: onTap ? handleOnTap : null,
    visible: !isHidden
  }), /* @__PURE__ */ createElement(Frame, {
    name: "Shutter",
    size: "100%",
    background,
    variants: shutterVariants,
    initial: ShutterVariant.Closed,
    animate: shutterAnimationControls,
    visible: !isCanvasCamera
  }), /* @__PURE__ */ createElement("video", {
    ref: video,
    autoPlay: true,
    muted: true,
    controls: false,
    preload: "auto",
    playsInline: true,
    style: styleVideo
  }));
}
var defaultProps = {
  height: 200,
  width: 200,
  radius: 0,
  background: "#000",
  lensConfig: LensConfig.Default,
  lensId: defaultLensId,
  lensPreference: LensPreference.Default,
  shutter: true,
  canvasDisplay: LensCanvasDisplay.Instructions
};
Lens.defaultProps = defaultProps;
Lens.displayName = displayName;
addPropertyControls(Lens, {
  lensPreference: {
    title: "Preference",
    type: ControlType.Enum,
    options: lensPrefVals,
    optionTitles: lensPrefKeys,
    defaultValue: defaultProps.lensPreference
  },
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
  shutter: {
    title: "Shutter",
    type: ControlType.Boolean,
    enabledTitle: "Yes",
    disabledTitle: "No"
  },
  lensConfig: {
    title: "Config",
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
  canvasDisplay: {
    title: "On Canvas",
    type: ControlType.Enum,
    options: lensCanvasDisplayKeys,
    optionTitles: lensCanvasDisplayVals,
    defaultValue: defaultProps.canvasDisplay
  },
  onTap: {
    type: ControlType.EventHandler
  },
  onCapture: {
    type: ControlType.EventHandler
  }
});
export {
  Lens
};
