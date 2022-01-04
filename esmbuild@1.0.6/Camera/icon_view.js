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

// src/Camera/icon_view.tsx
import {
  createElement
} from "react";
import { Frame, addPropertyControls, ControlType } from "framer";
function icon_view(props) {
  const _a = props, { scale, radius, fillColor, iconColor } = _a, rest = __objRest(_a, ["scale", "radius", "fillColor", "iconColor"]);
  const fill = fillColor;
  const icon = iconColor;
  const clear = "";
  const end = 16;
  const size = 16;
  const thick = 6;
  const endMargin = 6;
  const outlineRadius = 10;
  return /* @__PURE__ */ createElement(Frame, {
    name: "IconView",
    center: true,
    size: 100,
    background: fill,
    radius,
    scale
  }, /* @__PURE__ */ createElement(Frame, {
    name: "View",
    center: true,
    size: 56,
    background: "",
    radius: outlineRadius
  }, /* @__PURE__ */ createElement(Frame, {
    name: "CornerLeftTop",
    size,
    background: clear,
    radius: `${outlineRadius}px 0 0 0`,
    shadow: `inset ${thick}px ${thick}px 0 0px ${icon}`
  }, /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: thick,
    height: end,
    radius: thick / 2,
    top: endMargin
  }), /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: end,
    height: thick,
    radius: thick / 2,
    left: endMargin
  })), /* @__PURE__ */ createElement(Frame, {
    name: "CornerRightTop",
    size,
    right: 0,
    background: clear,
    radius: `0 ${outlineRadius}px 0 0`,
    shadow: `inset -${thick}px ${thick}px 0 0px ${icon}`
  }, /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: thick,
    height: end,
    radius: thick / 2,
    top: endMargin,
    right: 0
  }), /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: end,
    height: thick,
    radius: thick / 2,
    left: -endMargin
  })), /* @__PURE__ */ createElement(Frame, {
    name: "CornerRightBottom",
    size,
    right: 0,
    bottom: 0,
    background: clear,
    radius: `0 0 ${outlineRadius}px 0`,
    shadow: `inset -${thick}px -${thick}px 0 0px ${icon}`
  }, /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: thick,
    height: end,
    radius: thick / 2,
    bottom: endMargin,
    right: 0
  }), /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: end,
    height: thick,
    radius: thick / 2,
    left: -endMargin,
    bottom: 0
  })), /* @__PURE__ */ createElement(Frame, {
    name: "CornerLeftBottom",
    size,
    left: 0,
    bottom: 0,
    background: clear,
    radius: `0 0 0 ${outlineRadius}px`,
    shadow: `inset ${thick}px -${thick}px 0 0px ${icon}`
  }, /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: thick,
    height: end,
    radius: thick / 2,
    bottom: endMargin,
    left: 0
  }), /* @__PURE__ */ createElement(Frame, {
    background: icon,
    width: end,
    height: thick,
    radius: thick / 2,
    left: endMargin,
    bottom: 0
  })), /* @__PURE__ */ createElement(Frame, {
    center: true,
    size: 44,
    background: fill,
    radius: thick,
    opacity: 1
  })), /* @__PURE__ */ createElement(Frame, {
    name: "Lens",
    center: true,
    size: 56,
    background: "",
    radius: "50%",
    shadow: `inset 0 0 0 6px ${icon}`,
    opacity: 0
  }));
}
var defaultProps = {
  height: 100,
  width: 100,
  scale: 1,
  radius: 50,
  fillColor: "#000",
  iconColor: "#fff"
};
icon_view.defaultProps = defaultProps;
icon_view.displayName = "View Icon";
addPropertyControls(icon_view, {
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
  icon_view
};
