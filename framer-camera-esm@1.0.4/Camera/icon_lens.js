var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
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

// src/Camera/icon_lens.tsx
import {
  createElement
} from "react";
import { Frame, addPropertyControls, ControlType } from "framer";
function icon_lens(props) {
  const _a = props, { scale, radius, fillColor, iconColor } = _a, rest = __objRest(_a, ["scale", "radius", "fillColor", "iconColor"]);
  const fill = fillColor;
  const icon = iconColor;
  return /* @__PURE__ */ createElement(Frame, {
    name: "IconLens",
    center: true,
    size: 100,
    background: fillColor,
    radius,
    scale
  }, /* @__PURE__ */ createElement(Frame, {
    name: "Lens",
    center: true,
    size: 56,
    background: "",
    radius: "50%",
    shadow: `inset 0 0 0 6px ${icon}`
  }, /* @__PURE__ */ createElement(Frame, {
    name: "Flash",
    size: 8,
    top: 2,
    right: -8,
    radius: "50%",
    background: icon
  })));
}
var defaultProps = {
  height: 100,
  width: 100,
  scale: 1,
  radius: 50,
  fillColor: "#000",
  iconColor: "#fff"
};
icon_lens.defaultProps = defaultProps;
icon_lens.displayName = "Lens Icon";
addPropertyControls(icon_lens, {
  scale: {
    title: "Scale",
    type: ControlType.Number,
    defaultValue: defaultProps.scale,
    min: 0.25,
    max: 1.5,
    step: 0.25,
    displayStepper: true
  },
  radius: {
    title: "Radius",
    type: ControlType.Number,
    defaultValue: defaultProps.radius,
    min: 0,
    max: 50,
    step: 1,
    displayStepper: true
  },
  fillColor: {
    title: "Fill",
    type: ControlType.Color,
    defaultValue: defaultProps.fillColor
  },
  iconColor: {
    title: "Icon",
    type: ControlType.Color,
    defaultValue: defaultProps.iconColor
  }
});
export {
  icon_lens
};
