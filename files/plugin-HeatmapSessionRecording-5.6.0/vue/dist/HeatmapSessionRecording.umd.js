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

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=template&id=7c68c81b

const _hoisted_1 = {
  class: "heatmapVis"
};
const _hoisted_2 = ["innerHTML"];
const _hoisted_3 = {
  class: "heatmapSelection"
};
const _hoisted_4 = {
  class: "hsrToggle heatmapTypePills"
};
const _hoisted_5 = ["onClick"];
const _hoisted_6 = {
  class: "hsrToggle deviceTypePills"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = ["src", "alt"];
const _hoisted_9 = {
  class: "deviceName"
};
const _hoisted_10 = {
  class: "deviceResolution"
};
const _hoisted_11 = {
  class: "customIframeWidth"
};
const _hoisted_12 = ["textContent"];
const _hoisted_13 = {
  class: "legendOuter"
};
const _hoisted_14 = {
  class: "legendLabel"
};
const _hoisted_15 = {
  class: "legend-area"
};
const _hoisted_16 = ["src"];
const _hoisted_17 = {
  class: "legendLabel"
};
const _hoisted_18 = {
  class: "heatmapReportLayout"
};
const _hoisted_19 = {
  class: "heatmapWrapper"
};
const _hoisted_20 = {
  id: "heatmapContainer",
  ref: "heatmapContainer"
};
const _hoisted_21 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  id: "highlightDiv"
}, null, -1);
const _hoisted_22 = ["title"];
const _hoisted_23 = ["src", "width"];
const _hoisted_24 = {
  class: "heatmapLoadingOverlay"
};
const _hoisted_25 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "heatmapLoadingSpinner"
}, null, -1);
const _hoisted_26 = {
  class: "heatmapLoadingTitle"
};
const _hoisted_27 = {
  key: 0,
  class: "card heatmapSummaryCard"
};
const _hoisted_28 = {
  class: "card-content"
};
const _hoisted_29 = {
  class: "recordingsHeader"
};
const _hoisted_30 = {
  class: "card-title"
};
const _hoisted_31 = {
  class: "recordingsDeviceType"
};
const _hoisted_32 = {
  class: "recordingsValue"
};
const _hoisted_33 = {
  key: 0,
  class: "recordingsEmpty"
};
const _hoisted_34 = {
  key: 1,
  class: "deviceBreakdown"
};
const _hoisted_35 = {
  class: "deviceBreakdownBar"
};
const _hoisted_36 = ["title"];
const _hoisted_37 = {
  class: "deviceBreakdownLegend"
};
const _hoisted_38 = {
  class: "deviceBreakdownLegendLabel"
};
const _hoisted_39 = {
  class: "deviceBreakdownLegendPercentLabel"
};
const _hoisted_40 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "divider"
}, null, -1);
const _hoisted_41 = {
  class: "card-title"
};
const _hoisted_42 = {
  key: 0
};
const _hoisted_43 = {
  class: "topClickedElementContent"
};
const _hoisted_44 = ["title"];
const _hoisted_45 = {
  class: "topClickedElementBarRow"
};
const _hoisted_46 = {
  class: "topClickedElementBar"
};
const _hoisted_47 = {
  class: "topClickedElementPercent"
};
const _hoisted_48 = {
  key: 1
};
const _hoisted_49 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "divider"
}, null, -1);
const _hoisted_50 = {
  class: "scrollReachHeader"
};
const _hoisted_51 = {
  class: "card-title"
};
const _hoisted_52 = {
  key: 0,
  class: "scrollReachAvgFold"
};
const _hoisted_53 = {
  key: 2
};
const _hoisted_54 = {
  class: "scrollReachLabel"
};
const _hoisted_55 = {
  class: "topClickedElementBar"
};
const _hoisted_56 = {
  class: "scrollReachPercent"
};
const _hoisted_57 = {
  key: 3
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_HeatmapEmptyState = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapEmptyState");
  const _component_Tooltip = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Tooltip");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_1, [!!_ctx.actualNumSamples.nb_samples_device_all ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", {
    key: 0,
    innerHTML: _ctx.$sanitize(_ctx.recordedSamplesSince)
  }, null, 8, _hoisted_2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_4, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.heatmapTypes, theHeatmapType => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
      type: "button",
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["hsrToggleBtn", [`heatmapType${theHeatmapType.key}`, {
        active: theHeatmapType.key === _ctx.heatmapType
      }]]),
      onClick: $event => _ctx.changeHeatmapType(theHeatmapType.key),
      key: theHeatmapType.key
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(theHeatmapType.name), 11, _hoisted_5);
  }), 128))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_6, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.deviceTypesWithResolution, theDeviceType => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
      type: "button",
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["hsrToggleBtn", [`deviceType${theDeviceType.key}`, {
        active: theDeviceType.key === _ctx.deviceType
      }]]),
      onClick: $event => _ctx.changeDeviceType(theDeviceType.key),
      key: theDeviceType.key
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
      height: "15",
      src: theDeviceType.logo,
      alt: `${_ctx.translate('DevicesDetection_Device')} ${theDeviceType.name}`
    }, null, 8, _hoisted_8), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(theDeviceType.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_10, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(theDeviceType.resolution) + "px", 1)], 10, _hoisted_7);
  }), 128))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "customIframeWidthLabel",
    textContent: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CustomWidth'))
  }, null, 8, _hoisted_12), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "select",
    name: "iframewidth",
    "model-value": _ctx.customIframeWidth,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
      _ctx.customIframeWidth = $event;
      _ctx.changeIframeWidth(_ctx.customIframeWidth, true);
    }),
    options: _ctx.iframeWidthOptions,
    "full-width": true
  }, null, 8, ["model-value", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_13, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_14, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_LegendLow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
    class: "gradient",
    alt: "gradient",
    src: _ctx.gradientImgData
  }, null, 8, _hoisted_16)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_LegendHigh')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["heatmapScrollArea", {
      heatmapScrollAreaEmpty: !_ctx.hasSnapshot
    }]),
    ref: "heatmapScrollArea",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])(_ctx.scrollAreaStyle)
  }, [_ctx.hasSnapshot ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: "heatmapScaleBox",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])(_ctx.scaleBoxStyle)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "iframeRecordingContainer",
    ref: "iframeRecordingContainer",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])(_ctx.containerStyle)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_20, null, 512), _hoisted_21]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "aboveFoldLine",
    ref: "aboveFoldLine",
    title: _ctx.translate('HeatmapSessionRecording_AvgAboveFoldDescription'),
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      width: _ctx.iframeWidth + 'px',
      top: _ctx.avgFold + 'px'
    })
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_AvgFold', _ctx.avgFold)), 1)], 12, _hoisted_22), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.avgFold]]), _ctx.embedUrl ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("iframe", {
    key: 0,
    id: "recordingPlayer",
    ref: "recordingPlayer",
    sandbox: "allow-scripts allow-same-origin",
    referrerpolicy: "no-referrer",
    onLoad: _cache[1] || (_cache[1] = $event => _ctx.onLoaded()),
    height: "400",
    src: _ctx.embedUrl,
    width: _ctx.iframeWidth
  }, null, 40, _hoisted_23)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 4)], 4)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_HeatmapEmptyState, {
    key: 1,
    state: _ctx.emptyStateKey,
    "id-site-hsr": _ctx.idSiteHsr
  }, null, 8, ["state", "id-site-hsr"])), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_24, [_hoisted_25, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_26, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_LoadingHeatmap')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]])], 6), _ctx.showSummaryCard ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_27, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_28, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_29, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_30, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_Recordings')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_31, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.selectedDeviceTypeName), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", _hoisted_32, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.totalRecordings), 1), !_ctx.deviceBreakdown.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_33, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_WaitingForFirstRecording')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_34, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_35, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.deviceBreakdown, device => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["deviceBreakdownSegment", `deviceBreakdownDevice${device.key}`]),
      key: device.key,
      style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
        width: `${device.percent}%`
      }),
      title: `${device.name} ${device.percentLabel}`
    }, null, 14, _hoisted_36);
  }), 128))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_37, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.deviceBreakdown, device => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      class: "deviceBreakdownLegendItem",
      key: device.key
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["deviceBreakdownSwatch", `deviceBreakdownDevice${device.key}`])
    }, null, 2), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_38, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(device.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_39, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(device.percentLabel), 1)]);
  }), 128))])])), _ctx.hasSnapshot ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
    key: 2
  }, [_hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_41, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TopClickedElements')), 1), _ctx.topClickedElements.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_42, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.topClickedElements, element => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      class: "topClickedElementRow",
      key: element.key
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_43, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
      class: "topClickedElementLabel",
      title: element.label
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(element.label), 9, _hoisted_44), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_45, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_46, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
      class: "topClickedElementBarFill",
      style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
        width: `${element.percent}%`
      })
    }, null, 4)])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_47, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(element.percentLabel), 1)]);
  }), 128))])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_48, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_NoClickedElements')), 1)), _hoisted_49, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_50, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_51, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ScrollReach')), 1), _ctx.summaryAvgFold ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_52, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_AvgFold', _ctx.summaryAvgFold)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), _ctx.scrollReach.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_53, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.scrollReach, band => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      class: "scrollReachRow",
      key: band.key
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_54, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(band.label), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_55, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
      class: "topClickedElementBarFill",
      style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
        width: `${band.percent}%`
      })
    }, null, 4)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_56, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(band.percentLabel), 1)]);
  }), 128))])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_57, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_NoScrollData')), 1))], 64)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Tooltip, {
    ref: "tooltip",
    "click-count": _ctx.clickCount,
    "click-rate": _ctx.clickRate,
    "is-moves": _ctx.heatmapType === 1
  }, null, 8, ["click-count", "click-rate", "is-moves"])]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=template&id=7c68c81b

// EXTERNAL MODULE: ./plugins/HeatmapSessionRecording/node_modules/heatmap.js/build/heatmap.js
var heatmap = __webpack_require__("246e");
var heatmap_default = /*#__PURE__*/__webpack_require__.n(heatmap);

// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/util.js
function resolveUrl(url, baseUrl) {
    // url is absolute already
    if (url.match(/^[a-z]+:\/\//i)) {
        return url;
    }
    // url is absolute already, without protocol
    if (url.match(/^\/\//)) {
        return window.location.protocol + url;
    }
    // dataURI, mailto:, tel:, etc.
    if (url.match(/^[a-z]+:/i)) {
        return url;
    }
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement('base');
    const a = doc.createElement('a');
    doc.head.appendChild(base);
    doc.body.appendChild(a);
    if (baseUrl) {
        base.href = baseUrl;
    }
    a.href = url;
    return a.href;
}
const uuid = (() => {
    // generate uuid for className of pseudo elements.
    // We should not use GUIDs, otherwise pseudo elements sometimes cannot be captured.
    let counter = 0;
    // ref: http://stackoverflow.com/a/6248722/2519373
    const random = () => 
    // eslint-disable-next-line no-bitwise
    `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
    return () => {
        counter += 1;
        return `u${random()}${counter}`;
    };
})();
function delay(ms) {
    return (args) => new Promise((resolve) => {
        setTimeout(() => resolve(args), ms);
    });
}
function toArray(arrayLike) {
    const arr = [];
    for (let i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
    }
    return arr;
}
let styleProps = null;
function getStyleProperties(options = {}) {
    if (styleProps) {
        return styleProps;
    }
    if (options.includeStyleProperties) {
        styleProps = options.includeStyleProperties;
        return styleProps;
    }
    styleProps = toArray(window.getComputedStyle(document.documentElement));
    return styleProps;
}
function px(node, styleProperty) {
    const win = node.ownerDocument.defaultView || window;
    const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
    return val ? parseFloat(val.replace('px', '')) : 0;
}
function getNodeWidth(node) {
    const leftBorder = px(node, 'border-left-width');
    const rightBorder = px(node, 'border-right-width');
    return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
    const topBorder = px(node, 'border-top-width');
    const bottomBorder = px(node, 'border-bottom-width');
    return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
    const width = options.width || getNodeWidth(targetNode);
    const height = options.height || getNodeHeight(targetNode);
    return { width, height };
}
function getPixelRatio() {
    let ratio;
    let FINAL_PROCESS;
    try {
        FINAL_PROCESS = process;
    }
    catch (e) {
        // pass
    }
    const val = FINAL_PROCESS && FINAL_PROCESS.env
        ? FINAL_PROCESS.env.devicePixelRatio
        : null;
    if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
            ratio = 1;
        }
    }
    return ratio || window.devicePixelRatio || 1;
}
// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
const canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
    if (canvas.width > canvasDimensionLimit ||
        canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit &&
            canvas.height > canvasDimensionLimit) {
            if (canvas.width > canvas.height) {
                canvas.height *= canvasDimensionLimit / canvas.width;
                canvas.width = canvasDimensionLimit;
            }
            else {
                canvas.width *= canvasDimensionLimit / canvas.height;
                canvas.height = canvasDimensionLimit;
            }
        }
        else if (canvas.width > canvasDimensionLimit) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
        }
        else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
        }
    }
}
function canvasToBlob(canvas, options = {}) {
    if (canvas.toBlob) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, options.type ? options.type : 'image/png', options.quality ? options.quality : 1);
        });
    }
    return new Promise((resolve) => {
        const binaryString = window.atob(canvas
            .toDataURL(options.type ? options.type : undefined, options.quality ? options.quality : undefined)
            .split(',')[1]);
        const len = binaryString.length;
        const binaryArray = new Uint8Array(len);
        for (let i = 0; i < len; i += 1) {
            binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
            type: options.type ? options.type : 'image/png',
        }));
    });
}
function createImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            img.decode().then(() => {
                requestAnimationFrame(() => resolve(img));
            });
        };
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.src = url;
    });
}
async function svgToDataURL(svg) {
    return Promise.resolve()
        .then(() => new XMLSerializer().serializeToString(svg))
        .then(encodeURIComponent)
        .then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);
    foreignObject.appendChild(node);
    return svgToDataURL(svg);
}
const isInstanceOfElement = (node, instance) => {
    if (node instanceof instance)
        return true;
    const nodePrototype = Object.getPrototypeOf(node);
    if (nodePrototype === null)
        return false;
    return (nodePrototype.constructor.name === instance.name ||
        isInstanceOfElement(nodePrototype, instance));
};
//# sourceMappingURL=util.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/clone-pseudos.js

function formatCSSText(style) {
    const content = style.getPropertyValue('content');
    return `${style.cssText} content: '${content.replace(/'|"/g, '')}';`;
}
function formatCSSProperties(style, options) {
    return getStyleProperties(options)
        .map((name) => {
        const value = style.getPropertyValue(name);
        const priority = style.getPropertyPriority(name);
        return `${name}: ${value}${priority ? ' !important' : ''};`;
    })
        .join(' ');
}
function getPseudoElementStyle(className, pseudo, style, options) {
    const selector = `.${className}:${pseudo}`;
    const cssText = style.cssText
        ? formatCSSText(style)
        : formatCSSProperties(style, options);
    return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
    const style = window.getComputedStyle(nativeNode, pseudo);
    const content = style.getPropertyValue('content');
    if (content === '' || content === 'none') {
        return;
    }
    const className = uuid();
    try {
        clonedNode.className = `${clonedNode.className} ${className}`;
    }
    catch (err) {
        return;
    }
    const styleElement = document.createElement('style');
    styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
    clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode, options) {
    clonePseudoElement(nativeNode, clonedNode, ':before', options);
    clonePseudoElement(nativeNode, clonedNode, ':after', options);
}
//# sourceMappingURL=clone-pseudos.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/mimes.js
const WOFF = 'application/font-woff';
const JPEG = 'image/jpeg';
const mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
    webp: 'image/webp',
};
function getExtension(url) {
    const match = /\.([^./]*?)$/g.exec(url);
    return match ? match[1] : '';
}
function getMimeType(url) {
    const extension = getExtension(url).toLowerCase();
    return mimes[extension] || '';
}
//# sourceMappingURL=mimes.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/dataurl.js
function getContentFromDataUrl(dataURL) {
    return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
    return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
    return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init, process) {
    const res = await fetch(url, init);
    if (res.status === 404) {
        throw new Error(`Resource "${res.url}" not found`);
    }
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = () => {
            try {
                resolve(process({ res, result: reader.result }));
            }
            catch (error) {
                reject(error);
            }
        };
        reader.readAsDataURL(blob);
    });
}
const cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
    let key = url.replace(/\?.*/, '');
    if (includeQueryParams) {
        key = url;
    }
    // font resource
    if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, '');
    }
    return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
    const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
    if (cache[cacheKey] != null) {
        return cache[cacheKey];
    }
    // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
    if (options.cacheBust) {
        // eslint-disable-next-line no-param-reassign
        resourceUrl += (/\?/.test(resourceUrl) ? '&' : '?') + new Date().getTime();
    }
    let dataURL;
    try {
        const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
            if (!contentType) {
                // eslint-disable-next-line no-param-reassign
                contentType = res.headers.get('Content-Type') || '';
            }
            return getContentFromDataUrl(result);
        });
        dataURL = makeDataUrl(content, contentType);
    }
    catch (error) {
        dataURL = options.imagePlaceholder || '';
        let msg = `Failed to fetch resource: ${resourceUrl}`;
        if (error) {
            msg = typeof error === 'string' ? error : error.message;
        }
        if (msg) {
            console.warn(msg);
        }
    }
    cache[cacheKey] = dataURL;
    return dataURL;
}
//# sourceMappingURL=dataurl.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/clone-node.js




async function cloneCanvasElement(canvas) {
    const dataURL = canvas.toDataURL();
    if (dataURL === 'data:,') {
        return canvas.cloneNode(false);
    }
    return createImage(dataURL);
}
async function cloneVideoElement(video, options) {
    if (video.currentSrc) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        return createImage(dataURL);
    }
    const poster = video.poster;
    const contentType = getMimeType(poster);
    const dataURL = await resourceToDataURL(poster, contentType, options);
    return createImage(dataURL);
}
async function cloneIFrameElement(iframe, options) {
    var _a;
    try {
        if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
            return (await cloneNode(iframe.contentDocument.body, options, true));
        }
    }
    catch (_b) {
        // Failed to clone iframe
    }
    return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
    if (isInstanceOfElement(node, HTMLCanvasElement)) {
        return cloneCanvasElement(node);
    }
    if (isInstanceOfElement(node, HTMLVideoElement)) {
        return cloneVideoElement(node, options);
    }
    if (isInstanceOfElement(node, HTMLIFrameElement)) {
        return cloneIFrameElement(node, options);
    }
    return node.cloneNode(isSVGElement(node));
}
const isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === 'SLOT';
const isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === 'SVG';
async function cloneChildren(nativeNode, clonedNode, options) {
    var _a, _b;
    if (isSVGElement(clonedNode)) {
        return clonedNode;
    }
    let children = [];
    if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
        children = toArray(nativeNode.assignedNodes());
    }
    else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) &&
        ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
        children = [];
    }
    else {
        children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
    }
    if (children.length === 0 ||
        isInstanceOfElement(nativeNode, HTMLVideoElement)) {
        return clonedNode;
    }
    await children.reduce((deferred, child) => deferred
        .then(() => cloneNode(child, options))
        .then((clonedChild) => {
        if (clonedChild) {
            clonedNode.appendChild(clonedChild);
        }
    }), Promise.resolve());
    return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode, options) {
    const targetStyle = clonedNode.style;
    if (!targetStyle) {
        return;
    }
    const sourceStyle = window.getComputedStyle(nativeNode);
    if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
    }
    else {
        getStyleProperties(options).forEach((name) => {
            let value = sourceStyle.getPropertyValue(name);
            if (name === 'font-size' && value.endsWith('px')) {
                const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
                value = `${reducedFont}px`;
            }
            if (isInstanceOfElement(nativeNode, HTMLIFrameElement) &&
                name === 'display' &&
                value === 'inline') {
                value = 'block';
            }
            if (name === 'd' && clonedNode.getAttribute('d')) {
                value = `path(${clonedNode.getAttribute('d')})`;
            }
            targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
    }
}
function cloneInputValue(nativeNode, clonedNode) {
    if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) {
        clonedNode.innerHTML = nativeNode.value;
    }
    if (isInstanceOfElement(nativeNode, HTMLInputElement)) {
        clonedNode.setAttribute('value', nativeNode.value);
    }
}
function cloneSelectValue(nativeNode, clonedNode) {
    if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
        const clonedSelect = clonedNode;
        const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute('value'));
        if (selectedOption) {
            selectedOption.setAttribute('selected', '');
        }
    }
}
function decorate(nativeNode, clonedNode, options) {
    if (isInstanceOfElement(clonedNode, Element)) {
        cloneCSSStyle(nativeNode, clonedNode, options);
        clonePseudoElements(nativeNode, clonedNode, options);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
    }
    return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
    const uses = clone.querySelectorAll ? clone.querySelectorAll('use') : [];
    if (uses.length === 0) {
        return clone;
    }
    const processedDefs = {};
    for (let i = 0; i < uses.length; i++) {
        const use = uses[i];
        const id = use.getAttribute('xlink:href');
        if (id) {
            const exist = clone.querySelector(id);
            const definition = document.querySelector(id);
            if (!exist && definition && !processedDefs[id]) {
                // eslint-disable-next-line no-await-in-loop
                processedDefs[id] = (await cloneNode(definition, options, true));
            }
        }
    }
    const nodes = Object.values(processedDefs);
    if (nodes.length) {
        const ns = 'http://www.w3.org/1999/xhtml';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('xmlns', ns);
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';
        svg.style.display = 'none';
        const defs = document.createElementNS(ns, 'defs');
        svg.appendChild(defs);
        for (let i = 0; i < nodes.length; i++) {
            defs.appendChild(nodes[i]);
        }
        clone.appendChild(svg);
    }
    return clone;
}
async function cloneNode(node, options, isRoot) {
    if (!isRoot && options.filter && !options.filter(node)) {
        return null;
    }
    return Promise.resolve(node)
        .then((clonedNode) => cloneSingleNode(clonedNode, options))
        .then((clonedNode) => cloneChildren(node, clonedNode, options))
        .then((clonedNode) => decorate(node, clonedNode, options))
        .then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}
//# sourceMappingURL=clone-node.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/embed-resources.js



const URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
const URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
const FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
    // eslint-disable-next-line no-useless-escape
    const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, 'g');
}
function parseURLs(cssText) {
    const urls = [];
    cssText.replace(URL_REGEX, (raw, quotation, url) => {
        urls.push(url);
        return raw;
    });
    return urls.filter((url) => !isDataUrl(url));
}
async function embed_resources_embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
    try {
        const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
        const contentType = getMimeType(resourceURL);
        let dataURL;
        if (getContentFromUrl) {
            const content = await getContentFromUrl(resolvedURL);
            dataURL = makeDataUrl(content, contentType);
        }
        else {
            dataURL = await resourceToDataURL(resolvedURL, contentType, options);
        }
        return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
    }
    catch (error) {
        // pass
    }
    return cssText;
}
function filterPreferredFontFormat(str, { preferredFontFormat }) {
    return !preferredFontFormat
        ? str
        : str.replace(FONT_SRC_REGEX, (match) => {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
                if (!format) {
                    return '';
                }
                if (format === preferredFontFormat) {
                    return `src: ${src};`;
                }
            }
        });
}
function shouldEmbed(url) {
    return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
    if (!shouldEmbed(cssText)) {
        return cssText;
    }
    const filteredCSSText = filterPreferredFontFormat(cssText, options);
    const urls = parseURLs(filteredCSSText);
    return urls.reduce((deferred, url) => deferred.then((css) => embed_resources_embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}
//# sourceMappingURL=embed-resources.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/embed-images.js




async function embedProp(propName, node, options) {
    var _a;
    const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
    if (propValue) {
        const cssString = await embedResources(propValue, null, options);
        node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
        return true;
    }
    return false;
}
async function embedBackground(clonedNode, options) {
    ;
    (await embedProp('background', clonedNode, options)) ||
        (await embedProp('background-image', clonedNode, options));
    (await embedProp('mask', clonedNode, options)) ||
        (await embedProp('-webkit-mask', clonedNode, options)) ||
        (await embedProp('mask-image', clonedNode, options)) ||
        (await embedProp('-webkit-mask-image', clonedNode, options));
}
async function embedImageNode(clonedNode, options) {
    const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
    if (!(isImageElement && !isDataUrl(clonedNode.src)) &&
        !(isInstanceOfElement(clonedNode, SVGImageElement) &&
            !isDataUrl(clonedNode.href.baseVal))) {
        return;
    }
    const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
    const dataURL = await resourceToDataURL(url, getMimeType(url), options);
    await new Promise((resolve, reject) => {
        clonedNode.onload = resolve;
        clonedNode.onerror = options.onImageErrorHandler
            ? (...attributes) => {
                try {
                    resolve(options.onImageErrorHandler(...attributes));
                }
                catch (error) {
                    reject(error);
                }
            }
            : reject;
        const image = clonedNode;
        if (image.decode) {
            image.decode = resolve;
        }
        if (image.loading === 'lazy') {
            image.loading = 'eager';
        }
        if (isImageElement) {
            clonedNode.srcset = '';
            clonedNode.src = dataURL;
        }
        else {
            clonedNode.href.baseVal = dataURL;
        }
    });
}
async function embedChildren(clonedNode, options) {
    const children = toArray(clonedNode.childNodes);
    const deferreds = children.map((child) => embedImages(child, options));
    await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
    if (isInstanceOfElement(clonedNode, Element)) {
        await embedBackground(clonedNode, options);
        await embedImageNode(clonedNode, options);
        await embedChildren(clonedNode, options);
    }
}
//# sourceMappingURL=embed-images.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/apply-style.js
function applyStyle(node, options) {
    const { style } = node;
    if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
    }
    if (options.width) {
        style.width = `${options.width}px`;
    }
    if (options.height) {
        style.height = `${options.height}px`;
    }
    const manual = options.style;
    if (manual != null) {
        Object.keys(manual).forEach((key) => {
            style[key] = manual[key];
        });
    }
    return node;
}
//# sourceMappingURL=apply-style.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/embed-webfonts.js



const cssFetchCache = {};
async function fetchCSS(url) {
    let cache = cssFetchCache[url];
    if (cache != null) {
        return cache;
    }
    const res = await fetch(url);
    const cssText = await res.text();
    cache = { url, cssText };
    cssFetchCache[url] = cache;
    return cache;
}
async function embedFonts(data, options) {
    let cssText = data.cssText;
    const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
    const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
    const loadFonts = fontLocs.map(async (loc) => {
        let url = loc.replace(regexUrl, '$1');
        if (!url.startsWith('https://')) {
            url = new URL(url, data.url).href;
        }
        return fetchAsDataURL(url, options.fetchRequestInit, ({ result }) => {
            cssText = cssText.replace(loc, `url(${result})`);
            return [loc, result];
        });
    });
    return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
    if (source == null) {
        return [];
    }
    const result = [];
    const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
    // strip out comments
    let cssText = source.replace(commentsRegex, '');
    // eslint-disable-next-line prefer-regex-literals
    const keyframesRegex = new RegExp('((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})', 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const matches = keyframesRegex.exec(cssText);
        if (matches === null) {
            break;
        }
        result.push(matches[0]);
    }
    cssText = cssText.replace(keyframesRegex, '');
    const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
    // to match css & media queries together
    const combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]' +
        '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})';
    // unified regex
    const unifiedRegex = new RegExp(combinedCSSRegex, 'gi');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let matches = importRegex.exec(cssText);
        if (matches === null) {
            matches = unifiedRegex.exec(cssText);
            if (matches === null) {
                break;
            }
            else {
                importRegex.lastIndex = unifiedRegex.lastIndex;
            }
        }
        else {
            unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
    }
    return result;
}
async function getCSSRules(styleSheets, options) {
    const ret = [];
    const deferreds = [];
    // First loop inlines imports
    styleSheets.forEach((sheet) => {
        if ('cssRules' in sheet) {
            try {
                toArray(sheet.cssRules || []).forEach((item, index) => {
                    if (item.type === CSSRule.IMPORT_RULE) {
                        let importIndex = index + 1;
                        const url = item.href;
                        const deferred = fetchCSS(url)
                            .then((metadata) => embedFonts(metadata, options))
                            .then((cssText) => parseCSS(cssText).forEach((rule) => {
                            try {
                                sheet.insertRule(rule, rule.startsWith('@import')
                                    ? (importIndex += 1)
                                    : sheet.cssRules.length);
                            }
                            catch (error) {
                                console.error('Error inserting rule from remote css', {
                                    rule,
                                    error,
                                });
                            }
                        }))
                            .catch((e) => {
                            console.error('Error loading remote css', e.toString());
                        });
                        deferreds.push(deferred);
                    }
                });
            }
            catch (e) {
                const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
                if (sheet.href != null) {
                    deferreds.push(fetchCSS(sheet.href)
                        .then((metadata) => embedFonts(metadata, options))
                        .then((cssText) => parseCSS(cssText).forEach((rule) => {
                        inline.insertRule(rule, inline.cssRules.length);
                    }))
                        .catch((err) => {
                        console.error('Error loading remote stylesheet', err);
                    }));
                }
                console.error('Error inlining remote css file', e);
            }
        }
    });
    return Promise.all(deferreds).then(() => {
        // Second loop parses rules
        styleSheets.forEach((sheet) => {
            if ('cssRules' in sheet) {
                try {
                    toArray(sheet.cssRules || []).forEach((item) => {
                        ret.push(item);
                    });
                }
                catch (e) {
                    console.error(`Error while reading CSS rules from ${sheet.href}`, e);
                }
            }
        });
        return ret;
    });
}
function getWebFontRules(cssRules) {
    return cssRules
        .filter((rule) => rule.type === CSSRule.FONT_FACE_RULE)
        .filter((rule) => shouldEmbed(rule.style.getPropertyValue('src')));
}
async function parseWebFontRules(node, options) {
    if (node.ownerDocument == null) {
        throw new Error('Provided element is not within a Document');
    }
    const styleSheets = toArray(node.ownerDocument.styleSheets);
    const cssRules = await getCSSRules(styleSheets, options);
    return getWebFontRules(cssRules);
}
function normalizeFontFamily(font) {
    return font.trim().replace(/["']/g, '');
}
function getUsedFonts(node) {
    const fonts = new Set();
    function traverse(node) {
        const fontFamily = node.style.fontFamily || getComputedStyle(node).fontFamily;
        fontFamily.split(',').forEach((font) => {
            fonts.add(normalizeFontFamily(font));
        });
        Array.from(node.children).forEach((child) => {
            if (child instanceof HTMLElement) {
                traverse(child);
            }
        });
    }
    traverse(node);
    return fonts;
}
async function getWebFontCSS(node, options) {
    const rules = await parseWebFontRules(node, options);
    const usedFonts = getUsedFonts(node);
    const cssTexts = await Promise.all(rules
        .filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily)))
        .map((rule) => {
        const baseUrl = rule.parentStyleSheet
            ? rule.parentStyleSheet.href
            : null;
        return embedResources(rule.cssText, baseUrl, options);
    }));
    return cssTexts.join('\n');
}
async function embedWebFonts(clonedNode, options) {
    const cssText = options.fontEmbedCSS != null
        ? options.fontEmbedCSS
        : options.skipFonts
            ? null
            : await getWebFontCSS(clonedNode, options);
    if (cssText) {
        const styleNode = document.createElement('style');
        const sytleContent = document.createTextNode(cssText);
        styleNode.appendChild(sytleContent);
        if (clonedNode.firstChild) {
            clonedNode.insertBefore(styleNode, clonedNode.firstChild);
        }
        else {
            clonedNode.appendChild(styleNode);
        }
    }
}
//# sourceMappingURL=embed-webfonts.js.map
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/node_modules/html-to-image/es/index.js





async function toSvg(node, options = {}) {
    const { width, height } = getImageSize(node, options);
    const clonedNode = (await cloneNode(node, options, true));
    await embedWebFonts(clonedNode, options);
    await embedImages(clonedNode, options);
    applyStyle(clonedNode, options);
    const datauri = await nodeToDataURL(clonedNode, width, height);
    return datauri;
}
async function toCanvas(node, options = {}) {
    const { width, height } = getImageSize(node, options);
    const svg = await toSvg(node, options);
    const img = await createImage(svg);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const ratio = options.pixelRatio || getPixelRatio();
    const canvasWidth = options.canvasWidth || width;
    const canvasHeight = options.canvasHeight || height;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    if (!options.skipAutoScale) {
        checkCanvasDimensions(canvas);
    }
    canvas.style.width = `${canvasWidth}`;
    canvas.style.height = `${canvasHeight}`;
    if (options.backgroundColor) {
        context.fillStyle = options.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
}
async function toPixelData(node, options = {}) {
    const { width, height } = getImageSize(node, options);
    const canvas = await toCanvas(node, options);
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, width, height).data;
}
async function toPng(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL();
}
async function toJpeg(node, options = {}) {
    const canvas = await toCanvas(node, options);
    return canvas.toDataURL('image/jpeg', options.quality || 1);
}
async function toBlob(node, options = {}) {
    const canvas = await toCanvas(node, options);
    const blob = await canvasToBlob(canvas);
    return blob;
}
async function getFontEmbedCSS(node, options = {}) {
    return getWebFontCSS(node, options);
}
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// EXTERNAL MODULE: external "CorePluginsAdmin"
var external_CorePluginsAdmin_ = __webpack_require__("a5a2");

// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/heatmapGradient.ts
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
// Single source of truth for all heatmap colors (click/move overlays, scroll
// overlay and the legend gradient). Stops must be ordered ascending by `stop`.
const HEATMAP_GRADIENT_STOPS = [{
  stop: 0.0,
  rgb: [43, 89, 255]
}, {
  stop: 0.2,
  rgb: [22, 184, 192]
}, {
  stop: 0.4,
  rgb: [76, 175, 80]
}, {
  stop: 0.6,
  rgb: [255, 224, 0]
}, {
  stop: 0.8,
  rgb: [245, 124, 0]
}, {
  stop: 1.0,
  rgb: [229, 57, 53]
} // #E53935
];
function toHeatmapJsGradient(stops = HEATMAP_GRADIENT_STOPS) {
  const gradient = {};
  for (let i = 0; i < stops.length; i += 1) {
    gradient[`${stops[i].stop}`] = `rgb(${stops[i].rgb[0]},${stops[i].rgb[1]},${stops[i].rgb[2]})`;
  }
  return gradient;
}
function interpolateGradientColor(intensity, min, max, stops = HEATMAP_GRADIENT_STOPS) {
  const lastStop = stops[stops.length - 1];
  if (min === max || !min && !max) {
    return [lastStop.rgb[0], lastStop.rgb[1], lastStop.rgb[2]];
  }
  let t = (intensity - min) / (max - min);
  t = Math.min(Math.max(t, 0), 1);
  let lower = stops[0];
  let upper = lastStop;
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (t >= stops[i].stop && t <= stops[i + 1].stop) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }
  const range = upper.stop - lower.stop;
  const ratio = range === 0 ? 0 : (t - lower.stop) / range;
  return [Math.round(lower.rgb[0] + (upper.rgb[0] - lower.rgb[0]) * ratio), Math.round(lower.rgb[1] + (upper.rgb[1] - lower.rgb[1]) * ratio), Math.round(lower.rgb[2] + (upper.rgb[2] - lower.rgb[2]) * ratio)];
}
function generateGradientImgData(width = 100, height = 10, stops = HEATMAP_GRADIENT_STOPS) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  for (let i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(stops[i].stop, `rgb(${stops[i].rgb[0]},${stops[i].rgb[1]},${stops[i].rgb[2]})`);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
}
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
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue?vue&type=template&id=792e9515

const Tooltipvue_type_template_id_792e9515_hoisted_1 = {
  class: "tooltip-item"
};
const Tooltipvue_type_template_id_792e9515_hoisted_2 = {
  class: "tooltip-label"
};
const Tooltipvue_type_template_id_792e9515_hoisted_3 = {
  class: "tooltip-value"
};
const Tooltipvue_type_template_id_792e9515_hoisted_4 = {
  class: "tooltip-item"
};
const Tooltipvue_type_template_id_792e9515_hoisted_5 = {
  class: "tooltip-label"
};
const Tooltipvue_type_template_id_792e9515_hoisted_6 = {
  class: "tooltip-value"
};
function Tooltipvue_type_template_id_792e9515_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    ref: "tooltipRef",
    class: "tooltip",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])(_ctx.tooltipStyle)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Tooltipvue_type_template_id_792e9515_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_792e9515_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickCountTranslation), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_792e9515_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickCount), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Tooltipvue_type_template_id_792e9515_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_792e9515_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickRateTranslation), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Tooltipvue_type_template_id_792e9515_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getClickRate), 1)])], 4)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.visible]]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/Tooltip/Tooltip.vue?vue&type=template&id=792e9515

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
    // The tooltip follows the cursor, so it is positioned in viewport
    // coordinates via position: fixed. It must not be position: absolute:
    // that would resolve the coordinates against the nearest positioned
    // ancestor (the report card, as .card is position: relative), shifting
    // the tooltip away from the cursor by that ancestor's page offset.
    const tooltipStyle = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => ({
      top: `${state.position.top}px`,
      left: `${state.position.left}px`,
      position: 'fixed',
      zIndex: 1000
    }));
    function show(event) {
      state.position.top = event.clientY + 10;
      state.position.left = event.clientX + 10;
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
            state.position.left = event.clientX - tooltipRect.width - 10;
          }
          if (tooltipRect.bottom > innerHeight) {
            state.position.top = event.clientY - tooltipRect.height - 10;
          }
          const adjustedTooltipRect = tooltipElement.getBoundingClientRect();
          if (adjustedTooltipRect.left < 0) {
            state.position.left = 10;
          }
          if (adjustedTooltipRect.top < 0) {
            state.position.top = 10;
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



Tooltipvue_type_script_lang_ts.render = Tooltipvue_type_template_id_792e9515_render

/* harmony default export */ var Tooltip = (Tooltipvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapEmptyState.vue?vue&type=template&id=7a3200ad

const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_1 = {
  class: "heatmapEmptyState"
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_2 = {
  class: "heatmapEmptyStateIcon"
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_3 = {
  key: 0,
  src: "plugins/HeatmapSessionRecording/images/no-interactions.svg",
  width: "34",
  height: "38",
  alt: ""
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_4 = {
  key: 1,
  class: "icon-delete"
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_5 = {
  class: "heatmapEmptyStateTitle"
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_6 = {
  class: "heatmapEmptyStateSubtitle"
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_7 = {
  class: "heatmapEmptyStateCodeWrapper"
};
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_8 = ["textContent"];
const HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_9 = ["href"];
function HeatmapEmptyStatevue_type_template_id_7a3200ad_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_copy_to_clipboard = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("copy-to-clipboard");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_2, [_ctx.state === 'noInteractions' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("img", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_3)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_4))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.title), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.subtitle), 1), _ctx.state === 'deletedManual' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
    key: 0
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("pre", {
    class: "heatmapEmptyStateCode",
    textContent: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.captureCommand)
  }, null, 8, HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_8), [[_directive_copy_to_clipboard, {}]])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    class: "heatmapEmptyStateGuide btn",
    target: "_blank",
    rel: "noreferrer noopener",
    href: _ctx.guideUrl
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ReadTheGuide')), 9, HeatmapEmptyStatevue_type_template_id_7a3200ad_hoisted_9)], 64)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapEmptyState.vue?vue&type=template&id=7a3200ad

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapEmptyState.vue?vue&type=script&lang=ts


const GUIDE_URL = 'https://matomo.org/faq/heatmap-session-recording/how-to-capture-the-initial-heatmap-snapshot-manually/';
/* harmony default export */ var HeatmapEmptyStatevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  directives: {
    CopyToClipboard: external_CoreHome_["CopyToClipboard"]
  },
  props: {
    // one of: noInteractions, deletedAuto, deletedManual, deletedPaused, deletedNoRetake
    state: {
      type: String,
      required: true
    },
    idSiteHsr: {
      type: Number,
      required: true
    }
  },
  computed: {
    title() {
      if (this.state === 'noInteractions') {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateNoInteractionsTitle');
      }
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateSnapshotDeletedTitle');
    },
    subtitle() {
      switch (this.state) {
        case 'noInteractions':
          return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateNoInteractionsSubtitle');
        case 'deletedManual':
          return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateSnapshotDeletedManualSubtitle');
        case 'deletedPaused':
          return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateSnapshotDeletedPausedSubtitle');
        case 'deletedNoRetake':
          return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateSnapshotDeletedEndedSubtitle');
        default:
          return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_EmptyStateSnapshotDeletedAutoSubtitle');
      }
    },
    captureCommand() {
      return `_paq.push(['HeatmapSessionRecording::captureInitialDom', ${this.idSiteHsr}])`;
    },
    guideUrl() {
      // externalRawLink adds the matomo.org campaign parameters to the FAQ URL.
      return Object(external_CoreHome_["externalRawLink"])(GUIDE_URL);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapEmptyState.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapEmptyState.vue



HeatmapEmptyStatevue_type_script_lang_ts.render = HeatmapEmptyStatevue_type_template_id_7a3200ad_render

/* harmony default export */ var HeatmapEmptyState = (HeatmapEmptyStatevue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVis.vue?vue&type=script&lang=ts










const {
  $
} = window;
const deviceDesktop = 1;
const deviceTablet = 2;
const deviceMobile = 3;
// Summary card ranking thresholds: how many candidate elements we track before
// re-aggregating clicks by bounding box, how many we ultimately display, and the
// maximum length of an element label before it is truncated.
const MAX_TRACKED_CLICK_ELEMENTS = 15;
const MAX_TOP_CLICKED_ELEMENTS = 5;
const MAX_CLICKED_ELEMENT_LABEL_LENGTH = 60;
// Measured space the environment's vertical scrollbar actually consumes in
// the frame (see getScrollbarGutterWidth); cached for the page's lifetime.
let measuredScrollbarGutter = null;
// Folds at/above this share of the page height don't get a fold line: they
// mean the page was (nearly) fully visible in the visitors' viewports, where
// "nearly" absorbs the tracker's document-height padding from body margins
// and scrollbars (a fully-seen page typically tracks ~99%, not 100%).
const FOLD_LINE_MAX_PERCENT = 97;
// The summary's "Bottom" band tolerates the same padding: a visitor whose
// viewport covered the whole page tracks a depth just short of 1000‰, and
// requiring exactly 1000 would report Bottom 0% for a fully-seen page.
const SCROLL_REACH_BOTTOM_MARK = FOLD_LINE_MAX_PERCENT * 10;
// Elements the summary card prefers to attribute clicks to; clicks on their
// descendants roll up to them, and their full descendant text is a safe label.
const INTERACTIVE_ELEMENTS_SELECTOR = 'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [tabindex]';
// Structural/landmark elements only surface in the summary card through the
// container fallback and otherwise have no descriptive label, so they get a
// semantic type. The generic "table" reuses the shared core translation.
const STRUCTURAL_TYPE_KEYS = {
  nav: 'HeatmapSessionRecording_ElementTypeNavigation',
  ul: 'HeatmapSessionRecording_ElementTypeList',
  ol: 'HeatmapSessionRecording_ElementTypeList',
  form: 'HeatmapSessionRecording_ElementTypeForm',
  header: 'HeatmapSessionRecording_ElementTypeHeader',
  footer: 'HeatmapSessionRecording_ElementTypeFooter',
  main: 'HeatmapSessionRecording_ElementTypeMainContent',
  aside: 'HeatmapSessionRecording_ElementTypeSidebar',
  section: 'HeatmapSessionRecording_ElementTypeSection',
  article: 'HeatmapSessionRecording_ElementTypeArticle',
  table: 'General_Table'
};
// Container tags excluded from the preferred (interactive-only) pass when they
// have child elements: derived from the structural map above so the two can
// never drift apart, plus containers that have no semantic label of their own.
const GENERIC_CONTAINER_TAGS = Object.keys(STRUCTURAL_TYPE_KEYS).concat(['div', 'li', 'td', 'th', 'tr', 'tbody', 'thead']);
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
    const colorValues = interpolateGradientColor(bucket.percentageValue, minValue, maxValue);
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
}
function actualRenderHeatmap(recordingPlayer, heatmapContainer,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
recordingIframe, dataPoints) {
  const numHeatmaps = initHeatmap(recordingPlayer, heatmapContainer, recordingIframe);
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
      blur: 0.75,
      gradient: toHeatmapJsGradient()
    };
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
async function backgroundRenders(url, ownerDoc) {
  const probe = ownerDoc.createElement('img');
  probe.src = url;
  try {
    await probe.decode();
    return true;
  } catch (e) {
    return false;
  }
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
    createdDateRaw: {
      type: String,
      required: true
    },
    heatmapName: {
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
    },
    imageProxyNonce: {
      type: String,
      default: ''
    },
    // Whether a snapshot (page tree mirror) exists; when false the empty state renders instead.
    hasSnapshot: {
      type: Boolean,
      default: true
    },
    // Whether the heatmap only captures its snapshot manually (drives the empty-state text).
    captureManually: Boolean,
    // Whether a snapshot was previously deleted (tells "deleted" apart from "never captured").
    snapshotDeleted: Boolean,
    // Whether the heatmap is paused (resumable) rather than ended (permanent); the deleted
    // empty state tells the user capture resumes once the heatmap is resumed.
    isPaused: Boolean
  },
  components: {
    Field: external_CorePluginsAdmin_["Field"],
    Tooltip: Tooltip,
    HeatmapEmptyState: HeatmapEmptyState
  },
  data() {
    return {
      isLoading: false,
      isExporting: false,
      iframeWidth: this.desktopPreviewSize,
      customIframeWidth: this.desktopPreviewSize,
      avgFold: 0,
      summaryAvgFold: 0,
      heatmapType: this.heatmapTypes[0].key,
      deviceType: this.deviceTypes[0].key,
      iframeResolutions: this.iframeResolutionsValues,
      actualNumSamples: this.numSamples,
      dataCoordinates: [],
      currentElement: null,
      totalClicks: 0,
      topClickedElements: [],
      scrollReach: [],
      fetchGeneration: 0,
      scrollAreaMaxHeight: 0,
      previewScale: 1,
      recordingHeight: 0,
      summaryCardHeight: 0,
      frameNeedsVScroll: true,
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
      getRecordedClickHeatmap: oneAtATime('HeatmapSessionRecording.getRecordedHeatmap'),
      getRecordedScrollHeatmap: oneAtATime('HeatmapSessionRecording.getRecordedHeatmap'),
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
  mounted() {
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  },
  updated() {
    // The summary card grows as its async data lands; keep the frame's
    // height floor in sync (guarded internally against re-render loops).
    this.updateSummaryCardHeight();
  },
  emits: ['exporting'],
  watch: {
    isExporting() {
      // let the parent (settings dropdown) reflect the export progress
      this.$emit('exporting', this.isExporting);
    },
    isLoading() {
      if (this.isLoading === true) {
        return;
      }
      // The chrome above/below the scroll area can change once the report has
      // rendered (toolbar wrapping, the delete-screenshot button appearing).
      this.$nextTick(() => this.onWindowResize());
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
    window.removeEventListener('resize', this.onWindowResize);
    this.removeScrollHeatmap();
  },
  methods: {
    onWindowResize() {
      // Order matters: the scale (and its scrollbar decision) reads the cap
      // and the card height measured by the two calls before it.
      this.updateScrollAreaMaxHeight();
      this.updateSummaryCardHeight();
      this.updatePreviewScale();
    },
    // How much layout width the environment's vertical scrollbar takes inside
    // the frame: ~10px (the styled webkit width) with classic scrollbars,
    // 0 where scrollbars overlay or are hidden (macOS default, headless
    // screenshot runs) — subtracting a fixed allowance there left a hole to
    // the card's right. Probed once with the frame's own styling.
    getScrollbarGutterWidth() {
      if (measuredScrollbarGutter === null) {
        const probe = document.createElement('div');
        probe.className = 'heatmapScrollArea';
        probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;' + 'width:100px;height:100px;border:0;padding:0;overflow-y:scroll;';
        document.body.appendChild(probe);
        measuredScrollbarGutter = Math.max(0, probe.offsetWidth - probe.clientWidth);
        probe.remove();
      }
      return measuredScrollbarGutter;
    },
    // Height of the summary card while it sits beside the frame (row layout);
    // 0 in the stacked layout, where flooring the frame to the card would
    // only inflate it. Measured rather than computed because the card's
    // height depends on its async-loaded content; also re-measured from
    // updated() so content arriving later is picked up.
    updateSummaryCardHeight() {
      const area = this.$refs.heatmapScrollArea;
      const layout = area === null || area === void 0 ? void 0 : area.parentElement;
      const card = layout === null || layout === void 0 ? void 0 : layout.querySelector('.heatmapSummaryCard');
      if (!layout || !card) {
        return;
      }
      const stacked = window.getComputedStyle(layout).flexDirection === 'column';
      const height = stacked ? 0 : Math.round(card.getBoundingClientRect().height);
      // Guarded assignment: this runs from updated(), so writing an unchanged
      // value would re-render in a loop.
      if (height !== this.summaryCardHeight) {
        this.summaryCardHeight = height;
      }
    },
    // Fits a preview wider than the viewing area by scaling it down: the
    // recorded page keeps its true layout width inside the iframe (so the
    // heatmap data stays aligned with the elements it was recorded against)
    // and the rendered result shrinks uniformly, like the replay player.
    // Narrower previews stay at 1:1 and are centered instead.
    updatePreviewScale() {
      const area = this.$refs.heatmapScrollArea;
      const layout = area === null || area === void 0 ? void 0 : area.parentElement;
      if (!area || !layout || !layout.clientWidth || !this.iframeWidth) {
        return;
      }
      // The frame hugs the (scaled) snapshot, so its own width cannot drive
      // the scale (it *is* the scale). The available width is the layout
      // row's, minus the summary card and the row gap beside it — the frame
      // may only grow as far as the card still fits — minus the frame's
      // borders.
      const layoutStyles = window.getComputedStyle(layout);
      const areaStyles = window.getComputedStyle(area);
      const stacked = layoutStyles.flexDirection === 'column';
      const card = layout.querySelector('.heatmapSummaryCard');
      const cardSpace = !stacked && card ? card.getBoundingClientRect().width + (parseFloat(layoutStyles.columnGap || '0') || 0) : 0;
      const borders = (parseFloat(areaStyles.borderLeftWidth || '0') || 0) + (parseFloat(areaStyles.borderRightWidth || '0') || 0);
      const available = layout.clientWidth - cardSpace - borders;
      if (available <= 0) {
        return;
      }
      const round4 = value => Math.round(value * 10000) / 10000;
      // Two candidate scales, decided from first principles rather than live
      // scrollbar measurements (which would oscillate at the boundary: hiding
      // the scrollbar widens the area, raising the scale, which can re-need
      // the scrollbar). If the preview fits the frame's height without the
      // scrollbar's gutter, no vertical scrolling is possible and the gutter
      // is dropped entirely; otherwise the scale accounts for the gutter.
      const scaleWithoutGutter = Math.min(1, round4(available / this.iframeWidth));
      const frameHeight = this.scrollAreaMaxHeight ? Math.max(Math.min(this.scrollAreaMaxHeight, this.recordingHeight || Infinity), this.summaryCardHeight) : Infinity;
      const fits = !this.recordingHeight || scaleWithoutGutter * this.recordingHeight <= frameHeight;
      this.frameNeedsVScroll = !fits;
      this.previewScale = fits ? scaleWithoutGutter : Math.min(1, round4((available - this.getScrollbarGutterWidth()) / this.iframeWidth));
    },
    // Caps the scroll area so the report's bottom edge lands at the bottom of
    // the window (16px gap): the recording scrolls inside the frame while the
    // content below it (e.g. the delete-screenshot button) stays visible.
    // Measured live rather than a calc(100vh - X) constant because the
    // surrounding chrome varies (toolbar wrapping, notifications, admin vs
    // widgetized page headers).
    updateScrollAreaMaxHeight() {
      const area = this.$refs.heatmapScrollArea;
      const root = this.$el;
      if (!area || !(root !== null && root !== void 0 && root.getBoundingClientRect)) {
        return;
      }
      const layout = area.parentElement;
      const areaRect = area.getBoundingClientRect();
      // Content that must stay visible below the frame (the delete-screenshot
      // block), measured from the layout row's bottom rather than the area's
      // own: the row's bottom tracks its tallest child, so this stays
      // constant — and recomputation stable — even when the summary card
      // outgrows the capped area.
      const belowChrome = layout ? root.getBoundingClientRect().bottom - layout.getBoundingClientRect().bottom : 0;
      // The area's top as if the page were scrolled to the top, so the cap is
      // stable no matter when this runs.
      const areaTop = areaRect.top + window.scrollY;
      this.scrollAreaMaxHeight = Math.max(400, window.innerHeight - areaTop - belowChrome - 16);
    },
    // The metadata endpoint returns sample counts as strings (HeatmapMetadata's
    // `number` notwithstanding), so anything doing arithmetic on them must
    // coerce first: summing raw values concatenates ("0" + "2" + "0" -> "020")
    // and silently produces absurd device shares.
    getDeviceSamples(deviceKey) {
      return parseInt(String(this.actualNumSamples[`nb_samples_device_${deviceKey}`]), 10) || 0;
    },
    resolveClickedElement(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recordingIframe, selector) {
      const $element = recordingIframe.findElement(selector);
      const rawElement = $element && $element[0] ? $element[0] : null;
      if (!rawElement) {
        return null;
      }
      // Resolve permissively (containers allowed) but remember whether the click
      // also resolves to a preferred, non-container element, so a single pass can
      // serve both the interactive-only and the container-fallback rankings.
      const element = this.normalizeClickedElement(rawElement, true);
      if (!element) {
        return null;
      }
      return {
        key: this.getElementKey(element),
        label: this.getElementLabel(element, selector),
        boundingRectangle: element.getBoundingClientRect(),
        isPreferred: this.normalizeClickedElement(rawElement, false) !== null
      };
    },
    normalizeClickedElement(element, includeContainers) {
      const interactiveParent = element.closest(INTERACTIVE_ELEMENTS_SELECTOR);
      if (interactiveParent) {
        return interactiveParent;
      }
      const wrapped = this.getWrappedInteractiveElement(element);
      if (wrapped) {
        return wrapped;
      }
      if (!this.isUsefulClickedElement(element, includeContainers)) {
        return null;
      }
      return element;
    },
    // A presentational wrapper around exactly one interactive element (an image
    // inside a link, a button padded by a div) credits that element - the mirror
    // of the ancestor roll-up above. Landmark containers (nav, section, aside...)
    // keep their own identity, and a wrapper with its own text is more than a
    // pass-through, so both are left alone.
    getWrappedInteractiveElement(element) {
      const tagName = element.tagName.toLowerCase();
      if (STRUCTURAL_TYPE_KEYS[tagName] || this.getElementText(element)) {
        return null;
      }
      const interactive = element.querySelectorAll(INTERACTIVE_ELEMENTS_SELECTOR);
      return interactive.length === 1 ? interactive[0] : null;
    },
    isUsefulClickedElement(element, includeContainers) {
      const tagName = element.tagName.toLowerCase();
      if (['html', 'body'].indexOf(tagName) !== -1) {
        return false;
      }
      if (/^h[1-6]$/.test(tagName)) {
        return true;
      }
      // When too few interactive elements were found, generic containers are
      // allowed as a fallback so the summary card is not left mostly empty.
      if (includeContainers) {
        return true;
      }
      return !(GENERIC_CONTAINER_TAGS.indexOf(tagName) !== -1 && element.children.length);
    },
    getElementKey(element) {
      const id = element.getAttribute('id');
      if (id) {
        return `${element.tagName.toLowerCase()}#${id}`;
      }
      const name = element.getAttribute('name');
      if (name) {
        return `${element.tagName.toLowerCase()}[name="${name}"]`;
      }
      // No stable attribute: derive a deterministic path from the resolved element
      // itself. The recorded click selector varies by which child node was hit, so
      // keying on it would split repeated clicks on the same element into separate
      // entries; a path built from the element merges them.
      return this.getElementPath(element);
    },
    getElementPath(element) {
      const segments = [];
      let current = element;
      while (current) {
        const tagName = current.tagName.toLowerCase();
        if (tagName === 'body' || tagName === 'html') {
          break;
        }
        const id = current.getAttribute('id');
        if (id) {
          segments.unshift(`${tagName}#${id}`);
          break;
        }
        const parent = current.parentElement;
        if (!parent) {
          segments.unshift(tagName);
          break;
        }
        const sameTag = current.tagName;
        const index = Array.from(parent.children).filter(child => child.tagName === sameTag).indexOf(current) + 1;
        segments.unshift(`${tagName}:nth-of-type(${index})`);
        current = parent;
      }
      return segments.join('>') || element.tagName.toLowerCase();
    },
    getElementLabel(element, selector) {
      const tagName = element.tagName.toLowerCase();
      const htmlElementType = element.getAttribute('type');
      const rawLabel = [this.getElementText(element), element.getAttribute('aria-label'), element.getAttribute('title'), element.getAttribute('alt'), element.getAttribute('placeholder'), element.getAttribute('name'), element.getAttribute('id'), htmlElementType === 'button' ? element.getAttribute('value') || '' : '', this.getDescendantImageLabel(element), selector, tagName].map(value => (value || '').replace(/\s+/g, ' ').trim()).find(value => !!value) || tagName;
      const label = rawLabel.length > MAX_CLICKED_ELEMENT_LABEL_LENGTH ? `${rawLabel.slice(0, MAX_CLICKED_ELEMENT_LABEL_LENGTH - 3)}...` : rawLabel;
      const type = this.getElementTypeLabel(element);
      return type ? Object(external_CoreHome_["translate"])('HeatmapSessionRecording_TopClickedElementLabel', label, type) : label;
    },
    getElementText(element) {
      // An interactive element owns all its descendant text (<a><span>Buy
      // now</span></a>), so the full text is its visible label. Containers and
      // headings only use direct text nodes: labelling a nav by the text of its
      // first link would be misleading.
      const text = element.matches(INTERACTIVE_ELEMENTS_SELECTOR) ? element.textContent || '' : [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent || '').join(' ');
      return text.replace(/\s+/g, ' ').trim();
    },
    // An interactive element whose only content is an image (a thumbnail link,
    // an icon button) carries no text of its own, so the image's alt/title is
    // the natural label. Used as a fallback before the raw selector.
    getDescendantImageLabel(element) {
      const img = element.querySelector('img');
      if (!img) {
        return '';
      }
      return (img.getAttribute('alt') || img.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
    },
    getElementTypeLabel(element) {
      const tagName = element.tagName.toLowerCase();
      const role = element.getAttribute('role');
      const htmlElementType = element.getAttribute('type');
      // An image, or an interactive element whose only content is an image (a
      // linked thumbnail), reads to a visitor as an image. Calling it a "link"
      // would misdirect them to the separate text link that often sits beside it.
      if (tagName === 'img' || element.matches(INTERACTIVE_ELEMENTS_SELECTOR) && !this.getElementText(element) && element.querySelector('img')) {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ElementTypeImage');
      }
      if (tagName === 'a' || role === 'link') {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ElementTypeLink');
      }
      if (tagName === 'button' || role === 'button' || htmlElementType === 'button') {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ElementTypeButton');
      }
      if (/^h[1-6]$/.test(tagName)) {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ElementTypeHeading');
      }
      if (['input', 'select', 'textarea'].indexOf(tagName) !== -1) {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ElementTypeField');
      }
      const typeKey = STRUCTURAL_TYPE_KEYS[tagName];
      return typeKey ? Object(external_CoreHome_["translate"])(typeKey) : '';
    },
    formatTopClickedElements(clickedElements, totalClicks) {
      return [...clickedElements.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, MAX_TOP_CLICKED_ELEMENTS).map(element => {
        const percent = totalClicks ? Math.round(element.count / totalClicks * 100) : 0;
        return Object.assign(Object.assign({}, element), {}, {
          percent,
          percentLabel: external_CoreHome_["NumberFormatter"].formatPercent(percent)
        });
      });
    },
    getScrollReach(rows) {
      const total = rows.reduce((sum, row) => sum + (parseInt(row.value, 10) || 0), 0);
      // No scroll data: return no bands so the empty state renders (rather than a
      // ladder of 0% rows).
      if (!total) {
        return [];
      }
      // Cumulative reach at 0/25/50/75/100% of the page (row.label is the max
      // scroll depth on a 0-1000 scale). "Top" counts every visit; each following
      // row counts visits that scrolled at least that far; "Bottom" is visits
      // that reached the very end of the page.
      const marks = [{
        key: 'top',
        mark: 0,
        label: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ScrollReachTop')
      }, {
        key: 'q25',
        mark: 250,
        label: external_CoreHome_["NumberFormatter"].formatPercent(25)
      }, {
        key: 'q50',
        mark: 500,
        label: external_CoreHome_["NumberFormatter"].formatPercent(50)
      }, {
        key: 'q75',
        mark: 750,
        label: external_CoreHome_["NumberFormatter"].formatPercent(75)
      }, {
        key: 'bottom',
        mark: SCROLL_REACH_BOTTOM_MARK,
        label: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ScrollReachBottom')
      }];
      return marks.map(({
        key,
        mark,
        label
      }) => {
        const reached = rows.reduce((sum, row) => (parseInt(row.label, 10) || 0) >= mark ? sum + (parseInt(row.value, 10) || 0) : sum, 0);
        const percent = Math.round(reached / total * 100);
        return {
          key,
          label,
          percent,
          percentLabel: external_CoreHome_["NumberFormatter"].formatPercent(percent)
        };
      });
    },
    // True while `generation` is still the most recent fetchHeatmap call. The
    // summary-card requests run on their own oneAtATime closures that the primary
    // heatmap request never aborts, so their callbacks use this to drop a stale
    // (superseded) response before it overwrites the card.
    isCurrentFetch(generation) {
      return generation === this.fetchGeneration;
    },
    // Applies a background scroll-reach response, ignoring it when a newer fetch
    // has superseded it.
    applyScrollReach(rows, generation) {
      if (!this.isCurrentFetch(generation)) {
        return;
      }
      this.scrollReach = this.getScrollReach(rows);
    },
    getHeatmapDataPoints(rows,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recordingIframe) {
      const dataPoints = {
        min: 0,
        max: 0,
        data: []
      };
      let totalValue = 0;
      let numEntriesHigherThan1 = 0;
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        if (row.selector) {
          const value = parseInt(row.value, 10) || 0;
          const dataPoint = recordingIframe.getCoordinatesInFrame(row.selector, row.offset_x, row.offset_y, this.offsetAccuracy, true);
          if (dataPoint) {
            dataPoint.value = row.value;
            dataPoint.selector = row.selector;
            dataPoints.data.push(dataPoint);
            totalValue += value;
            if (value > 1) {
              numEntriesHigherThan1 += 1;
            }
          }
        }
      }
      return {
        dataPoints,
        numEntriesHigherThan1,
        totalValue
      };
    },
    getTopClickedElements(dataPoints,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recordingIframe, totalClicks) {
      const candidates = this.collectClickCandidates(dataPoints, recordingIframe);
      // Prefer interactive elements (links, buttons, fields...). Only fall back to
      // including generic containers when too few preferred elements were clicked.
      const preferred = new Map(Array.from(candidates.entries()).filter(([, candidate]) => candidate.isPreferred));
      const chosen = preferred.size >= MAX_TOP_CLICKED_ELEMENTS ? preferred : candidates;
      return this.rankClickedElements(chosen, dataPoints, totalClicks);
    },
    collectClickCandidates(dataPoints,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recordingIframe) {
      const candidates = new Map();
      const resolvedCache = new Map();
      // Single pass: resolve each clicked selector once (DOM lookups are the
      // expensive part) and tally selector-based counts per resolved element.
      dataPoints.data.forEach(dp => {
        const value = parseInt(dp.value, 10) || 0;
        if (!dp.selector || !value) {
          return;
        }
        let resolved = resolvedCache.get(dp.selector);
        if (!resolvedCache.has(dp.selector)) {
          resolved = this.resolveClickedElement(recordingIframe, dp.selector);
          resolvedCache.set(dp.selector, resolved);
        }
        if (!resolved) {
          return;
        }
        const existing = candidates.get(resolved.key);
        if (existing) {
          existing.count += value;
        } else {
          candidates.set(resolved.key, Object.assign(Object.assign({}, resolved), {}, {
            count: value,
            percent: 0,
            percentLabel: external_CoreHome_["NumberFormatter"].formatPercent(0)
          }));
        }
      });
      return candidates;
    },
    rankClickedElements(clickedElements, dataPoints, totalClicks) {
      // Keep the top candidates. Capture their selector-based counts, then clear
      // them so the geometric pass below can re-tally clicks by bounding box (to
      // match the heatmap tooltip, which aggregates clicks landing in an element).
      const reducedClickedElements = new Map(Array.from(clickedElements.entries()).sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label)).slice(0, MAX_TRACKED_CLICK_ELEMENTS));
      const selectorCounts = new Map();
      reducedClickedElements.forEach((element, key) => {
        selectorCounts.set(key, element.count);
        element.count = 0;
      });
      // Attribute each click to exactly one candidate: the smallest one whose
      // bounding box contains it. Candidates can nest (a link inside a nav kept
      // by the container fallback), and crediting every containing box would
      // inflate a container's count with its children's clicks.
      const rankedCandidates = Array.from(reducedClickedElements.values());
      const boxArea = element => (element.boundingRectangle.right - element.boundingRectangle.left) * (element.boundingRectangle.bottom - element.boundingRectangle.top);
      dataPoints.data.forEach(dp => {
        const containing = rankedCandidates.filter(element => (dp === null || dp === void 0 ? void 0 : dp.x) >= element.boundingRectangle.left && (dp === null || dp === void 0 ? void 0 : dp.x) <= element.boundingRectangle.right && (dp === null || dp === void 0 ? void 0 : dp.y) >= element.boundingRectangle.top && (dp === null || dp === void 0 ? void 0 : dp.y) <= element.boundingRectangle.bottom);
        if (!containing.length) {
          return;
        }
        const target = containing.reduce((smallest, element) => boxArea(element) < boxArea(smallest) ? element : smallest);
        target.count += parseInt(dp.value, 10) || 0;
      });
      // If the geometric pass attributed no clicks to an element (e.g. a recorded
      // offset that lands just outside a small element's box), fall back to its
      // selector-based count so a genuinely clicked element is not dropped.
      reducedClickedElements.forEach((element, key) => {
        if (!element.count) {
          element.count = selectorCounts.get(key) || 0;
        }
      });
      return this.formatTopClickedElements(new Map(Array.from(reducedClickedElements.entries()).sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label)).slice(0, MAX_TOP_CLICKED_ELEMENTS)), totalClicks);
    },
    removeScrollHeatmap() {
      const element = this.$refs.iframeRecordingContainer;
      $(element).find('.scrollHeatmapLeaf').remove();
    },
    proxyImageUrl(originalUrl, nonce) {
      const query = external_CoreHome_["MatomoUrl"].stringify({
        module: 'HeatmapSessionRecording',
        action: 'getProxiedImage',
        idSite: external_CoreHome_["Matomo"].idSite,
        idSiteHsr: this.idSiteHsr,
        url: originalUrl,
        nonce
      });
      // Resolve against the parent (Matomo) page so the URL is absolute and points at the Matomo
      // origin. A relative `?...` would resolve against the iframe's base (the recorded site).
      return new URL(`?${query}`, window.location.href).href;
    },
    isCrossOriginUrl(url) {
      if (!url || url.startsWith('data:')) {
        return false;
      }
      try {
        return new URL(url).origin !== window.location.origin;
      } catch (e) {
        return false;
      }
    },
    extractCrossOriginBackgroundUrls(background) {
      const urls = [];
      const regex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
      let match = regex.exec(background);
      while (match !== null) {
        if (this.isCrossOriginUrl(match[1])) {
          urls.push(match[1]);
        }
        match = regex.exec(background);
      }
      return urls;
    },
    proxyCssBackground(background, nonce, confirmedUrls) {
      return background.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g, (match, url) => this.isCrossOriginUrl(url) && confirmedUrls.has(url) ? `url("${this.proxyImageUrl(url, nonce)}")` : match);
    },
    async exportToImage() {
      if (!this.hasAdminAccess) {
        return;
      }
      this.isExporting = true;
      external_CoreHome_["NotificationsStore"].remove('hsrExportImage');
      const originalSrcs = [];
      const originalBackgrounds = [];
      const domRestores = [];
      let originalIframeCss = null;
      const heatmapContainer = this.$refs.heatmapContainer;
      const previousZIndex = heatmapContainer.style.zIndex;
      const foldLine = this.$refs.aboveFoldLine;
      const previousFoldZIndex = foldLine.style.zIndex;
      try {
        var _this$heatmapTypes$fi, _this$deviceTypes$fin;
        const iframe = this.$refs.recordingPlayer;
        const doc = iframe.contentDocument;
        if (!doc) {
          return;
        }
        const nonce = this.imageProxyNonce;
        // Keep the dot overlay, then the fold line, above the recorded page during capture.
        heatmapContainer.style.zIndex = '2147483646';
        foldLine.style.zIndex = '2147483647';
        doc.querySelectorAll('svg').forEach(svg => {
          if (!svg.hasAttribute('xmlns:xlink')) {
            domRestores.push(() => svg.removeAttribute('xmlns:xlink'));
            svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
          }
        });
        // Route cross-origin <img> sources through the proxy so the capture isn't tainted, but
        // only for images that actually rendered in the iframe. naturalWidth is 0 when the image
        // was blocked by CSP, 404'd or otherwise failed, in which case there is nothing to proxy.
        doc.querySelectorAll('img').forEach(img => {
          if (!(img.complete && img.naturalWidth > 0)) {
            return;
          }
          const rendered = img.currentSrc || img.src;
          if (this.isCrossOriginUrl(rendered)) {
            originalSrcs.push({
              img,
              src: img.src,
              srcset: img.srcset
            });
            img.src = this.proxyImageUrl(rendered, nonce);
            img.srcset = '';
          } else if (rendered !== img.src) {
            originalSrcs.push({
              img,
              src: img.src,
              srcset: img.srcset
            });
            img.src = rendered;
            img.srcset = '';
          }
        });
        // Same for cross-origin CSS background images, via an inline override we restore later.
        // A background has no naturalWidth to inspect, so probe each candidate url with
        // img.decode() and only proxy the ones that actually rendered. Anything we can't confirm
        // loaded is left untouched.
        const view = doc.defaultView || window;
        const backgroundCandidates = [];
        const candidateUrls = new Set();
        doc.querySelectorAll('*').forEach(el => {
          const background = view.getComputedStyle(el).backgroundImage;
          if (!background || !background.includes('url(')) {
            return;
          }
          const urls = this.extractCrossOriginBackgroundUrls(background);
          if (!urls.length) {
            return;
          }
          backgroundCandidates.push({
            el,
            background
          });
          urls.forEach(url => candidateUrls.add(url));
        });
        const confirmedUrls = new Set();
        await Promise.all([...candidateUrls].map(async url => {
          if (await backgroundRenders(url, doc)) {
            confirmedUrls.add(url);
          }
        }));
        backgroundCandidates.forEach(({
          el,
          background
        }) => {
          const proxied = this.proxyCssBackground(background, nonce, confirmedUrls);
          if (proxied !== background) {
            originalBackgrounds.push({
              el,
              background: el.style.backgroundImage
            });
            el.style.backgroundImage = proxied;
          }
        });
        // html-to-image copies the <iframe> element's own computed style onto the cloned page
        // <body>, dropping the recorded page's <html>/<body> background. Mirror the page's
        // effective background (the <html>'s, else the <body>'s, per CSS canvas propagation) onto
        // the iframe, proxying any cross-origin image, so it survives the capture.
        const htmlStyle = view.getComputedStyle(doc.documentElement);
        const bodyStyle = view.getComputedStyle(doc.body);
        const isOpaque = color => !!color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)';
        const pageStyle = htmlStyle.backgroundImage !== 'none' || isOpaque(htmlStyle.backgroundColor) ? htmlStyle : bodyStyle;
        originalIframeCss = iframe.style.cssText;
        ['background-color', 'background-position', 'background-size', 'background-repeat', 'background-origin', 'background-clip', 'background-attachment'].forEach(prop => {
          iframe.style.setProperty(prop, pageStyle.getPropertyValue(prop));
        });
        iframe.style.backgroundImage = this.proxyCssBackground(pageStyle.getPropertyValue('background-image'), nonce, confirmedUrls);
        const container = this.$refs.iframeRecordingContainer;
        const width = iframe.offsetWidth;
        const height = container.offsetHeight;
        const bodyRect = doc.body.getBoundingClientRect();
        iframe.style.marginLeft = `${bodyRect.left + view.scrollX + parseFloat(bodyStyle.borderLeftWidth) + parseFloat(bodyStyle.paddingLeft)}px`;
        iframe.style.marginTop = `${bodyRect.top + view.scrollY + parseFloat(bodyStyle.borderTopWidth) + parseFloat(bodyStyle.paddingTop)}px`;
        const dataUrl = await toPng(container, {
          width,
          height,
          backgroundColor: isOpaque(pageStyle.backgroundColor) ? pageStyle.backgroundColor : '#ffffff',
          pixelRatio: 1,
          cacheBust: true,
          includeQueryParams: true,
          onImageErrorHandler: () => undefined,
          style: {
            transform: 'none'
          }
        });
        const heatmapTypeName = ((_this$heatmapTypes$fi = this.heatmapTypes.find(type => type.key === this.heatmapType)) === null || _this$heatmapTypes$fi === void 0 ? void 0 : _this$heatmapTypes$fi.name) || '';
        const deviceTypeName = ((_this$deviceTypes$fin = this.deviceTypes.find(device => device.key === this.deviceType)) === null || _this$deviceTypes$fin === void 0 ? void 0 : _this$deviceTypes$fin.name) || '';
        const fileName = [this.createdDateRaw.slice(0, 10), 'Heatmap', this.heatmapName, heatmapTypeName, deviceTypeName, `${this.iframeWidth}px`].join(' ').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export heatmap image', err);
        external_CoreHome_["NotificationsStore"].show({
          message: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ExportImageError'),
          context: 'error',
          id: 'hsrExportImage',
          type: 'transient'
        });
      } finally {
        // Restore the recorded page so the live view is unchanged and reruns start clean.
        originalSrcs.forEach(({
          img,
          src,
          srcset
        }) => {
          img.src = src;
          img.srcset = srcset;
        });
        originalBackgrounds.forEach(({
          el,
          background
        }) => {
          el.style.backgroundImage = background;
        });
        domRestores.forEach(restore => restore());
        if (originalIframeCss !== null) {
          this.$refs.recordingPlayer.style.cssText = originalIframeCss;
        }
        heatmapContainer.style.zIndex = previousZIndex;
        foldLine.style.zIndex = previousFoldZIndex;
        this.isExporting = false;
      }
    },
    // Fetch only the sample metadata (recordings count + device split) for the summary
    // card in empty states, where there is no DOM to derive clicks/scroll reach from.
    fetchSummaryMetadata() {
      this.fetchGeneration += 1;
      const generation = this.fetchGeneration;
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
      this.getRecordedHeatmapMetadata(requestParams).then(numSamples => {
        if (generation !== this.fetchGeneration) {
          return;
        }
        if (Array.isArray(numSamples) && numSamples[0]) {
          [this.actualNumSamples] = numSamples;
        } else {
          this.actualNumSamples = numSamples;
        }
      });
    },
    fetchHeatmap() {
      // No snapshot means there is no iframe to load; skip the main fetch (which awaits the
      // iframe load event) so the report doesn't hang on the loading state. The summary card's
      // recordings count/device split still come from sample metadata, so fetch just that.
      if (!this.hasSnapshot) {
        this.isLoading = false;
        this.fetchSummaryMetadata();
        return;
      }
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
      this.summaryAvgFold = 0;
      this.dataCoordinates = [];
      this.totalClicks = 0;
      this.topClickedElements = [];
      this.scrollReach = [];
      // Each fetch gets a monotonic id. The primary heatmap request is abort-managed
      // by its oneAtATime closure, but the summary-card requests below run on
      // separate closures that the primary path never aborts, so a slow request from
      // a previous view/device/period can resolve late. Guarding every async
      // assignment on this id ensures only the latest fetch's results are applied.
      this.fetchGeneration += 1;
      const generation = this.fetchGeneration;
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
        var _this$actualNumSample;
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
          // scroll; the primary data already contains the scroll reaches, so the
          // summary card can be populated without an extra request.
          this.scrollReach = this.getScrollReach(rows);
          scrollHeatmap(this.$refs.iframeRecordingContainer, iframeElement, recordingIframe, rows);
        } else {
          const heatmapData = this.getHeatmapDataPoints(rows, recordingIframe);
          const {
            dataPoints
          } = heatmapData;
          this.dataCoordinates = dataPoints.data;
          this.totalClicks = heatmapData.totalValue;
          if (this.heatmapType === 2) {
            // click; the primary data already contains the clicks, so the
            // summary card can be populated without an extra request.
            this.topClickedElements = this.getTopClickedElements(heatmapData.dataPoints, recordingIframe, heatmapData.totalValue);
            if (heatmapData.numEntriesHigherThan1 / dataPoints.data.length >= 0.10 && dataPoints.data.length > 120) {
              // if at least 10% have .value >= 2, then we set max to 2 to differentiate better
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
        }
        // The iframe has been resized to the recorded page's full height by
        // now; the scale box needs it to reserve the scaled layout footprint.
        this.recordingHeight = recordingIframe.getIframeHeight() || 0;
        // Average fold applies to every heatmap type (including scroll), so the
        // summary-card value is computed after the type-specific rendering above.
        let foldLinePosition = 0;
        if ((_this$actualNumSample = this.actualNumSamples) !== null && _this$actualNumSample !== void 0 && _this$actualNumSample[`avg_fold_device_${this.deviceType}`]) {
          const avgFoldPercent = this.actualNumSamples[`avg_fold_device_${this.deviceType}`];
          const height = recordingIframe.getIframeHeight();
          if (height) {
            this.summaryAvgFold = parseInt(`${avgFoldPercent / 100 * height}`, 10);
            // Only draw the line when the fold is meaningfully above the page
            // end. Pages fully visible in the visitor's viewport track a fold
            // just short of 100% (the tracker's document height is padded by
            // body margins/scrollbars), and a line hugging the bottom edge
            // marks nothing. The summary card keeps the px value regardless.
            if (avgFoldPercent < FOLD_LINE_MAX_PERCENT) {
              foldLinePosition = this.summaryAvgFold;
            }
          }
        }
        // The fold line is drawn over the click and move heatmap overlays (as
        // before), but not the scroll view, where the scroll visualization already
        // conveys reach. summaryAvgFold is computed for every type above so the
        // summary card's "Avg. fold" label can still show on the scroll view.
        this.avgFold = this.isScrollHeatmapType ? 0 : foldLinePosition;
      }).finally(() => {
        this.isLoading = false;
      });
      if (this.heatmapType !== 2) {
        // For non-click heatmaps the summary card needs a separate click dataset.
        // Fetch it independently of the primary render so a slow or failed request
        // never delays or blocks the main visualization; on failure the card just
        // stays empty.
        Promise.all([this.getRecordedClickHeatmap(Object.assign(Object.assign({}, requestParams), {}, {
          heatmapType: 2
        })), this.iframeLoadedPromise]).then(response => {
          if (!this.isCurrentFetch(generation)) {
            // A newer fetch superseded this one; ignore its stale click data.
            return;
          }
          const recordingIframe = this.getRecordingIframe(this.$refs.recordingPlayer);
          const clickHeatmapData = this.getHeatmapDataPoints(response[0], recordingIframe);
          this.topClickedElements = this.getTopClickedElements(clickHeatmapData.dataPoints, recordingIframe, clickHeatmapData.totalValue);
        }).catch(() => {
          if (this.isCurrentFetch(generation)) {
            this.topClickedElements = [];
          }
        });
      }
      if (this.heatmapType !== 3) {
        // For non-scroll heatmaps the summary card needs a separate scroll
        // dataset. Fetch it independently (pure aggregation, no iframe needed) so
        // a slow or failed request never blocks the main visualization; on failure
        // the scroll-reach section just stays empty.
        this.getRecordedScrollHeatmap(Object.assign(Object.assign({}, requestParams), {}, {
          heatmapType: 3
        })).then(rows => {
          this.applyScrollReach(rows, generation);
        }).catch(() => {
          if (this.isCurrentFetch(generation)) {
            this.scrollReach = [];
          }
        });
      }
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
      this.updatePreviewScale();
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
      // Client rects are in scaled (on-screen) pixels while the iframe's
      // document works in its own unscaled coordinates, so the offset must be
      // divided back up by the preview scale.
      const rect = targetElement.getBoundingClientRect();
      return frameRef.elementFromPoint((event.clientX - rect.left) / this.previewScale, (event.clientY - rect.top) / this.previewScale);
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
    totalRecordings() {
      return this.getDeviceSamples(this.deviceType);
    },
    selectedDeviceTypeName() {
      const selected = this.deviceTypes.find(device => device.key === this.deviceType);
      return selected ? selected.name : '';
    },
    // The frame's height must not follow the preview's scale (Product: the
    // card shrinking as the window narrows or a large width is selected is
    // wrong; only the content inside should scale). It tracks the recording's
    // *unscaled* height — which is independent of the window width — capped
    // by the viewport fit; a scaled preview shorter than the frame letterboxes
    // at the bottom instead of collapsing the frame.
    scrollAreaStyle() {
      if (!this.scrollAreaMaxHeight) {
        return undefined;
      }
      if (this.recordingHeight) {
        // Floored at the summary card's height: once the frame is shorter
        // than the card beside it, shrinking further cannot raise the
        // report's bottom edge (the row is already card-tall) and only opens
        // a gap between the frame and the content below the row.
        const height = Math.max(Math.min(this.scrollAreaMaxHeight, this.recordingHeight), this.summaryCardHeight);
        const style = {
          height: `${height}px`
        };
        if (!this.frameNeedsVScroll) {
          // The scaled preview fits the frame: vertical scrolling is
          // impossible, so drop the scrollbar and its reserved gutter
          // entirely (updatePreviewScale owns this decision).
          style['overflow-y'] = 'hidden';
        }
        return style;
      }
      // Recording height unknown (still loading): cap only.
      return {
        maxHeight: `${this.scrollAreaMaxHeight}px`
      };
    },
    // Outer box reserving the preview's *scaled* layout footprint (transforms
    // don't affect layout), so a fitted preview neither shows a horizontal
    // scrollbar nor leaves blank scroll space below itself. Mirrors the
    // replay player's sized-box + scaled-inner pattern.
    scaleBoxStyle() {
      const style = {
        width: `${Math.round(this.previewScale * this.iframeWidth)}px`
      };
      if (this.previewScale < 1 && this.recordingHeight) {
        style.height = `${Math.round(this.previewScale * this.recordingHeight)}px`;
      }
      return style;
    },
    containerStyle() {
      const style = {
        width: `${this.iframeWidth}px`,
        // Read by the fold pill's counter-scale so its label stays readable.
        '--preview-scale': `${this.previewScale}`
      };
      if (this.previewScale < 1) {
        style.transform = `scale(${this.previewScale})`;
        style['transform-origin'] = '0 0';
      }
      return style;
    },
    // Share of all recorded samples per device type, for the stacked bar and its
    // legend. Empty only when nothing was recorded on any device, which is also
    // what switches the template to the "waiting for first recording" state
    // (the split still shows when only the selected device has no recordings).
    // Devices with zero samples keep their legend entry (with 0%); their bar
    // segment just has no width. Bar widths use the exact share so the segments
    // always fill the bar; only the legend label is rounded.
    deviceBreakdown() {
      const devices = this.deviceTypes;
      const counts = devices.map(device => this.getDeviceSamples(device.key));
      const total = counts.reduce((sum, count) => sum + count, 0);
      if (!total) {
        return [];
      }
      return devices.map((device, index) => {
        const percent = counts[index] / total * 100;
        return {
          key: device.key,
          name: device.name,
          percent,
          percentLabel: external_CoreHome_["NumberFormatter"].formatPercent(Math.round(percent))
        };
      });
    },
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
    deviceTypesWithResolution() {
      const resolutions = {
        [deviceDesktop]: this.desktopPreviewSize,
        [deviceTablet]: this.breakpointTablet || 960,
        [deviceMobile]: this.breakpointMobile || 600
      };
      return this.deviceTypes.map(deviceType => Object.assign(Object.assign({}, deviceType), {}, {
        resolution: resolutions[deviceType.key]
      }));
    },
    hasAdminAccess() {
      return !!(external_CoreHome_["Matomo"] !== null && external_CoreHome_["Matomo"] !== void 0 && external_CoreHome_["Matomo"].heatmapAdminAccess);
    },
    // Which empty state to render when no snapshot exists. A deleted snapshot (tracked via
    // screenshot_deleted_date) is distinguished from one that was never captured; once deleted,
    // the retake instructions depend on whether the heatmap still records and on its capture mode.
    emptyStateKey() {
      if (!this.snapshotDeleted) {
        return 'noInteractions';
      }
      if (!this.isActive) {
        // Paused heatmaps can be resumed (capture continues then); ended ones cannot.
        return this.isPaused ? 'deletedPaused' : 'deletedNoRetake';
      }
      return this.captureManually ? 'deletedManual' : 'deletedAuto';
    },
    showSummaryCard() {
      // Always show the recordings summary (count + device split); it comes from
      // sample metadata, which exists even in empty/deleted states without a DOM.
      return true;
    },
    gradientImgData() {
      return generateGradientImgData();
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
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_30 = {
  class: "duration"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_31 = {
  class: "playerHelp"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_32 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "clickEvent"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_33 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "moveEvent"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_34 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "scrollEvent"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_35 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "resizeEvent"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_36 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "formChange"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_37 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "mutationEvent"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_38 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", {
  style: {
    "clear": "right"
  }
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_39 = ["title"];
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_40 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_41 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "loadingUnderlay"
}, null, -1);
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_42 = {
  class: "valign-wrapper loadingInner"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_43 = {
  class: "loadingContent"
};
const SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_44 = ["src", "width", "height"];
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
  }, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_29, 10, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_30, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_PlayerDurationXofY', _ctx.positionPretty, _ctx.durationPretty)), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_31, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_32, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityClick')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_33, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityMove')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_34, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityScroll')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_35, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityResize')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_36, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityFormChange')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", null, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_37, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ActivityPageChange')), 1)])])]), SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_38]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
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
    }, null, 14, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_39);
  }), 128))], 4), SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: "hsrLoadingOuter",
    style: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeStyle"])({
      width: `${_ctx.replayWidth}px`,
      height: `${_ctx.replayHeight}px`
    })
  }, [SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_41, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_42, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_43, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Loading')), 1)])], 4), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
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
  }, null, 40, SessionRecordingVisvue_type_template_id_6f77b61e_hoisted_44)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 4)], 4)]);
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
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue?vue&type=template&id=4995a17f

const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_1 = {
  style: {
    "width": "100%"
  }
};
const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_2 = {
  name: "targetAttribute"
};
const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_3 = {
  name: "targetType"
};
const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_4 = {
  name: "targetValue"
};
const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_5 = {
  name: "targetValue2"
};
const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_6 = ["title"];
const HsrUrlTargetvue_type_template_id_4995a17f_hoisted_7 = ["title"];
function HsrUrlTargetvue_type_template_id_4995a17f_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["form-group hsrUrltarget valign-wrapper", {
      'disabled': _ctx.disableIfNoValue && !_ctx.modelValue.value
    }])
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4995a17f_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4995a17f_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "select",
    name: "targetAttribute",
    "model-value": _ctx.modelValue.attribute,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.$emit('update:modelValue', Object.assign(Object.assign({}, _ctx.modelValue), {}, {
      attribute: $event
    }))),
    title: _ctx.translate('HeatmapSessionRecording_Rule'),
    options: _ctx.targetAttributes,
    "full-width": true
  }, null, 8, ["model-value", "title", "options"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.simpleMode]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4995a17f_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "select",
    name: "targetType",
    "model-value": _ctx.pattern_type,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => {
      _ctx.onTypeChange($event);
    }),
    options: _ctx.targetOptions[_ctx.modelValue.attribute],
    "full-width": true
  }, null, 8, ["model-value", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4995a17f_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
    uicontrol: "text",
    name: "targetValue",
    placeholder: `eg. ${_ctx.targetExamples[_ctx.modelValue.attribute]}`,
    "model-value": _ctx.modelValue.value,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.$emit('update:modelValue', Object.assign(Object.assign({}, _ctx.modelValue), {}, {
      value: $event.trim()
    }))),
    maxlength: 500,
    "full-width": true
  }, null, 8, ["placeholder", "model-value"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.pattern_type !== 'any']])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HsrUrlTargetvue_type_template_id_4995a17f_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
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
  }, null, 8, HsrUrlTargetvue_type_template_id_4995a17f_hoisted_6), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.showAddUrl]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    class: "icon-minus valign",
    title: _ctx.translate('General_Remove'),
    onClick: _cache[5] || (_cache[5] = $event => _ctx.$emit('removeUrl'))
  }, null, 8, HsrUrlTargetvue_type_template_id_4995a17f_hoisted_7), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.canBeRemoved]])], 2);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/HsrUrlTarget.vue?vue&type=template&id=4995a17f

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
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HsrUrlTarget/simpleTargeting.ts
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
const SIMPLE_TARGET_TYPES = ['equals_simple', 'equals_exactly', 'contains', 'starts_with'];
function isInverted(rule) {
  return !!rule.inverted && rule.inverted !== '0';
}
/**
 * Returns true when the given rules can be represented by the simplified Target Page view
 */
function isSimpleCompatible(rules) {
  if (!rules || rules.length !== 1) {
    return false;
  }
  const rule = rules[0];
  return (rule === null || rule === void 0 ? void 0 : rule.attribute) === 'url' && SIMPLE_TARGET_TYPES.includes(rule.type) && !isInverted(rule) && !rule.value2;
}
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
    showAddUrl: Boolean,
    simpleMode: Boolean
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
      if (this.simpleMode) {
        const urlRule = AvailableTargetPageRules_store.rules.value.find(r => r.value === 'url');
        result.url = [];
        if (urlRule) {
          SIMPLE_TARGET_TYPES.forEach(typeValue => {
            const type = urlRule.types.find(t => t.value === typeValue);
            if (type) {
              result.url.push({
                key: type.value,
                value: `${urlRule.name} ${type.name}`
              });
            }
          });
        }
        return result;
      }
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



HsrUrlTargetvue_type_script_lang_ts.render = HsrUrlTargetvue_type_template_id_4995a17f_render

/* harmony default export */ var HsrUrlTarget = (HsrUrlTargetvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=template&id=13bf8eed

const Editvue_type_template_id_13bf8eed_hoisted_1 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_13bf8eed_hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_13bf8eed_hoisted_3 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_13bf8eed_hoisted_4 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_13bf8eed_hoisted_5 = {
  name: "name"
};
const Editvue_type_template_id_13bf8eed_hoisted_6 = {
  name: "description"
};
const Editvue_type_template_id_13bf8eed_hoisted_7 = {
  name: "autoRepeat"
};
const Editvue_type_template_id_13bf8eed_hoisted_8 = {
  class: "inline-help-node"
};
const Editvue_type_template_id_13bf8eed_hoisted_9 = ["innerHTML"];
const Editvue_type_template_id_13bf8eed_hoisted_10 = {
  class: "form-group row"
};
const Editvue_type_template_id_13bf8eed_hoisted_11 = {
  class: "col s12"
};
const Editvue_type_template_id_13bf8eed_hoisted_12 = {
  style: {
    "font-weight": "600"
  }
};
const Editvue_type_template_id_13bf8eed_hoisted_13 = {
  class: "col s12 m6",
  style: {
    "padding-left": "0"
  }
};
const Editvue_type_template_id_13bf8eed_hoisted_14 = {
  key: 0
};
const Editvue_type_template_id_13bf8eed_hoisted_15 = {
  key: 0,
  class: "matchPageRules simple"
};
const Editvue_type_template_id_13bf8eed_hoisted_16 = ["innerHTML"];
const Editvue_type_template_id_13bf8eed_hoisted_17 = {
  key: 1
};
const Editvue_type_template_id_13bf8eed_hoisted_18 = ["innerHTML"];
const Editvue_type_template_id_13bf8eed_hoisted_19 = {
  class: "col s12 m6"
};
const Editvue_type_template_id_13bf8eed_hoisted_20 = {
  class: "form-help"
};
const Editvue_type_template_id_13bf8eed_hoisted_21 = {
  class: "inline-help"
};
const Editvue_type_template_id_13bf8eed_hoisted_22 = ["innerHTML"];
const Editvue_type_template_id_13bf8eed_hoisted_23 = {
  class: "form-group row advancedSettingsToggle"
};
const Editvue_type_template_id_13bf8eed_hoisted_24 = {
  class: "col s12"
};
const Editvue_type_template_id_13bf8eed_hoisted_25 = {
  class: "sectionDescription"
};
const Editvue_type_template_id_13bf8eed_hoisted_26 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-chevron-down"
}, null, -1);
const Editvue_type_template_id_13bf8eed_hoisted_27 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-chevron-up"
}, null, -1);
const Editvue_type_template_id_13bf8eed_hoisted_28 = {
  class: "heatmapAdvancedSection"
};
const Editvue_type_template_id_13bf8eed_hoisted_29 = {
  class: "sectionDescription"
};
const Editvue_type_template_id_13bf8eed_hoisted_30 = {
  name: "sampleRate"
};
const Editvue_type_template_id_13bf8eed_hoisted_31 = {
  name: "sampleLimit"
};
const Editvue_type_template_id_13bf8eed_hoisted_32 = {
  class: "heatmapAdvancedSection"
};
const Editvue_type_template_id_13bf8eed_hoisted_33 = {
  class: "sectionDescription"
};
const Editvue_type_template_id_13bf8eed_hoisted_34 = {
  name: "screenshotUrl"
};
const Editvue_type_template_id_13bf8eed_hoisted_35 = {
  name: "trackManually"
};
const Editvue_type_template_id_13bf8eed_hoisted_36 = {
  class: "heatmapAdvancedSection"
};
const Editvue_type_template_id_13bf8eed_hoisted_37 = {
  class: "sectionDescription"
};
const Editvue_type_template_id_13bf8eed_hoisted_38 = {
  name: "excludedElements"
};
const Editvue_type_template_id_13bf8eed_hoisted_39 = {
  class: "heatmapAdvancedSection"
};
const Editvue_type_template_id_13bf8eed_hoisted_40 = {
  class: "sectionDescription"
};
const Editvue_type_template_id_13bf8eed_hoisted_41 = {
  name: "breakpointMobile"
};
const Editvue_type_template_id_13bf8eed_hoisted_42 = {
  name: "breakpointTablet"
};
const Editvue_type_template_id_13bf8eed_hoisted_43 = ["innerHTML"];
const Editvue_type_template_id_13bf8eed_hoisted_44 = {
  class: "entityCancel"
};
function Editvue_type_template_id_13bf8eed_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_HsrUrlTarget = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrUrlTarget");
  const _component_HsrTargetTest = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrTargetTest");
  const _component_SaveButton = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SaveButton");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    class: "editHsr",
    "content-title": _ctx.contentTitle
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_13bf8eed_hoisted_1, [Editvue_type_template_id_13bf8eed_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_13bf8eed_hoisted_3, [Editvue_type_template_id_13bf8eed_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_UpdatingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      onSubmit: _cache[20] || (_cache[20] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr())
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "name",
      "model-value": _ctx.siteHsr.name,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.siteHsr.name = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('General_Name'),
      maxlength: 255,
      placeholder: _ctx.translate('HeatmapSessionRecording_FieldNamePlaceholderV2'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapNameHelpText')
    }, null, 8, ["model-value", "title", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "textarea",
      name: "description",
      "model-value": _ctx.siteHsr.description,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => {
        _ctx.siteHsr.description = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_DescriptionOptional'),
      maxlength: 255,
      rows: 3,
      "ui-control-attributes": {
        class: 'compact-textarea'
      },
      placeholder: _ctx.translate('HeatmapSessionRecording_FieldDescriptionPlaceholder'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapDescriptionHelpText')
    }, null, 8, ["model-value", "title", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "auto_repeat",
      title: _ctx.translate('HeatmapSessionRecording_AutoRepeatHeatmap'),
      "model-value": _ctx.siteHsr.auto_repeat,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => {
        _ctx.siteHsr.auto_repeat = $event;
        _ctx.setValueHasChanged();
      })
    }, {
      "inline-help": Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        innerHTML: _ctx.$sanitize(_ctx.autoRepeatHelp)
      }, null, 8, Editvue_type_template_id_13bf8eed_hoisted_9)])]),
      _: 1
    }, 8, ["title", "model-value"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", Editvue_type_template_id_13bf8eed_hoisted_12, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPage')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_13, [!_ctx.showAdvancedTargeting ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Editvue_type_template_id_13bf8eed_hoisted_14, [_ctx.siteHsr.match_page_rules && _ctx.siteHsr.match_page_rules.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Editvue_type_template_id_13bf8eed_hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrUrlTarget, {
      "model-value": _ctx.siteHsr.match_page_rules[0],
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.setMatchPageRule($event, 0)),
      onAnyChange: _cache[4] || (_cache[4] = $event => _ctx.setValueHasChanged()),
      "simple-mode": true,
      "allow-any": false,
      "show-add-url": false,
      "can-be-removed": false
    }, null, 8, ["model-value"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      class: "targetingToggle",
      innerHTML: _ctx.$sanitize(_ctx.useAdvancedTargetingText),
      onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onTargetingToggleClick && _ctx.onTargetingToggleClick(...args))
    }, null, 8, Editvue_type_template_id_13bf8eed_hoisted_16)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.showAdvancedTargeting ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Editvue_type_template_id_13bf8eed_hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      class: "targetingToggle",
      innerHTML: _ctx.$sanitize(_ctx.useSimpleTargetingText),
      onClick: _cache[6] || (_cache[6] = (...args) => _ctx.onTargetingToggleClick && _ctx.onTargetingToggleClick(...args))
    }, null, 8, Editvue_type_template_id_13bf8eed_hoisted_18), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.siteHsr.match_page_rules, (url, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`matchPageRules ${index} multiple`),
        key: index
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrUrlTarget, {
        "model-value": url,
        "onUpdate:modelValue": $event => _ctx.setMatchPageRule($event, index),
        onAddUrl: _cache[7] || (_cache[7] = $event => _ctx.addMatchPageRule()),
        onRemoveUrl: $event => _ctx.removeMatchPageRule(index),
        onAnyChange: _cache[8] || (_cache[8] = $event => _ctx.setValueHasChanged()),
        "allow-any": false,
        "disable-if-no-value": index > 0,
        "can-be-removed": index > 0,
        "show-add-url": true
      }, null, 8, ["model-value", "onUpdate:modelValue", "onRemoveUrl", "disable-if-no-value", "can-be-removed"])])], 2);
    }), 128))])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_20, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_13bf8eed_hoisted_21, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
      innerHTML: _ctx.$sanitize(_ctx.targetHelpText)
    }, null, 8, Editvue_type_template_id_13bf8eed_hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrTargetTest, {
      "included-targets": _ctx.siteHsr.match_page_rules
    }, null, 8, ["included-targets"])])])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_24, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_AdvancedOptions')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Editvue_type_template_id_13bf8eed_hoisted_25, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.advancedOptionsSummary), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      href: "",
      class: "showAdvancedSettings",
      onClick: _cache[9] || (_cache[9] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.showAdvancedView = true, ["prevent"]))
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ShowAdvancedOptions')) + " ", 1), Editvue_type_template_id_13bf8eed_hoisted_26], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.showAdvancedView]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      href: "",
      class: "hideAdvancedSettings",
      onClick: _cache[10] || (_cache[10] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.showAdvancedView = false, ["prevent"]))
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HideAdvancedOptions')) + " ", 1), Editvue_type_template_id_13bf8eed_hoisted_27], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.showAdvancedView]])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_28, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionRecordingSettings')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Editvue_type_template_id_13bf8eed_hoisted_29, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionRecordingSettingsHelp')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_30, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleRate",
      "model-value": _ctx.siteHsr.sample_rate,
      "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => {
        _ctx.siteHsr.sample_rate = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_SampleRate'),
      options: _ctx.sampleRates,
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapSampleRateHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_31, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleLimit",
      "model-value": _ctx.siteHsr.sample_limit,
      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => {
        _ctx.siteHsr.sample_limit = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_HeatmapSampleLimit'),
      options: _ctx.sampleLimits,
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapSampleLimitHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_32, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionPageSnapshot')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Editvue_type_template_id_13bf8eed_hoisted_33, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionPageSnapshotHelp')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_34, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "screenshotUrl",
      "model-value": _ctx.siteHsr.screenshot_url,
      "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => {
        _ctx.siteHsr.screenshot_url = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_ScreenshotUrl'),
      placeholder: "https://www.example.com",
      maxlength: 300,
      disabled: !!_ctx.siteHsr.page_treemirror,
      "inline-help": _ctx.translate('HeatmapSessionRecording_ScreenshotUrlHelp')
    }, null, 8, ["model-value", "title", "disabled", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_35, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "capture_manually",
      title: _ctx.translate('HeatmapSessionRecording_CaptureDomTitle'),
      "inline-help": _ctx.captureDomInlineHelp,
      "model-value": _ctx.siteHsr.capture_manually,
      "onUpdate:modelValue": _cache[14] || (_cache[14] = $event => {
        _ctx.siteHsr.capture_manually = $event;
        _ctx.setValueHasChanged();
      })
    }, null, 8, ["title", "inline-help", "model-value"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_36, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionContentMasking')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Editvue_type_template_id_13bf8eed_hoisted_37, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionContentMaskingHelp')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_38, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "excludedElements",
      "model-value": _ctx.siteHsr.excluded_elements,
      "onUpdate:modelValue": _cache[15] || (_cache[15] = $event => {
        _ctx.siteHsr.excluded_elements = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_ExcludedElements'),
      placeholder: "#cookie-banner, .newsletter-popup",
      maxlength: 1000,
      "inline-help": _ctx.translate('HeatmapSessionRecording_ExcludedElementsHelp')
    }, null, 8, ["model-value", "title", "inline-help"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_39, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionDeviceBreakpoints')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Editvue_type_template_id_13bf8eed_hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapAdvancedSectionDeviceBreakpointsHelp')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_41, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "breakpointMobile",
      "model-value": _ctx.siteHsr.breakpoint_mobile,
      "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => {
        _ctx.siteHsr.breakpoint_mobile = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_BreakpointX', _ctx.translate('General_Mobile')),
      maxlength: 4,
      "inline-help": _ctx.breakpointMobileInlineHelp
    }, null, 8, ["model-value", "title", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_42, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "breakpointTablet",
      "model-value": _ctx.siteHsr.breakpoint_tablet,
      "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => {
        _ctx.siteHsr.breakpoint_tablet = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_BreakpointX', _ctx.translate('DevicesDetection_Tablet')),
      maxlength: 4,
      "inline-help": _ctx.breakpointTabletInlineHelp
    }, null, 8, ["model-value", "title", "inline-help"])])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.showAdvancedView]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      innerHTML: _ctx.$sanitize(_ctx.personalInformationNote)
    }, null, 8, Editvue_type_template_id_13bf8eed_hoisted_43), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
      class: "createButton",
      onConfirm: _cache[18] || (_cache[18] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr()),
      disabled: _ctx.isUpdating || !_ctx.isDirty,
      saving: _ctx.isUpdating,
      value: _ctx.saveButtonText
    }, null, 8, ["disabled", "saving", "value"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_13bf8eed_hoisted_44, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      onClick: _cache[19] || (_cache[19] = $event => _ctx.cancel())
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Cancel')), 1)])])], 32)]),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=template&id=13bf8eed

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
    HsrStore_store_defineProperty(this, "statusOptions", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(() => {
      const options = [{
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
      }, {
        key: 'onhold',
        value: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_StatusOnHold')
      }];
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["readonly"])(options);
    }));
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
      autoRepeat: hsr.auto_repeat ? 1 : 0,
      description: hsr.description !== undefined ? hsr.description.trim() : undefined,
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
      showAdvancedTargeting: false,
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
      this.showAdvancedTargeting = false;
      external_CoreHome_["Matomo"].helper.lazyScrollToContent();
      if (this.edit && idSiteHsr) {
        HeatmapStore.findHsr(idSiteHsr).then(siteHsr => {
          if (!siteHsr) {
            return;
          }
          this.siteHsr = Object(external_CoreHome_["clone"])(siteHsr);
          this.siteHsr.sample_rate = `${this.siteHsr.sample_rate}`;
          this.addInitialMatchPageRule();
          this.showAdvancedTargeting = !isSimpleCompatible(this.siteHsr.match_page_rules);
          this.isDirty = false;
        });
        return;
      }
      if (this.create) {
        this.siteHsr = {
          idSite: external_CoreHome_["Matomo"].idSite,
          name: '',
          description: '',
          sample_rate: '10.0',
          sample_limit: 1000,
          breakpoint_mobile: this.breakpointMobile,
          breakpoint_tablet: this.breakpointTablet,
          capture_manually: 0,
          auto_repeat: 1
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
      this.isDirty = true;
    },
    onTargetingToggleClick(event) {
      const target = event.target;
      if (target.tagName !== 'A') {
        return;
      }
      event.preventDefault();
      if (target.classList.contains('showSimpleTargeting')) {
        if (!isSimpleCompatible(this.siteHsr.match_page_rules.slice(0, 1))) {
          this.siteHsr.match_page_rules = [{
            attribute: 'url',
            type: 'equals_simple',
            value: '',
            inverted: 0
          }];
        } else {
          this.siteHsr.match_page_rules = [this.siteHsr.match_page_rules[0]];
        }
        this.showAdvancedTargeting = false;
      } else {
        this.showAdvancedTargeting = true;
      }
      this.setValueHasChanged();
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
      const values = [10, 20, 50, 100];
      const options = values.map(v => ({
        key: v.toFixed(1),
        value: `${v}%`
      }));
      if (!this.create && this.siteHsr.sample_rate) {
        const currentValue = Number.parseFloat(`${this.siteHsr.sample_rate}`);
        const currentOption = {
          key: currentValue.toFixed(1),
          value: `${currentValue}%`
        };
        if (!options.find(option => option.key === currentOption.key)) {
          options.unshift(currentOption);
        }
      }
      return options;
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
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointMobileManageHelp');
    },
    breakpointTabletInlineHelp() {
      const help1 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointTabletManageHelp');
      const help2 = Object(external_CoreHome_["translate"])('HeatmapSessionRecording_BreakpointGeneralHelpManage');
      return `${help1} ${help2}`;
    },
    advancedOptionsSummary() {
      var _this$siteHsr$sample_, _this$siteHsr$sample_2, _this$siteHsr$breakpo, _this$siteHsr$breakpo2;
      const sampleRate = external_CoreHome_["NumberFormatter"].formatNumber(Number.parseFloat(`${(_this$siteHsr$sample_ = this.siteHsr.sample_rate) !== null && _this$siteHsr$sample_ !== void 0 ? _this$siteHsr$sample_ : 0}`));
      const sampleLimit = external_CoreHome_["NumberFormatter"].formatNumber(Number((_this$siteHsr$sample_2 = this.siteHsr.sample_limit) !== null && _this$siteHsr$sample_2 !== void 0 ? _this$siteHsr$sample_2 : 0));
      const snapshotMode = this.siteHsr.capture_manually ? Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ManualSnapshot') : Object(external_CoreHome_["translate"])('HeatmapSessionRecording_AutomaticSnapshot');
      const breakpointMobile = external_CoreHome_["NumberFormatter"].formatNumber(Number((_this$siteHsr$breakpo = this.siteHsr.breakpoint_mobile) !== null && _this$siteHsr$breakpo !== void 0 ? _this$siteHsr$breakpo : 0));
      const breakpointTablet = external_CoreHome_["NumberFormatter"].formatNumber(Number((_this$siteHsr$breakpo2 = this.siteHsr.breakpoint_tablet) !== null && _this$siteHsr$breakpo2 !== void 0 ? _this$siteHsr$breakpo2 : 0));
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapAdvancedOptionsSummary', sampleRate, sampleLimit, snapshotMode, breakpointMobile, breakpointTablet);
    },
    captureDomInlineHelp() {
      const id = this.idSiteHsr ? this.idSiteHsr : '{idHeatmap}';
      const command = `<br><br><strong>_paq.push(['HeatmapSessionRecording::captureInitialDom', ${id}])</strong>`;
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CaptureDomInlineHelp', command, '<br><br><strong>', '</strong>');
    },
    autoRepeatHelp() {
      const link = 'https://matomo.org/faq/reports/create-and-manage-heatmaps/#advanced-options';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_AutoRepeatHeatmapHelp', `<a href="${link}" target="_blank" rel="noopener noreferrer">`, '</a>');
    },
    personalInformationNote() {
      const url = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-content-on-your-website';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_PersonalInformationNote', Object(external_CoreHome_["translate"])('HeatmapSessionRecording_Heatmap'), '<code>', '</code>', `<a href="${url}" target="_blank" rel="noreferrer noopener">`, '</a>');
    },
    saveButtonText() {
      return this.edit ? Object(external_CoreHome_["translate"])('CoreUpdater_UpdateTitle') : Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CreateNewHeatmap');
    },
    useAdvancedTargetingText() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_UseAdvancedTargeting', '<a href="" class="showAdvancedTargeting">', '</a>');
    },
    useSimpleTargetingText() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_UseSimpleTargeting', '<a href="" class="showSimpleTargeting">', '</a>');
    },
    targetHelpText() {
      const docUrl = 'https://matomo.org/faq/heatmap-session-recording/';
      const key = this.showAdvancedTargeting ? 'HeatmapSessionRecording_FieldIncludedTargetsHelpAdvanced' : 'HeatmapSessionRecording_FieldIncludedTargetsHelpSimple';
      return Object(external_CoreHome_["translate"])(key, Object(external_CoreHome_["externalLink"])(docUrl), '</a>');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Edit.vue



Editvue_type_script_lang_ts.render = Editvue_type_template_id_13bf8eed_render

/* harmony default export */ var Edit = (Editvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue?vue&type=template&id=27d46d25

const Listvue_type_template_id_27d46d25_hoisted_1 = {
  class: "heatmapList"
};
const Listvue_type_template_id_27d46d25_hoisted_2 = {
  class: "filterStatus"
};
const Listvue_type_template_id_27d46d25_hoisted_3 = {
  class: "hsrSearchFilter",
  style: {
    "margin-left": "3.5px"
  }
};
const Listvue_type_template_id_27d46d25_hoisted_4 = {
  class: "index"
};
const Listvue_type_template_id_27d46d25_hoisted_5 = {
  class: "name"
};
const Listvue_type_template_id_27d46d25_hoisted_6 = {
  class: "creationDate"
};
const Listvue_type_template_id_27d46d25_hoisted_7 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_27d46d25_hoisted_8 = {
  class: "status"
};
const Listvue_type_template_id_27d46d25_hoisted_9 = {
  class: "autoRepeat"
};
const Listvue_type_template_id_27d46d25_hoisted_10 = ["title"];
const Listvue_type_template_id_27d46d25_hoisted_11 = {
  class: "action"
};
const Listvue_type_template_id_27d46d25_hoisted_12 = {
  colspan: "7"
};
const Listvue_type_template_id_27d46d25_hoisted_13 = {
  class: "loadingPiwik"
};
const Listvue_type_template_id_27d46d25_hoisted_14 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Listvue_type_template_id_27d46d25_hoisted_15 = {
  colspan: "7"
};
const Listvue_type_template_id_27d46d25_hoisted_16 = ["id"];
const Listvue_type_template_id_27d46d25_hoisted_17 = {
  class: "index"
};
const Listvue_type_template_id_27d46d25_hoisted_18 = {
  class: "name"
};
const Listvue_type_template_id_27d46d25_hoisted_19 = {
  class: "creationDate"
};
const Listvue_type_template_id_27d46d25_hoisted_20 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_27d46d25_hoisted_21 = {
  key: 0,
  class: "status status-paused"
};
const Listvue_type_template_id_27d46d25_hoisted_22 = ["title"];
const Listvue_type_template_id_27d46d25_hoisted_23 = {
  key: 1,
  class: "status status-onhold"
};
const Listvue_type_template_id_27d46d25_hoisted_24 = ["title"];
const Listvue_type_template_id_27d46d25_hoisted_25 = {
  key: 2,
  class: "status"
};
const Listvue_type_template_id_27d46d25_hoisted_26 = {
  class: "autoRepeat"
};
const Listvue_type_template_id_27d46d25_hoisted_27 = ["title", "onClick"];
const Listvue_type_template_id_27d46d25_hoisted_28 = ["title", "onClick"];
const Listvue_type_template_id_27d46d25_hoisted_29 = ["title", "href"];
const Listvue_type_template_id_27d46d25_hoisted_30 = ["title", "onClick"];
const Listvue_type_template_id_27d46d25_hoisted_31 = {
  class: "tableActionBar"
};
const Listvue_type_template_id_27d46d25_hoisted_32 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-add"
}, null, -1);
const Listvue_type_template_id_27d46d25_hoisted_33 = {
  class: "ui-confirm",
  id: "confirmDeleteHeatmap",
  ref: "confirmDeleteHeatmap"
};
const Listvue_type_template_id_27d46d25_hoisted_34 = ["value"];
const Listvue_type_template_id_27d46d25_hoisted_35 = ["value"];
const Listvue_type_template_id_27d46d25_hoisted_36 = {
  class: "ui-confirm",
  id: "confirmEndHeatmap",
  ref: "confirmEndHeatmap"
};
const Listvue_type_template_id_27d46d25_hoisted_37 = {
  key: 0,
  style: {
    "text-align": "center"
  }
};
const Listvue_type_template_id_27d46d25_hoisted_38 = ["value"];
const Listvue_type_template_id_27d46d25_hoisted_39 = ["value"];
function Listvue_type_template_id_27d46d25_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_EntityDuplicatorAction = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("EntityDuplicatorAction");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_EntityDuplicatorModal = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("EntityDuplicatorModal");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  const _directive_tooltips = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("tooltips");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_27d46d25_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('HeatmapSessionRecording_ManageHeatmaps')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapUsageBenefits')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_27d46d25_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "filterStatus",
      "model-value": _ctx.filterStatus,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.setFilterStatus($event);
      }),
      title: _ctx.translate('HeatmapSessionRecording_Filter'),
      "full-width": true,
      options: _ctx.statusOptions
    }, null, 8, ["model-value", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_27d46d25_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "hsrSearch",
      title: _ctx.translate('General_Search'),
      modelValue: _ctx.searchFilter,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.searchFilter = $event),
      "full-width": true
    }, null, 8, ["title", "modelValue"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.hsrs.length > 0]])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Id')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Name')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreationDate')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_SampleLimit')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CorePluginsAdmin_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_AutoRepeatHeatmapColumn')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
      class: "icon-info",
      title: _ctx.translate('HeatmapSessionRecording_AutoRepeatHeatmapColumnHelp')
    }, null, 8, Listvue_type_template_id_27d46d25_hoisted_10)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_27d46d25_hoisted_11, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Actions')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Listvue_type_template_id_27d46d25_hoisted_13, [Listvue_type_template_id_27d46d25_hoisted_14, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading || _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_15, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_NoHeatmapsFound')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isLoading && _ctx.hsrs.length === 0]]), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.sortedHsrs, hsr => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        id: `hsr${hsr.idsitehsr}`,
        class: "hsrs",
        key: hsr.idsitehsr
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.idsitehsr), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_18, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_19, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.created_date_pretty), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_20, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.sample_limit), 1), hsr.status === 'paused' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_27d46d25_hoisted_21, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "icon icon-help",
        title: _ctx.pauseReason
      }, null, 8, Listvue_type_template_id_27d46d25_hoisted_22)])) : hsr.status === 'onhold' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_27d46d25_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_StatusOnHold')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "icon icon-help",
        title: _ctx.onHoldReason(hsr)
      }, null, 8, Listvue_type_template_id_27d46d25_hoisted_24)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_27d46d25_hoisted_25, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)), 1)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_27d46d25_hoisted_26, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.auto_repeat ? _ctx.translate('General_Yes') : _ctx.translate('General_No')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])({
          'action': true,
          'duplicate-available': _ctx.isEntityDuplicatorAvailable
        })
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-edit",
        title: _ctx.translate('HeatmapSessionRecording_EditX', _ctx.translate('HeatmapSessionRecording_Heatmap')),
        onClick: $event => _ctx.editHsr(hsr.idsitehsr)
      }, null, 8, Listvue_type_template_id_27d46d25_hoisted_27), hsr.status !== 'ended' && hsr.status !== 'onhold' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("a", {
        key: 0,
        class: "table-action stopRecording icon-stop",
        title: _ctx.translate('HeatmapSessionRecording_StopX', _ctx.translate('HeatmapSessionRecording_Heatmap')),
        onClick: $event => _ctx.completeHsr(hsr)
      }, null, 8, Listvue_type_template_id_27d46d25_hoisted_28)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), hsr.status !== 'onhold' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("a", {
        key: 1,
        target: "_blank",
        class: "table-action icon-show",
        title: _ctx.translate('HeatmapSessionRecording_ViewReport'),
        href: _ctx.getViewReportLink(hsr)
      }, null, 8, Listvue_type_template_id_27d46d25_hoisted_29)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_EntityDuplicatorAction, {
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
      }, null, 8, Listvue_type_template_id_27d46d25_hoisted_30)], 2)], 8, Listvue_type_template_id_27d46d25_hoisted_16);
    }), 128))])])), [[_directive_content_table], [_directive_tooltips]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_27d46d25_hoisted_31, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      class: "createNewHsr",
      value: "",
      onClick: _cache[2] || (_cache[2] = $event => _ctx.createHsr())
    }, [Listvue_type_template_id_27d46d25_hoisted_32, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreateNewHeatmap')), 1)])])]),
    _: 1
  }, 8, ["content-title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_27d46d25_hoisted_33, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteHeatmapConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_27d46d25_hoisted_34), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_27d46d25_hoisted_35)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_27d46d25_hoisted_36, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EndHeatmapConfirm')), 1), _ctx.endingHsrRepeats ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Listvue_type_template_id_27d46d25_hoisted_37, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EndHeatmapRepeatNotice')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_27d46d25_hoisted_38), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_27d46d25_hoisted_39)], 512)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_EntityDuplicatorModal, {
    modalStore: _ctx.entityDuplicatorStore
  }, null, 8, ["modalStore"])], 64);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/List.vue?vue&type=template&id=27d46d25

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
    ContentTable: external_CoreHome_["ContentTable"],
    Tooltips: external_CoreHome_["Tooltips"]
  },
  data() {
    return {
      searchFilter: '',
      showDuplicatorAction: true,
      enableDuplicatorAction: false,
      endingHsrRepeats: false,
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
      this.endingHsrRepeats = !!hsr.auto_repeat;
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
    onHoldReason(hsr) {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_StatusOnHoldHelp', hsr.scheduled_date_pretty || '');
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
      return HeatmapStore.statusOptions.value;
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



Listvue_type_script_lang_ts.render = Listvue_type_template_id_27d46d25_render

/* harmony default export */ var List = (Listvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue?vue&type=template&id=d34cf830

const Managevue_type_template_id_d34cf830_hoisted_1 = {
  class: "manageHsr",
  ref: "root"
};
const Managevue_type_template_id_d34cf830_hoisted_2 = {
  key: 0
};
const Managevue_type_template_id_d34cf830_hoisted_3 = {
  key: 1
};
function Managevue_type_template_id_d34cf830_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MatomoJsNotWritableAlert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MatomoJsNotWritableAlert");
  const _component_HeatmapList = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapList");
  const _component_HeatmapEdit = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapEdit");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_MatomoJsNotWritableAlert, {
    key: 0,
    "is-matomo-js-writable": _ctx.isMatomoJsWritable,
    "recording-type": _ctx.translate('HeatmapSessionRecording_Heatmaps')
  }, null, 8, ["is-matomo-js-writable", "recording-type"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Managevue_type_template_id_d34cf830_hoisted_1, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_d34cf830_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HeatmapList, {
    "pause-reason": _ctx.pauseReason
  }, null, 8, ["pause-reason"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_d34cf830_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HeatmapEdit, {
    "breakpoint-mobile": _ctx.breakpointMobile,
    "breakpoint-tablet": _ctx.breakpointTablet,
    "id-site-hsr": _ctx.idSiteHsr
  }, null, 8, ["breakpoint-mobile", "breakpoint-tablet", "id-site-hsr"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 512)], 64);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageHeatmap/Manage.vue?vue&type=template&id=d34cf830

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
    this.showReportNotFoundIfNeeded();
  },
  methods: {
    removeAnyHsrNotification() {
      external_CoreHome_["NotificationsStore"].remove('hsrmanagement');
    },
    showReportNotFoundIfNeeded() {
      if (!external_CoreHome_["MatomoUrl"].hashParsed.value.hsrReportNotFound) {
        return;
      }
      external_CoreHome_["NotificationsStore"].show({
        id: 'hsrreportnotfound',
        message: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ReportNoLongerExists'),
        context: 'warning',
        type: 'transient'
      });
      // remove the flag so the notification is not re-triggered on later navigation
      const hash = Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value);
      delete hash.hsrReportNotFound;
      external_CoreHome_["MatomoUrl"].updateHash(hash);
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



Managevue_type_script_lang_ts.render = Managevue_type_template_id_d34cf830_render

/* harmony default export */ var Manage = (Managevue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=template&id=3702361e

const Editvue_type_template_id_3702361e_hoisted_1 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_3702361e_hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_3702361e_hoisted_3 = {
  class: "loadingPiwik"
};
const Editvue_type_template_id_3702361e_hoisted_4 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Editvue_type_template_id_3702361e_hoisted_5 = {
  name: "name"
};
const Editvue_type_template_id_3702361e_hoisted_6 = {
  name: "description"
};
const Editvue_type_template_id_3702361e_hoisted_7 = {
  name: "autoRepeat"
};
const Editvue_type_template_id_3702361e_hoisted_8 = {
  class: "inline-help-node"
};
const Editvue_type_template_id_3702361e_hoisted_9 = ["innerHTML"];
const Editvue_type_template_id_3702361e_hoisted_10 = {
  name: "sampleLimit"
};
const Editvue_type_template_id_3702361e_hoisted_11 = {
  class: "form-group row"
};
const Editvue_type_template_id_3702361e_hoisted_12 = {
  class: "col s12"
};
const Editvue_type_template_id_3702361e_hoisted_13 = {
  class: "col s12 m6",
  style: {
    "padding-left": "0"
  }
};
const Editvue_type_template_id_3702361e_hoisted_14 = {
  key: 0
};
const Editvue_type_template_id_3702361e_hoisted_15 = {
  key: 0,
  class: "matchPageRules"
};
const Editvue_type_template_id_3702361e_hoisted_16 = ["innerHTML"];
const Editvue_type_template_id_3702361e_hoisted_17 = {
  key: 1
};
const Editvue_type_template_id_3702361e_hoisted_18 = ["innerHTML"];
const Editvue_type_template_id_3702361e_hoisted_19 = {
  class: "col s12 m6"
};
const Editvue_type_template_id_3702361e_hoisted_20 = {
  class: "form-help"
};
const Editvue_type_template_id_3702361e_hoisted_21 = {
  class: "inline-help"
};
const Editvue_type_template_id_3702361e_hoisted_22 = ["innerHTML"];
const Editvue_type_template_id_3702361e_hoisted_23 = {
  name: "sampleRate"
};
const Editvue_type_template_id_3702361e_hoisted_24 = {
  name: "minSessionTime"
};
const Editvue_type_template_id_3702361e_hoisted_25 = {
  name: "requiresActivity"
};
const Editvue_type_template_id_3702361e_hoisted_26 = {
  class: "inline-help-node"
};
const Editvue_type_template_id_3702361e_hoisted_27 = ["innerHTML"];
const Editvue_type_template_id_3702361e_hoisted_28 = ["innerHTML"];
const Editvue_type_template_id_3702361e_hoisted_29 = {
  class: "entityCancel"
};
function Editvue_type_template_id_3702361e_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_HsrUrlTarget = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrUrlTarget");
  const _component_HsrTargetTest = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HsrTargetTest");
  const _component_SaveButton = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SaveButton");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    class: "editHsr",
    "content-title": _ctx.contentTitle
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_3702361e_hoisted_1, [Editvue_type_template_id_3702361e_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_3702361e_hoisted_3, [Editvue_type_template_id_3702361e_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_UpdatingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      onSubmit: _cache[16] || (_cache[16] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr())
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "name",
      "model-value": _ctx.siteHsr.name,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.siteHsr.name = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('General_Name'),
      maxlength: 255,
      placeholder: _ctx.translate('HeatmapSessionRecording_FieldNamePlaceholderV2'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_SessionNameHelpText')
    }, null, 8, ["model-value", "title", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "textarea",
      name: "description",
      "model-value": _ctx.siteHsr.description,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => {
        _ctx.siteHsr.description = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_DescriptionOptional'),
      maxlength: 255,
      rows: 3,
      "ui-control-attributes": {
        class: 'compact-textarea'
      },
      placeholder: _ctx.translate('HeatmapSessionRecording_FieldDescriptionPlaceholder'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_HeatmapDescriptionHelpText')
    }, null, 8, ["model-value", "title", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "auto_repeat",
      title: _ctx.translate('HeatmapSessionRecording_AutoRepeatSessionRecording'),
      "model-value": _ctx.siteHsr.auto_repeat,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => {
        _ctx.siteHsr.auto_repeat = $event;
        _ctx.setValueHasChanged();
      })
    }, {
      "inline-help": Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        innerHTML: _ctx.$sanitize(_ctx.autoRepeatHelp)
      }, null, 8, Editvue_type_template_id_3702361e_hoisted_9)])]),
      _: 1
    }, 8, ["title", "model-value"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleLimit",
      "model-value": _ctx.siteHsr.sample_limit,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => {
        _ctx.siteHsr.sample_limit = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_SessionSampleLimit'),
      options: _ctx.sampleLimits,
      "inline-help": _ctx.translate('HeatmapSessionRecording_SessionSampleLimitHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_TargetPages')) + ":", 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_13, [!_ctx.showAdvancedTargeting ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Editvue_type_template_id_3702361e_hoisted_14, [_ctx.siteHsr.match_page_rules && _ctx.siteHsr.match_page_rules.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Editvue_type_template_id_3702361e_hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrUrlTarget, {
      "model-value": _ctx.siteHsr.match_page_rules[0],
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.setMatchPageRule($event, 0)),
      onAnyChange: _cache[5] || (_cache[5] = $event => _ctx.setValueHasChanged()),
      "simple-mode": true,
      "allow-any": false,
      "show-add-url": false,
      "can-be-removed": false
    }, null, 8, ["model-value"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      class: "targetingToggle",
      innerHTML: _ctx.$sanitize(_ctx.useAdvancedTargetingText),
      onClick: _cache[6] || (_cache[6] = (...args) => _ctx.onTargetingToggleClick && _ctx.onTargetingToggleClick(...args))
    }, null, 8, Editvue_type_template_id_3702361e_hoisted_16)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.showAdvancedTargeting ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Editvue_type_template_id_3702361e_hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      class: "targetingToggle",
      innerHTML: _ctx.$sanitize(_ctx.useSimpleTargetingText),
      onClick: _cache[7] || (_cache[7] = (...args) => _ctx.onTargetingToggleClick && _ctx.onTargetingToggleClick(...args))
    }, null, 8, Editvue_type_template_id_3702361e_hoisted_18), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.siteHsr.match_page_rules, (url, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`matchPageRules ${index} multiple`),
        key: index
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrUrlTarget, {
        "model-value": url,
        "onUpdate:modelValue": $event => _ctx.setMatchPageRule($event, index),
        onAddUrl: _cache[8] || (_cache[8] = $event => _ctx.addMatchPageRule()),
        onRemoveUrl: $event => _ctx.removeMatchPageRule(index),
        onAnyChange: _cache[9] || (_cache[9] = $event => _ctx.setValueHasChanged()),
        "allow-any": true,
        "disable-if-no-value": index > 0,
        "can-be-removed": index > 0,
        "show-add-url": true
      }, null, 8, ["model-value", "onUpdate:modelValue", "onRemoveUrl", "disable-if-no-value", "can-be-removed"])])], 2);
    }), 128))])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_20, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Editvue_type_template_id_3702361e_hoisted_21, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
      innerHTML: _ctx.$sanitize(_ctx.targetHelpText)
    }, null, 8, Editvue_type_template_id_3702361e_hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HsrTargetTest, {
      "included-targets": _ctx.siteHsr.match_page_rules
    }, null, 8, ["included-targets"])])])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "sampleRate",
      "model-value": _ctx.siteHsr.sample_rate,
      "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => {
        _ctx.siteHsr.sample_rate = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_SampleRate'),
      options: _ctx.sampleRates,
      introduction: _ctx.translate('HeatmapSessionRecording_AdvancedOptions'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_SessionSampleRateHelp')
    }, null, 8, ["model-value", "title", "options", "introduction", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_24, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "minSessionTime",
      "model-value": _ctx.siteHsr.min_session_time,
      "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => {
        _ctx.siteHsr.min_session_time = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_MinSessionTime'),
      options: _ctx.minSessionTimes,
      "inline-help": _ctx.translate('HeatmapSessionRecording_MinSessionTimeHelp')
    }, null, 8, ["model-value", "title", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_25, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "requiresActivity",
      "model-value": _ctx.siteHsr.requires_activity,
      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => {
        _ctx.siteHsr.requires_activity = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_RequiresActivity'),
      "inline-help": _ctx.translate('HeatmapSessionRecording_RequiresActivityHelp')
    }, null, 8, ["model-value", "title", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      name: "captureKeystrokes",
      "model-value": _ctx.siteHsr.capture_keystrokes,
      "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => {
        _ctx.siteHsr.capture_keystrokes = $event;
        _ctx.setValueHasChanged();
      }),
      title: _ctx.translate('HeatmapSessionRecording_CaptureKeystrokes')
    }, {
      "inline-help": Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        innerHTML: _ctx.$sanitize(_ctx.captureKeystrokesHelp)
      }, null, 8, Editvue_type_template_id_3702361e_hoisted_27)])]),
      _: 1
    }, 8, ["model-value", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      innerHTML: _ctx.$sanitize(_ctx.personalInformationNote)
    }, null, 8, Editvue_type_template_id_3702361e_hoisted_28), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
      class: "createButton",
      onConfirm: _cache[14] || (_cache[14] = $event => _ctx.edit ? _ctx.updateHsr() : _ctx.createHsr()),
      disabled: _ctx.isUpdating || !_ctx.isDirty,
      saving: _ctx.isUpdating,
      value: _ctx.saveButtonText
    }, null, 8, ["disabled", "saving", "value"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Editvue_type_template_id_3702361e_hoisted_29, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      onClick: _cache[15] || (_cache[15] = $event => _ctx.cancel())
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Cancel')), 1)])])], 32)]),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=template&id=3702361e

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
      showAdvancedTargeting: false,
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
      this.showAdvancedTargeting = false;
      external_CoreHome_["Matomo"].helper.lazyScrollToContent();
      if (this.edit && idSiteHsr) {
        SessionRecordingStore.findHsr(idSiteHsr).then(siteHsr => {
          if (!siteHsr) {
            return;
          }
          this.siteHsr = Object(external_CoreHome_["clone"])(siteHsr);
          this.siteHsr.sample_rate = `${this.siteHsr.sample_rate}`;
          this.addInitialMatchPageRule();
          this.showAdvancedTargeting = !isSimpleCompatible(this.siteHsr.match_page_rules);
          this.isDirty = false;
        });
        return;
      }
      if (this.create) {
        this.siteHsr = {
          idSite: external_CoreHome_["Matomo"].idSite,
          name: '',
          description: '',
          sample_rate: '10.0',
          sample_limit: 250,
          min_session_time: 0,
          requires_activity: true,
          capture_keystrokes: false,
          auto_repeat: 1
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
      this.isDirty = true;
    },
    onTargetingToggleClick(event) {
      const target = event.target;
      if (target.tagName !== 'A') {
        return;
      }
      event.preventDefault();
      if (target.classList.contains('showSimpleTargeting')) {
        if (!isSimpleCompatible(this.siteHsr.match_page_rules.slice(0, 1))) {
          this.siteHsr.match_page_rules = [{
            attribute: 'url',
            type: 'equals_simple',
            value: '',
            inverted: 0
          }];
        } else {
          this.siteHsr.match_page_rules = [this.siteHsr.match_page_rules[0]];
        }
        this.showAdvancedTargeting = false;
      } else {
        this.showAdvancedTargeting = true;
      }
      this.setValueHasChanged();
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
    autoRepeatHelp() {
      const link = 'https://matomo.org/faq/heatmap-session-recording/';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_AutoRepeatSessionRecordingHelp', `<a href="${link}" target="_blank" rel="noopener noreferrer">`, '</a>');
    },
    personalInformationNote() {
      const link = 'https://developer.matomo.org/guides/heatmap-session-recording/setup#masking-content-on-your-website';
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_PersonalInformationNote', Object(external_CoreHome_["translate"])('HeatmapSessionRecording_SessionRecording'), '<code>', '</code>', `<a href="${link}" target="_blank" rel="noreferrer noopener">`, '</a>');
    },
    saveButtonText() {
      return this.edit ? Object(external_CoreHome_["translate"])('CoreUpdater_UpdateTitle') : Object(external_CoreHome_["translate"])('HeatmapSessionRecording_CreateNewSessionRecording');
    },
    useAdvancedTargetingText() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_UseAdvancedTargeting', '<a href="" class="showAdvancedTargeting">', '</a>');
    },
    useSimpleTargetingText() {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_UseSimpleTargeting', '<a href="" class="showSimpleTargeting">', '</a>');
    },
    targetHelpText() {
      const docUrl = 'https://matomo.org/faq/heatmap-session-recording/';
      const key = this.showAdvancedTargeting ? 'HeatmapSessionRecording_FieldIncludedTargetsHelpAdvancedSessions' : 'HeatmapSessionRecording_FieldIncludedTargetsHelpSimpleSessions';
      return Object(external_CoreHome_["translate"])(key, Object(external_CoreHome_["externalLink"])(docUrl), '</a>');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Edit.vue



ManageSessionRecording_Editvue_type_script_lang_ts.render = Editvue_type_template_id_3702361e_render

/* harmony default export */ var ManageSessionRecording_Edit = (ManageSessionRecording_Editvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue?vue&type=template&id=2ee036d2

const Listvue_type_template_id_2ee036d2_hoisted_1 = {
  class: "sessionRecordingList"
};
const Listvue_type_template_id_2ee036d2_hoisted_2 = {
  class: "filterStatus"
};
const Listvue_type_template_id_2ee036d2_hoisted_3 = {
  class: "hsrSearchFilter",
  style: {
    "margin-left": "3.5px"
  }
};
const Listvue_type_template_id_2ee036d2_hoisted_4 = {
  class: "index"
};
const Listvue_type_template_id_2ee036d2_hoisted_5 = {
  class: "name"
};
const Listvue_type_template_id_2ee036d2_hoisted_6 = {
  class: "creationDate"
};
const Listvue_type_template_id_2ee036d2_hoisted_7 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_2ee036d2_hoisted_8 = {
  class: "status"
};
const Listvue_type_template_id_2ee036d2_hoisted_9 = {
  class: "autoRepeat"
};
const Listvue_type_template_id_2ee036d2_hoisted_10 = ["title"];
const Listvue_type_template_id_2ee036d2_hoisted_11 = {
  class: "action"
};
const Listvue_type_template_id_2ee036d2_hoisted_12 = {
  colspan: "7"
};
const Listvue_type_template_id_2ee036d2_hoisted_13 = {
  class: "loadingPiwik"
};
const Listvue_type_template_id_2ee036d2_hoisted_14 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);
const Listvue_type_template_id_2ee036d2_hoisted_15 = {
  colspan: "7"
};
const Listvue_type_template_id_2ee036d2_hoisted_16 = ["id"];
const Listvue_type_template_id_2ee036d2_hoisted_17 = {
  class: "index"
};
const Listvue_type_template_id_2ee036d2_hoisted_18 = {
  class: "name"
};
const Listvue_type_template_id_2ee036d2_hoisted_19 = {
  class: "creationDate"
};
const Listvue_type_template_id_2ee036d2_hoisted_20 = {
  class: "sampleLimit"
};
const Listvue_type_template_id_2ee036d2_hoisted_21 = {
  key: 0,
  class: "status status-paused"
};
const Listvue_type_template_id_2ee036d2_hoisted_22 = ["title"];
const Listvue_type_template_id_2ee036d2_hoisted_23 = {
  key: 1,
  class: "status status-onhold"
};
const Listvue_type_template_id_2ee036d2_hoisted_24 = ["title"];
const Listvue_type_template_id_2ee036d2_hoisted_25 = {
  key: 2,
  class: "status"
};
const Listvue_type_template_id_2ee036d2_hoisted_26 = {
  class: "autoRepeat"
};
const Listvue_type_template_id_2ee036d2_hoisted_27 = {
  class: "action"
};
const Listvue_type_template_id_2ee036d2_hoisted_28 = ["title", "onClick"];
const Listvue_type_template_id_2ee036d2_hoisted_29 = ["title", "onClick"];
const Listvue_type_template_id_2ee036d2_hoisted_30 = ["title", "href"];
const Listvue_type_template_id_2ee036d2_hoisted_31 = ["title", "onClick"];
const Listvue_type_template_id_2ee036d2_hoisted_32 = {
  class: "tableActionBar"
};
const Listvue_type_template_id_2ee036d2_hoisted_33 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-add"
}, null, -1);
const Listvue_type_template_id_2ee036d2_hoisted_34 = {
  class: "ui-confirm",
  ref: "confirmDeleteSessionRecording"
};
const Listvue_type_template_id_2ee036d2_hoisted_35 = ["value"];
const Listvue_type_template_id_2ee036d2_hoisted_36 = ["value"];
const Listvue_type_template_id_2ee036d2_hoisted_37 = {
  class: "ui-confirm",
  ref: "confirmEndSessionRecording"
};
const Listvue_type_template_id_2ee036d2_hoisted_38 = {
  key: 0,
  style: {
    "text-align": "center"
  }
};
const Listvue_type_template_id_2ee036d2_hoisted_39 = ["value"];
const Listvue_type_template_id_2ee036d2_hoisted_40 = ["value"];
function Listvue_type_template_id_2ee036d2_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  const _directive_tooltips = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("tooltips");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Listvue_type_template_id_2ee036d2_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('HeatmapSessionRecording_ManageSessionRecordings')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_SessionRecordingsUsageBenefits')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_2ee036d2_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      name: "filterStatus",
      "model-value": _ctx.filterStatus,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => {
        _ctx.setFilterStatus($event);
      }),
      title: _ctx.translate('HeatmapSessionRecording_Filter'),
      "full-width": true,
      options: _ctx.statusOptions
    }, null, 8, ["model-value", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_2ee036d2_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "hsrSearch",
      title: _ctx.translate('General_Search'),
      modelValue: _ctx.searchFilter,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.searchFilter = $event),
      "full-width": true
    }, null, 8, ["title", "modelValue"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.hsrs.length > 0]])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Id')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Name')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreationDate')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_SampleLimit')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CorePluginsAdmin_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_AutoRepeatSessionRecordingColumn')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
      class: "icon-info",
      title: _ctx.translate('HeatmapSessionRecording_AutoRepeatSessionRecordingColumnHelp')
    }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_10)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_2ee036d2_hoisted_11, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Actions')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Listvue_type_template_id_2ee036d2_hoisted_13, [Listvue_type_template_id_2ee036d2_hoisted_14, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading || _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_15, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_NoSessionRecordingsFound')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isLoading && _ctx.hsrs.length == 0]]), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.sortedHsrs, hsr => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        id: `hsr${hsr.idsitehsr}`,
        class: "hsrs",
        key: hsr.idsitehsr
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.idsitehsr), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_18, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_19, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.created_date_pretty), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_20, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.sample_limit), 1), hsr.status === 'paused' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_2ee036d2_hoisted_21, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "icon icon-help",
        title: _ctx.pauseReason
      }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_22)])) : hsr.status === 'onhold' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_2ee036d2_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_StatusOnHold')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "icon icon-help",
        title: _ctx.onHoldReason(hsr)
      }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_24)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", Listvue_type_template_id_2ee036d2_hoisted_25, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.ucfirst(hsr.status)), 1)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_26, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(hsr.auto_repeat ? _ctx.translate('General_Yes') : _ctx.translate('General_No')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_2ee036d2_hoisted_27, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-edit",
        title: _ctx.translate('HeatmapSessionRecording_EditX', _ctx.translate('HeatmapSessionRecording_SessionRecording')),
        onClick: $event => _ctx.editHsr(hsr.idsitehsr)
      }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_28), hsr.status !== 'ended' && hsr.status !== 'onhold' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("a", {
        key: 0,
        class: "table-action stopRecording icon-stop",
        title: _ctx.translate('HeatmapSessionRecording_StopX', _ctx.translate('HeatmapSessionRecording_SessionRecording')),
        onClick: $event => _ctx.completeHsr(hsr)
      }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_29)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), hsr.status !== 'onhold' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("a", {
        key: 1,
        class: "table-action icon-show",
        title: _ctx.translate('HeatmapSessionRecording_ViewReport'),
        href: _ctx.getViewReportLink(hsr),
        target: "_blank"
      }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_30)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "table-action icon-delete",
        title: _ctx.translate('HeatmapSessionRecording_DeleteX', _ctx.translate('HeatmapSessionRecording_SessionRecording')),
        onClick: $event => _ctx.deleteHsr(hsr)
      }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_31)])], 8, Listvue_type_template_id_2ee036d2_hoisted_16);
    }), 128))])])), [[_directive_content_table], [_directive_tooltips]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_2ee036d2_hoisted_32, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      class: "createNewHsr",
      value: "",
      onClick: _cache[2] || (_cache[2] = $event => _ctx.createHsr())
    }, [Listvue_type_template_id_2ee036d2_hoisted_33, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_CreateNewSessionRecording')), 1)])])]),
    _: 1
  }, 8, ["content-title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_2ee036d2_hoisted_34, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteSessionRecordingConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_35), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_36)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_2ee036d2_hoisted_37, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EndSessionRecordingConfirm')), 1), _ctx.endingHsrRepeats ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Listvue_type_template_id_2ee036d2_hoisted_38, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EndSessionRecordingRepeatNotice')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_39), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_2ee036d2_hoisted_40)], 512)]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/List.vue?vue&type=template&id=2ee036d2

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
    ContentTable: external_CoreHome_["ContentTable"],
    Tooltips: external_CoreHome_["Tooltips"]
  },
  data() {
    return {
      searchFilter: '',
      endingHsrRepeats: false
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
      this.endingHsrRepeats = !!hsr.auto_repeat;
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
    onHoldReason(hsr) {
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_StatusOnHoldHelpSessionRecording', hsr.scheduled_date_pretty || '');
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
      return SessionRecordingStore.statusOptions.value;
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



ManageSessionRecording_Listvue_type_script_lang_ts.render = Listvue_type_template_id_2ee036d2_render

/* harmony default export */ var ManageSessionRecording_List = (ManageSessionRecording_Listvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue?vue&type=template&id=5941c98a

const Managevue_type_template_id_5941c98a_hoisted_1 = {
  class: "manageHsr"
};
function Managevue_type_template_id_5941c98a_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MatomoJsNotWritableAlert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MatomoJsNotWritableAlert");
  const _component_SessionRecordingList = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SessionRecordingList");
  const _component_SessionRecordingEdit = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SessionRecordingEdit");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_MatomoJsNotWritableAlert, {
    key: 0,
    "is-matomo-js-writable": _ctx.isMatomoJsWritable,
    "recording-type": _ctx.translate('HeatmapSessionRecording_SessionRecordings')
  }, null, 8, ["is-matomo-js-writable", "recording-type"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Managevue_type_template_id_5941c98a_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SessionRecordingList, {
    "pause-reason": _ctx.pauseReason
  }, null, 8, ["pause-reason"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.editMode]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SessionRecordingEdit, {
    "id-site-hsr": _ctx.idSiteHsr
  }, null, 8, ["id-site-hsr"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.editMode]])])], 64);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/ManageSessionRecording/Manage.vue?vue&type=template&id=5941c98a

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
    this.showReportNotFoundIfNeeded();
  },
  methods: {
    removeAnyHsrNotification() {
      external_CoreHome_["NotificationsStore"].remove('hsrmanagement');
    },
    showReportNotFoundIfNeeded() {
      if (!external_CoreHome_["MatomoUrl"].hashParsed.value.hsrReportNotFound) {
        return;
      }
      external_CoreHome_["NotificationsStore"].show({
        id: 'hsrreportnotfound',
        message: Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ReportNoLongerExists'),
        context: 'warning',
        type: 'transient'
      });
      // remove the flag so the notification is not re-triggered on later navigation
      const hash = Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value);
      delete hash.hsrReportNotFound;
      external_CoreHome_["MatomoUrl"].updateHash(hash);
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



ManageSessionRecording_Managevue_type_script_lang_ts.render = Managevue_type_template_id_5941c98a_render

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
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=template&id=6759bcb2

const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_1 = {
  class: "heatmapVisPage"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_2 = {
  class: "heatmapReportHeader"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_3 = {
  class: "heatmap-vis-title"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_4 = {
  key: 0,
  class: "alert alert-info heatmap-country-alert"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_5 = {
  key: 1,
  class: "alert alert-info"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_6 = {
  class: "ui-confirm",
  ref: "deleteRetakeModal"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_7 = ["value"];
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_8 = ["value"];
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_9 = {
  class: "ui-confirm",
  ref: "deleteModal"
};
const HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_10 = ["value"];
function HeatmapVisPagevue_type_template_id_6759bcb2_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_EnrichedHeadline = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("EnrichedHeadline");
  const _component_HeatmapSettingsDropdown = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapSettingsDropdown");
  const _component_MatomoJsNotWritableAlert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MatomoJsNotWritableAlert");
  const _component_HeatmapVis = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("HeatmapVis");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_EnrichedHeadline, {
    "edit-url": _ctx.editUrl,
    "inline-help": _ctx.inlineHelp
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapX', `"${_ctx.heatmap.name}"`)), 1)]),
    _: 1
  }, 8, ["edit-url", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_HeatmapSettingsDropdown, {
    "edit-url": _ctx.editUrl,
    "has-snapshot": !!_ctx.heatmap.page_treemirror,
    "is-active": _ctx.isActive,
    "is-exporting": _ctx.isExporting,
    onExport: _ctx.onExport,
    onDelete: _ctx.onDelete
  }, null, 8, ["edit-url", "has-snapshot", "is-active", "is-exporting", "onExport", "onDelete"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_MatomoJsNotWritableAlert, {
    "is-matomo-js-writable": _ctx.isMatomoJsWritable,
    "recording-type": _ctx.translate('HeatmapSessionRecording_Heatmaps')
  }, null, 8, ["is-matomo-js-writable", "recording-type"]), _ctx.includedCountries ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_HeatmapInfoTrackVisitsFromCountries', _ctx.includedCountries)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isOnHold ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.onHoldMessage), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_HeatmapVis, {
    key: 2,
    ref: "heatmapVis",
    "created-date": _ctx.createdDate,
    "created-date-raw": _ctx.heatmap.created_date,
    "heatmap-name": _ctx.heatmap.name,
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
    "iframe-resolutions-values": _ctx.iframeResolutions,
    "image-proxy-nonce": _ctx.imageProxyNonce,
    "has-snapshot": !!_ctx.heatmap.page_treemirror,
    "capture-manually": !!_ctx.heatmap.capture_manually,
    "snapshot-deleted": !!_ctx.heatmap.screenshot_deleted_date,
    "is-paused": _ctx.heatmap.status === 'paused',
    onExporting: _cache[0] || (_cache[0] = $event => _ctx.isExporting = $event)
  }, null, 8, ["created-date", "created-date-raw", "heatmap-name", "excluded-elements", "num-samples", "url", "heatmap-date", "heatmap-period", "offset-accuracy", "breakpoint-tablet", "breakpoint-mobile", "heatmap-types", "device-types", "id-site-hsr", "is-active", "desktop-preview-size", "iframe-resolutions-values", "image-proxy-nonce", "has-snapshot", "capture-manually", "snapshot-deleted", "is-paused"])), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteRetakeSnapshotTitle')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteRetakeSnapshotDescription')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "deleteManual",
    type: "button",
    value: _ctx.translate('HeatmapSessionRecording_DeleteRetakeManually')
  }, null, 8, HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_7), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "validation",
    type: "button",
    value: _ctx.translate('HeatmapSessionRecording_DeleteRetakeAutomatically')
  }, null, 8, HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_8)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteSnapshotTitle')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_DeleteSnapshotDescription')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "validation",
    type: "button",
    value: _ctx.translate('HeatmapSessionRecording_DeleteSnapshotConfirm')
  }, null, 8, HeatmapVisPagevue_type_template_id_6759bcb2_hoisted_10)], 512)]);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=template&id=6759bcb2

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapSettingsDropdown.vue?vue&type=template&id=76b5ac76

const HeatmapSettingsDropdownvue_type_template_id_76b5ac76_hoisted_1 = ["href"];
const HeatmapSettingsDropdownvue_type_template_id_76b5ac76_hoisted_2 = {
  key: 1,
  class: "item",
  "data-action": "delete"
};
function HeatmapSettingsDropdownvue_type_template_id_76b5ac76_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MenuItemsDropdown = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("MenuItemsDropdown");
  return _ctx.hasWriteAccess ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["heatmapSettingsDropdown", {
      'is-exporting': _ctx.isExporting
    }])
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_MenuItemsDropdown, {
    "menu-title": _ctx.menuTitle,
    onAfterSelect: _cache[0] || (_cache[0] = $event => _ctx.onSelect($event))
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
      class: "item",
      href: _ctx.editUrl
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_EditHeatmap')), 9, HeatmapSettingsDropdownvue_type_template_id_76b5ac76_hoisted_1), _ctx.hasSnapshot && _ctx.hasAdminAccess ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
      key: 0,
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["item", {
        disabled: _ctx.isExporting
      }]),
      "data-action": "export"
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('HeatmapSessionRecording_ExportImage')), 3)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.hasSnapshot ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", HeatmapSettingsDropdownvue_type_template_id_76b5ac76_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.deleteLabel), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
    _: 1
  }, 8, ["menu-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true);
}
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapSettingsDropdown.vue?vue&type=template&id=76b5ac76

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapSettingsDropdown.vue?vue&type=script&lang=ts


/* harmony default export */ var HeatmapSettingsDropdownvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    editUrl: {
      type: String,
      required: true
    },
    hasSnapshot: Boolean,
    isActive: Boolean,
    isExporting: Boolean
  },
  components: {
    MenuItemsDropdown: external_CoreHome_["MenuItemsDropdown"]
  },
  emits: ['export', 'delete'],
  computed: {
    menuTitle() {
      // While exporting, the trigger becomes a non-interactive progress indicator: a spinner
      // plus the same "Generating image…" message the export button used before (PG-691).
      if (this.isExporting) {
        return `<span class="heatmapSettingsSpinner"></span> ${Object(external_CoreHome_["translate"])('HeatmapSessionRecording_ExportImageInProgress')}`;
      }
      return `<span class="icon-configure"></span> ${Object(external_CoreHome_["translate"])('HeatmapSessionRecording_HeatmapSettings')}`;
    },
    // Only active heatmaps can retake a snapshot; ended/paused ones get a plain delete (their
    // delete modal has no retake option), so match the menu wording to that.
    deleteLabel() {
      return this.isActive ? Object(external_CoreHome_["translate"])('HeatmapSessionRecording_DeleteRetakeSnapshot') : Object(external_CoreHome_["translate"])('HeatmapSessionRecording_DeleteSnapshotConfirm');
    },
    hasWriteAccess() {
      return !!(external_CoreHome_["Matomo"] !== null && external_CoreHome_["Matomo"] !== void 0 && external_CoreHome_["Matomo"].heatmapWriteAccess);
    },
    hasAdminAccess() {
      return !!(external_CoreHome_["Matomo"] !== null && external_CoreHome_["Matomo"] !== void 0 && external_CoreHome_["Matomo"].heatmapAdminAccess);
    }
  },
  methods: {
    onSelect(selected) {
      const action = selected.getAttribute('data-action');
      if (action === 'export' && !this.isExporting) {
        this.$emit('export');
      } else if (action === 'delete') {
        this.$emit('delete');
      }
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapSettingsDropdown.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapSettingsDropdown.vue



HeatmapSettingsDropdownvue_type_script_lang_ts.render = HeatmapSettingsDropdownvue_type_template_id_76b5ac76_render

/* harmony default export */ var HeatmapSettingsDropdown = (HeatmapSettingsDropdownvue_type_script_lang_ts);
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
    },
    imageProxyNonce: {
      type: String,
      default: ''
    }
  },
  components: {
    MatomoJsNotWritableAlert: MatomoJsNotWritableAlert,
    HeatmapVis: HeatmapVis,
    HeatmapSettingsDropdown: HeatmapSettingsDropdown,
    EnrichedHeadline: external_CoreHome_["EnrichedHeadline"]
  },
  data() {
    return {
      isExporting: false
    };
  },
  computed: {
    isOnHold() {
      return this.heatmap.status === 'onhold';
    },
    onHoldMessage() {
      const scheduledDate = this.heatmap.scheduled_date_pretty;
      if (!scheduledDate) {
        return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_RecordedHeatmapDocStatusOnHold');
      }
      return Object(external_CoreHome_["translate"])('HeatmapSessionRecording_RecordedHeatmapDocStatusOnHoldWithDate', scheduledDate);
    }
  },
  created() {
    // We want the selector hidden for heatmaps.
    external_CoreHome_["Matomo"].postEvent('hidePeriodSelector');
  },
  methods: {
    onExport() {
      this.$refs.heatmapVis.exportToImage();
    },
    onDelete() {
      // Active heatmaps still record, so they may retake the snapshot; ended/paused ones cannot,
      // so they only get a plain delete (their tracker configs no longer capture any DOM).
      // modalConfirm supports a `classes` option at runtime; the core ModalConfirmOptions type
      // omits it, so cast through unknown rather than editing the core type definition.
      const options = {
        classes: 'heatmapDeleteModal'
      };
      if (this.isActive) {
        external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.deleteRetakeModal, {
          deleteManual: () => this.deleteSnapshot(true),
          validation: () => this.deleteSnapshot(false)
        }, options);
      } else {
        external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.deleteModal, {
          validation: () => this.deleteSnapshot(false)
        }, options);
      }
    },
    deleteSnapshot(captureManually) {
      external_CoreHome_["AjaxHelper"].fetch({
        method: 'HeatmapSessionRecording.deleteHeatmapScreenshot',
        idSiteHsr: this.idSiteHsr,
        captureManually: captureManually ? 1 : 0
      }).then(() => {
        // reload so the report picks up the server-decided empty state
        window.location.reload();
      });
    }
  }
}));
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/HeatmapSessionRecording/vue/src/HeatmapVis/HeatmapVisPage.vue



HeatmapVisPagevue_type_script_lang_ts.render = HeatmapVisPagevue_type_template_id_6759bcb2_render

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