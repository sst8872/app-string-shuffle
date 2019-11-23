// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/spreadSheet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function getSheetLength(cb) {
  var appURL = 'https://script.google.com/macros/s/AKfycbzPEv6fWhImZlfEBeuc15Zaq1RapOO_FmtT8_N7bWLiiN_SOoE/exec';
  fetch(appURL).then(function (res) {
    return res.json();
  }).then(cb).catch(function (e) {
    return console.log(e);
  });
}

;
var _default = getSheetLength; // function doGet() {
//
//     var ss = SpreadsheetApp.getActiveSpreadsheet();
//     var sheetLen = ss.getSheets().length;
//     var jsonData = JSON.stringify(sheetLen);
//
//     return ContentService.createTextOutput(jsonData).setMimeType(ContentService.MimeType.JSON);
// }

exports.default = _default;
},{}],"js/exportContentToWord.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function Export2Doc(element) {
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  var postHtml = "</body></html>";
  var html = preHtml + document.getElementById(element).innerHTML + postHtml;
  var blob = new Blob(["\uFEFF", html], {
    type: 'application/msword'
  }); // Specify link url

  var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html); // Specify file name

  filename = filename ? filename + '.doc' : 'document.doc'; // Create download link element

  var downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = url; // Setting the file name

    downloadLink.download = filename; //triggering the function

    downloadLink.click();
  }

  document.body.removeChild(downloadLink);
}

var _default = Export2Doc;
exports.default = _default;
},{}],"js/app.js":[function(require,module,exports) {
"use strict";

var _spreadSheet = _interopRequireDefault(require("./spreadSheet"));

var _exportContentToWord = _interopRequireDefault(require("./exportContentToWord"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var myData = [];
$(document).ready(function () {
  $('#title').focus();
  $('#text').autosize();
  init();
  (0, _spreadSheet.default)(loadJSON);
});

function init() {
  var myForm = document.getElementById('paper');
  myForm.addEventListener('submit', makeSentence);

  function makeSentence(e) {
    e.preventDefault();

    if (text.value != '') {
      var strValue = text.value.split('\n');
      var result = handleString(strValue);
      console.log(result);
      text.value = result;
      text.style.color = 'green';
      copyToClipboard();
    } else {
      text.style.color = 'red';
      text.value = 'You should enter a sentence.';
      button.disabled = true;
      setTimeout(function () {
        text.value = '';
        button.disabled = false;
      }, 2000);
    }
  }

  function copyToClipboard() {
    button.value = 'Copy to Clipboard';
    text.select();
    makeFile(text.value);
    button.addEventListener('click', function (e) {
      document.execCommand('copy'); // makeFile(text.value);

      copied.style.color = '#6697ea';
      copied.style.marginBottom = '10px';
      copied.textContent = 'Copied Successfully!';
    });
  }

  function makeFile(data) {
    console.log('song');
    var blob = new Blob([data], {
      type: 'text/plain'
    });
    link.href = URL.createObjectURL(blob);
    link.classList.remove('hide'); // URL.revokeObjectURL(link.href);
  }

  function handleString(strArr) {
    if (strArr[0] == "") {
      text.style.color = "red";
      text.textContent = "You should enter a sentence."; // Reset the text field

      setTimeout(function () {
        text.style.color = "black";
        text.textContent = "";
      }, 2000);
      return;
    } else {
      return shuffStr(strArr);
    }
  }
}

function shuffStr(arr) {
  var res = arr.map(function (str) {
    return str.split(" ");
  }).map(shuffle).map(function (arr) {
    return arr.join(' ');
  }).map(function (str) {
    return str.replace(/\.|\?|!|,/g, '');
  }).map(function (str) {
    return str.toLowerCase().split(' ').join(', ');
  }).join('.\n');
  return res + '.';
}

function shuffle(arr) {
  var n = arr.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  return arr;
}

function loadJSON(len) {
  var id = "1jlOs08Z4Qt2sJwBK2eXRS8YdTiSPfgCXnFc107UY1g8";
  var urls = [];

  for (var sheetNum = 1; sheetNum <= len; sheetNum++) {
    var jsonURL = "https://spreadsheets.google.com/feeds/list/".concat(id, "/").concat(sheetNum, "/public/values?alt=json");
    urls = [].concat(_toConsumableArray(urls), [jsonURL]);
  }

  Promise.all(urls.map(function (url) {
    return fetch(url).then(function (res) {
      return res.json();
    }).then(function (data) {
      var tempArr = [];
      var sheetName = data.feed.title.$t;
      data.feed.entry.forEach(function (element) {
        var holder = {};

        for (var key in element) {
          if (key.substring(4) === 'korean') {
            holder.ko = element[key].$t;
          } else if (key.substring(4) === 'sentence') {
            holder.en = element[key].$t;
          }
        }

        tempArr = [].concat(_toConsumableArray(tempArr), [holder]);
      });
      return {
        key: sheetName,
        value: tempArr
      };
    });
  })).then(function (result) {
    myData = result;
    var types = document.querySelectorAll('.sentence');
    types.forEach(function (type) {
      type.addEventListener('click', function (e) {
        makeChoice(this.dataset.value);
      });
    });
  });
}

function makeChoice(value) {
  switch (value) {
    case '1':
      makeWordContent(1);
      break;

    case '2':
      makeWordContent(2);
      break;

    case '3':
      makeWordContent(3);
      break;

    case '4':
      makeWordContent(4);
      break;

    case '5':
      makeWordContent(5);
      break;
  }
}

function makeWordContent(num) {
  shuffle(myData[num - 1].value);
  exportContent.innerHTML = '';
  var tempData = myData[num - 1].value; // tempData.forEach((sentence, i)=> console.log(`${i+1}. ${sentence.en}`));

  tempData.forEach(function (sentence, i) {
    var tempSentence = shuffStr([sentence.en]);
    tempSentence;
    exportContent.innerHTML += "\n                                    ".concat(i + 1, ". ").concat(tempSentence, " <span class=\"korean\" style=\"font-size: 10px\">").concat(sentence.ko, "</span><br><br>\n                                    <div \n                                        class=\"blank\" \n                                        style=\"border-bottom: 1px solid black;\n                                               color: white;\n                                               margin-left: 20px;\n                                               font-size: 8px;\n                                        \"\n                                        >\n                                        ").concat(sentence.en).concat(sentence.ko, "</div><br><br>\n                                     ");
  });
  (0, _exportContentToWord.default)('exportContent', num + ' 형식');
  exportContent.innerHTML = '';
}
},{"./spreadSheet":"js/spreadSheet.js","./exportContentToWord":"js/exportContentToWord.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55487" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map