(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"));
	else if(typeof define === 'function' && define.amd)
		define(["CoreHome", , "CorePluginsAdmin"], factory);
	else if(typeof exports === 'object')
		exports["HeatmapSessionRecording"] = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"));
	else
		root["HeatmapSessionRecording"] = factory(root["CoreHome"], root["Vue"], root["CorePluginsAdmin"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__19dc__, __WEBPACK_EXTERNAL_MODULE__8bbf__, __WEBPACK_EXTERNAL_MODULE_a5a2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "plugins/HeatmapSessionRecording/vue/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "19dc":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__19dc__;

/***/ }),

/***/ "246e":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * heatmap.js v2.0.5 | JavaScript Heatmap Library
 *
 * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license 
 *
 * :: 2016-09-05 01:16
 */
;(function (name, context, factory) {

  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if ( true && module.exports) {
    module.exports = factory();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})("h337", this, function () {

// Heatmap Config stores default values and will be merged with instance config
var HeatmapConfig = {
  defaultRadius: 40,
  defaultRenderer: 'canvas2d',
  defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: .85,
  defaultXField: 'x',
  defaultYField: 'y',
  defaultValueField: 'value', 
  plugins: {}
};
var Store = (function StoreClosure() {

  var Store = function Store(config) {
    this._coordinator = {};
    this._data = [];
    this._radi = [];
    this._min = 10;
    this._max = 1;
    this._xField = config['xField'] || config.defaultXField;
    this._yField = config['yField'] || config.defaultYField;
    this._valueField = config['valueField'] || config.defaultValueField;

    if (config["radius"]) {
      this._cfgRadius = config["radius"];
    }
  };

  var defaultRadius = HeatmapConfig.defaultRadius;

  Store.prototype = {
    // when forceRender = false -> called from setData, omits renderall event
    _organiseData: function(dataPoint, forceRender) {
        var x = dataPoint[this._xField];
        var y = dataPoint[this._yField];
        var radi = this._radi;
        var store = this._data;
        var max = this._max;
        var min = this._min;
        var value = dataPoint[this._valueField] || 1;
        var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

        if (!store[x]) {
          store[x] = [];
          radi[x] = [];
        }

        if (!store[x][y]) {
          store[x][y] = value;
          radi[x][y] = radius;
        } else {
          store[x][y] += value;
        }
        var storedVal = store[x][y];

        if (storedVal > max) {
          if (!forceRender) {
            this._max = storedVal;
          } else {
            this.setDataMax(storedVal);
          }
          return false;
        } else if (storedVal < min) {
          if (!forceRender) {
            this._min = storedVal;
          } else {
            this.setDataMin(storedVal);
          }
          return false;
        } else {
          return { 
            x: x, 
            y: y,
            value: value, 
            radius: radius,
            min: min,
            max: max 
          };
        }
    },
    _unOrganizeData: function() {
      var unorganizedData = [];
      var data = this._data;
      var radi = this._radi;

      for (var x in data) {
        for (var y in data[x]) {

          unorganizedData.push({
            x: x,
            y: y,
            radius: radi[x][y],
            value: data[x][y]
          });

        }
      }
      return {
        min: this._min,
        max: this._max,
        data: unorganizedData
      };
    },
    _onExtremaChange: function() {
      this._coordinator.emit('extremachange', {
        min: this._min,
        max: this._max
      });
    },
    addData: function() {
      if (arguments[0].length > 0) {
        var dataArr = arguments[0];
        var dataLen = dataArr.length;
        while (dataLen--) {
          this.addData.call(this, dataArr[dataLen]);
        }
      } else {
        // add to store  
        var organisedEntry = this._organiseData(arguments[0], true);
        if (organisedEntry) {
          // if it's the first datapoint initialize the extremas with it
          if (this._data.length === 0) {
            this._min = this._max = organisedEntry.value;
          }
          this._coordinator.emit('renderpartial', {
            min: this._min,
            max: this._max,
            data: [organisedEntry]
          });
        }
      }
      return this;
    },
    setData: function(data) {
      var dataPoints = data.data;
      var pointsLen = dataPoints.length;


      // reset data arrays
      this._data = [];
      this._radi = [];

      for(var i = 0; i < pointsLen; i++) {
        this._organiseData(dataPoints[i], false);
      }
      this._max = data.max;
      this._min = data.min || 0;
      
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    removeData: function() {
      // TODO: implement
    },
    setDataMax: function(max) {
      this._max = max;
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    setDataMin: function(min) {
      this._min = min;
      this._onExtremaChange();
      this._coordinator.emit('renderall', this._getInternalData());
      return this;
    },
    setCoordinator: function(coordinator) {
      this._coordinator = coordinator;
    },
    _getInternalData: function() {
      return { 
        max: this._max,
        min: this._min, 
        data: this._data,
        radi: this._radi 
      };
    },
    getData: function() {
      return this._unOrganizeData();
    }/*,

      TODO: rethink.

    getValueAt: function(point) {
      var value;
      var radius = 100;
      var x = point.x;
      var y = point.y;
      var data = this._data;

      if (data[x] && data[x][y]) {
        return data[x][y];
      } else {
        var values = [];
        // radial search for datapoints based on default radius
        for(var distance = 1; distance < radius; distance++) {
          var neighbors = distance * 2 +1;
          var startX = x - distance;
          var startY = y - distance;

          for(var i = 0; i < neighbors; i++) {
            for (var o = 0; o < neighbors; o++) {
              if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                if (data[startY+i] && data[startY+i][startX+o]) {
                  values.push(data[startY+i][startX+o]);
                }
              } else {
                continue;
              } 
            }
          }
        }
        if (values.length > 0) {
          return Math.max.apply(Math, values);
        }
      }
      return false;
    }*/
  };


  return Store;
})();

var Canvas2dRenderer = (function Canvas2dRendererClosure() {

  var _getColorPalette = function(config) {
    var gradientConfig = config.gradient || config.defaultGradient;
    var paletteCanvas = document.createElement('canvas');
    var paletteCtx = paletteCanvas.getContext('2d');

    paletteCanvas.width = 256;
    paletteCanvas.height = 1;

    var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
    for (var key in gradientConfig) {
      gradient.addColorStop(key, gradientConfig[key]);
    }

    paletteCtx.fillStyle = gradient;
    paletteCtx.fillRect(0, 0, 256, 1);

    return paletteCtx.getImageData(0, 0, 256, 1).data;
  };

  var _getPointTemplate = function(radius, blurFactor) {
    var tplCanvas = document.createElement('canvas');
    var tplCtx = tplCanvas.getContext('2d');
    var x = radius;
    var y = radius;
    tplCanvas.width = tplCanvas.height = radius*2;

    if (blurFactor == 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = 'rgba(0,0,0,1)';
      tplCtx.fill();
    } else {
      var gradient = tplCtx.createRadialGradient(x, y, radius*blurFactor, x, y, radius);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, 2*radius, 2*radius);
    }



    return tplCanvas;
  };

  var _prepareData = function(data) {
    var renderData = [];
    var min = data.min;
    var max = data.max;
    var radi = data.radi;
    var data = data.data;

    var xValues = Object.keys(data);
    var xValuesLen = xValues.length;

    while(xValuesLen--) {
      var xValue = xValues[xValuesLen];
      var yValues = Object.keys(data[xValue]);
      var yValuesLen = yValues.length;
      while(yValuesLen--) {
        var yValue = yValues[yValuesLen];
        var value = data[xValue][yValue];
        var radius = radi[xValue][yValue];
        renderData.push({
          x: xValue,
          y: yValue,
          value: value,
          radius: radius
        });
      }
    }

    return {
      min: min,
      max: max,
      data: renderData
    };
  };


  function Canvas2dRenderer(config) {
    var container = config.container;
    var shadowCanvas = this.shadowCanvas = document.createElement('canvas');
    var canvas = this.canvas = config.canvas || document.createElement('canvas');
    var renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

    var computed = getComputedStyle(config.container) || {};

    canvas.className = 'heatmap-canvas';

    this._width = canvas.width = shadowCanvas.width = config.width || +(computed.width.replace(/px/,''));
    this._height = canvas.height = shadowCanvas.height = config.height || +(computed.height.replace(/px/,''));

    this.shadowCtx = shadowCanvas.getContext('2d');
    this.ctx = canvas.getContext('2d');

    // @TODO:
    // conditional wrapper

    canvas.style.cssText = shadowCanvas.style.cssText = 'position:absolute;left:0;top:0;';

    container.style.position = 'relative';
    container.appendChild(canvas);

    this._palette = _getColorPalette(config);
    this._templates = {};

    this._setStyles(config);
  };

  Canvas2dRenderer.prototype = {
    renderPartial: function(data) {
      if (data.data.length > 0) {
        this._drawAlpha(data);
        this._colorize();
      }
    },
    renderAll: function(data) {
      // reset render boundaries
      this._clear();
      if (data.data.length > 0) {
        this._drawAlpha(_prepareData(data));
        this._colorize();
      }
    },
    _updateGradient: function(config) {
      this._palette = _getColorPalette(config);
    },
    updateConfig: function(config) {
      if (config['gradient']) {
        this._updateGradient(config);
      }
      this._setStyles(config);
    },
    setDimensions: function(width, height) {
      this._width = width;
      this._height = height;
      this.canvas.width = this.shadowCanvas.width = width;
      this.canvas.height = this.shadowCanvas.height = height;
    },
    _clear: function() {
      this.shadowCtx.clearRect(0, 0, this._width, this._height);
      this.ctx.clearRect(0, 0, this._width, this._height);
    },
    _setStyles: function(config) {
      this._blur = (config.blur == 0)?0:(config.blur || config.defaultBlur);

      if (config.backgroundColor) {
        this.canvas.style.backgroundColor = config.backgroundColor;
      }

      this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width;
      this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height;


      this._opacity = (config.opacity || 0) * 255;
      this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
      this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
      this._useGradientOpacity = !!config.useGradientOpacity;
    },
    _drawAlpha: function(data) {
      var min = this._min = data.min;
      var max = this._max = data.max;
      var data = data.data || [];
      var dataLen = data.length;
      // on a point basis?
      var blur = 1 - this._blur;

      while(dataLen--) {

        var point = data[dataLen];

        var x = point.x;
        var y = point.y;
        var radius = point.radius;
        // if value is bigger than max
        // use max as value
        var value = Math.min(point.value, max);
        var rectX = x - radius;
        var rectY = y - radius;
        var shadowCtx = this.shadowCtx;




        var tpl;
        if (!this._templates[radius]) {
          this._templates[radius] = tpl = _getPointTemplate(radius, blur);
        } else {
          tpl = this._templates[radius];
        }
        // value from minimum / value range
        // => [0, 1]
        var templateAlpha = (value-min)/(max-min);
        // this fixes #176: small values are not visible because globalAlpha < .01 cannot be read from imageData
        shadowCtx.globalAlpha = templateAlpha < .01 ? .01 : templateAlpha;

        shadowCtx.drawImage(tpl, rectX, rectY);

        // update renderBoundaries
        if (rectX < this._renderBoundaries[0]) {
            this._renderBoundaries[0] = rectX;
          }
          if (rectY < this._renderBoundaries[1]) {
            this._renderBoundaries[1] = rectY;
          }
          if (rectX + 2*radius > this._renderBoundaries[2]) {
            this._renderBoundaries[2] = rectX + 2*radius;
          }
          if (rectY + 2*radius > this._renderBoundaries[3]) {
            this._renderBoundaries[3] = rectY + 2*radius;
          }

      }
    },
    _colorize: function() {
      var x = this._renderBoundaries[0];
      var y = this._renderBoundaries[1];
      var width = this._renderBoundaries[2] - x;
      var height = this._renderBoundaries[3] - y;
      var maxWidth = this._width;
      var maxHeight = this._height;
      var opacity = this._opacity;
      var maxOpacity = this._maxOpacity;
      var minOpacity = this._minOpacity;
      var useGradientOpacity = this._useGradientOpacity;

      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x + width > maxWidth) {
        width = maxWidth - x;
      }
      if (y + height > maxHeight) {
        height = maxHeight - y;
      }

      var img = this.shadowCtx.getImageData(x, y, width, height);
      var imgData = img.data;
      var len = imgData.length;
      var palette = this._palette;


      for (var i = 3; i < len; i+= 4) {
        var alpha = imgData[i];
        var offset = alpha * 4;


        if (!offset) {
          continue;
        }

        var finalAlpha;
        if (opacity > 0) {
          finalAlpha = opacity;
        } else {
          if (alpha < maxOpacity) {
            if (alpha < minOpacity) {
              finalAlpha = minOpacity;
            } else {
              finalAlpha = alpha;
            }
          } else {
            finalAlpha = maxOpacity;
          }
        }

        imgData[i-3] = palette[offset];
        imgData[i-2] = palette[offset + 1];
        imgData[i-1] = palette[offset + 2];
        imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha;

      }

      img.data = imgData;
      this.ctx.putImageData(img, x, y);

      this._renderBoundaries = [1000, 1000, 0, 0];

    },
    getValueAt: function(point) {
      var value;
      var shadowCtx = this.shadowCtx;
      var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
      var data = img.data[3];
      var max = this._max;
      var min = this._min;

      value = (Math.abs(max-min) * (data/255)) >> 0;

      return value;
    },
    getDataURL: function() {
      return this.canvas.toDataURL();
    }
  };


  return Canvas2dRenderer;
})();


var Renderer = (function RendererClosure() {

  var rendererFn = false;

  if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
    rendererFn = Canvas2dRenderer;
  }

  return rendererFn;
})();


var Util = {
  merge: function() {
    var merged = {};
    var argsLen = arguments.length;
    for (var i = 0; i < argsLen; i++) {
      var obj = arguments[i]
      for (var key in obj) {
        merged[key] = obj[key];
      }
    }
    return merged;
  }
};
// Heatmap Constructor
var Heatmap = (function HeatmapClosure() {

  var Coordinator = (function CoordinatorClosure() {

    function Coordinator() {
      this.cStore = {};
    };

    Coordinator.prototype = {
      on: function(evtName, callback, scope) {
        var cStore = this.cStore;

        if (!cStore[evtName]) {
          cStore[evtName] = [];
        }
        cStore[evtName].push((function(data) {
            return callback.call(scope, data);
        }));
      },
      emit: function(evtName, data) {
        var cStore = this.cStore;
        if (cStore[evtName]) {
          var len = cStore[evtName].length;
          for (var i=0; i<len; i++) {
            var callback = cStore[evtName][i];
            callback(data);
          }
        }
      }
    };

    return Coordinator;
  })();


  var _connect = function(scope) {
    var renderer = scope._renderer;
    var coordinator = scope._coordinator;
    var store = scope._store;

    coordinator.on('renderpartial', renderer.renderPartial, renderer);
    coordinator.on('renderall', renderer.renderAll, renderer);
    coordinator.on('extremachange', function(data) {
      scope._config.onExtremaChange &&
      scope._config.onExtremaChange({
        min: data.min,
        max: data.max,
        gradient: scope._config['gradient'] || scope._config['defaultGradient']
      });
    });
    store.setCoordinator(coordinator);
  };


  function Heatmap() {
    var config = this._config = Util.merge(HeatmapConfig, arguments[0] || {});
    this._coordinator = new Coordinator();
    if (config['plugin']) {
      var pluginToLoad = config['plugin'];
      if (!HeatmapConfig.plugins[pluginToLoad]) {
        throw new Error('Plugin \''+ pluginToLoad + '\' not found. Maybe it was not registered.');
      } else {
        var plugin = HeatmapConfig.plugins[pluginToLoad];
        // set plugin renderer and store
        this._renderer = new plugin.renderer(config);
        this._store = new plugin.store(config);
      }
    } else {
      this._renderer = new Renderer(config);
      this._store = new Store(config);
    }
    _connect(this);
  };

  // @TODO:
  // add API documentation
  Heatmap.prototype = {
    addData: function() {
      this._store.addData.apply(this._store, arguments);
      return this;
    },
    removeData: function() {
      this._store.removeData && this._store.removeData.apply(this._store, arguments);
      return this;
    },
    setData: function() {
      this._store.setData.apply(this._store, arguments);
      return this;
    },
    setDataMax: function() {
      this._store.setDataMax.apply(this._store, arguments);
      return this;
    },
    setDataMin: function() {
      this._store.setDataMin.apply(this._store, arguments);
      return this;
    },
    configure: function(config) {
      this._config = Util.merge(this._config, config);
      this._renderer.updateConfig(this._config);
      this._coordinator.emit('renderall', this._store._getInternalData());
      return this;
    },
    repaint: function() {
      this._coordinator.emit('renderall', this._store._getInternalData());
      return this;
    },
    getData: function() {
      return this._store.getData();
    },
    getDataURL: function() {
      return this._renderer.getDataURL();
    },
    getValueAt: function(point) {

      if (this._store.getValueAt) {
        return this._store.getValueAt(point);
      } else  if (this._renderer.getValueAt) {
        return this._renderer.getValueAt(point);
      } else {
        return null;
      }
    }
  };

  return Heatmap;

})();


// core
var heatmapFactory = {
  create: function(config) {
    return new Heatmap(config);
  },
  register: function(pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  }
};

return heatmapFactory;


});

/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "a5a2":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_a5a2__;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "HeatmapVis", function() { return /* reexport */ HeatmapVis; });
__webpack_require__.d(__webpack_exports__, "SessionRecordingVis", function() { return /* reexport */ SessionRecordingVis; });
__webpack_require__.d(__webpack_exports__, "HsrTargetTest", function() { return /* reexport */ HsrTargetTest; });
__webpack_require__.d(__webpack_exports__, "HsrUrlTarget", function() { return /* reexport */ HsrUrlTarget; });
__webpack_require__.d(__webpack_exports__, "HeatmapEdit", function() { return /* reexport */ Edit; });
__webpack_require__.d(__webpack_exports__, "HeatmapList", function() { return /* reexport */ List; });
__webpack_require__.d(__webpack_exports__, "HeatmapManage", function() { return /* reexport */ Manage; });
__webpack_require__.d(__webpack_exports__, "SessionRecordingEdit", function() { return /* reexport */ ManageSessionRecording_Edit; });
__webpack_require__.d(__webpack_exports__, "SessionRecordingList", function() { return /* reexport */ ManageSessionRecording_List; });
__webpack_require__.d(__webpack_exports__, "SessionRecordingManage", function() { return /* reexport */ ManageSessionRecording_Manage; });
__webpack_require__.d(__webpack_exports__, "ListOfPageviews", function() { return /* reexport */ ListOfPageviews; });
__webpack_require__.d(__webpack_exports__, "HeatmapVisPage", function() { return /* reexport */ HeatmapVisPage; });
__webpack_require__.d(__webpack_exports__, "MatomoJsNotWritableAlert", function() { return /* reexport */ MatomoJsNotWritableAlert; });
__webpack_require__.d(__webpack_exports__, "Tooltip", function() { return /* reexport */ Tooltip; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=template&id=d1a5d966

const _hoisted_1 = {
  class: "heatmapVis"
};
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = {
  class: "heatmapSelection"
};
const _hoisted_4 = {
  style: {
    "display": "inline",
    "margin-right": "13.5px"
  }
};
const _hoisted_5 = ["onClick"];
const _hoisted_6 = {
  style: {
    "display": "inline",
    "margin-left": "3rem",
    "margin-right": "13.5px"
  }
};
const _hoisted_7 = ["title", "onClick"];
const _hoisted_8 = ["src", "alt"];
const _hoisted_9 = {
  class: "numSamples"
};
const _hoisted_10 = {
  class: "legendOuter"
};
const _hoisted_11 = {
  class: "legend-area"
};
const _hoisted_12 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "min"
}, "0", -1);
const _hoisted_13 = ["src"];
const _hoisted_14 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "max"
}, "0", -1);
const _hoisted_15 = {
  class: "customIframeWidth"
};
const _hoisted_16 = ["textContent"];
const _hoisted_17 = {
  class: "iframeRecordingContainer",
  ref: "iframeRecordingContainer"
};
const _hoisted_18 = {
  class: "heatmapWrapper"
};
const _hoisted_19 = {
  id: "heatmapContainer",
  ref: "heatmapContainer"
};
const _hoisted_20 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  id: "highlightDiv"
}, null, -1);
const _hoisted_21 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "loadingUnderlay"
}, null, -1);
const _hoisted_22 = {
  class: "valign-wrapper loadingInner"
};
const _hoisted_23 = {
  class: "loadingContent"
};
const _hoisted_24 = ["title"];
const _hoisted_25 = ["src", "width"];
const _hoisted_26 = {
  style: {
    "margin-top": "2rem"
  }
};
const _hoisted_27 = {
  class: "ui-confirm",
  id: "confirmDeleteHeatmapScreenshot",
  ref: "confirmDeleteHeatmapScreenshot"
};
const _hoisted_28 = ["value"];
const _hoisted_29 = ["value"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_SaveButton = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SaveButton");
  const _component_Tooltip = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Tooltip");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_1, [!!_ctx.actualNumSamples.nb_samples_device_all ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", {
    key: 0,
    innerHTML: _ctx.$sanitize(_ctx.recordedSamplesSince)
  }, null, 8, _hoisted_2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", _hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_Action')), 1), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.heatmapTypes, theHeatmapType => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["btn-flat", {
        'visActive': theHeatmapType.key === _ctx.heatmapType,
        [`heatmapType${theHeatmapType.key}`]: true
      }]),
      onClick: $event => _ctx.changeHeatmapType(theHeatmapType.key),
      key: theHeatmapType.key
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(theHeatmapType.name), 11, _hoisted_5);
  }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", _hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeviceType')), 1), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.deviceTypesWithSamples, theDeviceType => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["btn-flat", {
        'visActive': theDeviceType.key === _ctx.deviceType,
        [`deviceType${theDeviceType.key}`]: true
      }]),
      title: theDeviceType.tooltip,
      onClick: $event => _ctx.changeDeviceType(theDeviceType.key),
      key: theDeviceType.key
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
      height: "15",
      src: theDeviceType.logo,
      alt: `${_ctx.translate('DevicesDetection_Device')} ${theDeviceType.name}`
    }, null, 8, _hoisted_8), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(theDeviceType.numSamples), 1)], 10, _hoisted_7);
  }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Installation_Legend')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_11, [_hoisted_12, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
    class: "gradient",
    alt: "gradient",
    src: _ctx.gradientImgData
  }, null, 8, _hoisted_13), _hoisted_14])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    style: {
      "margin-left": "2.5rem",
      "margin-right": "13.5px"
    },
    textContent: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_Width'))
  }, null, 8, _hoisted_16), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "select",
    name: "iframewidth",
    "model-value": _ctx.customIframeWidth,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
      _ctx.customIframeWidth = $event;
      _ctx.changeIframeWidth(_ctx.customIframeWidth, true);
    }),
    options: _ctx.iframeWidthOptions
  }, null, 8, ["model-value", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_19, null, 512), _hoisted_20]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "hsrLoadingOuter",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])([{
      "height": "400px"
    }, {
      width: _ctx.iframeWidth + 'px'
    }])
  }, [_hoisted_21, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_22, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_23, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Loading')), 1)])], 4), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "aboveFoldLine",
    title: _ctx.translate('HeatmapSessionRecording_AvgAboveFoldDescription'),
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      width: _ctx.iframeWidth + 'px',
      top: _ctx.avgFold + 'px'
    })
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_AvgAboveFoldTitle', _ctx.avgFold)), 1)], 12, _hoisted_24), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.avgFold]]), _ctx.embedUrl ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("iframe", {
    key: 0,
    id: "recordingPlayer",
    ref: "recordingPlayer",
    sandbox: "allow-scripts allow-same-origin",
    referrerpolicy: "no-referrer",
    onLoad: _cache[1] || (_cache[1] = $event => _ctx.onLoaded()),
    height: "400",
    src: _ctx.embedUrl,
    width: _ctx.iframeWidth
  }, null, 40, _hoisted_25)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
    style: {
      "display": "block !important"
    },
    loading: _ctx.isLoading,
    onClick: _cache[2] || (_cache[2] = $event => _ctx.deleteScreenshot()),
    value: _ctx.translate('HeatmapSessionRecording_DeleteScreenshot')
  }, null, 8, ["loading", "value"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.showDeleteScreenshot]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_27, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteHeatmapScreenshotConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, _hoisted_28), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, _hoisted_29)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Tooltip, {
    ref: "tooltip",
    "click-count": _ctx.clickCount,
    "click-rate": _ctx.clickRate,
    "is-moves": _ctx.heatmapType === 1
  }, null, 8, ["click-count", "click-rate", "is-moves"])]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=template&id=d1a5d966

// EXTERNAL MODULE: ./plugins/HeatmapSessionRecording/node_modules/heatmap.js/build/heatmap.js
var heatmap = __webpack_require__("246e");
var heatmap_default = /*#__PURE__*/__webpack_require__.n(heatmap);

// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// EXTERNAL MODULE: external "CorePluginsAdmin"
var external_CorePluginsAdmin_ = __webpack_require__("a5a2");

// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/getIframeWindow.ts
/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getIframeWindow(iframeElement) {
  if (iframeElement && iframeElement.contentWindow) {
    return iframeElement.contentWindow;
  }
  if (iframeElement && iframeElement.contentDocument && iframeElement.contentDocument.defaultView) {
    return iframeElement.contentDocument.defaultView;
  }
  return undefined;
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/oneAtATime.ts
/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function oneAtATime(method, options) {
  let abortController = null;
  return (params, postParams) => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    abortController = new AbortController();
    return external_CoreHome_["AjaxHelper"].post(Object.assign(Object.assign({}, params), {}, {
      method
    }), postParams, Object.assign(Object.assign({}, options), {}, {
      abortController
    })).finally(() => {
      abortController = null;
    });
  };
}
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue?vue&type=template&id=6a6ace20

const Tooltipvue_type_template_id_6a6ace20_hoisted_1 = {
  class: "tooltip-item"
};
const Tooltipvue_type_template_id_6a6ace20_hoisted_2 = {
  class: "tooltip-label"
};
const Tooltipvue_type_template_id_6a6ace20_hoisted_3 = {
  class: "tooltip-value"
};
const Tooltipvue_type_template_id_6a6ace20_hoisted_4 = {
  class: "tooltip-item"
};
const Tooltipvue_type_template_id_6a6ace20_hoisted_5 = {
  class: "tooltip-label"
};
const Tooltipvue_type_template_id_6a6ace20_hoisted_6 = {
  class: "tooltip-value"
};
function Tooltipvue_type_template_id_6a6ace20_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    ref: "tooltipRef",
    class: "tooltip",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])(_ctx.tooltipStyle)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Tooltipvue_type_template_id_6a6ace20_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_6a6ace20_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickCountTranslation), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_6a6ace20_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickCount), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Tooltipvue_type_template_id_6a6ace20_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_6a6ace20_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickRateTranslation), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_6a6ace20_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickRate), 1)])], 4)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.visible]]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue?vue&type=template&id=6a6ace20

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue?vue&type=script&lang=ts


/* harmony default export */ var Tooltipvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    clickCount: {
      type: Number,
      required: true
    },
    clickRate: {
      type: Number,
      required: true
    },
    isMoves: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {
    const state = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["reactive"])({
      visible: false,
      position: {
        top: 0,
        left: 0
      }
    });
    const tooltipRef = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["ref"])(null);
    const tooltipStyle = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => ({
      top: `${state.position.top}px`,
      left: `${state.position.left}px`,
      position: 'absolute',
      zIndex: 1000
    }));
    function show(event) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      state.position.top = event.clientY + scrollTop + 10;
      state.position.left = event.clientX + scrollLeft + 10;
      state.visible = true;
      Object(external_commonjs_vue_commonjs2_vue_root_Vue_["nextTick"])(() => {
        const tooltipElement = tooltipRef.value;
        if (tooltipElement) {
          const {
            innerWidth,
            innerHeight
          } = window;
          const tooltipRect = tooltipElement.getBoundingClientRect();
          if (tooltipRect.right > innerWidth) {
            state.position.left = event.clientX + scrollLeft - tooltipRect.width - 10;
          }
          if (tooltipRect.bottom > innerHeight) {
            state.position.top = event.clientY + scrollTop - tooltipRect.height - 10;
          }
          const adjustedTooltipRect = tooltipElement.getBoundingClientRect();
          if (adjustedTooltipRect.left < 0) {
            state.position.left = scrollLeft + 10;
          }
          if (adjustedTooltipRect.top < 0) {
            state.position.top = scrollTop + 10;
          }
        }
      });
    }
    function hide() {
      state.visible = false;
    }
    return Object.assign(Object.assign({}, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toRefs"])(state)), {}, {
      tooltipRef,
      show,
      hide,
      tooltipStyle,
      translate: external_CoreHome_["translate"]
    });
  },
  computed: {
    getClickCount() {
      return external_CoreHome_["NumberFormatter"].formatNumber(this.clickCount);
    },
    getClickRate() {
      return external_CoreHome_["NumberFormatter"].formatPercent(this.clickRate);
    },
    getClickCountTranslation() {
      const translation = this.isMoves ? 'HeatmapSessionRecording_Moves' : 'HeatmapSessionRecording_Clicks';
      return Object(external_CoreHome_["translate"])(translation);
    },
    getClickRateTranslation() {
      const translation = this.isMoves ? 'HeatmapSessionRecording_MoveRate' : 'HeatmapSessionRecording_ClickRate';
      return Object(external_CoreHome_["translate"])(translation);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue



Tooltipvue_type_script_lang_ts.render = Tooltipvue_type_template_id_6a6ace20_render

/* harmony default export */ var Tooltip = (Tooltipvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=script&lang=ts







const {
  $
} = window;
const deviceDesktop = 1;
const deviceTablet = 2;
const deviceMobile = 3;
let heightPerHeatmap = 32000;
const userAgent = String(window.navigator.userAgent).toLowerCase();
if (userAgent.match(/(iPod|iPhone|iPad|Android|IEMobile|Windows Phone)/i)) {
  heightPerHeatmap = 2000;
} else if (userAgent.indexOf('msie ') > 0 || userAgent.indexOf('trident/') > 0 || userAgent.indexOf('edge') > 0) {
  heightPerHeatmap = 8000;
}
function initHeatmap(recordingPlayer, heatmapContainer,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
recordingIframe) {
  const $iframe = $(recordingPlayer);
  // we first set the iframe to the initial 400px again so we can for sure detect the current
  // height of the inner iframe body correctly
  $iframe.css('height', '400px');
  const documentHeight = recordingIframe.getIframeHeight();
  $iframe.css('height', `${documentHeight}px`);
  $(heatmapContainer).css('height', `${documentHeight}px`).css('width', `${$iframe.width()}px`).empty();
  const numHeatmaps = Math.ceil(documentHeight / heightPerHeatmap);
  for (let i = 1; i <= numHeatmaps; i += 1) {
    let height = heightPerHeatmap;
    if (i === numHeatmaps) {
      height = documentHeight % heightPerHeatmap;
    }
    $(heatmapContainer).append(`<div id="heatmap${i}" class="heatmapTile"></div>`);
    $(heatmapContainer).find(`#heatmap${i}`).css({
      height: `${height}px`
    });
  }
  return numHeatmaps;
}
function scrollHeatmap(iframeRecordingContainer, recordingPlayer,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
recordingIframe, scrollReaches) {
  const $iframe = $(recordingPlayer);
  // we first set the iframe to the initial 400px again so we can for sure detect the current
  // height of the inner iframe body correctly
  $iframe.css('height', '400px');
  const documentHeight = recordingIframe.getIframeHeight();
  $iframe.css('height', `${documentHeight}px`);
  const numIntervals = 1000;
  const heightToIntervalRatio = documentHeight / numIntervals;
  const numViewersTotal = scrollReaches.reduce((pv, cv) => pv + parseInt(cv.value, 10), 0);
  const buckets = [];
  let num_viewers = 0;
  let lastBucket = null;
  let percentage = 100;
  let reachScrolledFromPosition = 0;
  // reachScrolledFromPosition we start from 0, and then always paint to the next bucket. eg when
  // scrollReach is 27 and scrollDepth is 35, then we know that 27 people have scrolled down to
  // 3.5% of the page.
  scrollReaches.forEach(scrollReachObj => {
    // the number of people that reached this point
    const scrollReach = parseInt(scrollReachObj.value, 10);
    // how far down they scrolled
    const scrollDepth = parseInt(scrollReachObj.label, 10);
    const reachScrolledToPosition = Math.round(scrollDepth * heightToIntervalRatio);
    if (lastBucket && lastBucket.position === reachScrolledToPosition) {
      // when page is < 1000 we need to aggregate buckets
      num_viewers += scrollReach;
    } else {
      if (numViewersTotal !== 0) {
        percentage = (numViewersTotal - num_viewers) / numViewersTotal * 100;
      }
      num_viewers += scrollReach;
      // percentage.toFixed(1) * 10 => convert eg 99.8 => 998
      lastBucket = {
        percentageValue: parseFloat(percentage.toFixed(1)) * 10,
        position: reachScrolledFromPosition,
        percent: percentage.toFixed(1)
      };
      buckets.push(lastBucket);
    }
    reachScrolledFromPosition = reachScrolledToPosition;
  });
  function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }
  function mapColorIntensity(intensity, min, max) {
    if (min === max || !min && !max) {
      return [255, 255, 0];
    }
    const cint = map(intensity, min, max, 0, 255);
    const step = (max - min) / 5;
    if (cint > 204) {
      return [255, map(intensity, max - step, max, 255, 0), 0];
    }
    if (cint > 153) {
      return [map(intensity, max - 2 * step, max - step, 0, 255), 255, 0];
    }
    if (cint > 102) {
      return [0, 255, map(intensity, max - 3 * step, max - 2 * step, 255, 0)];
    }
    if (cint > 51) {
      return [0, map(intensity, max - 4 * step, max - 3 * step, 0, 255), 255];
    }
    return [map(intensity, min, max - 4 * step, 255, 0), 0, 255];
  }
  if (buckets.length) {
    // we need to make sure to draw scroll heatmap over full page
    const found = buckets.some(b => b.position === 0);
    if (!found) {
      buckets.unshift({
        percent: '100.0',
        percentageValue: 1000,
        position: 0
      });
    }
  } else {
    // we'll show full page as not scrolled
    buckets.push({
      percent: '0',
      percentageValue: 0,
      position: 0
    });
  }
  let minValue = 0;
  const maxValue = 1000; // max value is always 1000 (=100%)
  if (buckets && buckets.length && buckets[0]) {
    minValue = buckets[buckets.length - 1].percentageValue;
  }
  const iframeWidth = $iframe.width();
  let nextBucket = null;
  for (let index = 0; index < buckets.length; index += 1) {
    const bucket = buckets[index];
    if (buckets[index + 1]) {
      nextBucket = buckets[index + 1];
    } else {
      nextBucket = {
        position: documentHeight
      };
    }
    const top = bucket.position;
    let height = nextBucket.position - bucket.position;
    if (height === 0) {
      height = 1; // make sure to draw at least one px
    }
    const percent = `${bucket.percent} percent reached this point`;
    const colorValues = mapColorIntensity(bucket.percentageValue, minValue, maxValue);
    const color = `rgb(${colorValues.join(',')})`;
    $(iframeRecordingContainer).append(`<div class="scrollHeatmapLeaf" title="${percent}" style="width: ${iframeWidth}px;height:` + ` ${height}px;left: 0;top: ${top}px; background-color: ${color};"></div>`);
  }
  $('.scrollHeatmapLeaf', iframeRecordingContainer).tooltip({
    track: true,
    items: '*',
    tooltipClass: 'heatmapTooltip',
    show: false,
    hide: false
  });
  $('.legend-area .min').text(`${(minValue / 10).toFixed(1)}%`);
  $('.legend-area .max').text(`${(maxValue / 10).toFixed(1)}%`);
}
function actualRenderHeatmap(recordingPlayer, heatmapContainer,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
recordingIframe, dataPoints) {
  const numHeatmaps = initHeatmap(recordingPlayer, heatmapContainer, recordingIframe);
  const legendCanvas = document.createElement('canvas');
  legendCanvas.width = 100;
  legendCanvas.height = 10;
  const min = document.querySelector('.legend-area .min');
  const max = document.querySelector('.legend-area .max');
  const gradientImg = document.querySelector('.legend-area .gradient');
  const legendCtx = legendCanvas.getContext('2d');
  let gradientCfg = {};
  function updateLegend(data) {
    // the onExtremaChange callback gives us min, max, and the gradientConfig
    // so we can update the legend
    min.innerHTML = `${data.min}`;
    max.innerHTML = `${data.max}`;
    // regenerate gradient image
    if (data.gradient && data.gradient !== gradientCfg) {
      gradientCfg = data.gradient;
      const gradient = legendCtx.createLinearGradient(0, 0, 100, 1);
      Object.keys(gradientCfg).forEach(key => {
        gradient.addColorStop(parseFloat(key), gradientCfg[key]);
      });
      legendCtx.fillStyle = gradient;
      legendCtx.fillRect(0, 0, 100, 10);
      gradientImg.src = legendCanvas.toDataURL();
    }
  }
  const heatmapInstances = [];
  for (let i = 1; i <= numHeatmaps; i += 1) {
    const dpoints = {
      min: dataPoints.min,
      max: dataPoints.max,
      data: []
    };
    const config = {
      container: document.getElementById(`heatmap${i}`),
      radius: 10,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75
    };
    if (i === 1) {
      config.onExtremaChange = updateLegend; // typing is wrong here
    }
    if (dataPoints && dataPoints.data && dataPoints.data.length >= 20000) {
      config.radius = 8;
    } else if (dataPoints && dataPoints.data && dataPoints.data.length >= 2000) {
      config.radius = 9;
    }
    if (numHeatmaps === 1) {
      dpoints.data = dataPoints.data;
    } else {
      const lowerLimit = (i - 1) * heightPerHeatmap;
      const upperLimit = lowerLimit + heightPerHeatmap - 1;
      dataPoints.data.forEach(dp => {
        if (dp.y >= lowerLimit && dp.y <= upperLimit) {
          const thePoint = Object.assign(Object.assign({}, dp), {}, {
            y: dp.y - lowerLimit
          });
          dpoints.data.push(thePoint);
        }
      });
    }
    const heatmapInstance = heatmap_default.a.create(config);
    // heatmap type requires value to be number, but matomo sets it as string
    heatmapInstance.setData(dpoints);
    heatmapInstances.push(heatmapInstance);
  }
  return heatmapInstances;
}
/* harmony default export */ var HeatmapVisvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    idSiteHsr: {
      type: Number,
      required: true
    },
    deviceTypes: {
      type: Array,
      required: true
    },
    heatmapTypes: {
      type: Array,
      required: true
    },
    breakpointMobile: {
      type: Number,
      required: true
    },
    breakpointTablet: {
      type: Number,
      required: true
    },
    offsetAccuracy: {
      type: Number,
      required: true
    },
    heatmapPeriod: {
      type: String,
      required: true
    },
    heatmapDate: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    isActive: Boolean,
    numSamples: {
      type: Object,
      required: true
    },
    excludedElements: {
      type: String,
      required: true
    },
    createdDate: {
      type: String,
      required: true
    },
    desktopPreviewSize: {
      type: Number,
      required: true
    },
    iframeResolutionsValues: {
      type: Object,
      required: true
    }
  },
  components: {
    Field: external_CorePluginsAdmin_["Field"],
    SaveButton: external_CorePluginsAdmin_["SaveButton"],
    Tooltip: Tooltip
  },
  data() {
    return {
      isLoading: false,
      iframeWidth: this.desktopPreviewSize,
      customIframeWidth: this.desktopPreviewSize,
      avgFold: 0,
      heatmapType: this.heatmapTypes[0].key,
      deviceType: this.deviceTypes[0].key,
      iframeResolutions: this.iframeResolutionsValues,
      actualNumSamples: this.numSamples,
      dataCoordinates: [],
      currentElement: null,
      totalClicks: 0,
      tooltipShowTimeoutId: null,
      clickCount: 0,
      clickRate: 0
    };
  },
  setup(props) {
    const tooltip = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["ref"])(null);
    let iframeLoadedResolve = null;
    const iframeLoadedPromise = new Promise(resolve => {
      iframeLoadedResolve = resolve;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let recordingIframe = null;
    const getRecordingIframe = recordingPlayer => {
      if (!recordingIframe) {
        recordingIframe = getIframeWindow(recordingPlayer).recordingFrame;
        recordingIframe.excludeElements(props.excludedElements);
        recordingIframe.addClass('html', 'piwikHeatmap');
        recordingIframe.addClass('html', 'matomoHeatmap');
        recordingIframe.addWorkaroundForSharepointHeatmaps();
      }
      return recordingIframe;
    };
    const heatmapInstances = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["ref"])(null);
    const renderHeatmap = (recordingPlayer, heatmapContainer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theRecordingIframe, dataPoints) => {
      heatmapInstances.value = actualRenderHeatmap(recordingPlayer, heatmapContainer, theRecordingIframe, dataPoints);
    };
    return {
      iframeLoadedPromise,
      onLoaded: iframeLoadedResolve,
      getRecordedHeatmap: oneAtATime('HeatmapSessionRecording.getRecordedHeatmap'),
      getRecordedHeatmapMetadata: oneAtATime('HeatmapSessionRecording.getRecordedHeatmapMetadata'),
      getRecordingIframe,
      heatmapInstances,
      renderHeatmap,
      tooltip
    };
  },
  created() {
    if (this.iframeResolutions.indexOf(this.breakpointMobile) === -1) {
      this.iframeResolutions.push(this.breakpointMobile);
    }
    if (this.iframeResolutions.indexOf(this.breakpointTablet) === -1) {
      this.iframeResolutions.push(this.breakpointTablet);
    }
    this.iframeResolutions = this.iframeResolutions.sort((a, b) => a - b);
    this.fetchHeatmap();
    // Hide the period selector since we don't filter the heatmap by period
    external_CoreHome_["Matomo"].postEvent('hidePeriodSelector');
  },
  watch: {
    isLoading() {
      if (this.isLoading === true) {
        return;
      }
      const heatmapContainer = window.document.getElementById('heatmapContainer');
      if (!heatmapContainer) {
        return;
      }
      heatmapContainer.addEventListener('mouseleave', event => {
        // Stop processing tooltip when moving mouse out of parent element
        if (this.tooltipShowTimeoutId) {
          clearTimeout(this.tooltipShowTimeoutId);
          this.tooltipShowTimeoutId = null;
        }
        // Reset the highlight and tooltip when leaving the container
        this.currentElement = null;
        this.handleTooltip(event, 0, 0, 'hide');
        const highlightDiv = window.document.getElementById('highlightDiv');
        if (!highlightDiv) {
          return;
        }
        highlightDiv.hidden = true;
      });
      heatmapContainer.addEventListener('mousemove', e => {
        this.handleMouseMove(e);
      });
    }
  },
  beforeUnmount() {
    this.removeScrollHeatmap();
  },
  methods: {
    removeScrollHeatmap() {
      const element = this.$refs.iframeRecordingContainer;
      $(element).find('.scrollHeatmapLeaf').remove();
    },
    deleteScreenshot() {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteHeatmapScreenshot, {
        yes: () => {
          this.isLoading = true;
          external_CoreHome_["AjaxHelper"].fetch({
            method: 'HeatmapSessionRecording.deleteHeatmapScreenshot',
            idSiteHsr: this.idSiteHsr
          }).then(() => {
            this.isLoading = false;
            window.location.reload();
          });
        }
      });
    },
    fetchHeatmap() {
      this.removeScrollHeatmap();
      if (this.heatmapInstances) {
        const instances = this.heatmapInstances;
        instances.forEach(heatmapInstance => {
          heatmapInstance.setData({
            max: 1,
            min: 0,
            data: []
          });
        });
      }
      this.isLoading = true;
      this.avgFold = 0;
      const segment = external_CoreHome_["MatomoUrl"].parsed.value.segment ? decodeURIComponent(external_CoreHome_["MatomoUrl"].parsed.value.segment) : undefined;
      const requestParams = {
        idSiteHsr: this.idSiteHsr,
        heatmapType: this.heatmapType,
        deviceType: this.deviceType,
        period: this.heatmapPeriod,
        date: this.heatmapDate,
        filter_limit: -1,
        segment
      };
      const heatmapDataPromise = this.getRecordedHeatmap(requestParams);
      const heatmapMetaDataPromise = this.getRecordedHeatmapMetadata(requestParams);
      Promise.all([heatmapDataPromise, heatmapMetaDataPromise, this.iframeLoadedPromise]).then(response => {
        const iframeElement = this.$refs.recordingPlayer;
        const recordingIframe = this.getRecordingIframe(iframeElement);
        initHeatmap(this.$refs.recordingPlayer, this.$refs.heatmapContainer, recordingIframe);
        this.removeScrollHeatmap();
        const rows = response[0];
        const numSamples = response[1];
        if (Array.isArray(numSamples) && numSamples[0]) {
          [this.actualNumSamples] = numSamples;
        } else {
          this.actualNumSamples = numSamples;
        }
        this.isLoading = false;
        if (this.isScrollHeatmapType) {
          scrollHeatmap(this.$refs.iframeRecordingContainer, iframeElement, recordingIframe, rows);
        } else {
          var _this$actualNumSample;
          const dataPoints = {
            min: 0,
            max: 0,
            data: []
          };
          for (let i = 0; i < rows.length; i += 1) {
            const row = rows[i];
            if (row.selector) {
              const dataPoint = recordingIframe.getCoordinatesInFrame(row.selector, row.offset_x, row.offset_y, this.offsetAccuracy, true);
              if (dataPoint) {
                dataPoint.value = row.value;
                dataPoints.data.push(dataPoint);
                this.dataCoordinates.push(dataPoint);
                this.totalClicks += parseInt(row.value, 10);
              }
            }
          }
          if (this.heatmapType === 2) {
            // click
            let numEntriesHigherThan1 = 0;
            dataPoints.data.forEach(dp => {
              if (dp !== null && dp !== void 0 && dp.value && parseInt(dp.value, 10) > 1) {
                numEntriesHigherThan1 += 1;
              }
            });
            if (numEntriesHigherThan1 / dataPoints.data.length >= 0.10 && dataPoints.data.length > 120) {
              // if at least 10% have .value >= 2, then we set max to 2 to differntiate better
              // between 1 and 2 clicks but only if we also have more than 80 data points
              // ("randomly" chosen that threshold)
              dataPoints.max = 2;
            } else {
              dataPoints.max = 1;
            }
          } else {
            const LIMIT_MAX_DATA_POINT = 10;
            const values = {};
            dataPoints.data.forEach(dp => {
              if (!dp || !dp.value) {
                return;
              }
              let value = parseInt(dp.value, 10);
              if (value > dataPoints.max) {
                dataPoints.max = value;
              }
              if (value > LIMIT_MAX_DATA_POINT) {
                value = LIMIT_MAX_DATA_POINT;
              }
              const valueStr = `${value}`;
              if (valueStr in values) {
                values[valueStr] += 1;
              } else {
                values[valueStr] = 0;
              }
            });
            if (dataPoints.max > LIMIT_MAX_DATA_POINT) {
              // we limit it to 10 otherwise many single points are not visible etc
              // if there is no single entry having value 10, we set it to 9, 8 or 7
              // to make sure there is actually a dataPoint for this max value.
              let sumValuesAboveThreshold = 0;
              for (let k = LIMIT_MAX_DATA_POINT; k > 1; k -= 1) {
                const kStr = `${k}`;
                if (kStr in values) {
                  // we need to aggregate the value
                  sumValuesAboveThreshold += values[kStr];
                }
                if (sumValuesAboveThreshold / dataPoints.data.length >= 0.2) {
                  // we make sure to have at least 20% of entries in that max value
                  dataPoints.max = k;
                  break;
                }
                // todo ideally in this case also require that akk 2 - (k-1) have a distribution
                // of 0.2 to make sure we have enough values in between, and if not select k-1 or
                // so. Otherwise we have maybe 75% with value 1, 20% with value 10, and only 5% in
                // between... which would be barely visible those 75% maybe
              }
              if (dataPoints.max > LIMIT_MAX_DATA_POINT) {
                // when no entry has more than 15% distribution, we set a default of 5
                dataPoints.max = 5;
                for (let k = 5; k > 0; k -= 1) {
                  const kStr = `${k}`;
                  if (kStr in values) {
                    // we limit it to 10 otherwise many single points are not visible etc
                    // also if there is no single entry having value 10, we set it to 9, 8 or 7
                    // to make sure there is actually a dataPoint for this max value.
                    dataPoints.max = k;
                    break;
                  }
                }
              }
            }
          }
          this.renderHeatmap(this.$refs.recordingPlayer, this.$refs.heatmapContainer, recordingIframe, dataPoints);
          if ((_this$actualNumSample = this.actualNumSamples) !== null && _this$actualNumSample !== void 0 && _this$actualNumSample[`avg_fold_device_${this.deviceType}`]) {
            const avgFoldPercent = this.actualNumSamples[`avg_fold_device_${this.deviceType}`];
            const height = recordingIframe.getIframeHeight();
            if (height) {
              this.avgFold = parseInt(`${avgFoldPercent / 100 * height}`, 10);
            }
          }
        }
      }).finally(() => {
        this.isLoading = false;
      });
    },
    changeDeviceType(deviceType) {
      this.deviceType = deviceType;
      if (this.deviceType === deviceDesktop) {
        this.changeIframeWidth(this.desktopPreviewSize, false);
      } else if (this.deviceType === deviceTablet) {
        this.changeIframeWidth(this.breakpointTablet || 960, false);
      } else if (this.deviceType === deviceMobile) {
        this.changeIframeWidth(this.breakpointMobile || 600, false);
      }
    },
    changeIframeWidth(iframeWidth, scrollToTop) {
      this.iframeWidth = iframeWidth;
      this.customIframeWidth = this.iframeWidth;
      this.totalClicks = 0;
      this.dataCoordinates = [];
      this.fetchHeatmap();
      if (scrollToTop) {
        external_CoreHome_["Matomo"].helper.lazyScrollToContent();
      }
    },
    changeHeatmapType(heatmapType) {
      this.heatmapType = heatmapType;
      this.totalClicks = 0;
      this.clickCount = 0;
      this.clickRate = 0;
      this.dataCoordinates = [];
      this.fetchHeatmap();
    },
    handleMouseMove(event) {
      const highlightDiv = window.document.getElementById('highlightDiv');
      if (!highlightDiv) {
        return;
      }
      // Keep the tooltip from showing until the cursor has stopped moving
      if (this.tooltipShowTimeoutId) {
        clearTimeout(this.tooltipShowTimeoutId);
        this.tooltipShowTimeoutId = null;
        this.currentElement = null;
      }
      // If the highlight is visible, move the tooltip around with the cursor
      if (!highlightDiv.hidden) {
        this.handleTooltip(event, 0, 0, 'move');
      }
      const element = this.lookUpRecordedElementAtEventLocation(event);
      // If there's no element, don't do anything else
      // If the element hasn't changed, there's no need to do anything else
      if (!element || element === this.currentElement) {
        return;
      }
      this.handleTooltip(event, 0, 0, 'hide');
      highlightDiv.hidden = true;
      const elementRect = element.getBoundingClientRect();
      let elementClicks = 0;
      this.dataCoordinates.forEach(dataPoint => {
        // Return if the dataPoint isn't within the element
        if (dataPoint.y < elementRect.top || dataPoint.y > elementRect.bottom || dataPoint.x < elementRect.left || dataPoint.x > elementRect.right) {
          return;
        }
        elementClicks += parseInt(dataPoint.value, 10);
      });
      // Have a slight delay so that it's not jarring when it displays
      this.tooltipShowTimeoutId = setTimeout(() => {
        this.currentElement = element;
        highlightDiv.hidden = false;
        // Multiplying by 10000 and then dividing by 100 to get 2 decimal points of precision
        const clickRate = this.totalClicks ? Math.round(elementClicks / this.totalClicks * 10000) / 100 : 0;
        const rect = element.getBoundingClientRect();
        highlightDiv.style.top = `${rect.top}px`;
        highlightDiv.style.left = `${rect.left}px`;
        highlightDiv.style.width = `${rect.width}px`;
        highlightDiv.style.height = `${rect.height}px`;
        this.handleTooltip(event, elementClicks, clickRate, 'show');
        this.tooltipShowTimeoutId = null;
      }, 100);
    },
    lookUpRecordedElementAtEventLocation(event) {
      const targetElement = event.target;
      if (!targetElement) {
        return null;
      }
      const frameElement = window.document.getElementById('recordingPlayer');
      if (!frameElement) {
        return null;
      }
      const frameRef = frameElement.contentWindow ? frameElement.contentWindow.document : frameElement.contentDocument;
      if (!frameRef) {
        return null;
      }
      const rect = targetElement.getBoundingClientRect();
      return frameRef.elementFromPoint(event.clientX - rect.left, event.clientY - rect.top);
    },
    handleTooltip(event, clickCount, clickRate, action) {
      if (this.tooltip) {
        if (action === 'show') {
          this.clickCount = clickCount;
          this.clickRate = clickRate;
          this.tooltip.show(event);
        } else if (action === 'move') {
          this.tooltip.show(event);
        } else {
          this.tooltip.hide();
        }
      }
    }
  },
  computed: {
    isScrollHeatmapType() {
      return this.heatmapType === 3;
    },
    tokenAuth() {
      return external_CoreHome_["MatomoUrl"].parsed.value.token_auth;
    },
    embedUrl() {
      return `?${external_CoreHome_["MatomoUrl"].stringify({
        module: 'HeatmapSessionRecording',
        action: 'embedPage',
        idSite: external_CoreHome_["Matomo"].idSite,
        idSiteHsr: this.idSiteHsr,
        token_auth: this.tokenAuth || undefined
      })}`;
    },
    iframeWidthOptions() {
      return this.iframeResolutions.map(width => ({
        key: width,
        value: `${width}px`
      }));
    },
    recordedSamplesSince() {
      const string1 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapXRecordedSamplesSince', `<span class="deviceAllCountSamples">${this.actualNumSamples.nb_samples_device_all}</span>`, this.createdDate);
      const linkString = Object(external_CoreHome_["externalLink"])('https://matomo.org/faq/heatmap-session-recording/troubleshooting-heatmaps/');
      const string2 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapTroubleshoot', linkString, '</a>');
      return `${string1} ${string2}`;
    },
    deviceTypesWithSamples() {
      return this.deviceTypes.map(deviceType => {
        let numSamples;
        if (this.actualNumSamples[`nb_samples_device_${deviceType.key}`]) {
          numSamples = this.actualNumSamples[`nb_samples_device_${deviceType.key}`];
        } else {
          numSamples = 0;
        }
        const tooltip = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_XSamples', `${deviceType.name} - ${numSamples}`);
        return Object.assign(Object.assign({}, deviceType), {}, {
          numSamples,
          tooltip
        });
      });
    },
    hasWriteAccess() {
      return !!(external_CoreHome_["Matomo"] !== null && external_CoreHome_["Matomo"] !== void 0 && external_CoreHome_["Matomo"].heatmapWriteAccess);
    },
    showDeleteScreenshot() {
      return this.isActive && this.hasWriteAccess;
    },
    gradientImgData() {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAKCAYAAABCHPt+AAAAnklEQVRYR+2WQQq' + 'DQBAES5wB/f8/Y05RcMWwSu6JIT0Dm4WlH1DUdHew7/z6WYFhhnGRpnlhAEaQpi/ADbh/np0MiBhGhW+2ymFU+DZ' + 'fg1EhaoB4jCFuMYYcQKZrXwPEVvm5Og0pcYakBvI35G1jNIZ4jCHexxjSpz9ZFUjAynLbpOvqteaODkm9sloz5JF' + '+ZTVmSAWSu9Qb65AvgDwBQoLgVDlWfAQAAAAASUVORK5CYII=';
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue



HeatmapVisvue_type_script_lang_ts.render = render

/* harmony default export */ var HeatmapVis = (HeatmapVisvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/SessionRecordingVis/SessionRecordingVis.vue?vue&type=template&id=6f77b61e

const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_1 = {
  class: "sessionRecordingPlayer"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_2 = {
  class: "controls"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_3 = {
  class: "playerActions"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_4 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_5 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_6 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_7 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_8 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_9 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_10 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_11 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_12 = {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 768 768"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_13 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("path", {
  d: "M480 576.5v-321h-64.5v129h-63v-129h-64.5v192h127.5v129h64.5zM607.5 127.999c34.5 0\n              64.5 30 64.5 64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5\n              0-64.5-30-64.5-64.5v-447c0-34.5 30-64.5 64.5-64.5h447z"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_14 = [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_13];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_15 = {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 768 768"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_16 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("path", {
  d: "M448.5 576.5v-321h-129v64.5h64.5v256.5h64.5zM607.5 127.999c34.5 0 64.5 30 64.5\n              64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5 0-64.5-30-64.5-64.5v-447c0-34.5\n              30-64.5 64.5-64.5h447z"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_17 = [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_16];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_18 = {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 768 768"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_19 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("path", {
  d: "M480 384.5v-64.5c0-36-30-64.5-64.5-64.5h-127.5v64.5h127.5v64.5h-63c-34.5 0-64.5\n              27-64.5 63v129h192v-64.5h-127.5v-64.5h63c34.5 0 64.5-27 64.5-63zM607.5 127.999c34.5\n              0 64.5 30 64.5 64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5\n              0-64.5-30-64.5-64.5v-447c0-34.5 30-64.5 64.5-64.5h447z"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_20 = [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_19];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_21 = {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 768 768"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_22 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("path", {
  d: "M480 320v-64.5h-127.5c-34.5 0-64.5 28.5-64.5 64.5v192c0 36 30 64.5 64.5\n              64.5h63c34.5 0 64.5-28.5 64.5-64.5v-64.5c0-36-30-63-64.5-63h-63v-64.5h127.5zM607.5\n              127.999c34.5 0 64.5 30 64.5 64.5v447c0 34.5-30 64.5-64.5 64.5h-447c-34.5\n              0-64.5-30-64.5-64.5v-447c0-34.5 30-64.5 64.5-64.5h447zM352.5 512v-64.5h63v64.5h-63z"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_23 = [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_22];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_24 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_25 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("svg", {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  viewBox: "0 0 768 768"
}, [/*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("path", {
  d: "M223.5 415.5h111l-64.5-63h-46.5v63zM72 72l624 624-42 40.5-88.5-90c-51 36-114\n              57-181.5 57-177 0-319.5-142.5-319.5-319.5 0-67.5 21-130.5 57-181.5l-90-88.5zM544.5\n              352.5h-111l-231-231c51-36 114-57 181.5-57 177 0 319.5 142.5 319.5 319.5 0 67.5-21\n              130.5-57 181.5l-148.5-150h46.5v-63z"
})], -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_26 = [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_25];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_27 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_28 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("svg", {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  width: "22",
  height: "22",
  viewBox: "0 0 768 768"
}, [/*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("path", {
  d: "M544.5 609v-129h63v192h-384v96l-127.5-127.5 127.5-127.5v96h321zM223.5\n              288v129h-63v-192h384v-96l127.5 127.5-127.5 127.5v-96h-321z"
})], -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_29 = [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_28];
const _hoisted_30 = {
  class: "duration"
};
const _hoisted_31 = {
  class: "playerHelp"
};
const _hoisted_32 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "clickEvent"
}, null, -1);
const _hoisted_33 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "moveEvent"
}, null, -1);
const _hoisted_34 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "scrollEvent"
}, null, -1);
const _hoisted_35 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "resizeEvent"
}, null, -1);
const _hoisted_36 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "formChange"
}, null, -1);
const _hoisted_37 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "mutationEvent"
}, null, -1);
const _hoisted_38 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", {
  style: {
    "clear": "right"
  }
}, null, -1);
const _hoisted_39 = ["title"];
const _hoisted_40 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const _hoisted_41 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "loadingUnderlay"
}, null, -1);
const _hoisted_42 = {
  class: "valign-wrapper loadingInner"
};
const _hoisted_43 = {
  class: "loadingContent"
};
const _hoisted_44 = ["src", "width", "height"];
function SessionRecordingVisvue_type_template_id_6f77b61e_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-skip-previous",
    title: _ctx.skipPreviousButtonTitle,
    onClick: _cache[0] || (_cache[0] = $event => _ctx.loadNewRecording(_ctx.previousRecordingId))
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_4), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.previousRecordingId]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-fast-rewind",
    title: _ctx.translate('HeatmapSessionRecording_PlayerRewindFast', 10, 'J'),
    onClick: _cache[1] || (_cache[1] = $event => _ctx.jumpRelative(10, false))
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_5), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-play",
    title: _ctx.translate('HeatmapSessionRecording_PlayerPlay', 'K'),
    onClick: _cache[2] || (_cache[2] = $event => _ctx.play())
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_6), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isPlaying && !_ctx.isFinished]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-replay",
    title: _ctx.translate('HeatmapSessionRecording_PlayerReplay', 'K'),
    onClick: _cache[3] || (_cache[3] = $event => _ctx.replay())
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_7), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isPlaying && _ctx.isFinished]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-pause",
    title: _ctx.translate('HeatmapSessionRecording_PlayerPause', 'K'),
    onClick: _cache[4] || (_cache[4] = $event => _ctx.pause())
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_8), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isPlaying]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-fast-forward",
    title: _ctx.translate('HeatmapSessionRecording_PlayerForwardFast', 10, 'L'),
    onClick: _cache[5] || (_cache[5] = $event => _ctx.jumpRelative(10, true))
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_9), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "playerAction icon-skip-next",
    title: _ctx.translate('HeatmapSessionRecording_PlayerPageViewNext', _ctx.nextRecordingInfo, 'N'),
    onClick: _cache[6] || (_cache[6] = $event => _ctx.loadNewRecording(_ctx.nextRecordingId))
  }, null, 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_10), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.nextRecordingId]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "changeReplaySpeed",
    title: _ctx.translate('HeatmapSessionRecording_ChangeReplaySpeed', 'S'),
    onClick: _cache[7] || (_cache[7] = $event => _ctx.increaseReplaySpeed())
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("svg", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_12, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_14, 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.actualReplaySpeed === 4]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("svg", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_15, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_17, 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.actualReplaySpeed === 1]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("svg", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_18, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_20, 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.actualReplaySpeed === 2]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("svg", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_21, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_23, 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.actualReplaySpeed === 6]])], 8, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_11), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["toggleSkipPause", {
      'active': _ctx.actualSkipPausesEnabled
    }]),
    title: _ctx.translate('HeatmapSessionRecording_ClickToSkipPauses', _ctx.skipPausesEnabledText, 'B'),
    onClick: _cache[8] || (_cache[8] = $event => _ctx.toggleSkipPauses())
  }, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_26, 10, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_24), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["toggleAutoPlay", {
      'active': _ctx.actualAutoPlayEnabled
    }]),
    title: _ctx.translate('HeatmapSessionRecording_AutoPlayNextPageview', _ctx.autoplayEnabledText, 'A'),
    onClick: _cache[9] || (_cache[9] = $event => _ctx.toggleAutoPlay())
  }, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_29, 10, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_30, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_PlayerDurationXofY', _ctx.positionPretty, _ctx.durationPretty)), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_31, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [_hoisted_32, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityClick')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [_hoisted_33, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityMove')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [_hoisted_34, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityScroll')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [_hoisted_35, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityResize')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [_hoisted_36, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityFormChange')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [_hoisted_37, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityPageChange')), 1)])])]), _hoisted_38]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "timelineOuter",
    onClick: _cache[10] || (_cache[10] = $event => _ctx.seekEvent($event)),
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      width: `${_ctx.replayWidth}px`
    })
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "timelineInner",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      width: `${_ctx.progress}%`
    })
  }, null, 4), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.clues, (clue, index) => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      title: clue.title,
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(clue.type),
      style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
        left: `${clue.left}%`
      }),
      key: index
    }, null, 14, _hoisted_39);
  }), 128))], 4), _hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "hsrLoadingOuter",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      width: `${_ctx.replayWidth}px`,
      height: `${_ctx.replayHeight}px`
    })
  }, [_hoisted_41, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_42, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_43, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Loading')), 1)])], 4), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "replayContainerOuter",
    onClick: _cache[12] || (_cache[12] = $event => _ctx.togglePlay()),
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      height: `${_ctx.replayHeight}px`,
      width: `${_ctx.replayWidth}px`
    })
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "replayContainerInner",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])([{
      "transform-origin": "0 0"
    }, {
      transform: `scale(${_ctx.replayScale})`,
      'margin-left': `${_ctx.replayMarginLeft}px`
    }])
  }, [_ctx.embedUrl ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("iframe", {
    key: 0,
    id: "recordingPlayer",
    ref: "recordingPlayer",
    onLoad: _cache[11] || (_cache[11] = $event => _ctx.onLoaded()),
    scrolling: "no",
    sandbox: "allow-scripts allow-same-origin",
    referrerpolicy: "no-referrer",
    src: _ctx.embedUrl,
    width: _ctx.recording.viewport_w_px,
    height: _ctx.recording.viewport_h_px
  }, null, 40, _hoisted_44)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 4)], 4)]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/SessionRecordingVis/SessionRecordingVis.vue?vue&type=template&id=6f77b61e

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/SessionRecordingVis/SessionRecordingVis.vue?vue&type=script&lang=ts



const FRAME_STEP = 20;
const EVENT_TYPE_MOVEMENT = 1;
const EVENT_TYPE_CLICK = 2;
const EVENT_TYPE_SCROLL = 3;
const EVENT_TYPE_RESIZE = 4;
const EVENT_TYPE_INITIAL_DOM = 5;
const EVENT_TYPE_MUTATION = 6;
const EVENT_TYPE_FORM_TEXT = 9;
const EVENT_TYPE_FORM_VALUE = 10;
const EVENT_TYPE_SCROLL_ELEMENT = 12;
const EVENT_TYPE_TO_NAME = {
  [EVENT_TYPE_CLICK]: 'clickEvent',
  [EVENT_TYPE_MOVEMENT]: 'moveEvent',
  [EVENT_TYPE_SCROLL]: 'scrollEvent',
  [EVENT_TYPE_SCROLL_ELEMENT]: 'scrollEvent',
  [EVENT_TYPE_RESIZE]: 'resizeEvent',
  [EVENT_TYPE_FORM_TEXT]: 'formChange',
  [EVENT_TYPE_FORM_VALUE]: 'formChange',
  [EVENT_TYPE_INITIAL_DOM]: 'mutationEvent',
  [EVENT_TYPE_MUTATION]: 'mutationEvent'
};
const EVENT_TYPE_TO_TITLE = {
  [EVENT_TYPE_CLICK]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityClick'),
  [EVENT_TYPE_MOVEMENT]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityMove'),
  [EVENT_TYPE_SCROLL]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityScroll'),
  [EVENT_TYPE_SCROLL_ELEMENT]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityScroll'),
  [EVENT_TYPE_RESIZE]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityResize'),
  [EVENT_TYPE_FORM_TEXT]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityFormChange'),
  [EVENT_TYPE_FORM_VALUE]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityFormChange'),
  [EVENT_TYPE_INITIAL_DOM]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityPageChange'),
  [EVENT_TYPE_MUTATION]: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ActivityPageChange')
};
const MOUSE_POINTER_HTML = `
<div class="mousePointer" style="width: 16px;height: 16px;position: absolute;z-index: 99999999;">
    <svg enable-background="new 0 0 24 24" fill="black" stroke="white" version="1.0"
        viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2"/>
    </svg>
</div>
`;
const {
  $: SessionRecordingVisvue_type_script_lang_ts_$,
  Mousetrap
} = window;
function intVal(v) {
  return typeof v === 'number' ? v : parseInt(v, 10);
}
function getEventTypeId(event) {
  if (!(event !== null && event !== void 0 && event.event_type)) {
    return undefined;
  }
  return intVal(event.event_type);
}
function toPrettyTimeFormat(milliseconds) {
  const durationSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(durationSeconds / 60);
  let secondsLeft = durationSeconds % 60;
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (secondsLeft < 10) {
    secondsLeft = `0${secondsLeft}`;
  }
  return `${minutes}:${secondsLeft}`;
}
// TODO use something like command pattern and redo actions for each action maybe for more effecient
// and better looking eeking to an earlier position in the video etc: Problem mutations can likely
// not be "undone"
/* harmony default export */ var SessionRecordingVisvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    offsetAccuracy: {
      type: Number,
      required: true
    },
    scrollAccuracy: {
      type: Number,
      required: true
    },
    autoPlayEnabled: Boolean,
    skipPausesEnabled: Boolean,
    replaySpeed: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isPlaying: false,
      progress: 0,
      isFinished: false,
      isLoading: true,
      seekTimeout: null,
      lastFramePainted: 0,
      recording: JSON.parse(JSON.stringify(window.sessionRecordingData)),
      positionPretty: '00:00',
      previousRecordingId: null,
      previousRecordingInfo: null,
      nextRecordingId: null,
      nextRecordingInfo: null,
      frame: 0,
      hasFoundPrevious: false,
      hasFoundNext: false,
      videoPlayerInterval: null,
      lastCanvasCoordinates: false,
      actualAutoPlayEnabled: !!this.autoPlayEnabled,
      replayWidth: 0,
      replayHeight: 0,
      replayScale: 0,
      replayMarginLeft: 0,
      seek: seekToFrame => seekToFrame,
      actualSkipPausesEnabled: !!this.skipPausesEnabled,
      actualReplaySpeed: this.replaySpeed
    };
  },
  setup() {
    const iframeLoaded = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["ref"])(false);
    let iframeLoadedResolve = null;
    const iframeLoadedPromise = new Promise(resolve => {
      iframeLoadedResolve = resolve;
      iframeLoaded.value = true;
    });
    const onLoaded = () => {
      setTimeout(() => {
        // just to be sure we wait for another 500ms
        iframeLoadedResolve('loaded');
      }, 500);
    };
    return {
      iframeLoadedPromise,
      onLoaded,
      iframeLoaded
    };
  },
  created() {
    this.recording.duration = intVal(this.recording.duration);
    this.recording.pageviews.forEach(pageview => {
      if (!pageview || !pageview.idloghsr) {
        return;
      }
      if (`${pageview.idloghsr}` === `${this.recording.idLogHsr}`) {
        this.hasFoundPrevious = true;
      } else if (!this.hasFoundPrevious) {
        this.previousRecordingId = pageview.idloghsr;
        this.previousRecordingInfo = [pageview.label, pageview.server_time_pretty, pageview.time_on_page_pretty].join(' - ');
      } else if (!this.hasFoundNext) {
        this.hasFoundNext = true;
        this.nextRecordingId = pageview.idloghsr;
        this.nextRecordingInfo = [pageview.label, pageview.server_time_pretty, pageview.time_on_page_pretty].join(' - ');
      }
    });
  },
  mounted() {
    Mousetrap.bind(['space', 'k'], () => {
      this.togglePlay();
    });
    Mousetrap.bind('0', () => {
      if (this.isFinished) {
        this.replay();
      }
    });
    Mousetrap.bind('p', () => {
      this.loadNewRecording(this.previousRecordingId);
    });
    Mousetrap.bind('n', () => {
      this.loadNewRecording(this.nextRecordingId);
    });
    Mousetrap.bind('s', () => {
      this.increaseReplaySpeed();
    });
    Mousetrap.bind('a', () => {
      this.toggleAutoPlay();
    });
    Mousetrap.bind('b', () => {
      this.toggleSkipPauses();
    });
    Mousetrap.bind('left', () => {
      const numSeconds = 5;
      const jumpForward = false;
      this.jumpRelative(numSeconds, jumpForward);
    });
    Mousetrap.bind('right', () => {
      const numSeconds = 5;
      const jumpForward = true;
      this.jumpRelative(numSeconds, jumpForward);
    });
    Mousetrap.bind('j', () => {
      const numSeconds = 10;
      const jumpForward = false;
      this.jumpRelative(numSeconds, jumpForward);
    });
    Mousetrap.bind('l', () => {
      const numSeconds = 10;
      const jumpForward = true;
      this.jumpRelative(numSeconds, jumpForward);
    });
    this.initViewport();
    SessionRecordingVisvue_type_script_lang_ts_$(window).on('resize', () => this.initViewport());
    this.iframeLoadedPromise.then(() => {
      this.initPlayer();
    });
    window.addEventListener('beforeunload', () => {
      // should improve reload / go to next page performance
      this.isPlaying = false;
      if (this.videoPlayerInterval) {
        clearInterval(this.videoPlayerInterval);
        this.videoPlayerInterval = null;
      }
    });
  },
  methods: {
    initPlayer() {
      const iframeElement = this.$refs.recordingPlayer;
      const recordingIframe = getIframeWindow(iframeElement).recordingFrame;
      if (!recordingIframe || !recordingIframe.isSupportedBrowser()) {
        return;
      }
      recordingIframe.addClass('html', 'piwikSessionRecording');
      recordingIframe.addClass('html', 'matomoSessionRecording');
      let $mousePointerNode = null;
      const drawMouseLine = (coordinates, color) => {
        if ($mousePointerNode) {
          $mousePointerNode.css({
            left: `${coordinates.x - 8}px`,
            top: `${coordinates.y - 8}px`
          });
        }
        if (!this.lastCanvasCoordinates) {
          return;
        }
        recordingIframe.drawLine(this.lastCanvasCoordinates.x, this.lastCanvasCoordinates.y, coordinates.x, coordinates.y, color);
        this.lastCanvasCoordinates = coordinates;
      };
      const scrollFrameTo = (xPos, yPos) => {
        if (!this.lastCanvasCoordinates || !$mousePointerNode) {
          // we cannot move the mouse pointer since we do not have the initial mouse position yet
          // only perform scroll action instead
          recordingIframe.scrollTo(xPos, yPos);
          return;
        }
        // we only move the mouse pointer but not draw a line for the mouse movement eg when user
        // scrolls we also make sure that when the next time the user moves the mouse the mouse
        // move line will be drawn from this new position
        const currentScrollTop = recordingIframe.getScrollTop();
        const currentScrollLeft = recordingIframe.getScrollLeft();
        recordingIframe.scrollTo(xPos, yPos);
        // we detect how far down or up user scrolled (or to the left or right)
        const diffScrollTop = yPos - currentScrollTop;
        const diffScrollLeft = xPos - currentScrollLeft;
        // if user scrolled eg 100px down, we also need to move the cursor down
        let newMousePointerPosLeft = diffScrollLeft + this.lastCanvasCoordinates.x;
        let newMousePointerPosTop = diffScrollTop + this.lastCanvasCoordinates.y;
        if (newMousePointerPosLeft <= 0) {
          newMousePointerPosLeft = 0;
        }
        if (newMousePointerPosTop <= 0) {
          newMousePointerPosTop = 0;
        }
        // we make sure to draw the next mouse move line  from this position. we use a blue line
        // to indicate the mouse was moved by a scroll
        drawMouseLine({
          x: newMousePointerPosLeft,
          y: newMousePointerPosTop
        }, 'blue');
      };
      const scrollElementTo = (element, xPos, yPos) => {
        if (element !== null && element !== void 0 && element.scrollTo) {
          element.scrollTo(xPos, yPos);
        } else {
          element.scrollLeft = xPos;
          element.scrollTop = yPos;
        }
      };
      let moveMouseTo = null;
      const replayEvent = event => {
        // fixes some concurrency problems etc by not continueing in the player until the current
        // action is drawn
        const {
          isPlaying
        } = this;
        this.isPlaying = false;
        const eventType = getEventTypeId(event);
        let offset = null;
        if (eventType === EVENT_TYPE_MOVEMENT) {
          if (event.selector) {
            offset = recordingIframe.getCoordinatesInFrame(event.selector, event.x, event.y, this.offsetAccuracy, false);
            if (offset) {
              moveMouseTo(offset);
            }
          }
        } else if (eventType === EVENT_TYPE_CLICK) {
          if (event.selector) {
            offset = recordingIframe.getCoordinatesInFrame(event.selector, event.x, event.y, this.offsetAccuracy, false);
            if (offset) {
              moveMouseTo(offset);
              recordingIframe.drawCircle(offset.x, offset.y, '#ff9407');
            }
          }
        } else if (eventType === EVENT_TYPE_MUTATION) {
          if (event.text) {
            recordingIframe.applyMutation(event.text);
          }
        } else if (eventType === EVENT_TYPE_SCROLL) {
          const docHeight = recordingIframe.getIframeHeight();
          const docWidth = recordingIframe.getIframeWidth();
          const yPos = parseInt(`${docHeight / this.scrollAccuracy * intVal(event.y)}`, 10);
          const xPos = parseInt(`${docWidth / this.scrollAccuracy * intVal(event.x)}`, 10);
          scrollFrameTo(xPos, yPos);
        } else if (eventType === EVENT_TYPE_SCROLL_ELEMENT) {
          if (event.selector) {
            const element = recordingIframe.findElement(event.selector);
            if (element && element.length && element[0]) {
              const eleHeight = Math.max(element[0].scrollHeight, element[0].offsetHeight, element.height(), 0);
              const eleWidth = Math.max(element[0].scrollWidth, element[0].offsetWidth, element.width(), 0);
              if (eleHeight && eleWidth) {
                const yPos = parseInt(`${eleHeight / this.scrollAccuracy * intVal(event.y)}`, 10);
                const xPos = parseInt(`${eleWidth / this.scrollAccuracy * intVal(event.x)}`, 10);
                scrollElementTo(element[0], xPos, yPos);
              }
            }
          }
        } else if (eventType === EVENT_TYPE_RESIZE) {
          this.setViewportResolution(event.x, event.y);
        } else if (eventType === EVENT_TYPE_FORM_TEXT) {
          if (event.selector) {
            const formElement = recordingIframe.findElement(event.selector);
            if (formElement.length) {
              const formAttrType = formElement.attr('type');
              if (formAttrType && `${formAttrType}`.toLowerCase() === 'file') {
                // cannot be changed to local file, would result in error
              } else {
                formElement.val(event.text).change();
              }
            }
          }
        } else if (eventType === EVENT_TYPE_FORM_VALUE) {
          if (event.selector) {
            const $field = recordingIframe.findElement(event.selector);
            if ($field.is('input')) {
              $field.prop('checked', event.text === 1 || event.text === '1');
            } else if ($field.is('select')) {
              $field.val(event.text).change();
            }
          }
        }
        this.isPlaying = isPlaying;
      };
      moveMouseTo = coordinates => {
        const resizeStage = () => {
          const stageWidth = recordingIframe.getIframeWidth();
          const stageHeight = recordingIframe.getIframeHeight();
          recordingIframe.makeSvg(stageWidth, stageHeight);
          for (let crtFrame = 0; crtFrame <= this.frame; crtFrame += FRAME_STEP) {
            if (!this.timeFrameBuckets[crtFrame]) {
              return;
            }
            this.timeFrameBuckets[crtFrame].forEach(event => {
              const eventType = getEventTypeId(event);
              if (eventType === EVENT_TYPE_MOVEMENT || eventType === EVENT_TYPE_SCROLL || eventType === EVENT_TYPE_SCROLL_ELEMENT || eventType === EVENT_TYPE_CLICK) {
                this.lastFramePainted = crtFrame;
                replayEvent(event);
              }
            });
          }
        };
        // Runs each time the DOM window resize event fires.
        // Resets the canvas dimensions to match window,
        // then draws the new borders accordingly.
        const iframeWindow = recordingIframe.getIframeWindow();
        if (!this.lastCanvasCoordinates) {
          const stageHeight = recordingIframe.getIframeHeight();
          const stageWidth = recordingIframe.getIframeWidth();
          recordingIframe.appendContent(MOUSE_POINTER_HTML);
          $mousePointerNode = recordingIframe.findElement('.mousePointer');
          recordingIframe.makeSvg(stageWidth, stageHeight);
          iframeWindow.removeEventListener('resize', resizeStage, false);
          iframeWindow.addEventListener('resize', resizeStage, false);
          this.lastCanvasCoordinates = coordinates;
          $mousePointerNode.css({
            left: `${coordinates.x - 8}px`,
            top: `${coordinates.y - 8}px`
          });
          return;
        }
        let scrollTop = recordingIframe.getScrollTop();
        const scrollLeft = recordingIframe.getScrollLeft();
        if (coordinates.y > scrollTop + intVal(this.recording.viewport_h_px)) {
          recordingIframe.scrollTo(scrollLeft, coordinates.y - 10);
        } else if (coordinates.y < scrollTop) {
          recordingIframe.scrollTo(scrollLeft, coordinates.y - 10);
        }
        scrollTop = recordingIframe.getScrollTop();
        if (coordinates.x > scrollLeft + intVal(this.recording.viewport_w_px)) {
          recordingIframe.scrollTo(coordinates.x - 10, scrollTop);
        } else if (coordinates.x < scrollLeft) {
          recordingIframe.scrollTo(coordinates.x - 10, scrollTop);
        }
        drawMouseLine(coordinates, '#ff9407');
      };
      this.seek = seekToFrame => {
        if (!this.iframeLoaded) {
          return;
        }
        // this operation may take a while so we want to stop any interval and further action
        // until this is completed
        this.isLoading = true;
        let previousFrame = this.frame;
        const executeSeek = thePreviousFrame => {
          for (let crtFrame = thePreviousFrame; crtFrame <= this.frame; crtFrame += FRAME_STEP) {
            (this.timeFrameBuckets[crtFrame] || []).forEach(event => {
              this.lastFramePainted = crtFrame;
              replayEvent(event);
            });
          }
        };
        this.isFinished = false;
        this.frame = seekToFrame - seekToFrame % FRAME_STEP;
        this.progress = parseFloat(parseFloat(`${this.frame / intVal(this.recording.duration) * 100}`).toFixed(2));
        this.positionPretty = toPrettyTimeFormat(this.frame);
        if (previousFrame > this.frame) {
          // we start replaying the video from the beginning
          previousFrame = 0;
          this.lastCanvasCoordinates = false;
          if (this.initialMutation) {
            recordingIframe.initialMutation(this.initialMutation.text);
          }
          recordingIframe.scrollTo(0, 0);
          this.setViewportResolution(window.sessionRecordingData.viewport_w_px, window.sessionRecordingData.viewport_h_px);
          if (this.seekTimeout) {
            clearTimeout(this.seekTimeout);
            this.seekTimeout = null;
            // make sure when user goes to previous position and we have a timeout to not execute
            // it multiple times
          }
          (thePreviousFrame => {
            this.seekTimeout = setTimeout(() => {
              executeSeek(thePreviousFrame);
              this.isLoading = false;
            }, 1050);
          })(previousFrame);
        } else {
          // otherwise we instead play fast forward all new actions for faster performance and
          // smoother visualization etc
          if (this.seekTimeout) {
            clearTimeout(this.seekTimeout);
            this.seekTimeout = null;
          }
          executeSeek(previousFrame);
          this.isLoading = false;
        }
      };
      this.isLoading = false;
      this.isPlaying = true;
      let updateTimeCounter = 0;
      const drawFrames = () => {
        if (this.isPlaying && !this.isLoading) {
          updateTimeCounter += 1;
          const duration = intVal(this.recording.duration);
          if (this.frame >= duration) {
            this.isPlaying = false;
            this.progress = 100;
            this.isFinished = true;
            this.positionPretty = this.durationPretty;
            if (this.actualAutoPlayEnabled && this.nextRecordingId) {
              this.loadNewRecording(this.nextRecordingId);
            }
          } else {
            this.progress = parseFloat(parseFloat(`${this.frame / duration * 100}`).toFixed(2));
            if (updateTimeCounter === 20) {
              updateTimeCounter = 0;
              this.positionPretty = toPrettyTimeFormat(this.frame);
            }
          }
          (this.timeFrameBuckets[this.frame] || []).forEach(event => {
            // remember when we last painted a frame
            this.lastFramePainted = this.frame;
            replayEvent(event);
          });
          if (this.actualSkipPausesEnabled && this.frame - this.lastFramePainted > 1800) {
            // after 1.8 seconds of not painting anything, move forward to next action
            let keys = Object.keys(this.timeFrameBuckets).map(k => parseInt(k, 10));
            keys = keys.sort((a, b) => a - b);
            const nextFrameKey = keys.find(key => key > this.frame);
            const hasNextFrame = !!nextFrameKey;
            if (nextFrameKey) {
              const isMoreThan1SecInFuture = nextFrameKey - this.frame > 1000;
              if (isMoreThan1SecInFuture) {
                // we set the pointer foward to the next frame printable
                // we only move forward if we can save at least one second.
                // we set the cursor to shortly before the next action.
                this.frame = nextFrameKey - 20 * FRAME_STEP;
              }
            }
            // if no frame found, skip to the end of the recording
            if (!hasNextFrame) {
              const isMoreThan1SecInFuture = duration - this.frame > 1000;
              if (isMoreThan1SecInFuture) {
                // we don't set it to very end to still have something to play
                this.frame = duration - 20 * FRAME_STEP;
              }
            }
          }
          this.frame += FRAME_STEP;
        }
      };
      this.videoPlayerInterval = setInterval(() => {
        for (let k = 1; k <= this.actualReplaySpeed; k += 1) {
          drawFrames();
        }
      }, FRAME_STEP);
    },
    initViewport() {
      this.replayHeight = SessionRecordingVisvue_type_script_lang_ts_$(window).height() - 48 - SessionRecordingVisvue_type_script_lang_ts_$('.sessionRecording .sessionRecordingHead').outerHeight(true) - SessionRecordingVisvue_type_script_lang_ts_$('.sessionRecordingPlayer .controls').outerHeight(true);
      this.replayWidth = SessionRecordingVisvue_type_script_lang_ts_$(window).width() - 48;
      const viewportwpx = intVal(this.recording.viewport_w_px);
      const viewporthpx = intVal(this.recording.viewport_h_px);
      const minReplayWidth = 400;
      if (this.replayWidth < minReplayWidth && viewportwpx > minReplayWidth) {
        this.replayWidth = minReplayWidth;
      }
      const minReplayHeight = 400;
      if (this.replayHeight < minReplayHeight && viewporthpx > minReplayHeight) {
        this.replayHeight = minReplayHeight;
      }
      let widthScale = 1;
      let heightScale = 1;
      if (viewportwpx > this.replayWidth) {
        widthScale = parseFloat(parseFloat(`${this.replayWidth / viewportwpx}`).toFixed(4));
      }
      if (viewporthpx > this.replayHeight) {
        heightScale = parseFloat(parseFloat(`${this.replayHeight / viewporthpx}`).toFixed(4));
      }
      this.replayScale = Math.min(widthScale, heightScale);
      this.replayMarginLeft = (this.replayWidth - this.replayScale * viewportwpx) / 2;
    },
    setViewportResolution(widthPx, heightPx) {
      this.recording.viewport_w_px = parseInt(`${widthPx}`, 10);
      this.recording.viewport_h_px = parseInt(`${heightPx}`, 10);
      SessionRecordingVisvue_type_script_lang_ts_$('.recordingWidth').text(widthPx);
      SessionRecordingVisvue_type_script_lang_ts_$('.recordingHeight').text(heightPx);
      this.initViewport();
    },
    increaseReplaySpeed() {
      if (this.actualReplaySpeed === 1) {
        this.actualReplaySpeed = 2;
      } else if (this.actualReplaySpeed === 2) {
        this.actualReplaySpeed = 4;
      } else if (this.actualReplaySpeed === 4) {
        this.actualReplaySpeed = 6;
      } else {
        this.actualReplaySpeed = 1;
      }
      this.updateSettings();
    },
    updateSettings() {
      external_CoreHome_["AjaxHelper"].fetch({
        module: 'HeatmapSessionRecording',
        action: 'saveSessionRecordingSettings',
        autoplay: this.actualAutoPlayEnabled ? 1 : 0,
        skippauses: this.actualSkipPausesEnabled ? 1 : 0,
        replayspeed: this.actualReplaySpeed
      }, {
        format: 'html'
      });
    },
    toggleAutoPlay() {
      this.actualAutoPlayEnabled = !this.actualAutoPlayEnabled;
      this.updateSettings();
    },
    toggleSkipPauses() {
      this.actualSkipPausesEnabled = !this.actualSkipPausesEnabled;
      this.updateSettings();
    },
    loadNewRecording(idLogHsr) {
      if (idLogHsr) {
        this.isPlaying = false;
        external_CoreHome_["MatomoUrl"].updateUrl(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
          idLogHsr: parseInt(`${idLogHsr}`, 10),
          updated: external_CoreHome_["MatomoUrl"].urlParsed.value.updated ? parseInt(external_CoreHome_["MatomoUrl"].urlParsed.value.updated, 10) + 1 : 1
        }));
      }
    },
    jumpRelative(numberSeconds, forward) {
      const framesToJump = numberSeconds * 1000;
      let newPosition;
      if (forward) {
        newPosition = this.frame + framesToJump;
        if (newPosition > this.recording.duration) {
          newPosition = intVal(this.recording.duration) - FRAME_STEP;
        }
      } else {
        newPosition = this.frame - framesToJump;
        if (newPosition < 0) {
          newPosition = 0;
        }
      }
      this.seek(newPosition);
    },
    replay() {
      this.isFinished = false;
      this.lastFramePainted = 0;
      this.seek(0);
      this.play();
    },
    pause() {
      this.isPlaying = false;
    },
    togglePlay() {
      if (this.isFinished) {
        this.replay();
      } else if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },
    seekEvent(event) {
      const offset = SessionRecordingVisvue_type_script_lang_ts_$(event.currentTarget).offset();
      const selectedPosition = event.pageX - offset.left;
      const fullWidth = this.replayWidth;
      const seekPercentage = selectedPosition / fullWidth;
      const seekPositionTime = intVal(this.recording.duration) * seekPercentage;
      this.seek(seekPositionTime);
    },
    play() {
      this.isPlaying = true;
    }
  },
  computed: {
    durationPretty() {
      return toPrettyTimeFormat(intVal(this.recording.duration));
    },
    embedUrl() {
      return `?${external_CoreHome_["MatomoUrl"].stringify({
        module: 'HeatmapSessionRecording',
        action: 'embedPage',
        idSite: this.recording.idSite,
        idLogHsr: this.recording.idLogHsr,
        idSiteHsr: this.recording.idSiteHsr,
        // NOTE: important to get the token_auth from the URL directly, since if there is no
        // token_auth there, we should send nothing. In this case, Matomo.token_auth will still
        // be set, so we can't check that variable here.
        token_auth: external_CoreHome_["MatomoUrl"].urlParsed.value.token_auth || undefined
      })}`;
    },
    skipPreviousButtonTitle() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_PlayerPageViewPrevious', this.previousRecordingInfo || '', 'P');
    },
    skipPausesEnabledText() {
      if (this.actualSkipPausesEnabled) {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_disable');
      }
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_enable');
    },
    autoplayEnabledText() {
      if (this.actualAutoPlayEnabled) {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_disable');
      }
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_enable');
    },
    recordingEvents() {
      if (!this.recording) {
        return [];
      }
      return this.recording.events.map(theEvent => {
        const eventType = getEventTypeId(theEvent);
        let {
          text
        } = theEvent;
        if ((eventType === EVENT_TYPE_INITIAL_DOM || eventType === EVENT_TYPE_MUTATION) && typeof text === 'string') {
          text = JSON.parse(text);
        }
        return Object.assign(Object.assign({}, theEvent), {}, {
          text
        });
      });
    },
    initialMutation() {
      const initialEvent = this.recordingEvents.find(e => {
        const eventType = getEventTypeId(e);
        const isMutation = eventType === EVENT_TYPE_INITIAL_DOM || eventType === EVENT_TYPE_MUTATION;
        const isInitialMutation = isMutation && (eventType === EVENT_TYPE_INITIAL_DOM || !e.time_since_load || e.time_since_load === '0');
        return isInitialMutation;
      });
      return initialEvent;
    },
    timeFrameBuckets() {
      const result = {};
      this.recordingEvents.forEach(event => {
        if (event === this.initialMutation) {
          return;
        }
        const bucket = Math.round(intVal(event.time_since_load) / FRAME_STEP) * FRAME_STEP;
        result[bucket] = result[bucket] || [];
        result[bucket].push(event);
      });
      return result;
    },
    clues() {
      const result = [];
      this.recordingEvents.forEach(event => {
        if (event === this.initialMutation) {
          return;
        }
        const eventTypeId = getEventTypeId(event);
        const eventType = EVENT_TYPE_TO_NAME[eventTypeId] || '';
        const eventTitle = EVENT_TYPE_TO_TITLE[eventTypeId] || '';
        if (eventType) {
          if ((event.time_since_load === 0 || event.time_since_load === '0') && eventType === 'moveEvent') {
            // this is the initial mouse position and we ignore it in the clues since we cannot
            // draw a line to it
            return;
          }
          result.push({
            left: parseFloat(`${intVal(event.time_since_load) / intVal(this.recording.duration) * 100}`).toFixed(2),
            type: eventType,
            title: eventTitle
          });
        }
      });
      return result;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/SessionRecordingVis/SessionRecordingVis.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/SessionRecordingVis/SessionRecordingVis.vue



SessionRecordingVisvue_type_script_lang_ts.render = SessionRecordingVisvue_type_template_id_6f77b61e_render

/* harmony default export */ var SessionRecordingVis = (SessionRecordingVisvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HsrTargetTest/HsrTargetTest.vue?vue&type=template&id=6eb3a085

const HsrTargetTestvue_type_template_id_6eb3a085_hoisted_1 = {
  class: "form-group hsrTargetTest"
};
const HsrTargetTestvue_type_template_id_6eb3a085_hoisted_2 = {
  class: "loadingPiwik loadingMatchingSteps"
};
const HsrTargetTestvue_type_template_id_6eb3a085_hoisted_3 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif",
  alt: ""
}, null, -1);
const HsrTargetTestvue_type_template_id_6eb3a085_hoisted_4 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  id: "hsrTargetValidationError"
}, null, -1);
function HsrTargetTestvue_type_template_id_6eb3a085_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HsrTargetTestvue_type_template_id_6eb3a085_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("label", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPageTestTitle')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPageTestLabel')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    type: "text",
    id: "urltargettest",
    placeholder: "http://www.example.com/",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.url = $event),
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])({
      'invalid': _ctx.url && !_ctx.matches && _ctx.isValid
    })
  }, null, 2), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vModelText"], _ctx.url]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "testInfo"
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPageTestErrorInvalidUrl')), 513), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.url && !_ctx.isValid]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "testInfo matches"
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPageTestUrlMatches')), 513), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.url && _ctx.matches && _ctx.isValid]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "testInfo notMatches"
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPageTestUrlNotMatches')), 513), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.url && !_ctx.matches && _ctx.isValid]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", HsrTargetTestvue_type_template_id_6eb3a085_hoisted_2, [HsrTargetTestvue_type_template_id_6eb3a085_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoadingTestMatchPage]])]), HsrTargetTestvue_type_template_id_6eb3a085_hoisted_4]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrTargetTest/HsrTargetTest.vue?vue&type=template&id=6eb3a085

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HsrTargetTest/HsrTargetTest.vue?vue&type=script&lang=ts



function isValidUrl(url) {
  return url.indexOf('://') > 3;
}
/* harmony default export */ var HsrTargetTestvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    includedTargets: Array
  },
  data() {
    return {
      url: '',
      matches: false,
      isLoadingTestMatchPage: false
    };
  },
  watch: {
    isValid(newVal) {
      if (!newVal) {
        this.matches = false;
      }
    },
    includedTargets() {
      this.runTest();
    },
    url() {
      this.runTest();
    }
  },
  setup() {
    return {
      testUrlMatchPages: oneAtATime('HeatmapSessionRecording.testUrlMatchPages', {
        errorElement: '#hsrTargetValidationError'
      })
    };
  },
  created() {
    // we wait for 200ms before actually sending a request as user might be still typing
    this.runTest = Object(external_CoreHome_["debounce"])(this.runTest, 200);
  },
  methods: {
    checkIsMatchingUrl() {
      if (!this.isValid) {
        return;
      }
      const url = this.targetUrl;
      const included = this.filteredIncludedTargets;
      if (!(included !== null && included !== void 0 && included.length)) {
        return;
      }
      this.isLoadingTestMatchPage = true;
      this.testUrlMatchPages({
        url
      }, {
        matchPageRules: included
      }).then(response => {
        var _this$filteredInclude;
        if (!((_this$filteredInclude = this.filteredIncludedTargets) !== null && _this$filteredInclude !== void 0 && _this$filteredInclude.length) || (response === null || response === void 0 ? void 0 : response.url) !== this.targetUrl) {
          return;
        }
        this.matches = response.matches;
      }).finally(() => {
        this.isLoadingTestMatchPage = false;
      });
    },
    runTest() {
      if (!this.isValid) {
        return;
      }
      this.checkIsMatchingUrl();
    }
  },
  computed: {
    targetUrl() {
      return (this.url || '').trim();
    },
    isValid() {
      return this.targetUrl && isValidUrl(this.targetUrl);
    },
    filteredIncludedTargets() {
      if (!this.includedTargets) {
        return undefined;
      }
      return this.includedTargets.filter(target => (target === null || target === void 0 ? void 0 : target.value) || (target === null || target === void 0 ? void 0 : target.type) === 'any').map(target => Object.assign(Object.assign({}, target), {}, {
        value: target.value ? target.value.trim() : ''
      }));
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrTargetTest/HsrTargetTest.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrTargetTest/HsrTargetTest.vue



HsrTargetTestvue_type_script_lang_ts.render = HsrTargetTestvue_type_template_id_6eb3a085_render

/* harmony default export */ var HsrTargetTest = (HsrTargetTestvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue?vue&type=template&id=4c1d8b92

const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_1 = {
  style: {
    "width": "100%"
  }
};
const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_2 = {
  name: "targetAttribute"
};
const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_3 = {
  name: "targetType"
};
const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_4 = {
  name: "targetValue"
};
const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_5 = {
  name: "targetValue2"
};
const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_6 = ["title"];
const HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_7 = ["title"];
function HsrUrlTargetvue_type_template_id_4c1d8b92_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["form-group hsrUrltarget valign-wrapper", {
      'disabled': _ctx.disableIfNoValue && !_ctx.modelValue.value
    }])
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "select",
    name: "targetAttribute",
    "model-value": _ctx.modelValue.attribute,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.$emit('update:modelValue', Object.assign(Object.assign({}, _ctx.modelValue), {}, {
      attribute: $event
    }))),
    title: _ctx.translate('HeatmapSessionRecording_Rule'),
    options: _ctx.targetAttributes,
    "full-width": true
  }, null, 8, ["model-value", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "select",
    name: "targetType",
    "model-value": _ctx.pattern_type,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => {
      _ctx.onTypeChange($event);
    }),
    options: _ctx.targetOptions[_ctx.modelValue.attribute],
    "full-width": true
  }, null, 8, ["model-value", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "text",
    name: "targetValue",
    placeholder: `eg. ${_ctx.targetExamples[_ctx.modelValue.attribute]}`,
    "model-value": _ctx.modelValue.value,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.$emit('update:modelValue', Object.assign(Object.assign({}, _ctx.modelValue), {}, {
      value: $event.trim()
    }))),
    maxlength: 500,
    "full-width": true
  }, null, 8, ["placeholder", "model-value"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.pattern_type !== 'any']])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "text",
    name: "targetValue2",
    "model-value": _ctx.modelValue.value2,
    "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.$emit('update:modelValue', Object.assign(Object.assign({}, _ctx.modelValue), {}, {
      value2: $event.trim()
    }))),
    maxlength: 500,
    "full-width": true,
    placeholder: _ctx.translate('HeatmapSessionRecording_UrlParameterValueToMatchPlaceholder')
  }, null, 8, ["model-value", "placeholder"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.modelValue.attribute === 'urlparam' && _ctx.pattern_type && _ctx.pattern_type !== 'exists' && _ctx.pattern_type !== 'not_exists']])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "icon-plus valign",
    title: _ctx.translate('General_Add'),
    onClick: _cache[4] || (_cache[4] = $event => _ctx.$emit('addUrl'))
  }, null, 8, HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_6), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.showAddUrl]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "icon-minus valign",
    title: _ctx.translate('General_Remove'),
    onClick: _cache[5] || (_cache[5] = $event => _ctx.$emit('removeUrl'))
  }, null, 8, HsrUrlTargetvue_type_template_id_4c1d8b92_hoisted_7), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.canBeRemoved]])], 2);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue?vue&type=template&id=4c1d8b92

// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/AvailableTargetPageRules.store.ts
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */


class AvailableTargetPageRules_store_AvailableTargetPageRulesStore {
  constructor() {
    _defineProperty(this, "privateState", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["reactive"])({
      rules: []
    }));
    _defineProperty(this, "state", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => Object(external_commonjs_vue_commonjs2_vue_root_Vue_["readonly"])(this.privateState)));
    _defineProperty(this, "rules", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => this.state.value.rules));
    _defineProperty(this, "initPromise", null);
  }
  init() {
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = external_CoreHome_["AjaxHelper"].fetch({
      method: 'HeatmapSessionRecording.getAvailableTargetPageRules',
      filter_limit: '-1'
    }).then(response => {
      this.privateState.rules = response;
      return this.rules.value;
    });
    return this.initPromise;
  }
}
/* harmony default export */ var AvailableTargetPageRules_store = (new AvailableTargetPageRules_store_AvailableTargetPageRulesStore());
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue?vue&type=script&lang=ts




/* harmony default export */ var HsrUrlTargetvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    canBeRemoved: Boolean,
    disableIfNoValue: Boolean,
    allowAny: Boolean,
    showAddUrl: Boolean
  },
  components: {
    Field: external_CorePluginsAdmin_["Field"]
  },
  emits: ['addUrl', 'removeUrl', 'update:modelValue'],
  created() {
    AvailableTargetPageRules_store.init();
  },
  watch: {
    modelValue(newValue) {
      if (!newValue.attribute) {
        return;
      }
      const types = this.targetOptions[newValue.attribute];
      const found = types.find(t => t.key === this.pattern_type);
      if (!found && types[0]) {
        this.onTypeChange(types[0].key);
      }
    }
  },
  computed: {
    pattern_type() {
      let result = this.modelValue.type;
      if (this.modelValue.inverted && this.modelValue.inverted !== '0') {
        result = `not_${this.modelValue.type}`;
      }
      return result;
    },
    targetAttributes() {
      return AvailableTargetPageRules_store.rules.value.map(r => ({
        key: r.value,
        value: r.name
      }));
    },
    targetOptions() {
      const result = {};
      AvailableTargetPageRules_store.rules.value.forEach(r => {
        result[r.value] = [];
        if (this.allowAny && r.value === 'url') {
          result[r.value].push({
            value: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_TargetTypeIsAny'),
            key: 'any'
          });
        }
        r.types.forEach(type => {
          result[r.value].push({
            value: type.name,
            key: type.value
          });
          result[r.value].push({
            value: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_TargetTypeIsNot', type.name),
            key: `not_${type.value}`
          });
        });
      });
      return result;
    },
    targetExamples() {
      const result = {};
      AvailableTargetPageRules_store.rules.value.forEach(r => {
        result[r.value] = r.example;
      });
      return result;
    }
  },
  methods: {
    onTypeChange(newType) {
      let inverted = 0;
      let type = newType;
      if (newType.indexOf('not_') === 0) {
        type = newType.substring('not_'.length);
        inverted = 1;
      }
      this.$emit('update:modelValue', Object.assign(Object.assign({}, this.modelValue), {}, {
        type,
        inverted
      }));
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue



HsrUrlTargetvue_type_script_lang_ts.render = HsrUrlTargetvue_type_template_id_4c1d8b92_render

/* harmony default export */ var HsrUrlTarget = (HsrUrlTargetvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=template&id=635b8e28

const Editvue_type_template_id_635b8e28_hoisted_1 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_635b8e28_hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_635b8e28_hoisted_3 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_635b8e28_hoisted_4 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_635b8e28_hoisted_5 = {
  name: "name"
};
const Editvue_type_template_id_635b8e28_hoisted_6 = {
  name: "sampleLimit"
};
const Editvue_type_template_id_635b8e28_hoisted_7 = {
  class: "form-group row"
};
const Editvue_type_template_id_635b8e28_hoisted_8 = {
  class: "col s12"
};
const Editvue_type_template_id_635b8e28_hoisted_9 = {
  class: "col s12 m6",
  style: {
    "padding-left": "0"
  }
};
const Editvue_type_template_id_635b8e28_hoisted_10 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("hr", null, null, -1);
const Editvue_type_template_id_635b8e28_hoisted_11 = {
  class: "col s12 m6"
};
const Editvue_type_template_id_635b8e28_hoisted_12 = {
  class: "form-help"
};
const Editvue_type_template_id_635b8e28_hoisted_13 = {
  class: "inline-help"
};
const Editvue_type_template_id_635b8e28_hoisted_14 = {
  name: "sampleRate"
};
const Editvue_type_template_id_635b8e28_hoisted_15 = {
  name: "excludedElements"
};
const Editvue_type_template_id_635b8e28_hoisted_16 = {
  name: "screenshotUrl"
};
const Editvue_type_template_id_635b8e28_hoisted_17 = {
  name: "breakpointMobile"
};
const Editvue_type_template_id_635b8e28_hoisted_18 = {
  name: "breakpointTablet"
};
const Editvue_type_template_id_635b8e28_hoisted_19 = {
  name: "trackManually"
};
const Editvue_type_template_id_635b8e28_hoisted_20 = ["innerHTML"];
const Editvue_type_template_id_635b8e28_hoisted_21 = {
  class: "entityCancel"
};
function Editvue_type_template_id_635b8e28_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_HsrUrlTarget = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrUrlTarget");
  const _component_HsrTargetTest = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrTargetTest");
  const _component_SaveButton = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SaveButton");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    class: "editHsr",
    "content-title": _ctx.contentTitle
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_635b8e28_hoisted_1, [Editvue_type_template_id_635b8e28_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_635b8e28_hoisted_3, [Editvue_type_template_id_635b8e28_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_UpdatingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      onSubmit: _cache[12] || (_cache[12] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr())
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "name",
      "model-value": _ctx.siteHsr.name,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.siteHsr.name = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('General_Name'),
      maxlength: 50,
      placeholder: _ctx.translate('HeatmapSessionRecording_FieldNamePlaceholder'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapNameHelp')
    }, null, 8, ["model-value", "title", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleLimit",
      "model-value": _ctx.siteHsr.sample_limit,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => {
        _ctx.siteHsr.sample_limit = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_HeatmapSampleLimit'),
      options: _ctx.sampleLimits,
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapSampleLimitHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPage')) + ":", 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_9, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.siteHsr.match_page_rules, (url, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`matchPageRules ${index} multiple`),
        key: index
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrUrlTarget, {
        "model-value": url,
        "onUpdate:modelValue": $event => _ctx.setMatchPageRule($event, index),
        onAddUrl: _cache[2] || (_cache[2] = $event => _ctx.addMatchPageRule()),
        onRemoveUrl: $event => _ctx.removeMatchPageRule(index),
        onAnyChange: _cache[3] || (_cache[3] = $event => _ctx.setValueHasChanged()),
        "allow-any": false,
        "disable-if-no-value": index > 0,
        "can-be-removed": index > 0,
        "show-add-url": true
      }, null, 8, ["model-value", "onUpdate:modelValue", "onRemoveUrl", "disable-if-no-value", "can-be-removed"])]), Editvue_type_template_id_635b8e28_hoisted_10], 2);
    }), 128))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_635b8e28_hoisted_13, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_FieldIncludedTargetsHelp')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrTargetTest, {
      "included-targets": _ctx.siteHsr.match_page_rules
    }, null, 8, ["included-targets"])])])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleRate",
      "model-value": _ctx.siteHsr.sample_rate,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => {
        _ctx.siteHsr.sample_rate = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_SampleRate'),
      options: _ctx.sampleRates,
      introduction: _ctx.translate('HeatmapSessionRecording_AdvancedOptions'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapSampleRateHelp')
    }, null, 8, ["model-value", "title", "options", "introduction", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "excludedElements",
      "model-value": _ctx.siteHsr.excluded_elements,
      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => {
        _ctx.siteHsr.excluded_elements = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_ExcludedElements'),
      maxlength: 1000,
      "inline-help": _ctx.translate('HeatmapSessionRecording_ExcludedElementsHelp')
    }, null, 8, ["model-value", "title", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_16, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "screenshotUrl",
      "model-value": _ctx.siteHsr.screenshot_url,
      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => {
        _ctx.siteHsr.screenshot_url = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_ScreenshotUrl'),
      maxlength: 300,
      disabled: !!_ctx.siteHsr.page_treemirror,
      "inline-help": _ctx.translate('HeatmapSessionRecording_ScreenshotUrlHelp')
    }, null, 8, ["model-value", "title", "disabled", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "breakpointMobile",
      "model-value": _ctx.siteHsr.breakpoint_mobile,
      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => {
        _ctx.siteHsr.breakpoint_mobile = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_BreakpointX', _ctx.translate('General_Mobile')),
      maxlength: 4,
      "inline-help": _ctx.breakpointMobileInlineHelp
    }, null, 8, ["model-value", "title", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "breakpointTablet",
      "model-value": _ctx.siteHsr.breakpoint_tablet,
      "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => {
        _ctx.siteHsr.breakpoint_tablet = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_BreakpointX', _ctx.translate('DevicesDetection_Tablet')),
      maxlength: 4,
      "inline-help": _ctx.breakpointGeneralHelp
    }, null, 8, ["model-value", "title", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "capture_manually",
      title: _ctx.translate('HeatmapSessionRecording_CaptureDomTitle'),
      "inline-help": _ctx.captureDomInlineHelp,
      "model-value": _ctx.siteHsr.capture_manually,
      "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => {
        _ctx.siteHsr.capture_manually = $event;
        _ctx.setValueHasChanged();
      })
    }, null, 8, ["title", "inline-help", "model-value"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      innerHTML: _ctx.$sanitize(_ctx.personalInformationNote)
    }, null, 8, Editvue_type_template_id_635b8e28_hoisted_20), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
      class: "createButton",
      onConfirm: _cache[10] || (_cache[10] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr()),
      disabled: _ctx.isUpdating || !_ctx.isDirty,
      saving: _ctx.isUpdating,
      value: _ctx.saveButtonText
    }, null, 8, ["disabled", "saving", "value"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_635b8e28_hoisted_21, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      onClick: _cache[11] || (_cache[11] = $event => _ctx.cancel())
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Cancel')), 1)])])], 32)]),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=template&id=635b8e28

// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrStore/HsrStore.store.ts
function HsrStore_store_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */


class HsrStore_store_HsrStore {
  constructor(context) {
    HsrStore_store_defineProperty(this, "context", void 0);
    HsrStore_store_defineProperty(this, "privateState", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["reactive"])({
      allHsrs: [],
      isLoading: false,
      isUpdating: false,
      filterStatus: ''
    }));
    HsrStore_store_defineProperty(this, "state", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => Object(external_commonjs_vue_commonjs2_vue_root_Vue_["readonly"])(this.privateState)));
    HsrStore_store_defineProperty(this, "hsrs", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => {
      if (!this.privateState.filterStatus) {
        return this.state.value.allHsrs;
      }
      return this.state.value.allHsrs.filter(hsr => hsr.status === this.privateState.filterStatus);
    }));
    // used just for the adapter
    HsrStore_store_defineProperty(this, "hsrsCloned", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => Object(external_CoreHome_["clone"])(this.hsrs.value)));
    HsrStore_store_defineProperty(this, "statusOptions", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["readonly"])([{
      key: '',
      value: Object(external_CoreHome_["translate"])('General_All')
    }, {
      key: 'active',
      value: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_StatusActive')
    }, {
      key: 'ended',
      value: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_StatusEnded')
    }, {
      key: 'paused',
      value: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_StatusPaused')
    }]));
    HsrStore_store_defineProperty(this, "fetchPromises", {});
    this.context = context;
  }
  setFilterStatus(status) {
    this.privateState.filterStatus = status;
  }
  reload() {
    this.privateState.allHsrs = [];
    this.fetchPromises = {};
    return this.fetchHsrs();
  }
  filterRules(rules) {
    return rules.filter(target => !!target && (target.value || target.type === 'any'));
  }
  getApiMethodInContext(apiMethod) {
    return `${apiMethod}${this.context}`;
  }
  fetchHsrs() {
    let method = 'HeatmapSessionRecording.getHeatmaps';
    if (this.context === 'SessionRecording') {
      method = 'HeatmapSessionRecording.getSessionRecordings';
    }
    const params = {
      method,
      filter_limit: '-1'
    };
    if (!this.fetchPromises[method]) {
      this.fetchPromises[method] = external_CoreHome_["AjaxHelper"].fetch(params);
    }
    this.privateState.isLoading = true;
    this.privateState.allHsrs = [];
    return this.fetchPromises[method].then(hsrs => {
      this.privateState.allHsrs = hsrs;
      return this.state.value.allHsrs;
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }
  findHsr(idSiteHsr) {
    // before going through an API request we first try to find it in loaded hsrs
    const found = this.state.value.allHsrs.find(hsr => hsr.idsitehsr === idSiteHsr);
    if (found) {
      return Promise.resolve(found);
    }
    // otherwise we fetch it via API
    this.privateState.isLoading = true;
    return external_CoreHome_["AjaxHelper"].fetch({
      idSiteHsr,
      method: this.getApiMethodInContext('HeatmapSessionRecording.get'),
      filter_limit: '-1'
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }
  deleteHsr(idSiteHsr) {
    this.privateState.isUpdating = true;
    this.privateState.allHsrs = [];
    return external_CoreHome_["AjaxHelper"].fetch({
      idSiteHsr,
      method: this.getApiMethodInContext('HeatmapSessionRecording.delete')
    }, {
      withTokenInUrl: true
    }).then(() => ({
      type: 'success'
    })).catch(error => ({
      type: 'error',
      message: error.message || error
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }
  completeHsr(idSiteHsr) {
    this.privateState.isUpdating = true;
    this.privateState.allHsrs = [];
    return external_CoreHome_["AjaxHelper"].fetch({
      idSiteHsr,
      method: this.getApiMethodInContext('HeatmapSessionRecording.end')
    }, {
      withTokenInUrl: true
    }).then(() => ({
      type: 'success'
    })).catch(error => ({
      type: 'error',
      message: error.message || error
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }
  createOrUpdateHsr(hsr, method) {
    const params = {
      idSiteHsr: hsr.idsitehsr,
      sampleLimit: hsr.sample_limit,
      sampleRate: hsr.sample_rate,
      excludedElements: hsr.excluded_elements ? hsr.excluded_elements.trim() : undefined,
      screenshotUrl: hsr.screenshot_url ? hsr.screenshot_url.trim() : undefined,
      breakpointMobile: hsr.breakpoint_mobile,
      breakpointTablet: hsr.breakpoint_tablet,
      minSessionTime: hsr.min_session_time,
      requiresActivity: hsr.requires_activity ? 1 : 0,
      captureKeystrokes: hsr.capture_keystrokes ? 1 : 0,
      captureDomManually: hsr.capture_manually ? 1 : 0,
      method,
      name: hsr.name.trim()
    };
    const postParams = {
      matchPageRules: this.filterRules(hsr.match_page_rules)
    };
    this.privateState.isUpdating = true;
    return external_CoreHome_["AjaxHelper"].post(params, postParams, {
      withTokenInUrl: true
    }).then(response => ({
      type: 'success',
      response
    })).catch(error => ({
      type: 'error',
      message: error.message || error
    })).finally(() => {
      this.privateState.isUpdating = false;
    });
  }
}
const HeatmapStore = new HsrStore_store_HsrStore('Heatmap');
const SessionRecordingStore = new HsrStore_store_HsrStore('SessionRecording');
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=script&lang=ts






const notificationId = 'hsrmanagement';
/* harmony default export */ var Editvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    idSiteHsr: Number,
    breakpointMobile: Number,
    breakpointTablet: Number
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    HsrUrlTarget: HsrUrlTarget,
    HsrTargetTest: HsrTargetTest,
    SaveButton: external_CorePluginsAdmin_["SaveButton"]
  },
  data() {
    return {
      isDirty: false,
      showAdvancedView: false,
      siteHsr: {}
    };
  },
  created() {
    this.init();
  },
  watch: {
    idSiteHsr(newValue) {
      if (newValue === null) {
        return;
      }
      this.init();
    }
  },
  methods: {
    removeAnyHsrNotification() {
      external_CoreHome_["NotificationsStore"].remove(notificationId);
      external_CoreHome_["NotificationsStore"].remove('ajaxHelper');
    },
    showNotification(message, context) {
      const instanceId = external_CoreHome_["NotificationsStore"].show({
        message,
        context,
        id: notificationId,
        type: 'transient'
      });
      setTimeout(() => {
        external_CoreHome_["NotificationsStore"].scrollToNotification(instanceId);
      }, 200);
    },
    showErrorFieldNotProvidedNotification(title) {
      const message = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ErrorXNotProvided', [title]);
      this.showNotification(message, 'error');
    },
    init() {
      const {
        idSiteHsr
      } = this;
      this.siteHsr = {};
      this.showAdvancedView = false;
      external_CoreHome_["Matomo"].helper.lazyScrollToContent();
      if (this.edit && idSiteHsr) {
        HeatmapStore.findHsr(idSiteHsr).then(siteHsr => {
          if (!siteHsr) {
            return;
          }
          this.siteHsr = Object(external_CoreHome_["clone"])(siteHsr);
          this.siteHsr.sample_rate = `${this.siteHsr.sample_rate}`;
          this.addInitialMatchPageRule();
          this.isDirty = false;
        });
        return;
      }
      if (this.create) {
        this.siteHsr = {
          idSite: external_CoreHome_["Matomo"].idSite,
          name: '',
          sample_rate: '10.0',
          sample_limit: 1000,
          breakpoint_mobile: this.breakpointMobile,
          breakpoint_tablet: this.breakpointTablet,
          capture_manually: 0
        };
        this.isDirty = false;
        const hashParams = external_CoreHome_["MatomoUrl"].hashParsed.value;
        if (hashParams.name) {
          this.siteHsr.name = hashParams.name;
          this.isDirty = true;
        }
        if (hashParams.matchPageRules) {
          try {
            this.siteHsr.match_page_rules = JSON.parse(hashParams.matchPageRules);
            this.isDirty = true;
          } catch (e) {
            console.log('warning: could not parse matchPageRules query param, expected JSON');
          }
        } else {
          this.addInitialMatchPageRule();
        }
      }
    },
    addInitialMatchPageRule() {
      var _this$siteHsr$match_p;
      if (!this.siteHsr) {
        return;
      }
      if ((_this$siteHsr$match_p = this.siteHsr.match_page_rules) !== null && _this$siteHsr$match_p !== void 0 && _this$siteHsr$match_p.length) {
        return;
      }
      this.addMatchPageRule();
    },
    addMatchPageRule() {
      var _this$siteHsr$match_p2;
      if (!this.siteHsr) {
        return;
      }
      if (!((_this$siteHsr$match_p2 = this.siteHsr.match_page_rules) !== null && _this$siteHsr$match_p2 !== void 0 && _this$siteHsr$match_p2.length)) {
        this.siteHsr.match_page_rules = [];
      }
      this.siteHsr.match_page_rules.push({
        attribute: 'url',
        type: 'equals_simple',
        value: '',
        inverted: 0
      });
      this.isDirty = true;
    },
    removeMatchPageRule(index) {
      if (this.siteHsr && index > -1) {
        this.siteHsr.match_page_rules = [...this.siteHsr.match_page_rules];
        this.siteHsr.match_page_rules.splice(index, 1);
        this.isDirty = true;
      }
    },
    cancel() {
      const newParams = Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value);
      delete newParams.idSiteHsr;
      external_CoreHome_["MatomoUrl"].updateHash(newParams);
    },
    createHsr() {
      this.removeAnyHsrNotification();
      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }
      HeatmapStore.createOrUpdateHsr(this.siteHsr, 'HeatmapSessionRecording.addHeatmap').then(response => {
        if (!response || response.type === 'error' || !response.response) {
          return;
        }
        this.isDirty = false;
        const idSiteHsr = response.response.value;
        HeatmapStore.reload().then(() => {
          if (external_CoreHome_["Matomo"].helper.isReportingPage()) {
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          }
          external_CoreHome_["MatomoUrl"].updateHash(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
            idSiteHsr
          }));
          setTimeout(() => {
            this.showNotification(Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapCreated'), response.type);
          }, 200);
        });
      });
    },
    setValueHasChanged() {
      this.isDirty = true;
    },
    updateHsr() {
      this.removeAnyHsrNotification();
      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }
      HeatmapStore.createOrUpdateHsr(this.siteHsr, 'HeatmapSessionRecording.updateHeatmap').then(response => {
        if (response.type === 'error') {
          return;
        }
        this.isDirty = false;
        this.siteHsr = {};
        HeatmapStore.reload().then(() => {
          this.init();
        });
        this.showNotification(Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapUpdated'), response.type);
      });
    },
    checkRequiredFieldsAreSet() {
      var _this$siteHsr$match_p3;
      if (!this.siteHsr.name) {
        const title = Object(external_CoreHome_["translate"])('General_Name');
        this.showErrorFieldNotProvidedNotification(title);
        return false;
      }
      if (!((_this$siteHsr$match_p3 = this.siteHsr.match_page_rules) !== null && _this$siteHsr$match_p3 !== void 0 && _this$siteHsr$match_p3.length) || !HeatmapStore.filterRules(this.siteHsr.match_page_rules).length) {
        const title = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ErrorPageRuleRequired');
        this.showNotification(title, 'error');
        return false;
      }
      return true;
    },
    setMatchPageRule(rule, index) {
      this.siteHsr.match_page_rules = [...this.siteHsr.match_page_rules];
      this.siteHsr.match_page_rules[index] = rule;
    }
  },
  computed: {
    sampleLimits() {
      return [1000, 2000, 5000].map(v => ({
        key: `${v}`,
        value: v
      }));
    },
    sampleRates() {
      const values = [0.1, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      return values.map(v => ({
        key: v.toFixed(1),
        value: `${v}%`
      }));
    },
    create() {
      return !this.idSiteHsr;
    },
    edit() {
      return !this.create;
    },
    editTitle() {
      const token = this.create ? 'HeatmapSessionRecording_CreateNewHeatmap' : 'HeatmapSessionRecording_EditHeatmapX';
      return token;
    },
    contentTitle() {
      return Object(external_CoreHome_["translate"])(this.editTitle, this.siteHsr.name ? `"${this.siteHsr.name}"` : '');
    },
    isLoading() {
      return HeatmapStore.state.value.isLoading;
    },
    isUpdating() {
      return HeatmapStore.state.value.isUpdating;
    },
    breakpointMobileInlineHelp() {
      const help1 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointGeneralHelp');
      const help2 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointGeneralHelpManage');
      return `${help1} ${help2}`;
    },
    breakpointGeneralHelp() {
      const help1 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointGeneralHelp');
      const help2 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointGeneralHelpManage');
      return `${help1} ${help2}`;
    },
    captureDomInlineHelp() {
      const id = this.idSiteHsr ? this.idSiteHsr : '{idHeatmap}';
      const command = `<br><br><strong>_paq.push(['HeatmapSessionRecording::captureInitialDom', ${id}])</strong>`;
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CaptureDomInlineHelp', command, '<br><br><strong>', '</strong>');
    },
    personalInformationNote() {
      const url = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-content-on-your-website';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_PersonalInformationNote', Object(external_CoreHome_["translate"])('HeatmapSessionRecording_Heatmap'), '<code>', '</code>', `<a href="${url}" target="_blank" rel="noreferrer noopener">`, '</a>');
    },
    saveButtonText() {
      return this.edit ? Object(external_CoreHome_["translate"])('CoreUpdater_UpdateTitle') : Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CreateNewHeatmap');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue



Editvue_type_script_lang_ts.render = Editvue_type_template_id_635b8e28_render

/* harmony default export */ var Edit = (Editvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue?vue&type=template&id=b53147ca

const Listvue_type_template_id_b53147ca_hoisted_1 = {
  class: "heatmapList"
};
const Listvue_type_template_id_b53147ca_hoisted_2 = {
  class: "filterStatus"
};
const Listvue_type_template_id_b53147ca_hoisted_3 = {
  class: "hsrSearchFilter",
  style: {
    "margin-left": "3.5px"
  }
};
const Listvue_type_template_id_b53147ca_hoisted_4 = {
  class: "index"
};
const Listvue_type_template_id_b53147ca_hoisted_5 = {
  class: "name"
};
const Listvue_type_template_id_b53147ca_hoisted_6 = {
  class: "creationDate"
};
const Listvue_type_template_id_b53147ca_hoisted_7 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_b53147ca_hoisted_8 = {
  class: "status"
};
const Listvue_type_template_id_b53147ca_hoisted_9 = {
  class: "action"
};
const Listvue_type_template_id_b53147ca_hoisted_10 = {
  colspan: "7"
};
const Listvue_type_template_id_b53147ca_hoisted_11 = {
  class: "loadingPiwik"
};
const Listvue_type_template_id_b53147ca_hoisted_12 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Listvue_type_template_id_b53147ca_hoisted_13 = {
  colspan: "7"
};
const Listvue_type_template_id_b53147ca_hoisted_14 = ["id"];
const Listvue_type_template_id_b53147ca_hoisted_15 = {
  class: "index"
};
const Listvue_type_template_id_b53147ca_hoisted_16 = {
  class: "name"
};
const Listvue_type_template_id_b53147ca_hoisted_17 = {
  class: "creationDate"
};
const Listvue_type_template_id_b53147ca_hoisted_18 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_b53147ca_hoisted_19 = {
  key: 0,
  class: "status status-paused"
};
const Listvue_type_template_id_b53147ca_hoisted_20 = ["title"];
const Listvue_type_template_id_b53147ca_hoisted_21 = {
  key: 1,
  class: "status"
};
const Listvue_type_template_id_b53147ca_hoisted_22 = ["title", "onClick"];
const Listvue_type_template_id_b53147ca_hoisted_23 = ["title", "onClick"];
const Listvue_type_template_id_b53147ca_hoisted_24 = ["title", "href"];
const Listvue_type_template_id_b53147ca_hoisted_25 = ["title", "onClick"];
const Listvue_type_template_id_b53147ca_hoisted_26 = {
  class: "tableActionBar"
};
const Listvue_type_template_id_b53147ca_hoisted_27 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-add"
}, null, -1);
const Listvue_type_template_id_b53147ca_hoisted_28 = {
  class: "ui-confirm",
  id: "confirmDeleteHeatmap",
  ref: "confirmDeleteHeatmap"
};
const Listvue_type_template_id_b53147ca_hoisted_29 = ["value"];
const Listvue_type_template_id_b53147ca_hoisted_30 = ["value"];
const Listvue_type_template_id_b53147ca_hoisted_31 = {
  class: "ui-confirm",
  id: "confirmEndHeatmap",
  ref: "confirmEndHeatmap"
};
const Listvue_type_template_id_b53147ca_hoisted_32 = ["value"];
const Listvue_type_template_id_b53147ca_hoisted_33 = ["value"];
function Listvue_type_template_id_b53147ca_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_EntityDuplicatorAction = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("EntityDuplicatorAction");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_EntityDuplicatorModal = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("EntityDuplicatorModal");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_b53147ca_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('HeatmapSessionRecording_ManageHeatmaps')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapUsageBenefits')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_b53147ca_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "filterStatus",
      "model-value": _ctx.filterStatus,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.setFilterStatus($event);
      }),
      title: _ctx.translate('HeatmapSessionRecording_Filter'),
      "full-width": true,
      options: _ctx.statusOptions
    }, null, 8, ["model-value", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_b53147ca_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "hsrSearch",
      title: _ctx.translate('General_Search'),
      modelValue: _ctx.searchFilter,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.searchFilter = $event),
      "full-width": true
    }, null, 8, ["title", "modelValue"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.hsrs.length > 0]])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_b53147ca_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Id')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_b53147ca_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Name')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_b53147ca_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreationDate')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_b53147ca_hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_SampleLimit')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_b53147ca_hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CorePluginsAdmin_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_b53147ca_hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Actions')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_b53147ca_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Listvue_type_template_id_b53147ca_hoisted_11, [Listvue_type_template_id_b53147ca_hoisted_12, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading || _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_b53147ca_hoisted_13, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_NoHeatmapsFound')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isLoading && _ctx.hsrs.length === 0]]), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.sortedHsrs, hsr => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        id: `hsr${hsr.idsitehsr}`,
        class: "hsrs",
        key: hsr.idsitehsr
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_b53147ca_hoisted_15, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.idsitehsr), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_b53147ca_hoisted_16, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_b53147ca_hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.created_date_pretty), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_b53147ca_hoisted_18, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.sample_limit), 1), hsr.status === 'paused' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_b53147ca_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "icon icon-help",
        title: _ctx.pauseReason
      }, null, 8, Listvue_type_template_id_b53147ca_hoisted_20)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_b53147ca_hoisted_21, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)), 1)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])({
          'action': true,
          'duplicate-available': _ctx.isEntityDuplicatorAvailable
        })
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-edit",
        title: _ctx.translate('HeatmapSessionRecording_EditX', _ctx.translate('HeatmapSessionRecording_Heatmap')),
        onClick: $event => _ctx.editHsr(hsr.idsitehsr)
      }, null, 8, Listvue_type_template_id_b53147ca_hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action stopRecording icon-drop-crossed",
        title: _ctx.translate('HeatmapSessionRecording_StopX', _ctx.translate('HeatmapSessionRecording_Heatmap')),
        onClick: $event => _ctx.completeHsr(hsr)
      }, null, 8, Listvue_type_template_id_b53147ca_hoisted_23), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], hsr.status !== 'ended']]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        target: "_blank",
        class: "table-action icon-show",
        title: _ctx.translate('HeatmapSessionRecording_ViewReport'),
        href: _ctx.getViewReportLink(hsr)
      }, null, 8, Listvue_type_template_id_b53147ca_hoisted_24), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_EntityDuplicatorAction, {
        actionFormData: {
          idSiteHsr: hsr.idsitehsr
        },
        modalStore: _ctx.entityDuplicatorStore,
        isActionVisible: _ctx.showDuplicatorAction,
        isActionEnabled: _ctx.enableDuplicatorAction,
        tooltipTextOverrideDisabled: _ctx.translate('HeatmapSessionRecording_QuotaReachedForX', _ctx.translate('HeatmapSessionRecording_Heatmap'), _ctx.translate('HeatmapSessionRecording_Heatmaps')),
        extraClasses: ['heatmap-duplicate-action', `hsr-${hsr.idsitehsr}`]
      }, null, 8, ["actionFormData", "modalStore", "isActionVisible", "isActionEnabled", "tooltipTextOverrideDisabled", "extraClasses"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-delete",
        title: _ctx.translate('HeatmapSessionRecording_DeleteX', _ctx.translate('HeatmapSessionRecording_Heatmap')),
        onClick: $event => _ctx.deleteHsr(hsr)
      }, null, 8, Listvue_type_template_id_b53147ca_hoisted_25)], 2)], 8, Listvue_type_template_id_b53147ca_hoisted_14);
    }), 128))])])), [[_directive_content_table]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_b53147ca_hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      class: "createNewHsr",
      value: "",
      onClick: _cache[2] || (_cache[2] = $event => _ctx.createHsr())
    }, [Listvue_type_template_id_b53147ca_hoisted_27, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreateNewHeatmap')), 1)])])]),
    _: 1
  }, 8, ["content-title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_b53147ca_hoisted_28, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteHeatmapConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_b53147ca_hoisted_29), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_b53147ca_hoisted_30)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_b53147ca_hoisted_31, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EndHeatmapConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_b53147ca_hoisted_32), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_b53147ca_hoisted_33)], 512)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_EntityDuplicatorModal, {
    modalStore: _ctx.entityDuplicatorStore
  }, null, 8, ["modalStore"])], 64);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue?vue&type=template&id=b53147ca

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue?vue&type=script&lang=ts




// Load these separately in case the version of core doesn't have the components yet
const EntityDuplicatorModal = Object(external_CoreHome_["useExternalPluginComponent"])('CoreHome', 'EntityDuplicatorModal');
const EntityDuplicatorAction = Object(external_CoreHome_["useExternalPluginComponent"])('CoreHome', 'EntityDuplicatorAction');
// Load the class similar to useExternalPluginComponent, but for something other than a component
let EntityDuplicatorStore = undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Object(external_CoreHome_["importPluginUmd"])('CoreHome').then(module => {
  EntityDuplicatorStore = module === null || module === void 0 ? void 0 : module.EntityDuplicatorStore;
});
/* harmony default export */ var Listvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    pauseReason: String
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    EntityDuplicatorModal,
    EntityDuplicatorAction
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
  },
  data() {
    return {
      searchFilter: '',
      showDuplicatorAction: true,
      enableDuplicatorAction: false,
      entityDuplicatorStore: typeof EntityDuplicatorStore !== 'undefined' ? EntityDuplicatorStore.buildStoreInstance('HeatmapSessionRecording_Heatmap', {
        method: 'HeatmapSessionRecording.duplicateHeatmap',
        requiredFields: ['idSite', 'idDestinationSites', 'idSiteHsr']
      }) : undefined
    };
  },
  created() {
    HeatmapStore.setFilterStatus('');
    HeatmapStore.fetchHsrs();
  },
  mounted() {
    // Check whether adding heatmaps is allowed. It will disable the action if it isn't
    this.checkIsAddingHeatmapAllowed();
    // If the adapter is defined, cast it to the expected type and override any necessary methods.
    if (this.entityDuplicatorStore) {
      const adapter = this.entityDuplicatorStore.adapter;
      adapter.onSuccessCallback = response => new Promise(resolve => {
        var _response$additionalD, _response$additionalD2, _response$additionalD3;
        // Check if reloading is even necessary. If the current site isn't a destination skip reload
        const idSite = (_response$additionalD = response.additionalData) === null || _response$additionalD === void 0 ? void 0 : _response$additionalD.idSite;
        if ((_response$additionalD2 = response.additionalData) !== null && _response$additionalD2 !== void 0 && _response$additionalD2.idSite && Array.isArray((_response$additionalD3 = response.additionalData) === null || _response$additionalD3 === void 0 ? void 0 : _response$additionalD3.idDestinationSites) && !response.additionalData.idDestinationSites.some(id => +id === +idSite)) {
          return resolve();
        }
        return HeatmapStore.reload().then(() => resolve());
      });
    }
  },
  methods: {
    createHsr() {
      this.editHsr(0);
    },
    editHsr(idSiteHsr) {
      external_CoreHome_["MatomoUrl"].updateHash(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
        idSiteHsr
      }));
    },
    deleteHsr(hsr) {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteHeatmap, {
        yes: () => {
          HeatmapStore.deleteHsr(hsr.idsitehsr).then(() => {
            HeatmapStore.reload();
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          });
        }
      });
    },
    completeHsr(hsr) {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmEndHeatmap, {
        yes: () => {
          HeatmapStore.completeHsr(hsr.idsitehsr).then(() => {
            HeatmapStore.reload();
          });
        }
      });
    },
    setFilterStatus(filter) {
      HeatmapStore.setFilterStatus(filter);
    },
    ucfirst(s) {
      return `${s[0].toUpperCase()}${s.substr(1)}`;
    },
    getViewReportLink(hsr) {
      return `?${external_CoreHome_["MatomoUrl"].stringify({
        module: 'Widgetize',
        action: 'iframe',
        moduleToWidgetize: 'HeatmapSessionRecording',
        actionToWidgetize: 'showHeatmap',
        idSiteHsr: hsr.idsitehsr,
        idSite: hsr.idsite,
        period: 'day',
        date: 'yesterday'
      })}`;
    },
    checkIsAddingHeatmapAllowed() {
      // Post event so that Billing, etc. can indicate whether adding another heatmap is allowed
      const parameters = {
        isAllowed: true
      };
      external_CoreHome_["Matomo"].postEvent('HeatmapSessionRecording.initAddHeatmap', parameters);
      this.enableDuplicatorAction = parameters && parameters.isAllowed === true;
      return !this.enableDuplicatorAction;
    }
  },
  computed: {
    filterStatus() {
      return HeatmapStore.state.value.filterStatus;
    },
    statusOptions() {
      return HeatmapStore.statusOptions;
    },
    hsrs() {
      return HeatmapStore.hsrs.value;
    },
    isLoading() {
      return HeatmapStore.state.value.isLoading;
    },
    isUpdating() {
      return HeatmapStore.state.value.isUpdating;
    },
    sortedHsrs() {
      // look through string properties of heatmaps for values that have searchFilter in them
      // (mimics angularjs filter() filter)
      const result = [...this.hsrs].filter(h => Object.keys(h).some(propName => {
        const entity = h;
        return typeof entity[propName] === 'string' && entity[propName].indexOf(this.searchFilter) !== -1;
      }));
      result.sort((lhs, rhs) => rhs.idsitehsr - lhs.idsitehsr);
      return result;
    },
    isEntityDuplicatorAvailable() {
      return typeof EntityDuplicatorStore !== 'undefined';
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue



Listvue_type_script_lang_ts.render = Listvue_type_template_id_b53147ca_render

/* harmony default export */ var List = (Listvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue?vue&type=template&id=56c7eaa3

const Managevue_type_template_id_56c7eaa3_hoisted_1 = {
  class: "manageHsr",
  ref: "root"
};
const Managevue_type_template_id_56c7eaa3_hoisted_2 = {
  key: 0
};
const Managevue_type_template_id_56c7eaa3_hoisted_3 = {
  key: 1
};
function Managevue_type_template_id_56c7eaa3_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MatomoJsNotWritableAlert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MatomoJsNotWritableAlert");
  const _component_HeatmapList = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapList");
  const _component_HeatmapEdit = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapEdit");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_MatomoJsNotWritableAlert, {
    key: 0,
    "is-matomo-js-writable": _ctx.isMatomoJsWritable,
    "recording-type": _ctx.translate('HeatmapSessionRecording_Heatmaps')
  }, null, 8, ["is-matomo-js-writable", "recording-type"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Managevue_type_template_id_56c7eaa3_hoisted_1, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_56c7eaa3_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HeatmapList, {
    "pause-reason": _ctx.pauseReason
  }, null, 8, ["pause-reason"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_56c7eaa3_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HeatmapEdit, {
    "breakpoint-mobile": _ctx.breakpointMobile,
    "breakpoint-tablet": _ctx.breakpointTablet,
    "id-site-hsr": _ctx.idSiteHsr
  }, null, 8, ["breakpoint-mobile", "breakpoint-tablet", "id-site-hsr"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 512)], 64);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue?vue&type=template&id=56c7eaa3

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/MatomoJsNotWritable/MatomoJsNotWritableAlert.vue?vue&type=template&id=3eefb154

const MatomoJsNotWritableAlertvue_type_template_id_3eefb154_hoisted_1 = ["innerHTML"];
function MatomoJsNotWritableAlertvue_type_template_id_3eefb154_render(_ctx, _cache, $props, $setup, $data, $options) {
  return !_ctx.isMatomoJsWritable ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: "alert alert-warning",
    innerHTML: _ctx.getJsNotWritableErrorMessage()
  }, null, 8, MatomoJsNotWritableAlertvue_type_template_id_3eefb154_hoisted_1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/MatomoJsNotWritable/MatomoJsNotWritableAlert.vue?vue&type=template&id=3eefb154

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/MatomoJsNotWritable/MatomoJsNotWritableAlert.vue?vue&type=script&lang=ts


/* harmony default export */ var MatomoJsNotWritableAlertvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    recordingType: {
      type: String,
      required: true
    },
    isMatomoJsWritable: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    getJsNotWritableErrorMessage() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_MatomoJSNotWritableErrorMessage', this.recordingType, '<a href="https://developer.matomo.org/guides/heatmap-session-recording/setup#when-the-matomojs-in-your-piwik-directory-file-is-not-writable" target="_blank" rel="noreferrer noopener">', '</a>');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/MatomoJsNotWritable/MatomoJsNotWritableAlert.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/MatomoJsNotWritable/MatomoJsNotWritableAlert.vue



MatomoJsNotWritableAlertvue_type_script_lang_ts.render = MatomoJsNotWritableAlertvue_type_template_id_3eefb154_render

/* harmony default export */ var MatomoJsNotWritableAlert = (MatomoJsNotWritableAlertvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue?vue&type=script&lang=ts





const {
  $: Managevue_type_script_lang_ts_$
} = window;
/* harmony default export */ var Managevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    breakpointMobile: Number,
    breakpointTablet: Number,
    pauseReason: String,
    isMatomoJsWritable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      idSiteHsr: null
    };
  },
  components: {
    MatomoJsNotWritableAlert: MatomoJsNotWritableAlert,
    HeatmapList: List,
    HeatmapEdit: Edit
  },
  watch: {
    editMode() {
      // when changing edit modes, the tooltip can sometimes get stuck on the screen
      Managevue_type_script_lang_ts_$('.ui-tooltip').remove();
    }
  },
  created() {
    // doing this in a watch because we don't want to post an event in a computed property
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["watch"])(() => external_CoreHome_["MatomoUrl"].hashParsed.value.idSiteHsr, idSiteHsr => {
      this.initState(idSiteHsr);
    });
    this.initState(external_CoreHome_["MatomoUrl"].hashParsed.value.idSiteHsr);
  },
  methods: {
    removeAnyHsrNotification() {
      external_CoreHome_["NotificationsStore"].remove('hsrmanagement');
    },
    initState(idSiteHsr) {
      if (idSiteHsr) {
        if (idSiteHsr === '0') {
          const parameters = {
            isAllowed: true
          };
          external_CoreHome_["Matomo"].postEvent('HeatmapSessionRecording.initAddHeatmap', parameters);
          if (parameters && !parameters.isAllowed) {
            this.editMode = false;
            this.idSiteHsr = null;
            return;
          }
        }
        this.editMode = true;
        this.idSiteHsr = parseInt(idSiteHsr, 10);
      } else {
        this.editMode = false;
        this.idSiteHsr = null;
      }
      this.removeAnyHsrNotification();
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue



Managevue_type_script_lang_ts.render = Managevue_type_template_id_56c7eaa3_render

/* harmony default export */ var Manage = (Managevue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=template&id=56c3e386

const Editvue_type_template_id_56c3e386_hoisted_1 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_56c3e386_hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_56c3e386_hoisted_3 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_56c3e386_hoisted_4 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_56c3e386_hoisted_5 = {
  name: "name"
};
const Editvue_type_template_id_56c3e386_hoisted_6 = {
  name: "sampleLimit"
};
const Editvue_type_template_id_56c3e386_hoisted_7 = {
  class: "form-group row"
};
const Editvue_type_template_id_56c3e386_hoisted_8 = {
  class: "col s12"
};
const Editvue_type_template_id_56c3e386_hoisted_9 = {
  class: "col s12 m6",
  style: {
    "padding-left": "0"
  }
};
const Editvue_type_template_id_56c3e386_hoisted_10 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("hr", null, null, -1);
const Editvue_type_template_id_56c3e386_hoisted_11 = {
  class: "col s12 m6"
};
const Editvue_type_template_id_56c3e386_hoisted_12 = {
  class: "form-help"
};
const Editvue_type_template_id_56c3e386_hoisted_13 = {
  class: "inline-help"
};
const Editvue_type_template_id_56c3e386_hoisted_14 = {
  name: "sampleRate"
};
const Editvue_type_template_id_56c3e386_hoisted_15 = {
  name: "minSessionTime"
};
const Editvue_type_template_id_56c3e386_hoisted_16 = {
  name: "requiresActivity"
};
const Editvue_type_template_id_56c3e386_hoisted_17 = {
  class: "inline-help-node"
};
const Editvue_type_template_id_56c3e386_hoisted_18 = ["innerHTML"];
const Editvue_type_template_id_56c3e386_hoisted_19 = ["innerHTML"];
const Editvue_type_template_id_56c3e386_hoisted_20 = {
  class: "entityCancel"
};
function Editvue_type_template_id_56c3e386_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_HsrUrlTarget = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrUrlTarget");
  const _component_HsrTargetTest = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrTargetTest");
  const _component_SaveButton = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SaveButton");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    class: "editHsr",
    "content-title": _ctx.contentTitle
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_56c3e386_hoisted_1, [Editvue_type_template_id_56c3e386_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_56c3e386_hoisted_3, [Editvue_type_template_id_56c3e386_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_UpdatingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      onSubmit: _cache[10] || (_cache[10] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr())
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "name",
      "model-value": _ctx.siteHsr.name,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.siteHsr.name = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('General_Name'),
      maxlength: 50,
      placeholder: _ctx.translate('HeatmapSessionRecording_FieldNamePlaceholder'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_SessionNameHelp')
    }, null, 8, ["model-value", "title", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleLimit",
      "model-value": _ctx.siteHsr.sample_limit,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => {
        _ctx.siteHsr.sample_limit = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_SessionSampleLimit'),
      options: _ctx.sampleLimits,
      "inline-help": _ctx.translate('HeatmapSessionRecording_SessionSampleLimitHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPages')) + ":", 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_9, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.siteHsr.match_page_rules, (url, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`matchPageRules ${index} multiple`),
        key: index
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrUrlTarget, {
        "model-value": url,
        "onUpdate:modelValue": $event => _ctx.setMatchPageRule($event, index),
        onAddUrl: _cache[2] || (_cache[2] = $event => _ctx.addMatchPageRule()),
        onRemoveUrl: $event => _ctx.removeMatchPageRule(index),
        onAnyChange: _cache[3] || (_cache[3] = $event => _ctx.setValueHasChanged()),
        "allow-any": true,
        "disable-if-no-value": index > 0,
        "can-be-removed": index > 0,
        "show-add-url": true
      }, null, 8, ["model-value", "onUpdate:modelValue", "onRemoveUrl", "disable-if-no-value", "can-be-removed"])]), Editvue_type_template_id_56c3e386_hoisted_10], 2);
    }), 128))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_56c3e386_hoisted_13, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_FieldIncludedTargetsHelpSessions')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrTargetTest, {
      "included-targets": _ctx.siteHsr.match_page_rules
    }, null, 8, ["included-targets"])])])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleRate",
      "model-value": _ctx.siteHsr.sample_rate,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => {
        _ctx.siteHsr.sample_rate = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_SampleRate'),
      options: _ctx.sampleRates,
      introduction: _ctx.translate('HeatmapSessionRecording_AdvancedOptions'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_SessionSampleRateHelp')
    }, null, 8, ["model-value", "title", "options", "introduction", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "minSessionTime",
      "model-value": _ctx.siteHsr.min_session_time,
      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => {
        _ctx.siteHsr.min_session_time = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_MinSessionTime'),
      options: _ctx.minSessionTimes,
      "inline-help": _ctx.translate('HeatmapSessionRecording_MinSessionTimeHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_16, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "requiresActivity",
      "model-value": _ctx.siteHsr.requires_activity,
      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => {
        _ctx.siteHsr.requires_activity = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_RequiresActivity'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_RequiresActivityHelp')
    }, null, 8, ["model-value", "title", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "captureKeystrokes",
      "model-value": _ctx.siteHsr.capture_keystrokes,
      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => {
        _ctx.siteHsr.capture_keystrokes = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_CaptureKeystrokes')
    }, {
      "inline-help": Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        innerHTML: _ctx.$sanitize(_ctx.captureKeystrokesHelp)
      }, null, 8, Editvue_type_template_id_56c3e386_hoisted_18)])]),
      _: 1
    }, 8, ["model-value", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      innerHTML: _ctx.$sanitize(_ctx.personalInformationNote)
    }, null, 8, Editvue_type_template_id_56c3e386_hoisted_19), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
      class: "createButton",
      onConfirm: _cache[8] || (_cache[8] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr()),
      disabled: _ctx.isUpdating || !_ctx.isDirty,
      saving: _ctx.isUpdating,
      value: _ctx.saveButtonText
    }, null, 8, ["disabled", "saving", "value"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_56c3e386_hoisted_20, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      onClick: _cache[9] || (_cache[9] = $event => _ctx.cancel())
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Cancel')), 1)])])], 32)]),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=template&id=56c3e386

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=script&lang=ts






const Editvue_type_script_lang_ts_notificationId = 'hsrmanagement';
/* harmony default export */ var ManageSessionRecording_Editvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    idSiteHsr: Number
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    HsrUrlTarget: HsrUrlTarget,
    HsrTargetTest: HsrTargetTest,
    SaveButton: external_CorePluginsAdmin_["SaveButton"]
  },
  data() {
    return {
      isDirty: false,
      showAdvancedView: false,
      sampleLimits: [],
      siteHsr: {}
    };
  },
  created() {
    external_CoreHome_["AjaxHelper"].fetch({
      method: 'HeatmapSessionRecording.getAvailableSessionRecordingSampleLimits'
    }).then(sampleLimits => {
      this.sampleLimits = (sampleLimits || []).map(l => ({
        key: `${l}`,
        value: l
      }));
    });
    this.init();
  },
  watch: {
    idSiteHsr(newValue) {
      if (newValue === null) {
        return;
      }
      this.init();
    }
  },
  methods: {
    removeAnyHsrNotification() {
      external_CoreHome_["NotificationsStore"].remove(Editvue_type_script_lang_ts_notificationId);
      external_CoreHome_["NotificationsStore"].remove('ajaxHelper');
    },
    showNotification(message, context) {
      const instanceId = external_CoreHome_["NotificationsStore"].show({
        message,
        context,
        id: Editvue_type_script_lang_ts_notificationId,
        type: 'transient'
      });
      setTimeout(() => {
        external_CoreHome_["NotificationsStore"].scrollToNotification(instanceId);
      }, 200);
    },
    showErrorFieldNotProvidedNotification(title) {
      const message = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ErrorXNotProvided', [title]);
      this.showNotification(message, 'error');
    },
    init() {
      const {
        idSiteHsr
      } = this;
      this.siteHsr = {};
      this.showAdvancedView = false;
      external_CoreHome_["Matomo"].helper.lazyScrollToContent();
      if (this.edit && idSiteHsr) {
        SessionRecordingStore.findHsr(idSiteHsr).then(siteHsr => {
          if (!siteHsr) {
            return;
          }
          this.siteHsr = Object(external_CoreHome_["clone"])(siteHsr);
          this.siteHsr.sample_rate = `${this.siteHsr.sample_rate}`;
          this.addInitialMatchPageRule();
          this.isDirty = false;
        });
        return;
      }
      if (this.create) {
        this.siteHsr = {
          idSite: external_CoreHome_["Matomo"].idSite,
          name: '',
          sample_rate: '10.0',
          sample_limit: 250,
          min_session_time: 0,
          requires_activity: true,
          capture_keystrokes: false
        };
        this.addInitialMatchPageRule();
        this.isDirty = false;
      }
    },
    addInitialMatchPageRule() {
      var _this$siteHsr$match_p;
      if (!this.siteHsr) {
        return;
      }
      if ((_this$siteHsr$match_p = this.siteHsr.match_page_rules) !== null && _this$siteHsr$match_p !== void 0 && _this$siteHsr$match_p.length) {
        return;
      }
      this.siteHsr.match_page_rules = [{
        attribute: 'url',
        type: 'any',
        value: '',
        inverted: 0
      }];
    },
    addMatchPageRule() {
      var _this$siteHsr$match_p2;
      if (!this.siteHsr) {
        return;
      }
      if (!((_this$siteHsr$match_p2 = this.siteHsr.match_page_rules) !== null && _this$siteHsr$match_p2 !== void 0 && _this$siteHsr$match_p2.length)) {
        this.siteHsr.match_page_rules = [];
      }
      this.siteHsr.match_page_rules.push({
        attribute: 'url',
        type: 'equals_simple',
        value: '',
        inverted: 0
      });
      this.isDirty = true;
    },
    removeMatchPageRule(index) {
      if (this.siteHsr && index > -1) {
        this.siteHsr.match_page_rules = [...this.siteHsr.match_page_rules];
        this.siteHsr.match_page_rules.splice(index, 1);
        this.isDirty = true;
      }
    },
    cancel() {
      const newParams = Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value);
      delete newParams.idSiteHsr;
      external_CoreHome_["MatomoUrl"].updateHash(newParams);
    },
    createHsr() {
      this.removeAnyHsrNotification();
      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }
      SessionRecordingStore.createOrUpdateHsr(this.siteHsr, 'HeatmapSessionRecording.addSessionRecording').then(response => {
        if (!response || response.type === 'error' || !response.response) {
          return;
        }
        this.isDirty = false;
        const idSiteHsr = response.response.value;
        SessionRecordingStore.reload().then(() => {
          if (external_CoreHome_["Matomo"].helper.isReportingPage()) {
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          }
          external_CoreHome_["MatomoUrl"].updateHash(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
            idSiteHsr
          }));
          setTimeout(() => {
            this.showNotification(Object(external_CoreHome_["translate"])('HeatmapSessionRecording_SessionRecordingCreated'), response.type);
          }, 200);
        });
      });
    },
    setValueHasChanged() {
      this.isDirty = true;
    },
    updateHsr() {
      this.removeAnyHsrNotification();
      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }
      SessionRecordingStore.createOrUpdateHsr(this.siteHsr, 'HeatmapSessionRecording.updateSessionRecording').then(response => {
        if (response.type === 'error') {
          return;
        }
        this.isDirty = false;
        this.siteHsr = {};
        SessionRecordingStore.reload().then(() => {
          this.init();
        });
        this.showNotification(Object(external_CoreHome_["translate"])('HeatmapSessionRecording_SessionRecordingUpdated'), response.type);
      });
    },
    checkRequiredFieldsAreSet() {
      var _this$siteHsr$match_p3;
      if (!this.siteHsr.name) {
        const title = this.translate('General_Name');
        this.showErrorFieldNotProvidedNotification(title);
        return false;
      }
      if (!((_this$siteHsr$match_p3 = this.siteHsr.match_page_rules) !== null && _this$siteHsr$match_p3 !== void 0 && _this$siteHsr$match_p3.length) || !SessionRecordingStore.filterRules(this.siteHsr.match_page_rules).length) {
        const title = this.translate('HeatmapSessionRecording_ErrorPageRuleRequired');
        this.showNotification(title, 'error');
        return false;
      }
      return true;
    },
    setMatchPageRule(rule, index) {
      this.siteHsr.match_page_rules = [...this.siteHsr.match_page_rules];
      this.siteHsr.match_page_rules[index] = rule;
    }
  },
  computed: {
    minSessionTimes() {
      return [0, 5, 10, 15, 20, 30, 45, 60, 90, 120].map(v => ({
        key: `${v}`,
        value: `${v} seconds`
      }));
    },
    sampleRates() {
      const rates = [0.1, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      return rates.map(v => ({
        key: `${v.toFixed(1)}`,
        value: `${v}%`
      }));
    },
    create() {
      return !this.idSiteHsr;
    },
    edit() {
      return !this.create;
    },
    editTitle() {
      const token = this.create ? 'HeatmapSessionRecording_CreateNewSessionRecording' : 'HeatmapSessionRecording_EditSessionRecordingX';
      return token;
    },
    contentTitle() {
      return Object(external_CoreHome_["translate"])(this.editTitle, this.siteHsr.name ? `"${this.siteHsr.name}"` : '');
    },
    isLoading() {
      return HeatmapStore.state.value.isLoading;
    },
    isUpdating() {
      return HeatmapStore.state.value.isUpdating;
    },
    captureKeystrokesHelp() {
      const link = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-keystrokes-in-form-fields';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CaptureKeystrokesHelp', `<a href="${link}" target="_blank" rel="noopener noreferrer">`, '</a>');
    },
    personalInformationNote() {
      const link = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-content-on-your-website';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_PersonalInformationNote', Object(external_CoreHome_["translate"])('HeatmapSessionRecording_SessionRecording'), '<code>', '</code>', `<a href="${link}" target="_blank" rel="noreferrer noopener">`, '</a>');
    },
    saveButtonText() {
      return this.edit ? Object(external_CoreHome_["translate"])('CoreUpdater_UpdateTitle') : Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CreateNewSessionRecording');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue



ManageSessionRecording_Editvue_type_script_lang_ts.render = Editvue_type_template_id_56c3e386_render

/* harmony default export */ var ManageSessionRecording_Edit = (ManageSessionRecording_Editvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue?vue&type=template&id=09d6f8c4

const Listvue_type_template_id_09d6f8c4_hoisted_1 = {
  class: "sessionRecordingList"
};
const Listvue_type_template_id_09d6f8c4_hoisted_2 = {
  class: "filterStatus"
};
const Listvue_type_template_id_09d6f8c4_hoisted_3 = {
  class: "hsrSearchFilter",
  style: {
    "margin-left": "3.5px"
  }
};
const Listvue_type_template_id_09d6f8c4_hoisted_4 = {
  class: "index"
};
const Listvue_type_template_id_09d6f8c4_hoisted_5 = {
  class: "name"
};
const Listvue_type_template_id_09d6f8c4_hoisted_6 = {
  class: "creationDate"
};
const Listvue_type_template_id_09d6f8c4_hoisted_7 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_09d6f8c4_hoisted_8 = {
  class: "status"
};
const Listvue_type_template_id_09d6f8c4_hoisted_9 = {
  class: "action"
};
const Listvue_type_template_id_09d6f8c4_hoisted_10 = {
  colspan: "7"
};
const Listvue_type_template_id_09d6f8c4_hoisted_11 = {
  class: "loadingPiwik"
};
const Listvue_type_template_id_09d6f8c4_hoisted_12 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Listvue_type_template_id_09d6f8c4_hoisted_13 = {
  colspan: "7"
};
const Listvue_type_template_id_09d6f8c4_hoisted_14 = ["id"];
const Listvue_type_template_id_09d6f8c4_hoisted_15 = {
  class: "index"
};
const Listvue_type_template_id_09d6f8c4_hoisted_16 = {
  class: "name"
};
const Listvue_type_template_id_09d6f8c4_hoisted_17 = {
  class: "creationDate"
};
const Listvue_type_template_id_09d6f8c4_hoisted_18 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_09d6f8c4_hoisted_19 = {
  key: 0,
  class: "status status-paused"
};
const Listvue_type_template_id_09d6f8c4_hoisted_20 = ["title"];
const Listvue_type_template_id_09d6f8c4_hoisted_21 = {
  key: 1,
  class: "status"
};
const Listvue_type_template_id_09d6f8c4_hoisted_22 = {
  class: "action"
};
const Listvue_type_template_id_09d6f8c4_hoisted_23 = ["title", "onClick"];
const Listvue_type_template_id_09d6f8c4_hoisted_24 = ["title", "onClick"];
const Listvue_type_template_id_09d6f8c4_hoisted_25 = ["title", "href"];
const Listvue_type_template_id_09d6f8c4_hoisted_26 = ["title", "onClick"];
const Listvue_type_template_id_09d6f8c4_hoisted_27 = {
  class: "tableActionBar"
};
const Listvue_type_template_id_09d6f8c4_hoisted_28 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-add"
}, null, -1);
const Listvue_type_template_id_09d6f8c4_hoisted_29 = {
  class: "ui-confirm",
  ref: "confirmDeleteSessionRecording"
};
const Listvue_type_template_id_09d6f8c4_hoisted_30 = ["value"];
const Listvue_type_template_id_09d6f8c4_hoisted_31 = ["value"];
const Listvue_type_template_id_09d6f8c4_hoisted_32 = {
  class: "ui-confirm",
  ref: "confirmEndSessionRecording"
};
const Listvue_type_template_id_09d6f8c4_hoisted_33 = ["value"];
const Listvue_type_template_id_09d6f8c4_hoisted_34 = ["value"];
function Listvue_type_template_id_09d6f8c4_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Listvue_type_template_id_09d6f8c4_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('HeatmapSessionRecording_ManageSessionRecordings')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_SessionRecordingsUsageBenefits')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_09d6f8c4_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "filterStatus",
      "model-value": _ctx.filterStatus,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.setFilterStatus($event);
      }),
      title: _ctx.translate('HeatmapSessionRecording_Filter'),
      "full-width": true,
      options: _ctx.statusOptions
    }, null, 8, ["model-value", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_09d6f8c4_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "hsrSearch",
      title: _ctx.translate('General_Search'),
      modelValue: _ctx.searchFilter,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.searchFilter = $event),
      "full-width": true
    }, null, 8, ["title", "modelValue"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.hsrs.length > 0]])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_09d6f8c4_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Id')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_09d6f8c4_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Name')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_09d6f8c4_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreationDate')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_09d6f8c4_hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_SampleLimit')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_09d6f8c4_hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CorePluginsAdmin_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_09d6f8c4_hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Actions')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Listvue_type_template_id_09d6f8c4_hoisted_11, [Listvue_type_template_id_09d6f8c4_hoisted_12, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading || _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_13, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_NoSessionRecordingsFound')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isLoading && _ctx.hsrs.length == 0]]), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.sortedHsrs, hsr => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        id: `hsr${hsr.idsitehsr}`,
        class: "hsrs",
        key: hsr.idsitehsr
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_15, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.idsitehsr), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_16, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.created_date_pretty), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_18, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.sample_limit), 1), hsr.status === 'paused' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_09d6f8c4_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "icon icon-help",
        title: _ctx.pauseReason
      }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_20)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_09d6f8c4_hoisted_21, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)), 1)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_09d6f8c4_hoisted_22, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-edit",
        title: _ctx.translate('HeatmapSessionRecording_EditX', _ctx.translate('HeatmapSessionRecording_SessionRecording')),
        onClick: $event => _ctx.editHsr(hsr.idsitehsr)
      }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_23), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action stopRecording icon-drop-crossed",
        title: _ctx.translate('HeatmapSessionRecording_StopX', _ctx.translate('HeatmapSessionRecording_SessionRecording')),
        onClick: $event => _ctx.completeHsr(hsr)
      }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_24), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], hsr.status !== 'ended']]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-show",
        title: _ctx.translate('HeatmapSessionRecording_ViewReport'),
        href: _ctx.getViewReportLink(hsr),
        target: "_blank"
      }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_25), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-delete",
        title: _ctx.translate('HeatmapSessionRecording_DeleteX', _ctx.translate('HeatmapSessionRecording_SessionRecording')),
        onClick: $event => _ctx.deleteHsr(hsr)
      }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_26)])], 8, Listvue_type_template_id_09d6f8c4_hoisted_14);
    }), 128))])])), [[_directive_content_table]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_09d6f8c4_hoisted_27, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      class: "createNewHsr",
      value: "",
      onClick: _cache[2] || (_cache[2] = $event => _ctx.createHsr())
    }, [Listvue_type_template_id_09d6f8c4_hoisted_28, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreateNewSessionRecording')), 1)])])]),
    _: 1
  }, 8, ["content-title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_09d6f8c4_hoisted_29, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteSessionRecordingConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_30), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_31)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_09d6f8c4_hoisted_32, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EndSessionRecordingConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_33), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_09d6f8c4_hoisted_34)], 512)]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue?vue&type=template&id=09d6f8c4

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue?vue&type=script&lang=ts




/* harmony default export */ var ManageSessionRecording_Listvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    pauseReason: String
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"]
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
  },
  data() {
    return {
      searchFilter: ''
    };
  },
  created() {
    SessionRecordingStore.setFilterStatus('');
    SessionRecordingStore.fetchHsrs();
  },
  methods: {
    createHsr() {
      this.editHsr(0);
    },
    editHsr(idSiteHsr) {
      external_CoreHome_["MatomoUrl"].updateHash(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
        idSiteHsr
      }));
    },
    deleteHsr(hsr) {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteSessionRecording, {
        yes: () => {
          SessionRecordingStore.deleteHsr(hsr.idsitehsr).then(() => {
            SessionRecordingStore.reload();
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          });
        }
      });
    },
    completeHsr(hsr) {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmEndSessionRecording, {
        yes: () => {
          SessionRecordingStore.completeHsr(hsr.idsitehsr).then(() => {
            SessionRecordingStore.reload();
          });
        }
      });
    },
    setFilterStatus(filter) {
      SessionRecordingStore.setFilterStatus(filter);
    },
    ucfirst(s) {
      return `${s[0].toUpperCase()}${s.substr(1)}`;
    },
    getViewReportLink(hsr) {
      return `?${external_CoreHome_["MatomoUrl"].stringify({
        module: 'CoreHome',
        action: 'index',
        idSite: hsr.idsite,
        period: 'day',
        date: 'yesterday'
      })}#?${external_CoreHome_["MatomoUrl"].stringify({
        category: 'HeatmapSessionRecording_SessionRecordings',
        idSite: hsr.idsite,
        period: 'day',
        date: 'yesterday',
        subcategory: hsr.idsitehsr
      })}`;
    }
  },
  computed: {
    filterStatus() {
      return SessionRecordingStore.state.value.filterStatus;
    },
    statusOptions() {
      return SessionRecordingStore.statusOptions;
    },
    hsrs() {
      return SessionRecordingStore.hsrs.value;
    },
    isLoading() {
      return SessionRecordingStore.state.value.isLoading;
    },
    isUpdating() {
      return SessionRecordingStore.state.value.isUpdating;
    },
    sortedHsrs() {
      // look through string properties of heatmaps for values that have searchFilter in them
      // (mimics angularjs filter() filter)
      const result = [...this.hsrs].filter(h => Object.keys(h).some(propName => {
        const entity = h;
        return typeof entity[propName] === 'string' && entity[propName].indexOf(this.searchFilter) !== -1;
      }));
      result.sort((lhs, rhs) => rhs.idsitehsr - lhs.idsitehsr);
      return result;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue



ManageSessionRecording_Listvue_type_script_lang_ts.render = Listvue_type_template_id_09d6f8c4_render

/* harmony default export */ var ManageSessionRecording_List = (ManageSessionRecording_Listvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue?vue&type=template&id=4a6cf182

const Managevue_type_template_id_4a6cf182_hoisted_1 = {
  class: "manageHsr"
};
function Managevue_type_template_id_4a6cf182_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MatomoJsNotWritableAlert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MatomoJsNotWritableAlert");
  const _component_SessionRecordingList = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SessionRecordingList");
  const _component_SessionRecordingEdit = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SessionRecordingEdit");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_MatomoJsNotWritableAlert, {
    key: 0,
    "is-matomo-js-writable": _ctx.isMatomoJsWritable,
    "recording-type": _ctx.translate('HeatmapSessionRecording_SessionRecordings')
  }, null, 8, ["is-matomo-js-writable", "recording-type"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Managevue_type_template_id_4a6cf182_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SessionRecordingList, {
    "pause-reason": _ctx.pauseReason
  }, null, 8, ["pause-reason"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.editMode]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SessionRecordingEdit, {
    "id-site-hsr": _ctx.idSiteHsr
  }, null, 8, ["id-site-hsr"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.editMode]])])], 64);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue?vue&type=template&id=4a6cf182

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue?vue&type=script&lang=ts





/* harmony default export */ var ManageSessionRecording_Managevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    pauseReason: String,
    isMatomoJsWritable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editMode: false,
      idSiteHsr: null
    };
  },
  components: {
    MatomoJsNotWritableAlert: MatomoJsNotWritableAlert,
    SessionRecordingEdit: ManageSessionRecording_Edit,
    SessionRecordingList: ManageSessionRecording_List
  },
  created() {
    // doing this in a watch because we don't want to post an event in a computed property
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["watch"])(() => external_CoreHome_["MatomoUrl"].hashParsed.value.idSiteHsr, idSiteHsr => {
      this.initState(idSiteHsr);
    });
    this.initState(external_CoreHome_["MatomoUrl"].hashParsed.value.idSiteHsr);
  },
  methods: {
    removeAnyHsrNotification() {
      external_CoreHome_["NotificationsStore"].remove('hsrmanagement');
    },
    initState(idSiteHsr) {
      if (idSiteHsr) {
        if (idSiteHsr === '0') {
          const parameters = {
            isAllowed: true
          };
          external_CoreHome_["Matomo"].postEvent('HeatmapSessionRecording.initAddSessionRecording', parameters);
          if (parameters && !parameters.isAllowed) {
            this.editMode = false;
            this.idSiteHsr = null;
            return;
          }
        }
        this.editMode = true;
        this.idSiteHsr = parseInt(idSiteHsr, 10);
      } else {
        this.editMode = false;
        this.idSiteHsr = null;
      }
      this.removeAnyHsrNotification();
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue



ManageSessionRecording_Managevue_type_script_lang_ts.render = Managevue_type_template_id_4a6cf182_render

/* harmony default export */ var ManageSessionRecording_Manage = (ManageSessionRecording_Managevue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ListOfPageviews/ListOfPageviews.vue?vue&type=template&id=fe86de22

const ListOfPageviewsvue_type_template_id_fe86de22_hoisted_1 = {
  class: "ui-confirm",
  id: "listOfPageviews"
};
const ListOfPageviewsvue_type_template_id_fe86de22_hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const ListOfPageviewsvue_type_template_id_fe86de22_hoisted_3 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const ListOfPageviewsvue_type_template_id_fe86de22_hoisted_4 = ["onClick"];
const ListOfPageviewsvue_type_template_id_fe86de22_hoisted_5 = ["title"];
const ListOfPageviewsvue_type_template_id_fe86de22_hoisted_6 = ["value"];
function ListOfPageviewsvue_type_template_id_fe86de22_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", ListOfPageviewsvue_type_template_id_fe86de22_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_PageviewsInVisit')), 1), ListOfPageviewsvue_type_template_id_fe86de22_hoisted_2, ListOfPageviewsvue_type_template_id_fe86de22_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ColumnTime')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_TimeOnPage')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.pageviews, pageview => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
      key: pageview.idloghsr,
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])({
        inactive: pageview.idloghsr !== _ctx.idLogHsr
      }),
      onClick: $event => _ctx.onClickPageView(pageview)
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(pageview.server_time_pretty), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(pageview.time_on_page_pretty), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
      title: pageview.label
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])((pageview.label || '').substr(0, 50)), 9, ListOfPageviewsvue_type_template_id_fe86de22_hoisted_5)], 10, ListOfPageviewsvue_type_template_id_fe86de22_hoisted_4);
  }), 128))])])), [[_directive_content_table]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "close",
    type: "button",
    value: _ctx.translate('General_Close')
  }, null, 8, ListOfPageviewsvue_type_template_id_fe86de22_hoisted_6)]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ListOfPageviews/ListOfPageviews.vue?vue&type=template&id=fe86de22

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ListOfPageviews/ListOfPageviews.vue?vue&type=script&lang=ts


/* harmony default export */ var ListOfPageviewsvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    pageviews: {
      type: Array,
      required: true
    },
    idLogHsr: {
      type: Number,
      required: true
    }
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
  },
  methods: {
    onClickPageView(pageview) {
      if (pageview.idloghsr === this.idLogHsr) {
        return;
      }
      external_CoreHome_["MatomoUrl"].updateUrl(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        idLogHsr: pageview.idloghsr
      }), external_CoreHome_["MatomoUrl"].hashParsed.value.length ? Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
        idLogHsr: pageview.idloghsr
      }) : undefined);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ListOfPageviews/ListOfPageviews.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ListOfPageviews/ListOfPageviews.vue



ListOfPageviewsvue_type_script_lang_ts.render = ListOfPageviewsvue_type_template_id_fe86de22_render

/* harmony default export */ var ListOfPageviews = (ListOfPageviewsvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=template&id=7f5f8230

const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_1 = {
  class: "heatmap-vis-title"
};
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_2 = {
  key: 0,
  class: "alert alert-info heatmap-country-alert"
};
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_3 = {
  key: 1
};
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_4 = {
  key: 2
};
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_5 = ["innerHTML"];
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_6 = {
  class: "alert alert-info"
};
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_7 = {
  key: 3
};
const HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_8 = {
  class: "alert alert-info"
};
function HeatmapVisPagevue_type_template_id_7f5f8230_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _ctx$heatmapMetadata;
  const _component_EnrichedHeadline = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("EnrichedHeadline");
  const _component_MatomoJsNotWritableAlert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MatomoJsNotWritableAlert");
  const _component_HeatmapVis = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapVis");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_EnrichedHeadline, {
    "edit-url": _ctx.editUrl,
    "inline-help": _ctx.inlineHelp
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapX', `"${_ctx.heatmap.name}"`)), 1)]),
    _: 1
  }, 8, ["edit-url", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_MatomoJsNotWritableAlert, {
    "is-matomo-js-writable": _ctx.isMatomoJsWritable,
    "recording-type": _ctx.translate('HeatmapSessionRecording_Heatmaps')
  }, null, 8, ["is-matomo-js-writable", "recording-type"]), _ctx.includedCountries ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapInfoTrackVisitsFromCountries', _ctx.includedCountries)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.heatmap.page_treemirror ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HeatmapVis, {
    "created-date": _ctx.createdDate,
    "excluded-elements": _ctx.heatmap.excluded_elements,
    "num-samples": _ctx.heatmapMetadata,
    url: _ctx.heatmap.screenshot_url,
    "heatmap-date": _ctx.heatmapDate,
    "heatmap-period": _ctx.heatmapPeriod,
    "offset-accuracy": _ctx.offsetAccuracy,
    "breakpoint-tablet": _ctx.heatmap.breakpoint_tablet,
    "breakpoint-mobile": _ctx.heatmap.breakpoint_mobile,
    "heatmap-types": _ctx.heatmapTypes,
    "device-types": _ctx.deviceTypes,
    "id-site-hsr": _ctx.idSiteHsr,
    "is-active": _ctx.isActive,
    "desktop-preview-size": _ctx.desktopPreviewSize,
    "iframe-resolutions-values": _ctx.iframeResolutions
  }, null, 8, ["created-date", "excluded-elements", "num-samples", "url", "heatmap-date", "heatmap-period", "offset-accuracy", "breakpoint-tablet", "breakpoint-mobile", "heatmap-types", "device-types", "id-site-hsr", "is-active", "desktop-preview-size", "iframe-resolutions-values"])])) : !((_ctx$heatmapMetadata = _ctx.heatmapMetadata) !== null && _ctx$heatmapMetadata !== void 0 && _ctx$heatmapMetadata.nb_samples_device_all) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
    innerHTML: _ctx.$sanitize(_ctx.recordedSamplesTroubleShoot)
  }, null, 8, HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_5), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, null, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate(_ctx.noDataMessageKey)), 1)]),
    _: 1
  })])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, null, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapVisPagevue_type_template_id_7f5f8230_hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.noHeatmapScreenshotRecordedYetText), 1)]),
    _: 1
  })]))]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=template&id=7f5f8230

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=script&lang=ts




/* harmony default export */ var HeatmapVisPagevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    idSiteHsr: {
      type: Number,
      required: true
    },
    heatmap: {
      type: Object,
      required: true
    },
    heatmapMetadata: {
      type: Object,
      required: true
    },
    deviceTypes: {
      type: Array,
      required: true
    },
    heatmapTypes: {
      type: Array,
      required: true
    },
    offsetAccuracy: {
      type: Number,
      required: true
    },
    heatmapPeriod: {
      type: String,
      required: true
    },
    heatmapDate: {
      type: String,
      required: true
    },
    isActive: Boolean,
    createdDate: {
      type: String,
      required: true
    },
    editUrl: {
      type: String,
      required: true
    },
    inlineHelp: {
      type: String,
      required: true
    },
    includedCountries: {
      type: String,
      required: true
    },
    desktopPreviewSize: {
      type: Number,
      required: true
    },
    iframeResolutions: {
      type: Object,
      required: true
    },
    noDataMessageKey: {
      type: String,
      required: true
    },
    isMatomoJsWritable: {
      type: Boolean,
      required: true
    }
  },
  components: {
    MatomoJsNotWritableAlert: MatomoJsNotWritableAlert,
    ContentBlock: external_CoreHome_["ContentBlock"],
    HeatmapVis: HeatmapVis,
    EnrichedHeadline: external_CoreHome_["EnrichedHeadline"]
  },
  computed: {
    noHeatmapScreenshotRecordedYetText() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_NoHeatmapScreenshotRecordedYet', this.heatmapMetadata.nb_samples_device_all, Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ScreenshotUrl'));
    },
    recordedSamplesTroubleShoot() {
      const linkString = Object(external_CoreHome_["externalLink"])('https://matomo.org/faq/heatmap-session-recording/troubleshooting-heatmaps/');
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapTroubleshoot', linkString, '</a>');
    }
  },
  created() {
    // We want the selector hidden for heatmaps.
    external_CoreHome_["Matomo"].postEvent('hidePeriodSelector');
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue



HeatmapVisPagevue_type_script_lang_ts.render = HeatmapVisPagevue_type_template_id_7f5f8230_render

/* harmony default export */ var HeatmapVisPage = (HeatmapVisPagevue_type_script_lang_ts);
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/index.ts
/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret
 * or copyright law. Redistribution of this information or reproduction of this material is
 * strictly forbidden unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from
 * InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */














// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js




/***/ })

/******/ });
});
//# sourceMappingURL=HeatmapSessionRecording.umd.js.map