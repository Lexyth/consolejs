//work in progress. Should do what it's supposed to do, but it's far from perfect. Just intended for when the inbuilt console only returns [object Object], so you can actually see the contents of the object.

(function () {
let noColId = "nCId294736942882";

let style = document.createElement("style");
style.type = "text/css";
style.innerHTML = `
.${noColId}collapse-btn {
    display: none;
}

.${noColId}btn {
    width: 20px;
    height: 20px;
    background: silver;
    border-radius: 5px;
    padding: 1px 3px;
    box-shadow: 1px 1px 1px #000;
    display: block;
    text-align: center;
    background-image: linear-gradient(to bottom, #f4f5f5, #dfdddd);
    font-family: arial;
    font-size: 12px;
    line-height:20px;
}

.${noColId}collapse-container {
  display: none;
}

.${noColId}collapse-btn:checked + .${noColId}collapse-container {
  display: block;
}

#${noColId}console {
  box-sizing: border-box;
  overflow: scroll;
  padding: 10px;
  width: 100vw;
  height: 250px;
  background: rgba(150,150,150,1);
}

#${noColId}console .${noColId}errorMessage{
  background: red;
}

#${noColId}console .${noColId}number {
  background: rgba(0,0,255,0.1);
}

#${noColId}console :is(.${noColId}array, .${noColId}object) > label {
  display: inline-block;
  width: auto;
  text-align: left;
  margin: 0 3px 3px 0;
  box-shadow: 2px 2px 2px;
}

#${noColId}console :is(.${noColId}array, .${noColId}object) > .${noColId}collapse-container {
  background: rgba(100,100,100,0.1);
  padding: 3px 0 0 3px;
  padding-left: 10px;
  box-shadow: 2px 2px 2px inset;
}

#${noColId}console .${noColId}array > label {
  max-width: 98%;
  border-left: 2px solid blue;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#${noColId}console .${noColId}array > .${noColId}collapse-container {
  border-left: 2px solid blue;
}

#${noColId}console .${noColId}object > label {
  max-width: 97%;
  border-left: 2px solid green;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#${noColId}console .${noColId}object > .${noColId}collapse-container {
  border-left: 2px solid green;
}`;
document.head.append(style);

(() => {
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.right = "0%";
  div.style.bottom = "0%";
  
  let label = document.createElement("label");
  label.className = `${noColId}btn`;
  label.setAttribute("for", `${noColId}consoleCollapseBtn`);
  label.innerText = "\u{25B2}";
  
  let input = document.createElement("input");
  input.id = `${noColId}consoleCollapseBtn`;
  input.type = "checkbox";
  input.className = `${noColId}collapse-btn`;
  input.onclick = function () {
    label.innerText = input.checked ? "\u{25BC}" : "\u{25B2}";
  };
  
  let consoleDiv = document.createElement("div");
  consoleDiv.id = `${noColId}console`;
  consoleDiv.className = `${noColId}collapse-container`;
  div.append(label, input, consoleDiv);
  document.body.append(div);
})();


function create(tagName, attrs) {
  var el = document.createElement(tagName);
  if (attrs)
    for (var k in attrs) el.setAttribute(k, attrs[k]);
  for (var i = 2; i < arguments.length; ++i)
    el.appendChild(arguments[i]);
  return el;
}
      

var logBackup = console.log;
      var logMessages = [];
      var collapsole =  document.querySelector(`#${noColId}console`);
      console.log = function() {
        logMessages.push.apply(logMessages, arguments);
        logBackup.apply(console, arguments);
        let message = logMessages[logMessages.length-1];
      collapsole.append(create("div", {}, output(message)));
      };

      var errorBackup = console.error;
      var errorMessages = [];
      console.error = function() {
        errorMessages.push.apply(errorMessages, arguments);
        errorBackup.apply(console, arguments);
        let message = errorMessages[errorMessages.length-1];
        let out = output(message);
        out.className = `${noColId}errorMessage`;
        collapsole.append(create("div", {}, out));
      }

//TODO:
//console.warn = () => alert("warn!");
//console.debug = () => alert("debug");

var uniqueId = (() => {
  let id = 0;
  return function () {
    id+=1;
    return `uniqueId${id}`;
  };
})();

function Collapser (title, onclick, className) {
  let collapseElem = document.createElement("span");
  collapseElem.className = className;
  let id = `${noColId}Collapser${uniqueId()}`;
  let label = document.createElement("label");
  label.setAttribute("for", id);
  label.innerText = '\u{25B2} ' + title;
  let input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", id);
  input.className = `${noColId}collapse-btn`;
  let container = document.createElement("div");
  container.className = `${noColId}collapse-container`;
  input.onclick = function () {
    onclick({label: label, container:container, input:input});
  };
  collapseElem.append(label, input, container);
  return collapseElem;
}




function text(el, text) {
  if (typeof el === 'string' || typeof el === 'number')
    return document.createTextNode(el);
  el.appendChild(document.createTextNode(text));
  return el;
}

function typeOf(obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]')
    return 'array';
  else if (Object.prototype.toString.call(obj) === '[object Error]')
    return 'error';
  else if (obj === null)
    return 'null';
  else if (obj && obj.nodeType == 1)
    return 'element';
  else
    return typeof obj;
}

function output(result, deep) {
  var type = typeOf(result);
  switch (type) {
    case 'null':
    case 'undefined':
      return create('div', {'class': type}, text(type));



    case 'array': {
      let title = `Array (${result.length}): [${result}]`;
      let onclick = function ({label, container, input}) {
          for (let i in result) {
            let div = create(
              "div",
              {},
              text(`${i}: `),
              output(result[i])
            );
            container.append(div);
          }
          label.innerText = (input.checked ? "\u{25BC} " : "\u{25B2} ") + title;
          input.onclick = function () {
            label.innerText = (input.checked ? "\u{25BC} " : "\u{25B2} ") + title;
          };
        };
      return Collapser(
        title,
        onclick,
        `${noColId}array`
      );
    }
    case 'object': {
      let title = `Object: {${result}}`;
      let onclick = function ({label, container, input}) {
          for (const [key, value] of Object.entries(result)) {
            let div = create(
              "div",
              {},
              text(`${key}: `),
              output(value)
            );
            container.append(div);
          }
          label.innerText = (input.checked ? "\u{25BC} " : "\u{25B2} ") + title;
          input.onclick = function () {
            label.innerText = (input.checked ? "\u{25BC} " : "\u{25B2} ") + title;
          };
        };
      return Collapser(
        title,
        onclick,
        `${noColId}object`
      );
    }


//dunno about this... better avoid passing element types
    case 'element':
      var nodeName = result.nodeName.toLowerCase(),
          attrs = create('dl'),
          open = create('div', {'class': 'open'}, text(nodeName), attrs),
          close = create('div', {'class': 'close'}, text(nodeName)),
          html = create('div', {'class': 'content'}, text(result.innerHTML));
      for (var i = 0; i < result.attributes.length; ++i) {
        var attr = result.attributes[i];
        attrs.appendChild(create('dt', null, text(attr.name)));
        attrs.appendChild(create('dd', null, text(attr.value)));
      }
      return create('div', {'class': type}, open, html, close);

    case "function": {
      return create("span", {}, text(`func:${result.toString()}`));
    }

    default:
      if (type !== "number" && type !== "string")
        console.log(type);
      return create('span', {'class': `${noColId}${type}`}, text(result.toString()));
  }
}

/*
console.log(console);
console.log("Done");

console.log(["hi", "be", "Eh,", " i", "meant", "bye", ["oh", "inner", "stuff"], ["1", "2", "3", "4", "5"], {a:0, b:50, "je":53}, [[5],[5,[9,0,1,2,3,4,5,6,7,8,9,9,9,9,9,9,8,7,6,6,7,8,9,8,7,6,7,8,9,7,7,7,7,7,8,9,9],"5"]]]);

let recursiveObj = {};
recursiveObj.recursion = recursiveObj;

console.log(recursiveObj);

console.error("Error!");

let arr = [0,1,2,3,4,5,6];
console.log(`Error in: ${arr}`);
*/
})();
