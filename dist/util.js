(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.index = mod.exports;
    }
})(this, function (exports, module) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  module.exports.applyRange = applyRange;
  module.exports.getRange = getRange;
  module.exports.getOffset = getOffset;
  module.exports.closest = closest;
  module.exports.getPrecedingRange = getPrecedingRange;
  function applyRange(range) {
    var selection = window.getSelection();
    if (selection) {
      // 容错
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  function getRange() {
    var selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
  }

  /* eslint-disable */
  // http://stackoverflow.com/questions/26747240/plain-javascript-replication-to-offset-and-position
  function getOffset(element, target) {
    // var element = document.getElementById(element),
    //     target  = target ? document.getElementById(target) : window;
    target = target || window;
    var offset = { top: element.offsetTop, left: element.offsetLeft },
        parent = element.offsetParent;
    while (parent != null && parent != target) {
      offset.left += parent.offsetLeft;
      offset.top += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return offset;
  }
  // http://stackoverflow.com/questions/3972014/get-caret-position-in-contenteditable-div
  function closest(el, predicate) {
    /* eslint-disable */
    do {
      if (predicate(el)) return el;
    } while (el = el && el.parentNode);
  }
  // http://stackoverflow.com/questions/15157435/get-last-character-before-caret-position-in-javascript
  function getPrecedingRange() {
    var r = getRange();
    if (r) {
      var range = r.cloneRange();
      range.collapse(true);
      var el = closest(range.endContainer, function (d) {
        return d.contentEditable;
      });
      range.setStart(el, 0);
      return range;
    }
  }
  /* eslint-enable */
})
