(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"), require("SegmentEditor"));
	else if(typeof define === 'function' && define.amd)
		define(["CoreHome", , "CorePluginsAdmin", "SegmentEditor"], factory);
	else if(typeof exports === 'object')
		exports["CustomReports"] = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"), require("SegmentEditor"));
	else
		root["CustomReports"] = factory(root["CoreHome"], root["Vue"], root["CorePluginsAdmin"], root["SegmentEditor"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__19dc__, __WEBPACK_EXTERNAL_MODULE__8bbf__, __WEBPACK_EXTERNAL_MODULE_a5a2__, __WEBPACK_EXTERNAL_MODULE_f06f__) {
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
/******/ 	__webpack_require__.p = "plugins/CustomReports/vue/dist/";
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

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "a5a2":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_a5a2__;

/***/ }),

/***/ "f06f":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_f06f__;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "ReportEdit", function() { return /* reexport */ Edit; });
__webpack_require__.d(__webpack_exports__, "ReportsList", function() { return /* reexport */ List; });
__webpack_require__.d(__webpack_exports__, "ReportsManage", function() { return /* reexport */ Manage; });

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

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./plugins/CustomReports/vue/src/Reports/Edit.vue?vue&type=template&id=769922f2

var _hoisted_1 = {
  class: "loadingPiwik"
};

var _hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);

var _hoisted_3 = {
  class: "loadingPiwik"
};

var _hoisted_4 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);

var _hoisted_5 = {
  class: "alert alert-warning"
};
var _hoisted_6 = {
  key: 0
};
var _hoisted_7 = {
  key: 1
};
var _hoisted_8 = {
  key: 0,
  class: "alert alert-warning"
};
var _hoisted_9 = ["innerHTML"];
var _hoisted_10 = {
  key: 1
};
var _hoisted_11 = {
  name: "name"
};
var _hoisted_12 = {
  name: "description"
};
var _hoisted_13 = {
  class: "form-group row"
};
var _hoisted_14 = {
  class: "col s12"
};
var _hoisted_15 = {
  class: "col s12 m6"
};
var _hoisted_16 = {
  for: "all_websites",
  class: "siteSelectorLabel"
};
var _hoisted_17 = {
  class: "sites_autocomplete"
};
var _hoisted_18 = {
  class: "col s12 m6"
};
var _hoisted_19 = {
  class: "form-help"
};
var _hoisted_20 = {
  key: 0,
  class: "inline-help"
};
var _hoisted_21 = {
  key: 1,
  class: "inline-help"
};
var _hoisted_22 = {
  key: 0,
  class: "col s12 m6"
};
var _hoisted_23 = {
  key: 0
};
var _hoisted_24 = {
  for: "websitecontains"
};

var _hoisted_25 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_26 = ["placeholder"];
var _hoisted_27 = ["disabled", "value"];
var _hoisted_28 = {
  key: 1
};

var _hoisted_29 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_30 = {
  class: "entityTable"
};
var _hoisted_31 = {
  class: "siteId"
};
var _hoisted_32 = {
  class: "siteName"
};
var _hoisted_33 = {
  key: 0,
  class: "siteAction"
};
var _hoisted_34 = {
  colspan: "3"
};
var _hoisted_35 = {
  key: 0,
  class: "siteAction"
};
var _hoisted_36 = ["onClick"];
var _hoisted_37 = {
  class: "form-group row"
};
var _hoisted_38 = {
  class: "col s12"
};
var _hoisted_39 = {
  class: "unlockAlert alert alert-info"
};
var _hoisted_40 = {
  key: 0
};
var _hoisted_41 = {
  key: 1
};

var _hoisted_42 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_43 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_44 = ["value"];
var _hoisted_45 = {
  class: "alertUnlocked alert alert-warning"
};
var _hoisted_46 = {
  key: 0
};
var _hoisted_47 = {
  key: 1
};
var _hoisted_48 = {
  name: "reportType"
};
var _hoisted_49 = {
  class: "form-group row"
};
var _hoisted_50 = {
  class: "col s12 m6 dimensionsGroup"
};

var _hoisted_51 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_52 = {
  class: "groupValueSelect",
  name: "dimensions"
};
var _hoisted_53 = ["title", "onClick"];
var _hoisted_54 = {
  class: "groupValueSelect addDimension",
  name: "dimensions"
};
var _hoisted_55 = {
  class: "col s12 m6"
};
var _hoisted_56 = {
  class: "form-help"
};
var _hoisted_57 = ["innerHTML"];
var _hoisted_58 = {
  class: "form-group row"
};
var _hoisted_59 = {
  class: "col s12 m6 metricsGroup"
};

var _hoisted_60 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_61 = {
  class: "groupValueSelect",
  name: "metrics"
};
var _hoisted_62 = ["title", "onClick"];
var _hoisted_63 = {
  class: "groupValueSelect addMetric",
  name: "metrics"
};
var _hoisted_64 = {
  class: "col s12 m6"
};
var _hoisted_65 = {
  class: "form-help"
};
var _hoisted_66 = {
  class: "inline-help"
};
var _hoisted_67 = ["innerHTML"];
var _hoisted_68 = {
  class: "form-group row segmentFilterGroup"
};
var _hoisted_69 = {
  class: "col s12"
};
var _hoisted_70 = {
  style: {
    "margin": "8px 0",
    "display": "inline-block"
  }
};
var _hoisted_71 = {
  class: "form-group row"
};
var _hoisted_72 = {
  class: "col s12"
};

var _hoisted_73 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_74 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);

var _hoisted_75 = {
  name: "reportCategories"
};
var _hoisted_76 = {
  name: "reportSubcategories"
};
var _hoisted_77 = {
  class: "alert alert-warning"
};
var _hoisted_78 = {
  key: 0
};
var _hoisted_79 = {
  key: 1
};
var _hoisted_80 = {
  class: "alert alert-warning"
};
var _hoisted_81 = {
  key: 0
};
var _hoisted_82 = {
  key: 1
};
var _hoisted_83 = {
  key: 0,
  class: "form-group row"
};
var _hoisted_84 = ["textContent"];
var _hoisted_85 = {
  class: "col s12 m6"
};
var _hoisted_86 = {
  id: "childReports",
  class: "col s12 m6"
};
var _hoisted_87 = ["data-id"];

var _hoisted_88 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "ui-icon ui-icon-arrowthick-2-n-s"
}, null, -1);

var _hoisted_89 = {
  class: "col s12 m6"
};
var _hoisted_90 = {
  class: "form-help"
};
var _hoisted_91 = ["textContent"];
var _hoisted_92 = {
  class: "entityCancel"
};
var _hoisted_93 = {
  class: "ui-confirm",
  id: "confirmUnlockReport",
  ref: "confirmUnlockReport"
};
var _hoisted_94 = {
  key: 0
};
var _hoisted_95 = {
  key: 1
};
var _hoisted_96 = ["value"];
var _hoisted_97 = ["value"];
var _hoisted_98 = {
  class: "ui-confirm",
  id: "infoReportIsLocked",
  ref: "infoReportIsLocked"
};
var _hoisted_99 = {
  key: 0
};
var _hoisted_100 = {
  key: 1
};
var _hoisted_101 = ["value"];
var _hoisted_102 = ["value"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");

  var _component_SiteSelector = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SiteSelector");

  var _component_SegmentGenerator = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SegmentGenerator");

  var _component_SaveButton = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SaveButton");

  var _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");

  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    class: "editReport",
    "content-title": _ctx.contentTitle
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(function () {
      var _ctx$report$metrics, _ctx$report$dimension, _ctx$report$subcatego;

      return [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_1, [_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_3, [_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_UpdatingData')), 1)])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_5, [_ctx.multipleSites.length && !_ctx.report.allowedToEdit ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportEditNotAllowedMultipleWebsitesAccessIssue')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportEditNotAllowedAllWebsitesUpdated')), 1))], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.canEdit]]), _ctx.report.status === 'paused' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_8, [_ctx.report.allowedToEdit ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 0,
        innerHTML: _ctx.getPausedStateAdminMessage
      }, null, 8, _hoisted_9)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_10, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_NoDataMessagePausedStateNonAdminUser')), 1))])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        onSubmit: _cache[15] || (_cache[15] = function ($event) {
          return _ctx.edit ? _ctx.updateReport() : _ctx.createReport();
        })
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "text",
        name: "name",
        "model-value": _ctx.report.name,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          _ctx.report.name = $event;

          _ctx.setValueHasChanged();
        }),
        title: _ctx.translate('General_Name'),
        maxlength: 50,
        disabled: !_ctx.canEdit,
        placeholder: _ctx.translate('CustomReports_FieldNamePlaceholder'),
        "inline-help": _ctx.translate('CustomReports_ReportNameHelp')
      }, null, 8, ["model-value", "title", "disabled", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "textarea",
        name: "description",
        "model-value": _ctx.report.description,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
          _ctx.report.description = $event;

          _ctx.setValueHasChanged();
        }),
        title: "".concat(_ctx.translate('General_Description'), " (optional)"),
        maxlength: 1000,
        disabled: !_ctx.canEdit,
        rows: 3,
        placeholder: _ctx.translate('CustomReports_FieldDescriptionPlaceholder'),
        "inline-help": _ctx.translate('CustomReports_ReportDescriptionHelp')
      }, null, 8, ["model-value", "title", "disabled", "placeholder", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_13, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", _hoisted_14, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ApplyTo')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("label", _hoisted_16, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Website')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SiteSelector, {
        id: "all_websites",
        "model-value": _ctx.report.site,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = function ($event) {
          _ctx.report.site = $event;

          _ctx.setWebsiteChanged($event);
        }),
        "show-all-sites-item": _ctx.isSuperUser,
        "switch-site-on-select": false,
        "show-selected-site": true
      }, null, 8, ["model-value", "show-all-sites-item"])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_19, [_ctx.isSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_20, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportAllWebsitesHelp')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_21, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportAllWebsitesNonSuperUserHelp')), 1))])]), _ctx.report.site.id !== 'all' && _ctx.report.site.id !== '0' && _ctx.report.site.id !== 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_22, [_ctx.report.allowedToEdit ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_24, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_SelectMeasurablesMatchingSearch')), 1), _hoisted_25, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        class: "control_text customReportSearchMeasurablesField",
        type: "text",
        id: "websitecontains",
        "onUpdate:modelValue": _cache[3] || (_cache[3] = function ($event) {
          return _ctx.containsText = $event;
        }),
        placeholder: _ctx.translate('General_Search')
      }, null, 8, _hoisted_26), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vModelText"], _ctx.containsText]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        style: {
          "margin-left": "3.5px"
        },
        disabled: !_ctx.containsText,
        class: "btn customReportSearchFindMeasurables",
        type: "button",
        onClick: _cache[4] || (_cache[4] = function ($event) {
          return _ctx.addSitesContaining(_ctx.containsText);
        }),
        value: _ctx.translate('CustomReports_FindMeasurables')
      }, null, 8, _hoisted_27)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.report.allowedToEdit || _ctx.multipleSites.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_28, [_hoisted_29, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("table", _hoisted_30, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", _hoisted_31, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Id')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", _hoisted_32, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Name')), 1), _ctx.report.allowedToEdit ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("th", _hoisted_33, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Remove')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_34, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_NoMeasurableAssignedYet')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.multipleSites.length]]), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.multipleSites, function (site, index) {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
          key: index
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(site.idsite), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(site.name), 1), _ctx.report.allowedToEdit ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("td", _hoisted_35, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-minus table-action",
          onClick: function onClick($event) {
            return _ctx.removeSite(site);
          }
        }, null, 8, _hoisted_36)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.multipleSites.length > 0]]);
      }), 128))])])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_37, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", _hoisted_38, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportContent')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_39, [_ctx.browserArchivingDisabled && _ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_WarningRequiresUnlockBrowserArchivingDisabled', _ctx.reArchiveLastN)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), !_ctx.browserArchivingDisabled || !_ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_41, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_WarningRequiresUnlock')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _hoisted_42, _hoisted_43, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "button",
        class: "btn unlockReport",
        onClick: _cache[5] || (_cache[5] = function ($event) {
          return _ctx.unlockReport();
        }),
        value: _ctx.translate('CustomReports_Unlock')
      }, null, 8, _hoisted_44)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLocked]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_45, [_ctx.browserArchivingDisabled && _ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_46, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_WarningOnUpdateReportMightGetLostBrowserArchivingDisabled', _ctx.reArchiveLastN)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), !_ctx.browserArchivingDisabled || !_ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_47, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_WarningOnUpdateReportMightGetLost')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUnlocked]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_48, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "radio",
        name: "reportType",
        "model-value": _ctx.report.report_type,
        "onUpdate:modelValue": _cache[6] || (_cache[6] = function ($event) {
          return _ctx.setReportTypeHasChanged($event);
        }),
        title: _ctx.translate('CustomReports_ReportType'),
        disabled: !_ctx.canEdit,
        options: _ctx.reportTypes
      }, null, 8, ["model-value", "title", "disabled", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_49, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_50, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("label", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_Dimensions')), 1), _hoisted_51, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.report.dimensions, function (dimension, dimIndex) {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
          class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])("selectedDimension selectedDimension".concat(dimIndex)),
          key: dimIndex
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_52, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
          uicontrol: "expandable-select",
          name: "dimensions",
          "model-value": dimension,
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return _ctx.changeDimension($event, dimIndex);
          },
          title: _ctx.dimensionsReadable[dimension] || dimension,
          "full-width": true,
          options: _ctx.dimensions
        }, null, 8, ["model-value", "onUpdate:modelValue", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-minus",
          title: _ctx.translate('CustomReports_RemoveDimension'),
          onClick: function onClick($event) {
            return _ctx.removeDimension(dimIndex);
          }
        }, null, 8, _hoisted_53)], 2);
      }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_54, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "expandable-select",
        name: "dimensions",
        "model-value": '',
        "onUpdate:modelValue": _cache[7] || (_cache[7] = function ($event) {
          _ctx.addDimension($event);
        }),
        title: _ctx.translate('CustomReports_AddDimension'),
        "full-width": true,
        options: _ctx.dimensions
      }, null, 8, ["title", "options"])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.report.dimensions.length < _ctx.maxDimensions]])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_55, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_56, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "inline-help",
        innerHTML: _ctx.$sanitize(_ctx.getDimensionsHelpText)
      }, null, 8, _hoisted_57)])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.report.report_type !== 'evolution']]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_58, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_59, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("label", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Metrics')), 1), _hoisted_60, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.report.metrics, function (metric, metricIndex) {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
          class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])("selectedMetric selectedMetric".concat(metricIndex)),
          key: metricIndex
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_61, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
          uicontrol: "expandable-select",
          name: "metrics",
          "model-value": metric,
          "onUpdate:modelValue": function onUpdateModelValue($event) {
            return _ctx.changeMetric($event, metricIndex);
          },
          title: _ctx.metricsReadable[metric] || metric,
          "full-width": true,
          options: _ctx.metrics
        }, null, 8, ["model-value", "onUpdate:modelValue", "title", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-minus",
          title: _ctx.translate('CustomReports_RemoveMetric'),
          onClick: function onClick($event) {
            return _ctx.removeMetric(metricIndex);
          }
        }, null, 8, _hoisted_62)], 2);
      }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_63, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "expandable-select",
        name: "metrics",
        "model-value": '',
        "onUpdate:modelValue": _cache[8] || (_cache[8] = function ($event) {
          _ctx.addMetric($event);
        }),
        title: _ctx.translate('CustomReports_AddMetric'),
        "full-width": true,
        options: _ctx.metrics
      }, null, 8, ["title", "options"])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_64, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_65, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_66, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportMetricsHelp')), 1)])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
        class: "alert alert-warning",
        innerHTML: _ctx.getProductRevenueDependencyMessage
      }, null, 8, _hoisted_67), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.dependencyAdded]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_68, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_69, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("label", _hoisted_70, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_Filter')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportSegmentHelp')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SegmentGenerator, {
        "model-value": _ctx.report.segment_filter,
        "onUpdate:modelValue": _cache[9] || (_cache[9] = function ($event) {
          return _ctx.setSegmentFilterHasChanged($event);
        }),
        idsite: _ctx.report.site.id
      }, null, 8, ["model-value", "idsite"])])])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_71, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_72, [_hoisted_73, _hoisted_74, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
        class: "showPreviewButton",
        disabled: !((_ctx$report$metrics = _ctx.report.metrics) !== null && _ctx$report$metrics !== void 0 && _ctx$report$metrics.length) || !((_ctx$report$dimension = _ctx.report.dimensions) !== null && _ctx$report$dimension !== void 0 && _ctx$report$dimension.length),
        onConfirm: _cache[10] || (_cache[10] = function ($event) {
          return _ctx.showPreview();
        }),
        value: _ctx.translate('CustomReports_PreviewReport')
      }, null, 8, ["disabled", "value"])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.report.report_type === 'table']]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_75, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "select",
        name: "reportCategories",
        "model-value": _ctx.report.category.id,
        "onUpdate:modelValue": _cache[11] || (_cache[11] = function ($event) {
          _ctx.report.category.id = $event;

          _ctx.setValueHasChanged();
        }),
        title: _ctx.translate('CustomReports_ReportCategory'),
        disabled: !_ctx.canEdit,
        options: _ctx.categories,
        introduction: _ctx.translate('CustomReports_ReportPage'),
        "inline-help": _ctx.translate('CustomReports_ReportCategoryHelp')
      }, null, 8, ["model-value", "title", "disabled", "options", "introduction", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_76, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "select",
        name: "reportSubcategories",
        "model-value": (_ctx$report$subcatego = _ctx.report.subcategory) === null || _ctx$report$subcatego === void 0 ? void 0 : _ctx$report$subcatego.id,
        "onUpdate:modelValue": _cache[12] || (_cache[12] = function ($event) {
          _ctx.setSubcategory($event);

          _ctx.setValueHasChanged();
        }),
        title: _ctx.translate('CustomReports_ReportSubcategory'),
        disabled: !_ctx.canEdit,
        options: _ctx.subcategories[_ctx.report.category.id],
        "inline-help": _ctx.translate('CustomReports_ReportSubcategoryHelp')
      }, null, 8, ["model-value", "title", "disabled", "options", "inline-help"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_77, [_ctx.browserArchivingDisabled && _ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_78, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_WarningOnUpdateReportMightGetLostBrowserArchivingDisabled', _ctx.reArchiveLastN)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), !_ctx.browserArchivingDisabled || !_ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_79, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_WarningOnUpdateReportMightGetLost')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUnlocked]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_80, [_ctx.multipleSites.length && !_ctx.report.allowedToEdit ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_81, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportEditNotAllowedMultipleWebsitesAccessIssue')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_82, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ReportEditNotAllowedAllWebsitesUpdated')), 1))], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.canEdit]]), _ctx.childReports.length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_83, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", {
        class: "col s12",
        textContent: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_OrderSubCategoryReports'))
      }, null, 8, _hoisted_84), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_85, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", _hoisted_86, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.childReports, function (childReport) {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: childReport.idcustomreport,
          "data-id": childReport.idcustomreport
        }, [_hoisted_88, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(childReport.name), 1)], 8, _hoisted_87);
      }), 128))])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_89, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_90, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
        class: "form-description",
        textContent: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_OrderSubCategoryReportsDescription'))
      }, null, 8, _hoisted_91)])])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SaveButton, {
        class: "createButton",
        onConfirm: _cache[13] || (_cache[13] = function ($event) {
          return _ctx.edit ? _ctx.updateReport() : _ctx.createReport();
        }),
        disabled: _ctx.isUpdating || !_ctx.isDirty,
        saving: _ctx.isUpdating,
        value: _ctx.saveButtonText
      }, null, 8, ["disabled", "saving", "value"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.canEdit]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_92, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        onClick: _cache[14] || (_cache[14] = function ($event) {
          return _ctx.cancel();
        })
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Cancel')), 1)])])], 32), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_93, [_ctx.browserArchivingDisabled && _ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("h2", _hoisted_94, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ConfirmUnlockReportBrowserArchivingDisabled', _ctx.reArchiveLastN)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), !_ctx.browserArchivingDisabled || !_ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("h2", _hoisted_95, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ConfirmUnlockReport')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "yes",
        type: "button",
        value: _ctx.translate('General_Yes')
      }, null, 8, _hoisted_96), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "no",
        type: "button",
        value: _ctx.translate('General_No')
      }, null, 8, _hoisted_97)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_98, [_ctx.browserArchivingDisabled && _ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("h2", _hoisted_99, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_InfoReportIsLockedBrowserArchivingDisabled', _ctx.reArchiveLastN)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), !_ctx.browserArchivingDisabled || !_ctx.reArchiveLastN ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("h2", _hoisted_100, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_InfoReportIsLocked')), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "unlock",
        type: "button",
        value: _ctx.translate('CustomReports_Unlock')
      }, null, 8, _hoisted_101), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "ok",
        type: "button",
        value: _ctx.translate('General_Cancel')
      }, null, 8, _hoisted_102)], 512)];
    }),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/Edit.vue?vue&type=template&id=769922f2

// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// EXTERNAL MODULE: external "CorePluginsAdmin"
var external_CorePluginsAdmin_ = __webpack_require__("a5a2");

// EXTERNAL MODULE: external "SegmentEditor"
var external_SegmentEditor_ = __webpack_require__("f06f");

// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/CustomReports.store.ts
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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



function arrayFilterAndRemoveDuplicates(values) {
  return _toConsumableArray(new Set(values)).filter(function (v) {
    return !!v;
  });
}

function formatExpandableList(listByCategories, subcategoryField, extraField) {
  var list = [];
  listByCategories.forEach(function (category) {
    category[subcategoryField].forEach(function (value) {
      list.push(Object.assign({
        group: category.category,
        key: value.uniqueId,
        value: value.name,
        tooltip: value.description || undefined
      }, extraField ? _defineProperty({}, extraField, value[extraField]) : {}));
    });
  });
  return list;
}

var EMPTY_CAT = {
  key: '',
  value: ''
};

var CustomReports_store_CustomReportsStore = /*#__PURE__*/function () {
  function CustomReportsStore() {
    var _this = this;

    _classCallCheck(this, CustomReportsStore);

    _defineProperty(this, "privateState", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["reactive"])({
      reports: [],
      reportTypesReadable: {},
      dimensionsReadable: {},
      metricsReadable: {},
      categories: [],
      subcategories: {},
      isLoading: false,
      isUpdating: false,
      allMetrics: [],
      allDimensions: []
    }));

    _defineProperty(this, "state", Object(external_commonjs_vue_commonjs2_vue_root_Vue_["computed"])(function () {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["readonly"])(_this.privateState);
    }));

    _defineProperty(this, "fetchPromise", null);

    _defineProperty(this, "availableReportTypesPromise", null);

    _defineProperty(this, "dimensionsPromise", null);

    _defineProperty(this, "dimensionsIdsiteLoaded", 0);

    _defineProperty(this, "metricsPromise", null);

    _defineProperty(this, "metricsIdsiteLoaded", 0);

    _defineProperty(this, "categoriesPromise", null);

    _defineProperty(this, "categoriesIdsiteLoaded", null);
  }

  _createClass(CustomReportsStore, [{
    key: "reload",
    value: function reload() {
      this.privateState.reports = [];
      this.fetchPromise = null;
      return this.fetchReports();
    }
  }, {
    key: "cleanupSegmentDefinition",
    value: function cleanupSegmentDefinition(definition) {
      var result = definition;
      result = result.replace('\'', '%27');
      result = result.replace('&', '%26');
      return result;
    }
  }, {
    key: "getAvailableReportTypes",
    value: function getAvailableReportTypes() {
      var _this2 = this;

      if (!this.availableReportTypesPromise) {
        this.availableReportTypesPromise = external_CoreHome_["AjaxHelper"].fetch({
          method: 'CustomReports.getAvailableReportTypes',
          filter_limit: '-1'
        }).then(function (reportTypes) {
          var reportTypeMap = {};
          reportTypes.forEach(function (rt) {
            reportTypeMap[rt.key] = rt.value;
          });
          _this2.privateState.reportTypesReadable = reportTypeMap;
        });
      }

      return this.availableReportTypesPromise.then(function () {
        return _this2.state.value.reportTypesReadable;
      });
    }
  }, {
    key: "getAvailableDimensions",
    value: function getAvailableDimensions(idSite) {
      var _this3 = this;

      if (!this.dimensionsPromise || this.dimensionsIdsiteLoaded !== idSite) {
        this.dimensionsIdsiteLoaded = idSite;
        this.dimensionsPromise = external_CoreHome_["AjaxHelper"].fetch({
          method: 'CustomReports.getAvailableDimensions',
          filter_limit: '-1',
          idSite: idSite
        }).then(function (dimensions) {
          var dimensionMap = {};
          dimensions.forEach(function (category) {
            category.dimensions.forEach(function (dimension) {
              dimensionMap[dimension.uniqueId] = dimension.name;
            });
          });
          _this3.privateState.dimensionsReadable = dimensionMap;
          _this3.privateState.allDimensions = formatExpandableList(dimensions, 'dimensions', 'sqlSegment');
        });
      }

      return this.dimensionsPromise.then(function () {
        return _this3.state.value.dimensionsReadable;
      });
    }
  }, {
    key: "getAvailableMetrics",
    value: function getAvailableMetrics(idSite) {
      var _this4 = this;

      if (!this.metricsPromise || this.metricsIdsiteLoaded !== idSite) {
        this.metricsIdsiteLoaded = idSite;
        this.metricsPromise = external_CoreHome_["AjaxHelper"].fetch({
          method: 'CustomReports.getAvailableMetrics',
          filter_limit: '-1',
          idSite: idSite
        }).then(function (metrics) {
          var metricsMap = {};
          metrics.forEach(function (metricsCategory) {
            metricsCategory.metrics.forEach(function (metric) {
              metricsMap[metric.uniqueId] = metric.name;
            });
          });
          _this4.privateState.metricsReadable = metricsMap;
          _this4.privateState.allMetrics = formatExpandableList(metrics, 'metrics');
        });
      }

      return this.metricsPromise.then(function () {
        return _this4.state.value.metricsReadable;
      });
    }
  }, {
    key: "getAvailableCategories",
    value: function getAvailableCategories(idSite) {
      var _this5 = this;

      var idSiteToUse = !idSite || idSite === 'all' ? external_CoreHome_["Matomo"].idSite : idSite;

      if (!this.categoriesPromise || this.categoriesIdsiteLoaded !== idSite) {
        this.categoriesPromise = external_CoreHome_["AjaxHelper"].fetch({
          method: 'CustomReports.getAvailableCategories',
          filter_limit: '-1',
          idSite: idSiteToUse
        }).then(function (response) {
          var categories = [];
          var subcategories = {};
          response.forEach(function (category) {
            categories.push({
              key: category.uniqueId,
              value: category.name
            });
            category.subcategories.forEach(function (subcat) {
              subcategories[category.uniqueId] = subcategories[category.uniqueId] || [EMPTY_CAT];
              subcategories[category.uniqueId].push({
                key: subcat.uniqueId,
                value: subcat.name
              });
            });
          });
          _this5.privateState.categories = categories;
          _this5.privateState.subcategories = subcategories;
        });
      }

      return this.categoriesPromise;
    }
  }, {
    key: "fetchReports",
    value: function fetchReports() {
      var _this6 = this;

      if (!this.fetchPromise) {
        this.fetchPromise = external_CoreHome_["AjaxHelper"].fetch({
          method: 'CustomReports.getConfiguredReports',
          filter_limit: '-1'
        });
      }

      this.privateState.isLoading = true;
      this.privateState.reports = [];
      return this.fetchPromise.then(function (reports) {
        _this6.privateState.reports = reports.map(function (report) {
          var _report$subcategory, _report$category;

          var subcategoryLink = undefined;

          if (report !== null && report !== void 0 && (_report$subcategory = report.subcategory) !== null && _report$subcategory !== void 0 && _report$subcategory.id) {
            subcategoryLink = report.subcategory.id;
          } else if ((report === null || report === void 0 ? void 0 : (_report$category = report.category) === null || _report$category === void 0 ? void 0 : _report$category.id) === 'CustomReports_CustomReports') {
            subcategoryLink = report.idcustomreport;
          } else {
            subcategoryLink = report.name;
          }

          return Object.assign(Object.assign({}, report), {}, {
            // report.idsite is falsey when report is set for all sites
            linkIdSite: report.idsite ? report.idsite : external_CoreHome_["Matomo"].idSite,
            subcategoryLink: subcategoryLink
          });
        });
        return _this6.state.value.reports;
      }).finally(function () {
        _this6.privateState.isLoading = false;
      });
    }
  }, {
    key: "findReport",
    value: function findReport(idCustomReport, isReload) {
      var _this7 = this;

      // before going through an API request we first try to find it in loaded reports
      var found = this.state.value.reports.find(function (r) {
        return parseInt("".concat(r.idcustomreport), 10) === idCustomReport;
      });

      if (found && !isReload) {
        return Promise.resolve(found);
      } // otherwise we fetch it via API


      this.privateState.isLoading = true;
      return external_CoreHome_["AjaxHelper"].fetch({
        idCustomReport: idCustomReport,
        method: 'CustomReports.getConfiguredReport'
      }).finally(function () {
        _this7.privateState.isLoading = false;
      });
    }
  }, {
    key: "deleteReport",
    value: function deleteReport(idCustomReport, idSite) {
      var _this8 = this;

      this.privateState.isUpdating = true;
      this.privateState.reports = [];
      return external_CoreHome_["AjaxHelper"].fetch({
        idCustomReport: idCustomReport,
        idSite: "".concat(idSite),
        method: 'CustomReports.deleteCustomReport'
      }, {
        withTokenInUrl: true
      }).then(function () {
        return {
          type: 'success'
        };
      }).catch(function (e) {
        return {
          type: 'error',
          message: e.message || e
        };
      }).finally(function () {
        _this8.privateState.isUpdating = false;
      });
    }
  }, {
    key: "pauseReport",
    value: function pauseReport(idCustomReport, idSite) {
      var _this9 = this;

      this.privateState.isUpdating = true;
      this.privateState.reports = [];
      return external_CoreHome_["AjaxHelper"].fetch({
        idCustomReport: idCustomReport,
        idSite: "".concat(idSite),
        method: 'CustomReports.pauseCustomReport'
      }, {
        withTokenInUrl: true
      }).then(function () {
        return {
          type: 'success'
        };
      }).catch(function (e) {
        return {
          type: 'error',
          message: e.message || e
        };
      }).finally(function () {
        _this9.privateState.isUpdating = false;
      });
    }
  }, {
    key: "resumeReport",
    value: function resumeReport(idCustomReport, idSite) {
      var _this10 = this;

      this.privateState.isUpdating = true;
      this.privateState.reports = [];
      return external_CoreHome_["AjaxHelper"].fetch({
        idCustomReport: idCustomReport,
        idSite: "".concat(idSite),
        method: 'CustomReports.resumeCustomReport'
      }, {
        withTokenInUrl: true
      }).then(function () {
        return {
          type: 'success'
        };
      }).catch(function (e) {
        return {
          type: 'error',
          message: e.message || e
        };
      }).finally(function () {
        _this10.privateState.isUpdating = false;
      });
    }
  }, {
    key: "createOrUpdateReport",
    value: function createOrUpdateReport(report, method, childReportIds, multipleIdSites) {
      var _report$category2,
          _report$subcategory2,
          _this11 = this;

      this.privateState.isUpdating = true;
      return external_CoreHome_["AjaxHelper"].post({
        method: method,
        idCustomReport: report.idcustomreport,
        reportType: report.report_type,
        name: report.name.trim(),
        description: report.description.trim(),
        segmentFilter: encodeURIComponent(report.segment_filter),
        categoryId: (_report$category2 = report.category) === null || _report$category2 === void 0 ? void 0 : _report$category2.id,
        subcategoryId: (_report$subcategory2 = report.subcategory) === null || _report$subcategory2 === void 0 ? void 0 : _report$subcategory2.id,
        idSite: report.site.id,
        subCategoryReportIds: childReportIds,
        multipleIdSites: multipleIdSites
      }, {
        dimensionIds: arrayFilterAndRemoveDuplicates(report.dimensions),
        metricIds: arrayFilterAndRemoveDuplicates(report.metrics)
      }, {
        withTokenInUrl: true
      }).then(function (response) {
        return {
          type: 'success',
          response: response
        };
      }).catch(function (error) {
        return {
          type: 'error',
          message: error.message || error
        };
      }).finally(function () {
        _this11.privateState.isUpdating = false;
      });
    }
  }]);

  return CustomReportsStore;
}();

/* harmony default export */ var CustomReports_store = (new CustomReports_store_CustomReportsStore());
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--14-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--14-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./plugins/CustomReports/vue/src/Reports/Edit.vue?vue&type=script&lang=ts
function Editvue_type_script_lang_ts_toConsumableArray(arr) { return Editvue_type_script_lang_ts_arrayWithoutHoles(arr) || Editvue_type_script_lang_ts_iterableToArray(arr) || Editvue_type_script_lang_ts_unsupportedIterableToArray(arr) || Editvue_type_script_lang_ts_nonIterableSpread(); }

function Editvue_type_script_lang_ts_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function Editvue_type_script_lang_ts_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Editvue_type_script_lang_ts_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Editvue_type_script_lang_ts_arrayLikeToArray(o, minLen); }

function Editvue_type_script_lang_ts_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function Editvue_type_script_lang_ts_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return Editvue_type_script_lang_ts_arrayLikeToArray(arr); }

function Editvue_type_script_lang_ts_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }






var notificationId = 'reportsmanagement';
var productMetricNotificationId = 'reportsmanagementProductMetric';

function Editvue_type_script_lang_ts_arrayFilterAndRemoveDuplicates(values) {
  return Editvue_type_script_lang_ts_toConsumableArray(new Set(values)).filter(function (v) {
    return !!v;
  });
}

function makeDefaultReport() {
  return {
    dimensions: [],
    site: {
      id: external_CoreHome_["Matomo"].idSite,
      name: external_CoreHome_["Matomo"].currentSiteName
    },
    category: {}
  };
}

/* harmony default export */ var Editvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    idCustomReport: Number,
    browserArchivingDisabled: Boolean,
    reArchiveLastN: Number,
    maxDimensions: Number,
    isCloud: Boolean
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    SiteSelector: external_CoreHome_["SiteSelector"],
    SegmentGenerator: external_SegmentEditor_["SegmentGenerator"],
    SaveButton: external_CorePluginsAdmin_["SaveButton"]
  },
  data: function data() {
    return {
      isDirty: false,
      report: makeDefaultReport(),
      isLocked: false,
      isUnlocked: false,
      canEdit: true,
      dependencyAdded: false,
      childReports: [],
      childReportIds: [],
      containsText: '',
      multipleSites: [],
      multipleIdSites: []
    };
  },
  created: function created() {
    CustomReports_store.getAvailableReportTypes();
    this.init();
  },
  watch: {
    idCustomReport: function idCustomReport(newValue) {
      if (newValue === null) {
        return;
      }

      this.init();
    }
  },
  methods: {
    initReportOptions: function initReportOptions() {
      var idsite = parseInt("".concat(this.report.site.id), 10) || 'all';
      CustomReports_store.getAvailableDimensions(idsite);
      CustomReports_store.getAvailableMetrics(idsite);
      CustomReports_store.getAvailableCategories(idsite);
    },
    doUnlock: function doUnlock() {
      this.isLocked = false;
      this.isUnlocked = true;
    },
    confirmReportIsLocked: function confirmReportIsLocked(callback) {
      var _this = this;

      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.infoReportIsLocked, {
        unlock: function unlock() {
          _this.doUnlock();

          if (callback) {
            callback();
          }
        }
      });
    },
    removeAnyReportNotification: function removeAnyReportNotification() {
      external_CoreHome_["NotificationsStore"].remove(notificationId);
      external_CoreHome_["NotificationsStore"].remove(productMetricNotificationId);
      external_CoreHome_["NotificationsStore"].remove('ajaxHelper');
    },
    showApiErrorMessage: function showApiErrorMessage(errorMessage, responseType) {
      if (errorMessage && responseType) {
        this.removeAnyReportNotification();
        var elem = document.createElement('textarea');
        elem.innerHTML = errorMessage;
        this.showNotification(elem.value, responseType, 'toast');
      }
    },
    showNotification: function showNotification(message, context) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var instanceId = external_CoreHome_["NotificationsStore"].show({
        message: message,
        context: context,
        id: notificationId,
        type: type !== null && type !== void 0 ? type : 'transient',
        prepend: true
      });
      setTimeout(function () {
        external_CoreHome_["NotificationsStore"].scrollToNotification(instanceId);
      }, 100);
    },
    showProductMetricNotification: function showProductMetricNotification(message, shouldScrollToNotification) {
      var instanceId = external_CoreHome_["NotificationsStore"].show({
        message: message,
        context: 'warning',
        id: productMetricNotificationId,
        type: 'transient'
      });

      if (!shouldScrollToNotification) {
        return;
      }

      setTimeout(function () {
        external_CoreHome_["NotificationsStore"].scrollToNotification(instanceId);
      }, 100);
    },
    showErrorFieldNotProvidedNotification: function showErrorFieldNotProvidedNotification(title) {
      var message = Object(external_CoreHome_["translate"])('CustomReports_ErrorXNotProvided', [title]);
      this.showNotification(message, 'error');
    },
    init: function init() {
      var _this2 = this;

      var idCustomReport = this.idCustomReport;
      this.canEdit = true;
      this.report = makeDefaultReport();
      external_CoreHome_["Matomo"].helper.lazyScrollToContent();

      if (this.edit && idCustomReport) {
        CustomReports_store.findReport(idCustomReport, true).then(function (report) {
          var _this2$report$child_r;

          if (!report) {
            return;
          }

          _this2.report = Object(external_CoreHome_["clone"])(report);
          _this2.isLocked = true;
          _this2.isUnlocked = false;
          _this2.canEdit = true;
          _this2.childReports = (_this2$report$child_r = _this2.report.child_reports) !== null && _this2$report$child_r !== void 0 ? _this2$report$child_r : [];

          if (_this2.report.multipleIdSites && _this2.report.multipleIdSites.length && _this2.report.site.id !== 'all' && _this2.report.site.id !== '0' && _this2.report.site.id !== 0) {
            _this2.multipleSites = _this2.report.multipleIdSites;

            if (!_this2.report.allowedToEdit) {
              _this2.canEdit = false;
              _this2.isLocked = false;
            }
          }

          if (_this2.childReports.length) {
            Object.values(_this2.childReports).forEach(function (value) {
              _this2.childReportIds.push(value.idcustomreport);
            });
          }

          $(document).ready(function () {
            $('#childReports').sortable({
              connectWith: '#childReports',
              update: function update() {
                _this2.isDirty = true;
                var childReportsListItems = $('#childReports li');
                _this2.childReportIds = [];
                childReportsListItems.each(function (idx, li) {
                  if (li.dataset.id) {
                    _this2.childReportIds.push(li.dataset.id);
                  }
                });
              }
            });
          });
          var idSite = _this2.report.idsite;

          if (idSite === 0 || idSite === '0' || idSite === 'all') {
            // we need to make sure to send 'all' and not '0' as otherwise piwikApi would
            // consider 0 as no value set and replace it with the current idsite. Also the
            // site selector expects us to set 'all' instead of 0
            idSite = 'all';

            if (!_this2.isSuperUser) {
              // a lock does not make sense because report cannot be changed anyway. we do not want
              // to show a warning related to this in such a case
              _this2.canEdit = false;
              _this2.isLocked = false;
            }
          }

          _this2.report.site = {
            id: idSite,
            name: _this2.report.site.name
          };
          _this2.isDirty = false;

          _this2.initReportOptions();
        });
        return;
      }

      if (this.create) {
        this.report = {
          idsite: external_CoreHome_["Matomo"].idSite,
          site: {
            id: external_CoreHome_["Matomo"].idSite,
            name: external_CoreHome_["Matomo"].currentSiteName || external_CoreHome_["Matomo"].siteName
          },
          name: '',
          description: '',
          dimensions: [],
          metrics: ['nb_visits'],
          report_type: 'table',
          category: {
            id: 'CustomReports_CustomReports'
          },
          subcategory: null,
          segment_filter: '',
          child_reports: [],
          allowedToEdit: true
        };
        this.isLocked = false;
        this.canEdit = true;
        this.isDirty = false;
        this.initReportOptions();
      }
    },
    cancel: function cancel() {
      var newParams = Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value);
      delete newParams.idCustomReport;
      external_CoreHome_["MatomoUrl"].updateHash(newParams);
    },
    unlockReport: function unlockReport() {
      var _this3 = this;

      if (!this.report) {
        return;
      }

      if (this.isLocked) {
        external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmUnlockReport, {
          yes: function yes() {
            _this3.doUnlock();
          }
        });
      }
    },
    createReport: function createReport() {
      var _this4 = this;

      var method = 'CustomReports.addCustomReport';
      this.removeAnyReportNotification();

      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }

      this.multipleIdSites = [];

      if (this.multipleSites && this.multipleSites.length && this.report.site.id !== 'all' && this.report.site.id !== '0' && this.report.site.id !== 0) {
        this.multipleIdSites.push(external_CoreHome_["Matomo"].idSite);
        this.multipleSites.forEach(function (item) {
          var idSite = item.idsite;

          if (!_this4.multipleIdSites.includes(idSite)) {
            _this4.multipleIdSites.push(idSite);
          }
        });
      }

      if (this.multipleIdSites && this.multipleIdSites.length) {
        // need to update this else this creates an issue after save
        this.report.site.id = external_CoreHome_["Matomo"].idSite;
      }

      CustomReports_store.createOrUpdateReport(this.report, method, this.childReportIds, this.multipleIdSites).then(function (response) {
        if (!response || response.type === 'error' || !response.response) {
          var _response$message, _response$type;

          _this4.showApiErrorMessage((_response$message = response.message) !== null && _response$message !== void 0 ? _response$message : '', (_response$type = response.type) !== null && _response$type !== void 0 ? _response$type : 'error');

          return;
        }

        _this4.isDirty = false;
        var idCustomReport = response.response.value;

        if (_this4.report.site) {
          var idSite = _this4.report.site.id;

          if (idSite && idSite !== 'all' && "".concat(idSite) !== "".concat(external_CoreHome_["Matomo"].idSite)) {
            // when creating a report for a different site...
            // we need to reload this page for a different idsite, otherwise the report won't
            // be found
            external_CoreHome_["MatomoUrl"].updateUrl(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
              idSite: idSite
            }), Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
              idCustomReport: idCustomReport
            }));
            return;
          }
        }

        CustomReports_store.reload().then(function () {
          if (external_CoreHome_["Matomo"].helper.isReportingPage()) {
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          }

          external_CoreHome_["MatomoUrl"].updateHash(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
            idCustomReport: idCustomReport
          }));
          setTimeout(function () {
            _this4.showNotification(Object(external_CoreHome_["translate"])('CustomReports_ReportCreated'), response.type);
          }, 200);
        });
      });
    },
    showPreview: function showPreview() {
      var _this$report$site, _this$report$dimensio, _this$report$metrics;

      if (!this.isProductRevenueDependencyMet(true)) {
        return;
      }

      var idSite = (_this$report$site = this.report.site) !== null && _this$report$site !== void 0 && _this$report$site.id && this.report.site.id !== 'all' ? this.report.site.id : external_CoreHome_["Matomo"].idSite;
      var hasDimensions = ((_this$report$dimensio = this.report.dimensions) === null || _this$report$dimensio === void 0 ? void 0 : _this$report$dimensio.length) && this.report.report_type && this.report.report_type !== 'evolution';
      var dimensions = hasDimensions ? this.report.dimensions.join(',') : undefined;
      var hasMetrics = !!((_this$report$metrics = this.report.metrics) !== null && _this$report$metrics !== void 0 && _this$report$metrics.length);
      var metrics = hasMetrics ? this.report.metrics.join(',') : undefined;
      var url = external_CoreHome_["MatomoUrl"].stringify({
        module: 'CustomReports',
        action: 'previewReport',
        period: 'day',
        date: 'today',
        idSite: idSite,
        report_type: this.report.report_type,
        dimensions: dimensions,
        metrics: metrics,
        segment: this.report.segment_filter || undefined
      });
      var title = Object(external_CoreHome_["translate"])('CustomReports_Preview');
      window.Piwik_Popover.createPopupAndLoadUrl(url, title, 'customReportPreview');
    },
    setValueHasChanged: function setValueHasChanged() {
      this.isDirty = true;
    },
    addDimension: function addDimension(dimension) {
      var _this5 = this;

      if (!this.report || !dimension) {
        return;
      }

      if (this.isLocked) {
        this.confirmReportIsLocked(function () {
          _this5.addDimension(dimension);
        });
        return;
      }

      if (!this.report.dimensions) {
        this.report.dimensions = [];
      }

      this.report.dimensions = [].concat(Editvue_type_script_lang_ts_toConsumableArray(this.report.dimensions), [dimension]);
      this.setValueHasChanged();
    },
    changeDimension: function changeDimension(dimension, index) {
      var _this6 = this,
          _this$report$dimensio2;

      if (!this.report || !dimension) {
        return;
      }

      if (this.isLocked) {
        this.confirmReportIsLocked(function () {
          _this6.changeDimension(dimension, index);
        });
        return;
      }

      if (!((_this$report$dimensio2 = this.report.dimensions) !== null && _this$report$dimensio2 !== void 0 && _this$report$dimensio2[index])) {
        return;
      }

      this.report.dimensions = Editvue_type_script_lang_ts_toConsumableArray(this.report.dimensions);
      this.report.dimensions[index] = dimension;
      this.setValueHasChanged();
    },
    changeMetric: function changeMetric(metric, index) {
      var _this7 = this,
          _this$report$metrics2;

      this.dependencyAdded = false;

      if (!this.report || !metric) {
        return;
      }

      if (this.isLocked) {
        this.confirmReportIsLocked(function () {
          _this7.changeMetric(metric, index);
        });
        return;
      }

      if (!((_this$report$metrics2 = this.report.metrics) !== null && _this$report$metrics2 !== void 0 && _this$report$metrics2[index])) {
        return;
      }

      this.report.metrics = Editvue_type_script_lang_ts_toConsumableArray(this.report.metrics);
      this.report.metrics[index] = metric;
      this.setValueHasChanged();
      this.addMetricIfMissingDependency(metric);
    },
    setWebsiteChanged: function setWebsiteChanged(newValue) {
      this.setValueHasChanged();
      this.initReportOptions();

      if (this.report.site.id === 'all' || this.report.site.id === '0' || this.report.site.id === 0) {
        this.multipleSites = [];
      } else if (this.report.allowedToEdit && !this.isSiteIncludedAlready("".concat(newValue.id)) && this.multipleSites) {
        this.multipleSites.push({
          idsite: newValue.id,
          name: newValue.name
        });
      }
    },
    removeDimension: function removeDimension(index) {
      var _this8 = this;

      if (this.isLocked) {
        this.confirmReportIsLocked(function () {
          _this8.removeDimension(index);
        });
        return;
      }

      window.$('div.ui-tooltip[role="tooltip"]:not([style*="display: none"])').remove();

      if (index > -1) {
        this.report.dimensions = Editvue_type_script_lang_ts_toConsumableArray(this.report.dimensions);
        this.report.dimensions.splice(index, 1);
        this.setValueHasChanged();
      }
    },
    addMetric: function addMetric(metric) {
      var _this9 = this;

      this.dependencyAdded = false;

      if (!this.report || !metric) {
        return;
      }

      if (!this.report.metrics) {
        this.report.metrics = [];
      }

      if (this.isLocked) {
        this.confirmReportIsLocked(function () {
          _this9.addMetric(metric);
        });
        return;
      }

      this.report.metrics = [].concat(Editvue_type_script_lang_ts_toConsumableArray(this.report.metrics), [metric]);
      this.setValueHasChanged();
      this.addMetricIfMissingDependency(metric);
    },
    addMetricIfMissingDependency: function addMetricIfMissingDependency(metric) {
      // If the metric isn't Product Revenue or the dependency is already met, return
      if (!['sum_product_revenue', 'avg_product_revenue'].includes(metric) || this.doesReportIncludeProductQuantityMetric()) {
        return;
      }

      var dependency = metric === 'avg_product_revenue' ? 'avg_ecommerce_productquantity' : 'sum_ecommerce_productquantity';
      this.addMetric(dependency);
      this.dependencyAdded = true;
    },
    removeMetric: function removeMetric(index) {
      var _this10 = this;

      this.dependencyAdded = false;

      if (this.isLocked) {
        this.confirmReportIsLocked(function () {
          _this10.removeMetric(index);
        });
        return;
      }

      window.$('div.ui-tooltip[role="tooltip"]:not([style*="display: none"])').remove();

      if (index > -1) {
        this.report.metrics = Editvue_type_script_lang_ts_toConsumableArray(this.report.metrics);
        this.report.metrics.splice(index, 1);
        this.setValueHasChanged();
      }
    },
    setReportTypeHasChanged: function setReportTypeHasChanged(newReportType) {
      var _this11 = this;

      if (this.report && this.isLocked) {
        if (newReportType !== this.report.report_type) {
          this.confirmReportIsLocked(function () {
            _this11.report.report_type = newReportType;

            _this11.setValueHasChanged();
          });
        }
      } else {
        this.report.report_type = newReportType;
        this.setValueHasChanged();
      }
    },
    setSegmentFilterHasChanged: function setSegmentFilterHasChanged(newSegmentFilter) {
      var _this12 = this;

      if (this.report && this.isLocked) {
        if (newSegmentFilter !== this.report.segment_filter) {
          this.confirmReportIsLocked(function () {
            _this12.report.segment_filter = newSegmentFilter;

            _this12.setValueHasChanged();
          });
        }
      } else {
        this.report.segment_filter = newSegmentFilter;
        this.setValueHasChanged();
      }
    },
    updateReport: function updateReport() {
      var _this13 = this;

      this.removeAnyReportNotification();

      if (!this.checkRequiredFieldsAreSet()) {
        return;
      }

      this.multipleIdSites = [];

      if (this.multipleSites && this.multipleSites.length && this.report.site.id !== 'all' && this.report.site.id !== '0' && this.report.site.id !== 0) {
        this.multipleIdSites.push(external_CoreHome_["Matomo"].idSite);
        this.multipleSites.forEach(function (item) {
          var idSite = item.idsite;

          if (!_this13.multipleIdSites.includes(idSite)) {
            _this13.multipleIdSites.push(idSite);
          }
        });
      }

      var method = 'CustomReports.updateCustomReport';

      if (this.multipleIdSites && this.multipleIdSites.length) {
        // need to update this else this creates an issue after save
        this.report.site.id = external_CoreHome_["Matomo"].idSite;
      }

      CustomReports_store.createOrUpdateReport(this.report, method, this.childReportIds, this.multipleIdSites).then(function (response) {
        if (!response || response.type === 'error') {
          var _response$message2, _response$type2;

          _this13.showApiErrorMessage((_response$message2 = response.message) !== null && _response$message2 !== void 0 ? _response$message2 : '', (_response$type2 = response.type) !== null && _response$type2 !== void 0 ? _response$type2 : 'error');

          return;
        }

        var idSite = _this13.report.site.id;
        _this13.isDirty = false;
        _this13.canEdit = true;

        if (idSite && idSite !== 'all' && "".concat(idSite) !== "".concat(external_CoreHome_["Matomo"].idSite)) {
          // when moving a report from one site to another...
          // we need to reload this page for a different idsite, otherwise the report won't be found
          external_CoreHome_["MatomoUrl"].updateUrl(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
            idSite: idSite
          }), Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value));
          return;
        }

        CustomReports_store.reload().then(function () {
          _this13.init();
        });

        _this13.showNotification(Object(external_CoreHome_["translate"])('CustomReports_ReportUpdated'), response.type);
      });
    },
    checkRequiredFieldsAreSet: function checkRequiredFieldsAreSet() {
      var _this$report$metrics3;

      if (!this.report.name) {
        var title = Object(external_CoreHome_["translate"])('General_Name');
        this.showErrorFieldNotProvidedNotification(title);
        return false;
      }

      if (this.report.report_type !== 'evolution') {
        var _this$report$dimensio3;

        if (!((_this$report$dimensio3 = this.report.dimensions) !== null && _this$report$dimensio3 !== void 0 && _this$report$dimensio3.length) || !Editvue_type_script_lang_ts_arrayFilterAndRemoveDuplicates(this.report.dimensions).length) {
          var _title = Object(external_CoreHome_["translate"])('CustomReports_ErrorMissingDimension');

          this.showNotification(_title, 'error');
          return false;
        }
      }

      if (!((_this$report$metrics3 = this.report.metrics) !== null && _this$report$metrics3 !== void 0 && _this$report$metrics3.length) || !Editvue_type_script_lang_ts_arrayFilterAndRemoveDuplicates(this.report.metrics).length) {
        var _title2 = Object(external_CoreHome_["translate"])('CustomReports_ErrorMissingMetric');

        this.showNotification(_title2, 'error');
        return false;
      } // Don't fail validation since we automatically add the dependency


      this.isProductRevenueDependencyMet(false);
      return true;
    },
    setSubcategory: function setSubcategory(subcategoryId) {
      this.report.subcategory = this.report.subcategory || {
        id: ''
      };
      this.report.subcategory.id = subcategoryId;
    },
    isProductRevenueDependencyMet: function isProductRevenueDependencyMet(shouldScrollToNotification) {
      var linkString = Object(external_CoreHome_["externalLink"])('https://matomo.org/faq/custom-reports/why-is-there-an-error-when-i-try-to-run-a-custom-report-with-the-product-revenue-metric/');
      var notificationText = Object(external_CoreHome_["translate"])('CustomReports_WarningProductRevenueMetricDependency', linkString, '</a>');

      if (this.report.metrics.includes('sum_product_revenue') && !this.doesReportIncludeProductQuantityMetric()) {
        this.addMetric('sum_ecommerce_productquantity');
        this.showProductMetricNotification(notificationText, shouldScrollToNotification);
        return false;
      }

      if (this.report.metrics.includes('avg_product_revenue') && !this.doesReportIncludeProductQuantityMetric()) {
        this.addMetric('avg_ecommerce_productquantity');
        this.showProductMetricNotification(notificationText, shouldScrollToNotification);
        return false;
      }

      return true;
    },
    doesReportIncludeProductQuantityMetric: function doesReportIncludeProductQuantityMetric() {
      return this.report.metrics.includes('sum_ecommerce_productquantity') || this.report.metrics.includes('avg_ecommerce_productquantity');
    },
    isSiteIncludedAlready: function isSiteIncludedAlready(idSite) {
      if (this.multipleSites && this.multipleSites.length) {
        return this.multipleSites.some(function (item) {
          return "".concat(item.idsite) === "".concat(idSite);
        });
      }

      return false;
    },
    removeSite: function removeSite(site) {
      if (this.multipleSites) {
        this.isDirty = true;
        this.multipleSites = this.multipleSites.filter(function (item) {
          return item.idsite !== site.idsite;
        });
      }
    },
    addSitesContaining: function addSitesContaining(searchTerm) {
      var _this14 = this;

      if (!searchTerm) {
        return;
      }

      var displaySearchTerm = "\"".concat(external_CoreHome_["Matomo"].helper.escape(external_CoreHome_["Matomo"].helper.htmlEntities(searchTerm)), "\"");
      external_CoreHome_["AjaxHelper"].fetch({
        method: 'SitesManager.getSitesWithAdminAccess',
        pattern: searchTerm,
        filter_limit: -1
      }).then(function (sites) {
        if (!sites || !sites.length) {
          var _sitesToAdd = "<div>\n            <h2>".concat(Object(external_CoreHome_["translate"])('CustomReports_MatchingSearchNotFound', displaySearchTerm), "</h2>\n            <input role=\"ok\" type=\"button\" value=\"").concat(Object(external_CoreHome_["translate"])('General_Ok'), "\"/>\n          </div>");

          external_CoreHome_["Matomo"].helper.modalConfirm(_sitesToAdd);
          return;
        }

        var newSites = [];
        var alreadyAddedSites = [];
        sites.forEach(function (site) {
          var siteName = window.vueSanitize(external_CoreHome_["Matomo"].helper.htmlEntities(site.name));
          var siteTitle = "".concat(siteName, " (id ").concat(parseInt("".concat(site.idsite), 10), ")<br />");

          if (_this14.isSiteIncludedAlready("".concat(site.idsite))) {
            alreadyAddedSites.push(siteTitle);
          } else {
            newSites.push(siteTitle);
          }
        });
        var title = Object(external_CoreHome_["translate"])('CustomReports_MatchingSearchConfirmTitle', newSites.length);

        if (alreadyAddedSites.length) {
          var text = Object(external_CoreHome_["translate"])('CustomReports_MatchingSearchConfirmTitleAlreadyAdded', alreadyAddedSites.length);
          title += " (".concat(text, ")");
        }

        var sitesToAdd = "<div><h2>".concat(title, "</h2><p>\n          ").concat(Object(external_CoreHome_["translate"])('CustomReports_MatchingSearchMatchedAdd', newSites.length, displaySearchTerm), ":\n          <br /><br />");
        sitesToAdd += newSites.join('');

        if (alreadyAddedSites.length) {
          var _text = Object(external_CoreHome_["translate"])('CustomReports_MatchingSearchMatchedAlreadyAdded', alreadyAddedSites.length, displaySearchTerm);

          sitesToAdd += "<br />".concat(_text, ":<br /><br />").concat(alreadyAddedSites.join(''));
        }

        sitesToAdd += "</p><input role=\"yes\" type=\"button\" value=\"".concat(Object(external_CoreHome_["translate"])('General_Yes'), "\"/>\n          <input role=\"no\" type=\"button\" value=\"").concat(Object(external_CoreHome_["translate"])('General_No'), "\"/>\n          </div>");
        external_CoreHome_["Matomo"].helper.modalConfirm(sitesToAdd, {
          yes: function yes() {
            sites.forEach(function (site) {
              if (_this14.multipleSites) {
                if (!_this14.isSiteIncludedAlready("".concat(site.idsite))) {
                  _this14.isDirty = true;

                  _this14.multipleSites.push({
                    idsite: site.idsite,
                    name: site.name
                  });
                }
              }
            });
            _this14.containsText = '';
          }
        });
      });
    }
  },
  computed: {
    isSuperUser: function isSuperUser() {
      return !!external_CoreHome_["Matomo"].hasSuperUserAccess;
    },
    allMetrics: function allMetrics() {
      return CustomReports_store.state.value.allMetrics;
    },
    metrics: function metrics() {
      var _this$report;

      // if any of the page generation times in the report is used than allow all of them
      // otherwise don't show any of thme.
      var pageGenerationMetrics = ['pageviews_with_generation_time', 'avg_page_generation_time', 'max_actions_pagegenerationtime', 'sum_actions_pagegenerationtime'];
      var hasPageGenerationMetric = (((_this$report = this.report) === null || _this$report === void 0 ? void 0 : _this$report.metrics) || []).some(function (m) {
        return pageGenerationMetrics.indexOf(m) >= 0;
      });
      var shouldRemoveGenerationTime = !hasPageGenerationMetric;
      return this.allMetrics.filter(function (m) {
        if (!m) {
          return false;
        }

        if (shouldRemoveGenerationTime && pageGenerationMetrics.indexOf(m.key) >= 0) {
          return false;
        }

        return true;
      });
    },
    allDimensions: function allDimensions() {
      return CustomReports_store.state.value.allDimensions;
    },
    reportTypes: function reportTypes() {
      return CustomReports_store.state.value.reportTypesReadable;
    },
    create: function create() {
      return !this.idCustomReport;
    },
    edit: function edit() {
      return !this.create;
    },
    editTitle: function editTitle() {
      return this.create ? 'CustomReports_CreateNewReport' : 'CustomReports_EditReport';
    },
    contentTitle: function contentTitle() {
      return Object(external_CoreHome_["translate"])(this.editTitle, this.report.name ? "\"".concat(this.report.name, "\"") : '');
    },
    categories: function categories() {
      return CustomReports_store.state.value.categories;
    },
    subcategories: function subcategories() {
      return CustomReports_store.state.value.subcategories;
    },
    dimensions: function dimensions() {
      var _this$report2;

      var result = Editvue_type_script_lang_ts_toConsumableArray(this.allDimensions);

      if (!((_this$report2 = this.report) !== null && _this$report2 !== void 0 && _this$report2.dimensions)) {
        return result;
      }

      var hasPageGenerationDimension = this.report.dimensions.indexOf('Actions.PageGenerationTime') !== -1; // we do not allow to select eg grouping by "Page URL, Clicked URL" as it wouldn't show any
      // data

      var usedSqlSegments = this.report.dimensions.map(function (dimensionId) {
        var _result$find;

        return (_result$find = result.find(function (dim) {
          return dim.key === dimensionId;
        })) === null || _result$find === void 0 ? void 0 : _result$find.sqlSegment;
      }).filter(function (sqlSegment) {
        return !!sqlSegment;
      }); // make sure these dimensions cannot be selected a second time

      for (var j = 0; j < result.length; j += 1) {
        var dim = result[j];

        if (!hasPageGenerationDimension && dim.key === 'Actions.PageGenerationTime') {
          // we only show this metric if it was used before already in the report
          result.splice(j, 1);
          j -= 1;
          break;
        }

        if (dim.sqlSegment && usedSqlSegments.indexOf(dim.sqlSegment) > -1 && this.report.dimensions.indexOf(dim.key) === -1) {
          // we want to make sure to not show incompatible dimensions but we still want to show an
          // already selected dimension again so users can eg easily swap dimensions etc.
          result.splice(j, 1);
          j -= 1;
        }
      }

      return result;
    },
    isLoading: function isLoading() {
      return CustomReports_store.state.value.isLoading;
    },
    isUpdating: function isUpdating() {
      return CustomReports_store.state.value.isUpdating;
    },
    dimensionsReadable: function dimensionsReadable() {
      return CustomReports_store.state.value.dimensionsReadable;
    },
    metricsReadable: function metricsReadable() {
      return CustomReports_store.state.value.metricsReadable;
    },
    saveButtonText: function saveButtonText() {
      return this.edit ? Object(external_CoreHome_["translate"])('CoreUpdater_UpdateTitle') : Object(external_CoreHome_["translate"])('CustomReports_CreateNewReport');
    },
    getProductRevenueDependencyMessage: function getProductRevenueDependencyMessage() {
      var linkString = Object(external_CoreHome_["externalLink"])('https://matomo.org/faq/custom-reports/why-is-there-an-error-when-i-try-to-run-a-custom-report-with-the-product-revenue-metric/');
      return Object(external_CoreHome_["translate"])('CustomReports_WarningProductRevenueMetricDependency', linkString, '</a>');
    },
    getPausedStateAdminMessage: function getPausedStateAdminMessage() {
      var url = "?".concat(external_CoreHome_["MatomoUrl"].stringify(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        module: 'CustomReports',
        action: 'manage'
      })));
      return Object(external_CoreHome_["translate"])('CustomReports_ReportInPausedStateAdmin', "<a href=\"".concat(url, "\" target=\"_blank\" rel=\"noreferrer noopener\">"), '</a>');
    },
    getDimensionsHelpText: function getDimensionsHelpText() {
      var helpText = Object(external_CoreHome_["translate"])('CustomReports_ReportDimensionsHelpNew');
      var extended = this.getDimensionsHelpTextExtended;

      if (extended) {
        return "".concat(helpText, "<br><br>").concat(extended);
      }

      return helpText;
    },
    getDimensionsHelpTextExtended: function getDimensionsHelpTextExtended() {
      if (this.isCloud) {
        return '';
      }

      var linkString = Object(external_CoreHome_["externalLink"])('https://matomo.org/faq/custom-reports/faq_25655/');
      return Object(external_CoreHome_["translate"])('CustomReports_ReportDimensionsHelpExtended', linkString, '</a>');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/Edit.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/Edit.vue



Editvue_type_script_lang_ts.render = render

/* harmony default export */ var Edit = (Editvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./plugins/CustomReports/vue/src/Reports/List.vue?vue&type=template&id=81f7b908

var Listvue_type_template_id_81f7b908_hoisted_1 = {
  class: "reportSearchFilter"
};
var Listvue_type_template_id_81f7b908_hoisted_2 = {
  class: "index"
};
var Listvue_type_template_id_81f7b908_hoisted_3 = {
  class: "name"
};
var Listvue_type_template_id_81f7b908_hoisted_4 = {
  class: "description"
};
var Listvue_type_template_id_81f7b908_hoisted_5 = {
  class: "reportType"
};
var Listvue_type_template_id_81f7b908_hoisted_6 = {
  class: "reportCategory"
};
var Listvue_type_template_id_81f7b908_hoisted_7 = {
  class: "action"
};
var Listvue_type_template_id_81f7b908_hoisted_8 = {
  colspan: "7"
};
var Listvue_type_template_id_81f7b908_hoisted_9 = {
  class: "loadingPiwik"
};

var Listvue_type_template_id_81f7b908_hoisted_10 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
  src: "plugins/Morpheus/images/loading-blue.gif"
}, null, -1);

var Listvue_type_template_id_81f7b908_hoisted_11 = {
  colspan: "7"
};
var Listvue_type_template_id_81f7b908_hoisted_12 = ["id"];
var Listvue_type_template_id_81f7b908_hoisted_13 = {
  class: "index"
};
var Listvue_type_template_id_81f7b908_hoisted_14 = {
  class: "name"
};
var Listvue_type_template_id_81f7b908_hoisted_15 = ["title"];
var Listvue_type_template_id_81f7b908_hoisted_16 = ["title"];
var Listvue_type_template_id_81f7b908_hoisted_17 = ["title"];
var Listvue_type_template_id_81f7b908_hoisted_18 = ["title"];
var Listvue_type_template_id_81f7b908_hoisted_19 = ["title"];
var Listvue_type_template_id_81f7b908_hoisted_20 = {
  class: "reportType"
};
var Listvue_type_template_id_81f7b908_hoisted_21 = ["title"];
var Listvue_type_template_id_81f7b908_hoisted_22 = {
  key: 0
};
var Listvue_type_template_id_81f7b908_hoisted_23 = {
  class: "action"
};
var Listvue_type_template_id_81f7b908_hoisted_24 = ["title", "onClick"];
var Listvue_type_template_id_81f7b908_hoisted_25 = ["title", "onClick"];
var Listvue_type_template_id_81f7b908_hoisted_26 = ["title", "onClick"];
var Listvue_type_template_id_81f7b908_hoisted_27 = ["title", "href"];
var Listvue_type_template_id_81f7b908_hoisted_28 = ["title", "onClick"];
var Listvue_type_template_id_81f7b908_hoisted_29 = {
  class: "tableActionBar"
};

var Listvue_type_template_id_81f7b908_hoisted_30 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-add"
}, null, -1);

var Listvue_type_template_id_81f7b908_hoisted_31 = {
  class: "ui-confirm",
  ref: "confirmDeleteReport"
};
var Listvue_type_template_id_81f7b908_hoisted_32 = ["value"];
var Listvue_type_template_id_81f7b908_hoisted_33 = ["value"];
var Listvue_type_template_id_81f7b908_hoisted_34 = {
  class: "ui-confirm",
  ref: "confirmPauseReport"
};
var Listvue_type_template_id_81f7b908_hoisted_35 = ["value"];
var Listvue_type_template_id_81f7b908_hoisted_36 = ["value"];
var Listvue_type_template_id_81f7b908_hoisted_37 = {
  class: "ui-confirm",
  ref: "confirmResumeReport"
};
var Listvue_type_template_id_81f7b908_hoisted_38 = ["value"];
var Listvue_type_template_id_81f7b908_hoisted_39 = ["value"];
function Listvue_type_template_id_81f7b908_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");

  var _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");

  var _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");

  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('CustomReports_ManageReports'),
    feature: _ctx.translate('CustomReports_ManageReports')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(function () {
      return [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_CustomReportIntroduction')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_81f7b908_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "text",
        name: "reportSearch",
        title: _ctx.translate('General_Search'),
        modelValue: _ctx.searchFilter,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = function ($event) {
          return _ctx.searchFilter = $event;
        })
      }, null, 8, ["title", "modelValue"]), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.reports.length > 0]])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_81f7b908_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Id')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_81f7b908_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Name')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_81f7b908_hoisted_4, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Description')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_81f7b908_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_Type')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_81f7b908_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_Category')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Listvue_type_template_id_81f7b908_hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Actions')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_81f7b908_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Listvue_type_template_id_81f7b908_hoisted_9, [Listvue_type_template_id_81f7b908_hoisted_10, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_LoadingData')), 1)])])], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isLoading || _ctx.isUpdating]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_81f7b908_hoisted_11, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_NoCustomReportsFound')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isLoading && _ctx.reports.length == 0]]), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.sortedReports, function (report) {
        var _report$subcategory;

        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
          id: "report".concat(report.idcustomreport),
          class: "customReports",
          key: report.idcustomreport
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_81f7b908_hoisted_13, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(report.idcustomreport), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_81f7b908_hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(report.name) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-locked",
          title: _ctx.translate('CustomReports_ReportEditNotAllowedAllWebsitesUpdated')
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_15), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !report.idsite && !_ctx.isSuperUser]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-info2",
          title: _ctx.translate('CustomReports_ReportAvailableToAllWebsites')
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_16), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !report.idsite && _ctx.isSuperUser]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-locked",
          title: _ctx.translate('CustomReports_ReportEditNotAllowedMultipleWebsitesAccessIssue')
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_17), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !report.allowedToEdit && _ctx.isMultiSiteReport(report)]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
          class: "icon-info2",
          title: _ctx.translate('CustomReports_ReportAvailableToMultipleWebsites')
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_18), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], report.allowedToEdit && _ctx.isMultiSiteReport(report)]])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
          class: "description",
          title: _ctx.htmlEntities(report.description)
        }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.truncate(report.description.trim(), 60)), 9, Listvue_type_template_id_81f7b908_hoisted_19), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_81f7b908_hoisted_20, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.reportTypesReadable[report.report_type]), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
          class: "reportCategory",
          title: _ctx.htmlEntities(report.category.name)
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.truncate(report.category.name.trim(), 60)) + " ", 1), (_report$subcategory = report.subcategory) !== null && _report$subcategory !== void 0 && _report$subcategory.name ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Listvue_type_template_id_81f7b908_hoisted_22, " - " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.truncate(report.subcategory.name.trim(), 60)), 1)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 8, Listvue_type_template_id_81f7b908_hoisted_21), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Listvue_type_template_id_81f7b908_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
          class: "table-action icon-pause",
          title: _ctx.translate('CustomReports_PauseReportInfo'),
          onClick: function onClick($event) {
            return _ctx.pauseReport(report);
          }
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_24), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], (report.idsite && !_ctx.isMultiSiteReport(report) || report.allowedToEdit) && report.status === 'active']]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
          class: "table-action icon-play",
          title: _ctx.translate('CustomReports_ResumeReportInfo'),
          onClick: function onClick($event) {
            return _ctx.resumeReport(report);
          }
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_25), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], (report.idsite && !_ctx.isMultiSiteReport(report) || report.allowedToEdit) && report.status === 'paused']]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
          class: "table-action icon-edit",
          title: _ctx.translate('CustomReports_EditReport'),
          onClick: function onClick($event) {
            return _ctx.editReport(report.idcustomreport);
          }
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_26), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
          target: "_blank",
          class: "table-action icon-show",
          title: _ctx.translate('CustomReports_ViewReportInfo'),
          href: _ctx.getViewReportLink(report)
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
          class: "table-action icon-delete",
          title: _ctx.translate('CustomReports_DeleteReportInfo'),
          onClick: function onClick($event) {
            return _ctx.deleteReport(report);
          }
        }, null, 8, Listvue_type_template_id_81f7b908_hoisted_28), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], report.idsite && !_ctx.isMultiSiteReport(report) || report.allowedToEdit]])])], 8, Listvue_type_template_id_81f7b908_hoisted_12);
      }), 128))])], 512), [[_directive_content_table]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_81f7b908_hoisted_29, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "createNewReport",
        onClick: _cache[1] || (_cache[1] = function ($event) {
          return _ctx.createReport();
        })
      }, [Listvue_type_template_id_81f7b908_hoisted_30, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_CreateNewReport')), 1)])])];
    }),
    _: 1
  }, 8, ["content-title", "feature"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_81f7b908_hoisted_31, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_DeleteReportConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_81f7b908_hoisted_32), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_81f7b908_hoisted_33)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_81f7b908_hoisted_34, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_PauseReportConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_81f7b908_hoisted_35), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_81f7b908_hoisted_36)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Listvue_type_template_id_81f7b908_hoisted_37, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('CustomReports_ResumeReportConfirm')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "yes",
    type: "button",
    value: _ctx.translate('General_Yes')
  }, null, 8, Listvue_type_template_id_81f7b908_hoisted_38), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    role: "no",
    type: "button",
    value: _ctx.translate('General_No')
  }, null, 8, Listvue_type_template_id_81f7b908_hoisted_39)], 512)]);
}
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/List.vue?vue&type=template&id=81f7b908

// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/truncateText2.ts
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
function truncateText2(text, length) {
  if (text && text.length > length) {
    return "".concat(text.substr(0, length - 3), "...");
  }

  return text;
}
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--14-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--14-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./plugins/CustomReports/vue/src/Reports/List.vue?vue&type=script&lang=ts
function Listvue_type_script_lang_ts_toConsumableArray(arr) { return Listvue_type_script_lang_ts_arrayWithoutHoles(arr) || Listvue_type_script_lang_ts_iterableToArray(arr) || Listvue_type_script_lang_ts_unsupportedIterableToArray(arr) || Listvue_type_script_lang_ts_nonIterableSpread(); }

function Listvue_type_script_lang_ts_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function Listvue_type_script_lang_ts_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Listvue_type_script_lang_ts_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Listvue_type_script_lang_ts_arrayLikeToArray(o, minLen); }

function Listvue_type_script_lang_ts_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function Listvue_type_script_lang_ts_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return Listvue_type_script_lang_ts_arrayLikeToArray(arr); }

function Listvue_type_script_lang_ts_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }






var Listvue_type_script_lang_ts_notificationId = 'customreportmanagementlist';
/* harmony default export */ var Listvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {},
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"]
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
  },
  data: function data() {
    return {
      searchFilter: ''
    };
  },
  created: function created() {
    CustomReports_store.getAvailableReportTypes();
    CustomReports_store.fetchReports();
  },
  methods: {
    createReport: function createReport() {
      this.editReport(0);
    },
    editReport: function editReport(idCustomReport) {
      external_CoreHome_["MatomoUrl"].updateHash(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].hashParsed.value), {}, {
        idCustomReport: idCustomReport
      }));
    },
    pauseReport: function pauseReport(report) {
      var _this = this;

      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmPauseReport, {
        yes: function yes() {
          CustomReports_store.pauseReport(report.idcustomreport, report.idsite).then(function (response) {
            if (!response || response.type === 'error') {
              CustomReports_store.reload();
              return;
            }

            CustomReports_store.reload().then(function () {
              _this.showNotification(_this.translate('CustomReports_PausedReport'), 'success');
            });
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          });
        }
      });
    },
    resumeReport: function resumeReport(report) {
      var _this2 = this;

      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmResumeReport, {
        yes: function yes() {
          CustomReports_store.resumeReport(report.idcustomreport, report.idsite).then(function (response) {
            if (!response || response.type === 'error') {
              CustomReports_store.reload();
              return;
            }

            CustomReports_store.reload().then(function () {
              _this2.showNotification(_this2.translate('CustomReports_ResumedReport'), 'success');
            });
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          });
        }
      });
    },
    showNotification: function showNotification(message, context) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var instanceId = external_CoreHome_["NotificationsStore"].show({
        message: message,
        context: context,
        id: Listvue_type_script_lang_ts_notificationId,
        type: type !== null ? type : 'toast'
      });
      setTimeout(function () {
        external_CoreHome_["NotificationsStore"].scrollToNotification(instanceId);
      }, 200);
    },
    deleteReport: function deleteReport(report) {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteReport, {
        yes: function yes() {
          CustomReports_store.deleteReport(report.idcustomreport, report.idsite).then(function () {
            CustomReports_store.reload();
            external_CoreHome_["Matomo"].postEvent('updateReportingMenu');
          });
        }
      });
    },
    getViewReportLink: function getViewReportLink(report) {
      return "?".concat(external_CoreHome_["MatomoUrl"].stringify({
        module: 'CoreHome',
        action: 'index',
        idSite: report.linkIdSite,
        period: 'day',
        date: 'yesterday'
      }), "#?").concat(external_CoreHome_["MatomoUrl"].stringify({
        category: report.category.id,
        idSite: report.linkIdSite,
        date: external_CoreHome_["MatomoUrl"].parsed.value.date,
        period: external_CoreHome_["MatomoUrl"].parsed.value.period,
        segment: external_CoreHome_["MatomoUrl"].parsed.value.segment,
        subcategory: report.subcategoryLink
      }));
    },
    truncate: truncateText2,
    htmlEntities: function htmlEntities(v) {
      return external_CoreHome_["Matomo"].helper.htmlEntities(v);
    },
    isMultiSiteReport: function isMultiSiteReport(report) {
      return report.multiple_idsites && report.multiple_idsites.split(',');
    }
  },
  computed: {
    isSuperUser: function isSuperUser() {
      return external_CoreHome_["Matomo"].hasSuperUserAccess;
    },
    reports: function reports() {
      return CustomReports_store.state.value.reports;
    },
    sortedReports: function sortedReports() {
      var searchFilter = this.searchFilter.toLowerCase(); // look through string properties of custom reports for values that have searchFilter in them
      // (mimics angularjs filter() filter)

      var result = Listvue_type_script_lang_ts_toConsumableArray(this.reports).filter(function (h) {
        return Object.keys(h).some(function (propName) {
          var entity = h;
          return typeof entity[propName] === 'string' && entity[propName].toLowerCase().indexOf(searchFilter) !== -1;
        });
      });

      result.sort(function (lhs, rhs) {
        var lhsId = parseInt("".concat(lhs.idcustomreport), 10);
        var rhsId = parseInt("".concat(rhs.idcustomreport), 10);
        return lhsId - rhsId;
      });
      return result;
    },
    isLoading: function isLoading() {
      return CustomReports_store.state.value.isLoading;
    },
    isUpdating: function isUpdating() {
      return CustomReports_store.state.value.isUpdating;
    },
    reportTypesReadable: function reportTypesReadable() {
      return CustomReports_store.state.value.reportTypesReadable;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/List.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/List.vue



Listvue_type_script_lang_ts.render = Listvue_type_template_id_81f7b908_render

/* harmony default export */ var List = (Listvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./plugins/CustomReports/vue/src/Reports/Manage.vue?vue&type=template&id=03955ed8

var Managevue_type_template_id_03955ed8_hoisted_1 = {
  class: "manageReports"
};
var Managevue_type_template_id_03955ed8_hoisted_2 = {
  key: 0
};
var Managevue_type_template_id_03955ed8_hoisted_3 = {
  key: 1
};
function Managevue_type_template_id_03955ed8_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_CustomReportsList = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("CustomReportsList");

  var _component_CustomReportsEdit = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("CustomReportsEdit");

  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_03955ed8_hoisted_1, [!_ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_03955ed8_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_CustomReportsList)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.editMode ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Managevue_type_template_id_03955ed8_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_CustomReportsEdit, {
    "id-custom-report": _ctx.idCustomReport,
    "browser-archiving-disabled": _ctx.browserArchivingDisabled,
    "re-archive-last-n": _ctx.reArchiveLastN,
    "max-dimensions": _ctx.maxDimensions,
    "is-cloud": _ctx.isCloud
  }, null, 8, ["id-custom-report", "browser-archiving-disabled", "re-archive-last-n", "max-dimensions", "is-cloud"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
}
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/Manage.vue?vue&type=template&id=03955ed8

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--14-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--14-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--0-1!./plugins/CustomReports/vue/src/Reports/Manage.vue?vue&type=script&lang=ts




/* harmony default export */ var Managevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    browserArchivingDisabled: Boolean,
    reArchiveLastN: Number,
    maxDimensions: Number,
    isCloud: Boolean
  },
  components: {
    CustomReportsList: List,
    CustomReportsEdit: Edit
  },
  data: function data() {
    return {
      editMode: false,
      idCustomReport: null
    };
  },
  watch: {
    editMode: function editMode() {
      // when changing edit modes, the tooltip can sometimes get stuck on the screen
      $('.ui-tooltip').remove();
    }
  },
  created: function created() {
    var _this = this;

    // doing this in a watch because we don't want to post an event in a computed property
    Object(external_commonjs_vue_commonjs2_vue_root_Vue_["watch"])(function () {
      return external_CoreHome_["MatomoUrl"].hashParsed.value.idCustomReport;
    }, function (idCustomReport) {
      _this.initState(idCustomReport);
    });
    this.initState(external_CoreHome_["MatomoUrl"].hashParsed.value.idCustomReport);
  },
  methods: {
    removeAnyReportNotification: function removeAnyReportNotification() {
      var shouldHideProductMetricNotification = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      external_CoreHome_["NotificationsStore"].remove('reportsmanagement');

      if (shouldHideProductMetricNotification) {
        external_CoreHome_["NotificationsStore"].remove('reportsmanagementProductMetric');
      }
    },
    initState: function initState(idCustomReport) {
      if (idCustomReport) {
        if (idCustomReport === '0') {
          var parameters = {
            isAllowed: true
          };
          external_CoreHome_["Matomo"].postEvent('CustomReports.initAddReport', parameters);

          if (parameters && !parameters.isAllowed) {
            this.editMode = false;
            this.idCustomReport = null;
            return;
          }
        }

        this.editMode = true;
        this.idCustomReport = parseInt(idCustomReport, 10);
      } else {
        this.editMode = false;
        this.idCustomReport = null;
      }

      this.removeAnyReportNotification(!idCustomReport);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/Manage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/Reports/Manage.vue



Managevue_type_script_lang_ts.render = Managevue_type_template_id_03955ed8_render

/* harmony default export */ var Manage = (Managevue_type_script_lang_ts);
// CONCATENATED MODULE: ./plugins/CustomReports/vue/src/index.ts
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
//# sourceMappingURL=CustomReports.umd.js.map