// src/Button.tsx
import {
  createElement
} from "react";

// esbuild-css-modules-plugin-namespace:/tmp/tmp-1796-CoIYt4xR6Sm5/main/src/Button.modules.css.js
var digest = "1211f44266c5fd2a68f5d3a32504722519e8e3b7ad26ba153503b8000d155a31";
var css = `._button_kpmle_1 {
  background-color: #c8d5ff;
}
`;
(function() {
  if (!document.getElementById(digest)) {
    var ele = document.createElement("style");
    ele.id = digest;
    ele.textContent = css;
    document.head.appendChild(ele);
  }
})();
var Button_modules_css_default = { "button": "_button_kpmle_1" };

// src/Button.tsx
function Button({ title = "Title" }) {
  return /* @__PURE__ */ createElement("button", {
    className: Button_modules_css_default.button
  }, title);
}
export {
  Button
};
