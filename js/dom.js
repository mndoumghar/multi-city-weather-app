

export function h(tag, props = {}, children = []) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (key === "className") {
      element.className = value;
    } else if (key === "dataset") {
        Object.assign(element.dataset, value);
    } else if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "text") {
      element.append(document.createTextNode(value));
    } else {
      element.setAttribute(key, value === true ? "" : value);
    }
  }

  appendChildren(element, children)
  return element

}

function appendChildren(parent, children) {
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}


export function clear(element) {
  while (element.firstChild) element.removeChild(element.firstChild);
}


export function setChildren(element, children) {
  clear(element);
  appendChildren(element, children);
}


export function show(element) {
  element.hidden = false;
}

export function hide(element) {
  element.hidden = true;
}
