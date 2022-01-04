// src/Camera/index.ts
import { createData, RenderTarget } from "framer";
var EMPTY_DATA_STATE = { id: null, image: null, time: null };
var LensConfig;
(function(LensConfig2) {
  LensConfig2["Default"] = "Default";
  LensConfig2["Custom"] = "Custom";
})(LensConfig || (LensConfig = {}));
var ViewConfig;
(function(ViewConfig2) {
  ViewConfig2["Default"] = "Default";
  ViewConfig2["Custom"] = "Custom";
})(ViewConfig || (ViewConfig = {}));
var FaceConfig;
(function(FaceConfig2) {
  FaceConfig2["Default"] = "Default";
  FaceConfig2["Custom"] = "Custom";
})(FaceConfig || (FaceConfig = {}));
var ViewCanvasDisplay;
(function(ViewCanvasDisplay2) {
  ViewCanvasDisplay2["Instructions"] = "Instructions";
  ViewCanvasDisplay2["Background"] = "Background";
  ViewCanvasDisplay2["Hidden"] = "Hidden";
})(ViewCanvasDisplay || (ViewCanvasDisplay = {}));
var LensCanvasDisplay;
(function(LensCanvasDisplay2) {
  LensCanvasDisplay2["Instructions"] = "Instructions";
  LensCanvasDisplay2["Camera"] = "Camera";
  LensCanvasDisplay2["Background"] = "Background";
  LensCanvasDisplay2["Hidden"] = "Hidden";
})(LensCanvasDisplay || (LensCanvasDisplay = {}));
var defaultLensId = "CameraLens";
var defaultViewId = "CameraView";
var defaultFaceId = "CameraFace";
var useCameraLensState = createData(EMPTY_DATA_STATE);
var useCameraViewState = createData(EMPTY_DATA_STATE);
var useCameraFaceState = createData(EMPTY_DATA_STATE);
var useCameraCaptureState = createData({
  lensId: null,
  viewId: null,
  time: null,
  dataCallback: null
});
function getCameraId(id) {
  return id != "" ? id : generateRandomId();
}
function generateRandomId() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a) => (a ^ Math.random() * 16 >> a / 4).toString(16));
}
var getFusedRadius = (radius, isMixed, tl, tr, br, bl) => {
  return isMixed ? `${tl}px ${tr}px ${br}px ${bl}px` : `${radius}px`;
};
var INDENT = "\u2005\xB7\u2005\u2005";
var REQUIRED = "Required";
var isThumbnail = RenderTarget.current() === RenderTarget.thumbnail;
var isCanvas = RenderTarget.current() === RenderTarget.canvas;
var isPreview = RenderTarget.current() === RenderTarget.preview;
var isDesktop = document.location.protocol === "http:";
export {
  EMPTY_DATA_STATE,
  FaceConfig,
  INDENT,
  LensCanvasDisplay,
  LensConfig,
  REQUIRED,
  ViewCanvasDisplay,
  ViewConfig,
  defaultFaceId,
  defaultLensId,
  defaultViewId,
  getCameraId,
  getFusedRadius,
  isCanvas,
  isDesktop,
  isPreview,
  isThumbnail,
  useCameraCaptureState,
  useCameraFaceState,
  useCameraLensState,
  useCameraViewState
};
