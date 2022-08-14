class UI {
  constructor(elem) {
    this.elem = elem;
    this.state = {};
  }
}
UI.prototype.setState = function (state) {
  let prevState = this.state;
  let nextState = state
  let newState = Object.assign(prevState, nextState)
  return newState;
};
UI.prototype.createElement = function (tag, props, ...children) {
  if (typeof tag === "function") return tag(props, children);

  const appendChild = (parent, child) => {
    if (Array.isArray(child))
      child.forEach((nestedChild) => appendChild(parent, nestedChild));
    else
      parent.appendChild(
        child.nodeType ? child : document.createTextNode(child)
      );
  };

  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substring(2), value);
    }
    if (name === "submit") {
      element.addEventListener("submit", value);
    }
    if (name === "input") {
      element.addEventListener("input", value);
    }
    if (name === "required") {
      element.required = value;
    }
    if (name === "click") {
      element.addEventListener("click", value);
    } else element.setAttribute(name, value.toString());
  });

  children.forEach((child) => {
    appendChild(element, child);
  });

  return element;
};
UI.prototype.anchor = function (arr) {
    this.elem.innerHTML = "";
    const App = this.createElement(
      "div",
      { id: "root" },
      ...arr.map((el) => el)
    );
    this.elem.append(App);
    arr = [];
    return this;
  };

export default UI;
