(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"));
	else if(typeof define === 'function' && define.amd)
		define(["CoreHome", , "CorePluginsAdmin"], factory);
	else if(typeof exports === 'object')
		exports["SearchEngineKeywordsPerformance"] = factory(require("CoreHome"), require("vue"), require("CorePluginsAdmin"));
	else
		root["SearchEngineKeywordsPerformance"] = factory(root["CoreHome"], root["Vue"], root["CorePluginsAdmin"]);
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
/******/ 	__webpack_require__.p = "plugins/SearchEngineKeywordsPerformance/vue/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0207":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "0a7a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Provider_vue_vue_type_style_index_0_id_e3ab98aa_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ec02");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Provider_vue_vue_type_style_index_0_id_e3ab98aa_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Provider_vue_vue_type_style_index_0_id_e3ab98aa_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "157a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_AdminPage_vue_vue_type_style_index_0_id_f28c5c7e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3738");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_AdminPage_vue_vue_type_style_index_0_id_f28c5c7e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_AdminPage_vue_vue_type_style_index_0_id_f28c5c7e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "19dc":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__19dc__;

/***/ }),

/***/ "3738":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "536a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_2d80ecca_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("0207");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_2d80ecca_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_2d80ecca_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "941f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_7b109890_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e155");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_7b109890_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_7b109890_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "9811":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_0a6d122c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a533");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_0a6d122c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Configuration_vue_vue_type_style_index_0_id_0a6d122c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "a533":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "a5a2":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_a5a2__;

/***/ }),

/***/ "b260":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "be76":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Navigation_vue_vue_type_style_index_0_id_70192541_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c772");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Navigation_vue_vue_type_style_index_0_id_70192541_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_Navigation_vue_vue_type_style_index_0_id_70192541_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "c772":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e155":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "ec02":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "eeed":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_WebsitesAvailableModal_vue_vue_type_style_index_0_id_2f54bc49_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b260");
/* harmony import */ var _node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_WebsitesAvailableModal_vue_vue_type_style_index_0_id_2f54bc49_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_cli_service_node_modules_mini_css_extract_plugin_dist_loader_js_ref_7_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_vue_cli_service_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_cli_service_node_modules_vue_loader_v16_dist_index_js_ref_1_1_WebsitesAvailableModal_vue_vue_type_style_index_0_id_2f54bc49_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "AdminPage", function() { return /* reexport */ AdminPage; });
__webpack_require__.d(__webpack_exports__, "BingConfiguration", function() { return /* reexport */ Configuration; });
__webpack_require__.d(__webpack_exports__, "GoogleConfiguration", function() { return /* reexport */ Google_Configuration; });
__webpack_require__.d(__webpack_exports__, "YandexConfiguration", function() { return /* reexport */ Yandex_Configuration; });
__webpack_require__.d(__webpack_exports__, "ConfigureConnection", function() { return /* reexport */ ConfigureConnection; });

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

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=template&id=f28c5c7e&scoped=true

const _withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-f28c5c7e"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const _hoisted_1 = {
  class: "intro"
};
const _hoisted_2 = {
  class: "provider-list"
};
const _hoisted_3 = /*#__PURE__*/_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "clear"
}, null, -1));
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SearchEngineNavigation = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SearchEngineNavigation");
  const _component_Provider = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Provider");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SearchEngineNavigation, {
    "current-tab": "setup"
  }), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, null, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigurationDescriptionLine1New')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigurationDescriptionLine2New')), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_2, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.providers, provider => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_Provider, {
        key: provider.id,
        provider: provider
      }, null, 8, ["provider"]);
    }), 128)), _hoisted_3])]),
    _: 1
  })], 64);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=template&id=f28c5c7e&scoped=true

// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=template&id=e3ab98aa&scoped=true

const Providervue_type_template_id_e3ab98aa_scoped_true_withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-e3ab98aa"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const Providervue_type_template_id_e3ab98aa_scoped_true_hoisted_1 = {
  class: "search-engine-card"
};
const Providervue_type_template_id_e3ab98aa_scoped_true_hoisted_2 = {
  class: "card-content"
};
const Providervue_type_template_id_e3ab98aa_scoped_true_hoisted_3 = {
  class: "logo-box"
};
const _hoisted_4 = ["src", "alt"];
const _hoisted_5 = {
  class: "text-content"
};
const _hoisted_6 = ["innerHTML"];
const _hoisted_7 = {
  class: "button-wrapper"
};
const _hoisted_8 = ["href"];
const _hoisted_9 = {
  key: 0,
  class: "btn action-button"
};
const _hoisted_10 = {
  key: 1,
  class: "btn action-button"
};
const _hoisted_11 = {
  key: 2,
  class: "btn"
};
const _hoisted_12 = {
  class: "text-content"
};
function Providervue_type_template_id_e3ab98aa_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Alert = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Alert");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Providervue_type_template_id_e3ab98aa_scoped_true_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Providervue_type_template_id_e3ab98aa_scoped_true_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Providervue_type_template_id_e3ab98aa_scoped_true_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
    src: _ctx.provider.logo,
    alt: _ctx.provider.name
  }, null, 8, _hoisted_4)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.provider.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
    innerHTML: _ctx.$sanitize(_ctx.provider.note)
  }, null, 8, _hoisted_6)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    href: _ctx.configureUrl,
    class: "cta"
  }, [_ctx.provider.hasWarning ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", _hoisted_9, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_FixConfiguration')), 1)) : _ctx.provider.is_configured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", _hoisted_10, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ChangeConfiguration')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", _hoisted_11, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_SetupConfiguration')), 1))], 8, _hoisted_8)]), _ctx.provider.hasWarning ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_Alert, {
    key: 0,
    severity: "warning",
    class: "warning-alert"
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigurationProblemDetected')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", _hoisted_12, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigurationProblemDescription', _ctx.provider.name)), 1)]),
    _: 1
  })) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=template&id=e3ab98aa&scoped=true

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=script&lang=ts


/* harmony default export */ var Providervue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  components: {
    Alert: external_CoreHome_["Alert"]
  },
  props: {
    provider: {
      type: Object,
      required: true
    }
  },
  computed: {
    configureUrl() {
      return `?${external_CoreHome_["MatomoUrl"].stringify(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        action: `configure${this.provider.id}`
      }))}`;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=style&index=0&id=e3ab98aa&scoped=true&lang=css
var Providervue_type_style_index_0_id_e3ab98aa_scoped_true_lang_css = __webpack_require__("0a7a");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue





Providervue_type_script_lang_ts.render = Providervue_type_template_id_e3ab98aa_scoped_true_render
Providervue_type_script_lang_ts.__scopeId = "data-v-e3ab98aa"

/* harmony default export */ var Provider = (Providervue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Navigation/Navigation.vue?vue&type=template&id=70192541&scoped=true

const Navigationvue_type_template_id_70192541_scoped_true_withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-70192541"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_1 = {
  class: "search-engine-navigation"
};
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_2 = {
  class: "page-title"
};
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_3 = {
  class: "tabs"
};
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_4 = ["href"];
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_5 = ["href"];
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_6 = ["href"];
const Navigationvue_type_template_id_70192541_scoped_true_hoisted_7 = ["href"];
function Navigationvue_type_template_id_70192541_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Navigationvue_type_template_id_70192541_scoped_true_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", Navigationvue_type_template_id_70192541_scoped_true_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Navigationvue_type_template_id_70192541_scoped_true_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["tab", {
      active: _ctx.currentTab === 'setup'
    }]),
    href: _ctx.setupUrl
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Setup')), 11, Navigationvue_type_template_id_70192541_scoped_true_hoisted_4), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["tab", {
      active: _ctx.currentTab === 'google'
    }]),
    href: _ctx.googleUrl
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NavTitleGoogle')), 11, Navigationvue_type_template_id_70192541_scoped_true_hoisted_5), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["tab", {
      active: _ctx.currentTab === 'bing'
    }]),
    href: _ctx.bingUrl
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NavTitleBing')), 11, Navigationvue_type_template_id_70192541_scoped_true_hoisted_6), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(["tab", {
      active: _ctx.currentTab === 'yandex'
    }]),
    href: _ctx.yandexUrl
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NavTitleYandex')), 11, Navigationvue_type_template_id_70192541_scoped_true_hoisted_7)])]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Navigation/Navigation.vue?vue&type=template&id=70192541&scoped=true

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Navigation/Navigation.vue?vue&type=script&lang=ts


/* harmony default export */ var Navigationvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    currentTab: {
      type: String,
      required: true
    }
  },
  methods: {
    getNavigationUrl(action) {
      return `?${external_CoreHome_["MatomoUrl"].stringify(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        module: 'SearchEngineKeywordsPerformance',
        action
      }))}`;
    },
    translate: external_CoreHome_["translate"]
  },
  computed: {
    setupUrl() {
      return this.getNavigationUrl('index');
    },
    googleUrl() {
      return this.getNavigationUrl('configureGoogle');
    },
    bingUrl() {
      return this.getNavigationUrl('configureBing');
    },
    yandexUrl() {
      return this.getNavigationUrl('configureYandex');
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Navigation/Navigation.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Navigation/Navigation.vue?vue&type=style&index=0&id=70192541&scoped=true&lang=css
var Navigationvue_type_style_index_0_id_70192541_scoped_true_lang_css = __webpack_require__("be76");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Navigation/Navigation.vue





Navigationvue_type_script_lang_ts.render = Navigationvue_type_template_id_70192541_scoped_true_render
Navigationvue_type_script_lang_ts.__scopeId = "data-v-70192541"

/* harmony default export */ var Navigation = (Navigationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=script&lang=ts




/* harmony default export */ var AdminPagevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    providers: {
      type: Array,
      required: true
    }
  },
  components: {
    SearchEngineNavigation: Navigation,
    ContentBlock: external_CoreHome_["ContentBlock"],
    Provider: Provider
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=style&index=0&id=f28c5c7e&scoped=true&lang=css
var AdminPagevue_type_style_index_0_id_f28c5c7e_scoped_true_lang_css = __webpack_require__("157a");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue





AdminPagevue_type_script_lang_ts.render = render
AdminPagevue_type_script_lang_ts.__scopeId = "data-v-f28c5c7e"

/* harmony default export */ var AdminPage = (AdminPagevue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=template&id=7b109890&scoped=true

const Configurationvue_type_template_id_7b109890_scoped_true_withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-7b109890"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_1 = {
  class: "ui-confirm",
  id: "confirmRemoveAccountConfig",
  ref: "confirmRemoveAccountConfig"
};
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_2 = ["value"];
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_3 = ["value"];
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_4 = {
  class: "measurable-list-scroller"
};
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_5 = {
  class: "measurableList"
};
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_6 = {
  key: 0
};
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_7 = {
  colspan: "7"
};
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_8 = ["title"];
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_9 = ["title"];
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_10 = ["title"];
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_11 = ["onSubmit"];
const Configurationvue_type_template_id_7b109890_scoped_true_hoisted_12 = ["value"];
const _hoisted_13 = ["value"];
const _hoisted_14 = ["title"];
const _hoisted_15 = {
  key: 1
};
const _hoisted_16 = {
  colspan: "7",
  align: "right"
};
const _hoisted_17 = {
  key: 2,
  class: "configureMeasurableForm"
};
const _hoisted_18 = {
  colspan: "2"
};
const _hoisted_19 = {
  class: "bingAccountAndUrlToAdd"
};
const _hoisted_20 = {
  colspan: "4"
};
const _hoisted_21 = {
  action: "",
  method: "post"
};
const _hoisted_22 = ["value"];
const _hoisted_23 = ["value"];
const _hoisted_24 = ["value"];
const _hoisted_25 = ["value"];
const _hoisted_26 = {
  class: "ui-confirm",
  id: "confirmDeleteAccount",
  ref: "confirmDeleteAccount"
};
const _hoisted_27 = ["value"];
const _hoisted_28 = ["value"];
const _hoisted_29 = {
  class: "oauthconfigoptions"
};
const _hoisted_30 = ["innerHTML"];
const _hoisted_31 = ["innerHTML"];
const _hoisted_32 = {
  key: 0
};
const _hoisted_33 = {
  class: "bing-accounts"
};
const _hoisted_34 = {
  class: "accounts-table-scroller"
};
const _hoisted_35 = {
  key: 0,
  class: "accounts-table entityTable"
};
const _hoisted_36 = {
  class: "actions-column"
};
const _hoisted_37 = {
  key: 0
};
const _hoisted_38 = {
  key: 1
};
const _hoisted_39 = {
  key: 0
};
const _hoisted_40 = {
  key: 1
};
const _hoisted_41 = {
  key: 0
};
const _hoisted_42 = ["title"];
const _hoisted_43 = /*#__PURE__*/Configurationvue_type_template_id_7b109890_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const _hoisted_44 = ["title"];
const _hoisted_45 = ["title"];
const _hoisted_46 = /*#__PURE__*/Configurationvue_type_template_id_7b109890_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const _hoisted_47 = {
  class: "cta cta-inline"
};
const _hoisted_48 = ["onSubmit"];
const _hoisted_49 = ["value"];
const _hoisted_50 = ["value"];
const _hoisted_51 = ["title"];
const _hoisted_52 = {
  class: "bing-account-add"
};
const _hoisted_53 = {
  method: "POST",
  action: "",
  class: "bing-account-add-form"
};
const _hoisted_54 = ["value"];
const _hoisted_55 = {
  class: "cta cta-start-oauth"
};
const _hoisted_56 = {
  type: "submit",
  class: "btn"
};
function Configurationvue_type_template_id_7b109890_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SearchEngineNavigation = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SearchEngineNavigation");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_Notification = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Notification");
  const _component_WebsitesAvailableModal = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("WebsitesAvailableModal");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  const _directive_tooltips = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("tooltips");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SearchEngineNavigation, {
    "current-tab": "bing"
  }), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, null, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingConfigurationTitle')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingConfigurationDescription')), 1)]),
    _: 1
  }), Object.keys(_ctx.accounts).length > 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`websiteconfiguration ${Object.keys(_ctx.configuredMeasurables).length ? 'configured' : ''}`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_7b109890_scoped_true_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigRemovalConfirm', _ctx.removeAccountConfigName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_2), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_3)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_7b109890_scoped_true_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_7b109890_scoped_true_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Measurable')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Mobile_Account')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_LastImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CreatedBy')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Action')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [!Object.keys(_ctx.configuredMeasurables).length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_7b109890_scoped_true_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_7b109890_scoped_true_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured')), 1)])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.configuredMeasurablesToDisplay, (config, siteId, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: index
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].name) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", null, "(" + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].main_url) + ")", 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.apiKeyDisplay), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.url), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].lastRun), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.createdByUser), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].accountValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 0,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_AuthenticationFailedTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AuthenticationFailed')), 9, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_8)) : !_ctx.sitesInfos[siteId].urlValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 1,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_InvalidUrlTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_InvalidUrl')), 9, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_9)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 2,
        class: "status-active",
        title: _ctx.translate('SearchEngineKeywordsPerformance_ActiveTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Active')), 9, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_10))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccountConfig(siteId, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeConfig",
        value: siteId
      }, null, 8, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_12), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeSiteConfigNonce",
        value: _ctx.removeBingSiteConfigNonce
      }, null, 8, _hoisted_13), config.isDeletionAllowed ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
        key: 0,
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, _hoisted_14)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 40, Configurationvue_type_template_id_7b109890_scoped_true_hoisted_11)])]);
    }), 128)), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", _hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_16, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
      class: "btn",
      onClick: _cache[0] || (_cache[0] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.isAddingMeasurable = true, ["prevent"]))
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddConfiguration')), 1)])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", _hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "site",
      modelValue: _ctx.currentSiteToAdd,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.currentSiteToAdd = $event),
      title: _ctx.translate('CoreHome_ChooseX', _ctx.translate('General_Measurable'))
    }, null, 8, ["modelValue", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      modelValue: _ctx.bingAccountAndUrlToAdd,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.bingAccountAndUrlToAdd = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_UrlOfAccount'),
      options: _ctx.urlOptions
    }, null, 8, ["modelValue", "title", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_20, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", _hoisted_21, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "bingSiteId",
      value: _ctx.currentSiteToAdd.id
    }, null, 8, _hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "addSiteConfigNonce",
      value: _ctx.addBingSiteConfigNonce
    }, null, 8, _hoisted_23), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "bingAccountAndUrl",
      value: _ctx.bingAccountAndUrlToAdd
    }, null, 8, _hoisted_24), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "submit",
      class: "btn",
      value: _ctx.translate('General_Save')
    }, null, 8, _hoisted_25)])])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])), [[_directive_content_table], [_directive_tooltips]])])])]),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`accountconfiguration ${Object.keys(_ctx.accounts).length > 0 ? 'configured' : ''}`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ManageAPIKeys')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountRemovalConfirm', _ctx.removeAccountName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, _hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, _hoisted_28)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_29, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      class: "secondary-text",
      innerHTML: _ctx.$sanitize(_ctx.bingApiKeyInstructionText)
    }, null, 8, _hoisted_30), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      class: "secondary-text",
      innerHTML: _ctx.$sanitize(_ctx.visitBingApiKeyHowTo)
    }, null, 8, _hoisted_31), _ctx.hasApiKeyError ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", _hoisted_32, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Notification, {
      context: "error",
      type: "transient"
    }, {
      default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingAccountErrorNew', _ctx.error)), 1)]),
      _: 1
    })])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_33, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_34, [Object.keys(_ctx.accountsToDisplay).length ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", _hoisted_35, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_APIKey')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddedBy')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_TimeAdded')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AvailableWebsitesForImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_UnverifiedWebsites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", _hoisted_36, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Action')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.accountsToDisplay, (account, accountId) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: accountId
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getDisplayApiKey(account.apiKey)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.username), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.created_formatted), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [_ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_37, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getAvailableWebsites(account)[0]) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_WebsitesAvailableModal, {
        websites: _ctx.getAvailableWebsites(account),
        "link-label": _ctx.getAdditionalWebsitesLinkLabel(_ctx.getAvailableWebsites(account))
      }, null, 8, ["websites", "link-label"])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_38, "-"))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object.values(account.urls).some(verified => !verified) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_39, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getUnverifiedWebsites(account)[0]) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_WebsitesAvailableModal, {
        websites: _ctx.getUnverifiedWebsites(account),
        "link-label": _ctx.getAdditionalWebsitesLinkLabel(_ctx.getUnverifiedWebsites(account)),
        "modal-title": _ctx.unverifiedWebsitesModalTitle
      }, null, 8, ["websites", "link-label", "modal-title"])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_40, "-"))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [typeof account.hasError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_41, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "status-error",
        title: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_BingAccountErrorNew', account.hasError))
      }, [_hoisted_43, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Error')), 1)], 8, _hoisted_42)])) : _ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 1,
        class: "status-active",
        title: _ctx.translate('SearchEngineKeywordsPerformance_ActiveTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Active')), 9, _hoisted_44)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 2,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccessNew')
      }, [_hoisted_46, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteAccess')), 1)], 8, _hoisted_45))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_47, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccount(account, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "remove",
        value: account.apiKey
      }, null, 8, _hoisted_49), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeAccountNonce",
        value: _ctx.removeBingAccountNonce
      }, null, 8, _hoisted_50), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, _hoisted_51)], 40, _hoisted_48)])])]);
    }), 128))])])), [[_directive_tooltips]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_52, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", _hoisted_53, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      class: "bing-account-add-form__field",
      uicontrol: "text",
      "full-width": true,
      name: "apikey",
      modelValue: _ctx.apiKeyToAdd,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.apiKeyToAdd = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_APIKey'),
      autocomplete: "off"
    }, null, 8, ["modelValue", "title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "config_nonce",
      value: _ctx.formNonce
    }, null, 8, _hoisted_54), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_55, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_56, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddAPIKey')), 1)])])])])])]),
    _: 1
  }, 8, ["content-title"])], 2)]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=template&id=7b109890&scoped=true

// EXTERNAL MODULE: external "CorePluginsAdmin"
var external_CorePluginsAdmin_ = __webpack_require__("a5a2");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/utilities.ts
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
function getDisplayApiKey(apiKey = '') {
  return `${apiKey.substr(0, 5)}*****${apiKey.substr(apiKey.length - 5, 5)}`;
}
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/components/WebsitesAvailableModal.vue?vue&type=template&id=2f54bc49&scoped=true

const WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-2f54bc49"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_1 = {
  key: 0
};
const WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_2 = {
  class: "ui-confirm websites-available-modal",
  ref: "websitesAvailableModal"
};
const WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_3 = /*#__PURE__*/WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "btn-close modal-close"
}, [/*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("i", {
  class: "icon-close"
})], -1));
const WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_4 = {
  class: "websites-available-modal-header"
};
const WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_5 = {
  class: "websites-available-modal-list"
};
function WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.websites.length > 1 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    href: "#",
    class: "websites-available-modal-link",
    onClick: _cache[0] || (_cache[0] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])((...args) => _ctx.openModal && _ctx.openModal(...args), ["prevent"]))
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.linkLabel), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_2, [WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.actualModalTitle), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("table", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.sortedWebsites, website => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
      key: website
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(website), 1)]);
  }), 128))])])])], 512)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/components/WebsitesAvailableModal.vue?vue&type=template&id=2f54bc49&scoped=true

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/components/WebsitesAvailableModal.vue?vue&type=script&lang=ts


/* harmony default export */ var WebsitesAvailableModalvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    websites: {
      type: Array,
      required: true
    },
    linkLabel: {
      type: String,
      required: true
    },
    modalTitle: String
  },
  methods: {
    openModal() {
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.websitesAvailableModal, {}, {
        classes: 'websites-available-modal-dialog'
      });
    }
  },
  computed: {
    actualModalTitle() {
      return this.modalTitle || Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_AvailableWebsitesForImport');
    },
    sortedWebsites() {
      return [...this.websites].sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/components/WebsitesAvailableModal.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/components/WebsitesAvailableModal.vue?vue&type=style&index=0&id=2f54bc49&scoped=true&lang=css
var WebsitesAvailableModalvue_type_style_index_0_id_2f54bc49_scoped_true_lang_css = __webpack_require__("eeed");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/components/WebsitesAvailableModal.vue





WebsitesAvailableModalvue_type_script_lang_ts.render = WebsitesAvailableModalvue_type_template_id_2f54bc49_scoped_true_render
WebsitesAvailableModalvue_type_script_lang_ts.__scopeId = "data-v-2f54bc49"

/* harmony default export */ var WebsitesAvailableModal = (WebsitesAvailableModalvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=script&lang=ts






/* harmony default export */ var Configurationvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    configuredMeasurables: {
      type: Object,
      required: true
    },
    accounts: {
      type: Object,
      required: true
    },
    sitesInfos: {
      type: Object,
      required: true
    },
    currentSite: {
      type: Object,
      required: true
    },
    urlOptions: {
      type: [Object, Array],
      required: true
    },
    error: String,
    apikey: String,
    formNonce: String,
    addBingSiteConfigNonce: String,
    removeBingSiteConfigNonce: String,
    removeBingAccountNonce: String,
    countOfAccountsWithAccess: Number,
    userIsSuperUser: String
  },
  data() {
    return {
      removeAccountConfigName: '',
      removeAccountName: '',
      isAddingMeasurable: false,
      currentSiteToAdd: this.currentSite,
      bingAccountAndUrlToAdd: null,
      apiKeyToAdd: this.apikey || ''
    };
  },
  components: {
    SearchEngineNavigation: Navigation,
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    Notification: external_CoreHome_["Notification"],
    WebsitesAvailableModal: WebsitesAvailableModal
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"],
    Tooltips: external_CoreHome_["Tooltips"]
  },
  methods: {
    removeAccountConfig(siteId, event) {
      const siteInfos = this.sitesInfos;
      this.removeAccountConfigName = siteInfos[siteId].name;
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmRemoveAccountConfig, {
        yes() {
          event.target.submit();
        }
      });
    },
    getDisplayApiKey: getDisplayApiKey,
    removeAccount(account, event) {
      this.removeAccountName = this.getDisplayApiKey(account.apiKey);
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteAccount, {
        yes() {
          event.target.submit();
        }
      });
    },
    accountHasAvailableSites(account) {
      return Object.values(account.urls).some(verified => verified);
    },
    getAvailableWebsites(account) {
      return Object.entries(account.urls).filter(([, verified]) => verified).map(([url]) => url).sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    },
    getUnverifiedWebsites(account) {
      return Object.entries(account.urls).filter(([, verified]) => !verified).map(([url]) => url).sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    },
    getAdditionalWebsitesLinkLabel(websites) {
      return `+${websites.length - 1}`;
    }
  },
  computed: {
    unverifiedWebsitesModalTitle() {
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_UnverifiedWebsites');
    },
    hasApiKeyError() {
      return typeof this.error !== 'undefined' && this.error !== null;
    },
    configuredMeasurablesToDisplay() {
      const entries = Object.entries(this.configuredMeasurables);
      return Object.fromEntries(entries.filter(([, config]) => {
        const [account] = config.bingSiteUrl.split('##');
        return !!this.accounts[account];
      }).map(([siteId, config]) => {
        const [account, url] = config.bingSiteUrl.split('##');
        const {
          apiKey
        } = this.accounts[account];
        return [siteId, Object.assign(Object.assign({}, config), {}, {
          account,
          url,
          apiKeyDisplay: this.getDisplayApiKey(apiKey)
        })];
      }));
    },
    bingApiKeyInstructionText() {
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_BingAPIKeyInstruction', '<a href="https://www.bing.com/webmasters" target="_new" rel="noreferrer noopener">', '</a>', '', '');
    },
    visitBingApiKeyHowTo() {
      const link = Object(external_CoreHome_["externalRawLink"])('https://matomo.org/faq/reports/import-bing-and-yahoo-search-keywords-into-matomo/');
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_VisitBingApiKeyHowTo', `<a target="_blank" href="${link}" rel="noreferrer noopener">`, '</a>');
    },
    accountsToDisplay() {
      const asArray = Object.entries(this.accounts);
      const filtered = asArray.filter(([, value]) => value.hasAccess);
      return Object.fromEntries(filtered);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=style&index=0&id=7b109890&scoped=true&lang=css
var Configurationvue_type_style_index_0_id_7b109890_scoped_true_lang_css = __webpack_require__("941f");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue





Configurationvue_type_script_lang_ts.render = Configurationvue_type_template_id_7b109890_scoped_true_render
Configurationvue_type_script_lang_ts.__scopeId = "data-v-7b109890"

/* harmony default export */ var Configuration = (Configurationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=template&id=0a6d122c&scoped=true

const Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-0a6d122c"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_1 = {
  key: 0
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_2 = {
  class: "alert alert-warning"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_3 = {
  key: 1
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_4 = {
  class: "ui-confirm",
  id: "confirmRemoveAccountConfig",
  ref: "confirmRemoveAccountConfig"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_5 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_6 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_7 = {
  class: "measurable-list-scroller"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_8 = {
  class: "measurableList"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_9 = {
  key: 0
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_10 = {
  colspan: "8"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_11 = ["innerHTML"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_12 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1));
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_13 = ["title"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_14 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-info"
}, null, -1));
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_15 = ["title"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_16 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-info"
}, null, -1));
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_17 = ["title"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_18 = ["title"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_19 = ["title"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_20 = ["onSubmit"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_21 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_22 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_23 = ["title"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_24 = {
  key: 1,
  class: "configureMeasurableForm"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_25 = {
  class: "account-select"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_26 = {
  colspan: "5"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_27 = {
  action: "",
  method: "post"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_28 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_29 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_30 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_31 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_32 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_33 = {
  key: 0
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_34 = {
  key: 0,
  class: "oauthconfiguration"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_35 = {
  class: "ui-confirm",
  id: "confirmDeleteAccount",
  ref: "confirmDeleteAccount"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_36 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_37 = ["value"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_38 = {
  class: "oauthconfigoptions"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_39 = {
  key: 0,
  class: "secondary-text"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_40 = {
  key: 1
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_41 = {
  key: 2
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_42 = {
  key: 0
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_43 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1));
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_44 = {
  class: "google-accounts"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_45 = {
  class: "accounts-table-scroller"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_46 = {
  key: 0,
  class: "accounts-table entityTable"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_47 = {
  class: "actions-column"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_48 = {
  class: "account-info"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_49 = ["src"];
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_50 = {
  key: 1,
  class: "avatar placeholder"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_51 = {
  class: "name"
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_52 = {
  key: 0
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_53 = {
  key: 1
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_54 = {
  key: 0
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_55 = {
  key: 1
};
const Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_56 = {
  key: 0
};
const _hoisted_57 = ["title"];
const _hoisted_58 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const _hoisted_59 = ["title"];
const _hoisted_60 = ["title"];
const _hoisted_61 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const _hoisted_62 = {
  class: "cta cta-inline"
};
const _hoisted_63 = ["action"];
const _hoisted_64 = ["value"];
const _hoisted_65 = ["title"];
const _hoisted_66 = ["onSubmit"];
const _hoisted_67 = ["value"];
const _hoisted_68 = ["value"];
const _hoisted_69 = ["title"];
const _hoisted_70 = {
  class: "cta cta-start-oauth"
};
const _hoisted_71 = ["action"];
const _hoisted_72 = ["value"];
const _hoisted_73 = {
  type: "submit",
  class: "btn"
};
const _hoisted_74 = {
  key: 0,
  class: "clientconfiguration"
};
const _hoisted_75 = /*#__PURE__*/Configurationvue_type_template_id_0a6d122c_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1));
const _hoisted_76 = ["action"];
const _hoisted_77 = ["value"];
const _hoisted_78 = {
  type: "submit",
  class: "btn"
};
const _hoisted_79 = {
  key: 1
};
const _hoisted_80 = {
  class: "connected-notice-text"
};
const _hoisted_81 = ["href"];
const _hoisted_82 = {
  class: "connected-notice-text"
};
const _hoisted_83 = {
  class: "connected-notice-actions"
};
const _hoisted_84 = ["href"];
function Configurationvue_type_template_id_0a6d122c_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SearchEngineNavigation = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SearchEngineNavigation");
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_Notification = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Notification");
  const _component_WebsitesAvailableModal = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("WebsitesAvailableModal");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  const _directive_tooltips = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("tooltips");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SearchEngineNavigation, {
    "current-tab": "google"
  }), _ctx.isClientConfigured && _ctx.isOAuthConfigured || !_ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    key: 0,
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [!_ctx.isClientConfigured && _ctx.isClientConfigurable && !_ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GooglePendingConfigurationErrorMessage')), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured && _ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigRemovalConfirm', _ctx.removeAccountConfigName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_5), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_6)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Measurable')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_EnabledSearchTypes')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Mobile_Account')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_LastImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CreatedBy')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Action')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object.keys(_ctx.configuredMeasurablesToDisplay).length === 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured')), 1)])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.configuredMeasurablesToDisplay, (config, siteId, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: index
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
        innerHTML: _ctx.$sanitize(_ctx.sitesInfos[siteId].name)
      }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_11), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleWebKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeWeb') : '') + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleImageKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeImage') : '') + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleVideoKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeVideo') : '') + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleNewsKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeNews') : ''), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.accounts[config.account].name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.url.replaceAll('sc-domain:', '')) + " ", 1), Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_12, /^sc-domain:/.test(config.url) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 0,
        class: "property-type",
        title: _ctx.translate('SearchEngineKeywordsPerformance_DomainPropertyInfo')
      }, [Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_14, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" (" + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_DomainProperty')) + ") ", 1)], 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_13)) : /^http/.test(config.url) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 1,
        class: "property-type",
        title: _ctx.translate('SearchEngineKeywordsPerformance_URLPrefixPropertyInfo')
      }, [Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_16, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" (" + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_URLPrefixProperty')) + ") ", 1)], 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_15)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].lastRun), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.createdByUser), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].accountValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 0,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_AuthenticationFailedTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AuthenticationFailed')), 9, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_17)) : !_ctx.sitesInfos[siteId].urlValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 1,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_InvalidUrlTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_InvalidUrl')), 9, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_18)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 2,
        class: "status-active",
        title: _ctx.translate('SearchEngineKeywordsPerformance_ActiveTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Active')), 9, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_19))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccountConfig(siteId, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeConfig",
        value: siteId
      }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_21), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeSiteConfigNonce",
        value: _ctx.removeGoogleSiteConfigNonce
      }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_22), config.isDeletionAllowed ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
        key: 0,
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_23)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 40, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_20)])]);
    }), 128)), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_24, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "site",
      "full-width": true,
      modelValue: _ctx.currentSiteToAdd,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => _ctx.currentSiteToAdd = $event),
      title: _ctx.translate('CoreHome_ChooseX', _ctx.translate('General_Measurable'))
    }, null, 8, ["modelValue", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "checkbox",
      modelValue: _ctx.googleTypesToAdd,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.googleTypesToAdd = $event),
      "var-type": "array",
      title: "keyword types to fetch",
      "full-width": true,
      options: _ctx.googleTypeOptions
    }, null, 8, ["modelValue", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_25, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      modelValue: _ctx.googleAccountAndUrlToAdd,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.googleAccountAndUrlToAdd = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_UrlOfAccount'),
      "full-width": true,
      options: _ctx.urlOptions
    }, null, 8, ["modelValue", "title", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_27, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "googleSiteId",
      value: _ctx.currentSiteToAdd.id
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_28), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "addSiteConfigNonce",
      value: _ctx.addGoogleSiteConfigNonce
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_29), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "googleAccountAndUrl",
      value: _ctx.googleAccountAndUrlToAdd
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_30), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "googleTypes",
      value: _ctx.googleTypesToAdd.length ? _ctx.googleTypesToAdd : 'web'
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_31), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "submit",
      class: "btn",
      value: _ctx.translate('General_Save')
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_32)])])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])), [[_directive_content_table], [_directive_tooltips]])]), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_33, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
      id: "addWebsiteBtn",
      class: "btn",
      onClick: _cache[3] || (_cache[3] = $event => _ctx.isAddingMeasurable = true)
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddConfiguration')), 1)], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
    _: 1
  }, 8, ["content-title"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    key: 1,
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConnectGoogleAccountsText')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [_ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_34, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_35, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountRemovalConfirm', _ctx.removeAccountName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_36), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_37)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_38, [_ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_39, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts', _ctx.countOfAccountsWithAccess)), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectFirstAccount')), 1)), _ctx.hasOAuthError ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_41, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Notification, {
      context: "error",
      type: "transient"
    }, {
      default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthErrorNew')) + " ", 1), _ctx.hasOAuthError.length > 5 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_42, [Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_43, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.hasOAuthError), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
      _: 1
    })])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_44, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_45, [Object.keys(_ctx.accounts).length ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_46, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAccount')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddedBy')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_TimeAdded')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AvailableWebsitesForImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_UnverifiedWebsites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_47, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Action')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.accountsToDisplay, (account, accountId) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: accountId
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_48, [account.picture ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("img", {
        key: 0,
        src: account.picture,
        alt: "avatar",
        class: "avatar"
      }, null, 8, Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_49)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_50, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.name.charAt(0)), 1)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_51, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.name), 1)])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.username), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.created_formatted), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [_ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_52, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getAvailableWebsites(account)[0]) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_WebsitesAvailableModal, {
        websites: _ctx.getAvailableWebsites(account),
        "link-label": _ctx.getAdditionalWebsitesLinkLabel(_ctx.getAvailableWebsites(account))
      }, null, 8, ["websites", "link-label"])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_53, "-"))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object.values(account.urls).indexOf('siteUnverifiedUser') !== -1 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_54, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getUnverifiedWebsites(account)[0]) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_WebsitesAvailableModal, {
        websites: _ctx.getUnverifiedWebsites(account),
        "link-label": _ctx.getAdditionalWebsitesLinkLabel(_ctx.getUnverifiedWebsites(account)),
        "modal-title": _ctx.unverifiedWebsitesModalTitle
      }, null, 8, ["websites", "link-label", "modal-title"])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_55, "-"))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [typeof account.hasError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_0a6d122c_scoped_true_hoisted_56, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "status-error",
        title: _ctx.$sanitize(account.hasError)
      }, [_hoisted_58, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Error')), 1)], 8, _hoisted_57)])) : _ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 1,
        class: "status-active",
        title: _ctx.translate('SearchEngineKeywordsPerformance_ActiveTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Active')), 9, _hoisted_59)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 2,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccessNew')
      }, [_hoisted_61, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteAccess')), 1)], 8, _hoisted_60))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", _hoisted_62, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "post",
        action: _ctx.forwardToAuthUrl
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "auth_nonce",
        value: _ctx.authNonce
      }, null, 8, _hoisted_64), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        type: "submit",
        class: "btn-flat icon-refresh",
        title: _ctx.translate('General_Refresh')
      }, null, 8, _hoisted_65)], 8, _hoisted_63), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccount(account, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "remove",
        value: accountId
      }, null, 8, _hoisted_67), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeAccountNonce",
        value: _ctx.removeGoogleAccountNonce
      }, null, 8, _hoisted_68), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, _hoisted_69)], 40, _hoisted_66)])])]);
    }), 128))])])), [[_directive_tooltips]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_70, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      method: "post",
      action: _ctx.forwardToAuthUrl
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "auth_nonce",
      value: _ctx.authNonce
    }, null, 8, _hoisted_72), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_73, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccount')), 1)], 8, _hoisted_71)])])])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
    _: 1
  }, 8, ["content-title"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.hasSetupCard ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    key: 2,
    "content-title": _ctx.setupCardTitle,
    class: "oauth-setup-card"
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [_ctx.showClientConfiguration ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_74, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientId')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientId), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientSecret')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientSecret), 1)]), _hoisted_75, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      action: _ctx.removeConfigUrl,
      method: "POST",
      enctype: "multipart/form-data",
      id: "removeConfigForm"
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_DeleteUploadedClientConfig')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "config_nonce",
      value: _ctx.formNonce
    }, null, 8, _hoisted_77), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_78, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Remove')), 1)], 8, _hoisted_76)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.showSetupExtensions ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_79, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.resolvedComponentExtensions, (entry, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        key: index
      }, [entry.plugin === 'ConnectAccounts' && entry.component === 'PluginConnectedNotice' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], {
        key: 0
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", _hoisted_80, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.connectedWithBody) + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConnectAccounts_ConnectedWithBody[beforeLink]')) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        id: "unlinkCloudGoogleConfig",
        href: _ctx.configConnectProps.unlinkUrl
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('ConnectAccounts_ConnectedWithBody[linkText]')), 9, _hoisted_81)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", _hoisted_82, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.reAuthorizeBody), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_83, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
        class: "googleSignInButton",
        href: _ctx.configConnectProps.authUrl
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.reAuthorizeBtnText), 9, _hoisted_84)])], 64)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDynamicComponent"])(entry.resolvedComponent), {
        key: 1,
        "manual-config-nonce": _ctx.configConnectProps.manualConfigNonce,
        "base-domain": _ctx.configConnectProps.baseDomain,
        "base-url": _ctx.configConnectProps.baseUrl,
        "manual-action-url": _ctx.configConnectProps.manualActionUrl,
        "primary-text": _ctx.configConnectProps.primaryText,
        "radio-options": _ctx.configConnectProps.radioOptions,
        "manual-config-text": _ctx.configConnectProps.manualConfigText,
        "connect-accounts-url": _ctx.configConnectProps.connectAccountsUrl,
        "connect-accounts-btn-text": _ctx.configConnectProps.connectAccountsBtnText,
        "auth-url": _ctx.configConnectProps.authUrl,
        "unlink-url": _ctx.configConnectProps.unlinkUrl,
        strategy: _ctx.configConnectProps.strategy,
        "connected-with": _ctx.configConnectProps.connectedWith,
        "authorized-js-origin": _ctx.configConnectProps.authorizedJsOrigin,
        "authorized-redirect-url": _ctx.configConnectProps.authorizedRedirectUrl,
        "faq-url": _ctx.configConnectProps.faqUrl
      }, null, 8, ["manual-config-nonce", "base-domain", "base-url", "manual-action-url", "primary-text", "radio-options", "manual-config-text", "connect-accounts-url", "connect-accounts-btn-text", "auth-url", "unlink-url", "strategy", "connected-with", "authorized-js-origin", "authorized-redirect-url", "faq-url"]))]);
    }), 128))])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
    _: 1
  }, 8, ["content-title"])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=template&id=0a6d122c&scoped=true

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=script&lang=ts






/* harmony default export */ var Google_Configurationvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    configuredMeasurables: {
      type: Object,
      required: true
    },
    isClientConfigured: Boolean,
    isClientConfigurable: Boolean,
    isOAuthConfigured: Boolean,
    clientId: String,
    clientSecret: String,
    accounts: {
      type: Object,
      required: true
    },
    sitesInfos: {
      type: Object,
      required: true
    },
    currentSite: {
      type: Object,
      required: true
    },
    urlOptions: {
      type: [Object, Array],
      required: true
    },
    hasOAuthError: [String, Boolean],
    authNonce: {
      type: String,
      required: true
    },
    formNonce: String,
    addGoogleSiteConfigNonce: String,
    removeGoogleSiteConfigNonce: String,
    removeGoogleAccountNonce: String,
    countOfAccountsWithAccess: Number,
    userIsSuperUser: String,
    extensions: Array,
    removeConfigUrl: String,
    configureConnectionProps: {
      type: Object,
      required: true
    }
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    Notification: external_CoreHome_["Notification"],
    SearchEngineNavigation: Navigation,
    WebsitesAvailableModal: WebsitesAvailableModal
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"],
    Tooltips: external_CoreHome_["Tooltips"]
  },
  data() {
    return {
      removeAccountConfigName: '',
      removeAccountName: '',
      isAddingMeasurable: false,
      currentSiteToAdd: this.currentSite,
      googleAccountAndUrlToAdd: null,
      googleTypesToAdd: ['web'],
      clientFile: null,
      clientText: ''
    };
  },
  methods: {
    removeAccountConfig(siteId, event) {
      const siteInfos = this.sitesInfos;
      this.removeAccountConfigName = siteInfos[siteId].name;
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmRemoveAccountConfig, {
        yes() {
          event.target.submit();
        }
      });
    },
    removeAccount(account, event) {
      this.removeAccountName = account.name;
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteAccount, {
        yes() {
          event.target.submit();
        }
      });
    },
    accountHasAvailableSites(account) {
      const siteAccessLevels = ['siteOwner', 'siteFullUser', 'siteRestrictedUser'];
      return Object.values(account.urls).some(siteAccess => siteAccessLevels.indexOf(siteAccess) !== -1);
    },
    getAvailableWebsites(account) {
      return Object.entries(account.urls).filter(([, level]) => level !== 'siteUnverifiedUser').map(([url]) => url.replaceAll('sc-domain:', '')).sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    },
    getUnverifiedWebsites(account) {
      return Object.entries(account.urls).filter(([, accessLevel]) => accessLevel === 'siteUnverifiedUser').map(([url]) => url.replaceAll('sc-domain:', '')).sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    },
    getAdditionalWebsitesLinkLabel(websites) {
      return `+${websites.length - 1}`;
    }
  },
  computed: {
    unverifiedWebsitesModalTitle() {
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_UnverifiedWebsites');
    },
    configuredMeasurablesToDisplay() {
      const entries = Object.entries(this.configuredMeasurables);
      return Object.fromEntries(entries.filter(([, config]) => {
        const [account] = config.googleSearchConsoleUrl.split('##');
        return !!this.accounts[account];
      }).map(([siteId, config]) => {
        const [account, url] = config.googleSearchConsoleUrl.split('##');
        const {
          apiKey
        } = this.accounts[account];
        return [siteId, Object.assign(Object.assign({}, config), {}, {
          account,
          url,
          apiKeyDisplay: getDisplayApiKey(apiKey)
        })];
      }));
    },
    accountsToDisplay() {
      const asArray = Object.entries(this.accounts);
      const filtered = asArray.filter(([, value]) => value.hasAccess);
      return Object.fromEntries(filtered);
    },
    googleTypeOptions() {
      return {
        web: Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_KeywordTypeWeb'),
        image: Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_KeywordTypeImage'),
        video: Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_KeywordTypeVideo'),
        news: Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_KeywordTypeNews')
      };
    },
    forwardToAuthUrl() {
      return `?${external_CoreHome_["MatomoUrl"].stringify(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        action: 'forwardToAuth'
      }))}`;
    },
    extensionEntries() {
      return this.extensions;
    },
    resolvedComponentExtensions() {
      const entries = this.extensionEntries;
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["markRaw"])(entries.map(entry => Object.assign(Object.assign({}, entry), {}, {
        resolvedComponent: Object(external_CoreHome_["useExternalPluginComponent"])(entry.plugin, entry.component)
      })));
    },
    isCloudAppSetupCard() {
      return this.extensionEntries.some(entry => entry.plugin === 'ConnectAccounts');
    },
    showClientConfiguration() {
      return !!this.userIsSuperUser && !!this.isClientConfigured && !!this.isClientConfigurable && (!!this.clientId || !!this.clientSecret);
    },
    showSetupExtensions() {
      return this.userIsSuperUser;
    },
    hasSetupCard() {
      return this.showClientConfiguration || this.showSetupExtensions && this.extensionEntries.length > 0;
    },
    setupCardTitle() {
      if (this.isCloudAppSetupCard) {
        return this.extensionEntries.some(entry => entry.plugin === 'ConnectAccounts' && entry.component === 'PluginConnectedNotice') ? Object(external_CoreHome_["translate"])('ConnectAccounts_ConnectedWithHeader') : Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_ConnectUsingMatomoCloudApp');
      }
      if (this.showClientConfiguration) {
        return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_OAuthClientConfig');
      }
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_GoogleConfigurationTitle');
    },
    connectedWithBody() {
      return Object(external_CoreHome_["translate"])('ConnectAccounts_ConnectedWithBody', [this.configConnectProps.connectedWith]);
    },
    reAuthorizeBody() {
      return Object(external_CoreHome_["translate"])('ConnectAccounts_ReAuthorizeBody', [this.configConnectProps.connectedWith]);
    },
    reAuthorizeBtnText() {
      return Object(external_CoreHome_["translate"])('ConnectAccounts_ReAuthorizeBtnText', [this.configConnectProps.connectedWith]);
    },
    configConnectProps() {
      return this.configureConnectionProps;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=style&index=0&id=0a6d122c&scoped=true&lang=css
var Configurationvue_type_style_index_0_id_0a6d122c_scoped_true_lang_css = __webpack_require__("9811");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue





Google_Configurationvue_type_script_lang_ts.render = Configurationvue_type_template_id_0a6d122c_scoped_true_render
Google_Configurationvue_type_script_lang_ts.__scopeId = "data-v-0a6d122c"

/* harmony default export */ var Google_Configuration = (Google_Configurationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=template&id=2d80ecca&scoped=true

const Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId = n => (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["pushScopeId"])("data-v-2d80ecca"), n = n(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["popScopeId"])(), n);
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_1 = {
  class: "ui-confirm",
  id: "confirmRemoveAccountConfig",
  ref: "confirmRemoveAccountConfig"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_2 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_3 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_4 = {
  class: "measurable-list-scroller"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_5 = {
  class: "measurableList"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_6 = ["innerHTML"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_7 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_8 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_9 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_10 = ["onSubmit"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_11 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_12 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_13 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_14 = {
  key: 0
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_15 = {
  colspan: "7",
  align: "right"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_16 = {
  key: 1,
  class: "configureMeasurableForm"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_17 = {
  colspan: "2"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_18 = {
  class: "account-select"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_19 = {
  colspan: "4"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_20 = {
  action: "",
  method: "post"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_21 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_22 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_23 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_24 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_25 = {
  key: 1,
  class: "yandex"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_26 = {
  class: "ui-confirm",
  id: "confirmDeleteAccount",
  ref: "confirmDeleteAccount"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_27 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_28 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_29 = {
  class: "oauthconfigoptions"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_30 = {
  key: 0
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_31 = {
  key: 1
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_32 = {
  key: 2
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_33 = {
  key: 0
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_34 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_35 = {
  class: "yandex-accounts"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_36 = {
  class: "accounts-table-scroller"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_37 = {
  key: 0,
  class: "accounts-table entityTable"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_38 = {
  class: "actions-column"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_39 = {
  class: "account-info"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_40 = ["src"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_41 = {
  key: 1,
  class: "avatar placeholder"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_42 = {
  class: "name"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_43 = {
  key: 0
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_44 = {
  key: 1
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_45 = {
  key: 0
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_46 = {
  key: 1
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_47 = {
  class: "status-cell"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_48 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_49 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_50 = {
  key: 1
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_51 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_52 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_53 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_54 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_55 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_56 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_57 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_58 = {
  class: "cta cta-inline"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_59 = ["action"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_60 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_61 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_62 = ["onSubmit"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_63 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_64 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_65 = ["title"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_66 = {
  class: "cta cta-start-oauth"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_67 = ["action"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_68 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_69 = {
  type: "submit",
  class: "btn"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_70 = {
  key: 3,
  class: "clientconfighelp"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_71 = ["innerHTML"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_72 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_73 = /*#__PURE__*/Configurationvue_type_template_id_2d80ecca_scoped_true_withScopeId(() => /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1));
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_74 = {
  key: 4,
  class: "clientconfiguration"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_75 = {
  method: "post",
  action: "",
  id: "clientconfigform"
};
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_76 = ["value"];
const Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_77 = {
  type: "submit",
  class: "btn"
};
function Configurationvue_type_template_id_2d80ecca_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SearchEngineNavigation = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("SearchEngineNavigation");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_Notification = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Notification");
  const _component_WebsitesAvailableModal = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("WebsitesAvailableModal");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  const _directive_tooltips = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("tooltips");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_SearchEngineNavigation, {
    "current-tab": "yandex"
  }), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, null, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexConfigurationTitle')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexConfigurationDescription')), 1)]),
    _: 1
  }), _ctx.isClientConfigured && _ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(Object.keys(_ctx.configuredMeasurables).length ? 'configured' : '')
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => {
      var _ctx$currentSiteToAdd;
      return [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigRemovalConfirm', _ctx.removeAccountConfigName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "yes",
        type: "button",
        value: _ctx.translate('General_Yes')
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_2), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "no",
        type: "button",
        value: _ctx.translate('General_No')
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_3)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_5, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Measurable')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Mobile_Account')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_LastImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CreatedBy')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Action')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.configuredMeasurablesToDisplay, (config, siteId, index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
          key: index
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
          innerHTML: _ctx.$sanitize(_ctx.sitesInfos[siteId].name)
        }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_6), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.accounts[config.account].name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.hostUrl || config.host), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].lastRun), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.createdByUser), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].accountValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
          key: 0,
          class: "status-error",
          title: _ctx.translate('SearchEngineKeywordsPerformance_AuthenticationFailedTooltip')
        }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AuthenticationFailed')), 9, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_7)) : !_ctx.sitesInfos[siteId].urlValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
          key: 1,
          class: "status-error",
          title: _ctx.translate('SearchEngineKeywordsPerformance_InvalidUrlTooltip')
        }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_InvalidUrl')), 9, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_8)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
          key: 2,
          class: "status-active",
          title: _ctx.translate('SearchEngineKeywordsPerformance_ActiveTooltip')
        }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Active')), 9, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_9))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
          method: "POST",
          action: "",
          onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccountConfig(siteId, $event), ["prevent"])
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
          type: "hidden",
          name: "removeConfig",
          value: siteId
        }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_11), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
          type: "hidden",
          name: "removeSiteConfigNonce",
          value: _ctx.removeYandexSiteConfigNonce
        }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_12), config.isDeletionAllowed ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
          key: 0,
          type: "submit",
          class: "btn-flat icon-delete",
          title: _ctx.translate('General_Delete')
        }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_13)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 40, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_10)])]);
      }), 128)), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        class: "btn",
        onClick: _cache[0] || (_cache[0] = $event => _ctx.isAddingMeasurable = true)
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddConfiguration')), 1)])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_16, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "site",
        "full-width": true,
        modelValue: _ctx.currentSiteToAdd,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.currentSiteToAdd = $event),
        title: _ctx.translate('CoreHome_ChooseX', _ctx.translate('General_Measurable'))
      }, null, 8, ["modelValue", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "select",
        modelValue: _ctx.yandexAccountAndHostIdToAdd,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.yandexAccountAndHostIdToAdd = $event),
        title: _ctx.translate('SearchEngineKeywordsPerformance_UrlOfAccount'),
        "full-width": true,
        options: _ctx.urlOptions
      }, null, 8, ["modelValue", "title", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_20, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "yandexSiteId",
        value: (_ctx$currentSiteToAdd = _ctx.currentSiteToAdd) === null || _ctx$currentSiteToAdd === void 0 ? void 0 : _ctx$currentSiteToAdd.id
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_21), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "addSiteConfigNonce",
        value: _ctx.addYandexSiteConfigNonce
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "yandexAccountAndHostId",
        value: _ctx.yandexAccountAndHostIdToAdd
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_23), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "submit",
        class: "btn",
        value: _ctx.translate('General_Save')
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_24)])])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])), [[_directive_content_table], [_directive_tooltips]])])];
    }),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_25, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConnectYandexAccounts')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountRemovalConfirm', _ctx.removeAccountName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_28)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_29, [_ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_30, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts', _ctx.countOfAccountsWithAccess)), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_31, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectFirstAccount')), 1)), _ctx.hasOAuthError ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_32, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Notification, {
      context: "error"
    }, {
      default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthErrorNew')) + " ", 1), typeof _ctx.hasOAuthError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_33, [Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_34, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.hasOAuthError), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
      _: 1
    })])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_35, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_36, [Object.keys(_ctx.accounts).length ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_37, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexAccount')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddedBy')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_TimeAdded')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AvailableWebsitesForImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_UnverifiedWebsites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Status')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_38, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Action')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.accountsToDisplay, (account, accountId) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: accountId
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_39, [account.picture ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("img", {
        key: 0,
        src: account.picture,
        alt: "avatar",
        class: "avatar"
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_40)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_41, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.name.charAt(0)), 1)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_42, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.name), 1)])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.username), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.created_formatted), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [_ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_43, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getAvailableWebsites(account)[0]) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_WebsitesAvailableModal, {
        websites: _ctx.getAvailableWebsites(account),
        "link-label": _ctx.getAdditionalWebsitesLinkLabel(_ctx.getAvailableWebsites(account))
      }, null, 8, ["websites", "link-label"])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_44, "-"))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object.values(account.urls).some(siteAccess => !siteAccess.verified) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_45, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getUnverifiedWebsites(account)[0]) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_WebsitesAvailableModal, {
        websites: _ctx.getUnverifiedWebsites(account),
        "link-label": _ctx.getAdditionalWebsitesLinkLabel(_ctx.getUnverifiedWebsites(account)),
        "modal-title": _ctx.unverifiedWebsitesModalTitle
      }, null, 8, ["websites", "link-label", "modal-title"])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_46, "-"))]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_47, [account.authDaysAgo >= 180 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 0,
        class: "status-warning",
        title: _ctx.translate('SearchEngineKeywordsPerformance_OAuthAccessTimedOutNew')
      }, [Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_49, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Warning')), 1)], 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_48)) : typeof account.hasError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_50, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        class: "status-error",
        title: _ctx.$sanitize(account.hasError)
      }, [Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_52, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Error')), 1)], 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_51)])) : _ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 2,
        class: "status-active",
        title: _ctx.translate('SearchEngineKeywordsPerformance_ActiveTooltip')
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Active')), 9, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_53)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 3,
        class: "status-error",
        title: _ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccessNew')
      }, [Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_55, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteAccess')), 1)], 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_54)), account.authDaysAgo >= 150 && account.authDaysAgo < 180 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 4,
        class: "status-warning",
        title: _ctx.translate('SearchEngineKeywordsPerformance_OAuthAccessWillTimeOutSoonNew', 180 - account.authDaysAgo)
      }, [Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_57, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Warning')), 1)], 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_56)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_58, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "post",
        action: _ctx.forwardToYandexAuthUrl
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "auth_nonce",
        value: _ctx.auth_nonce
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_60), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        type: "submit",
        class: "btn-flat icon-refresh",
        title: _ctx.translate('General_Refresh')
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_61)], 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_59), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccount(account, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "remove",
        value: accountId
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_63), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeAccountNonce",
        value: _ctx.removeYandexAccountNonce
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_64), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_65)], 40, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_62)])])]);
    }), 128))])])), [[_directive_tooltips]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_66, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      method: "post",
      action: _ctx.forwardToYandexAuthUrl
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "auth_nonce",
      value: _ctx.auth_nonce
    }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_68), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_69, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccount')), 1)], 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_67)])])])]),
    _: 1
  }, 8, ["content-title"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured && _ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 2,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`clientconfiguration ${_ctx.isClientConfigured ? 'configured' : ''}`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_OAuthClientConfig')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientId')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientId), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientSecret')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientSecret), 1)])]),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.userIsSuperUser && !_ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_70, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_HowToGetOAuthClientConfig')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      innerHTML: _ctx.$sanitize(_ctx.visitOAuthHowTo)
    }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_71), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthExampleText')) + " ", 1), Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_72, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexFieldUrlToAppSite')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseDomain) + " ", 1), Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_73, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexFieldCallbackUri')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseDomainUrl) + "?module=SearchEngineKeywordsPerformance&action=processYandexAuthCode ", 1)])]),
    _: 1
  }, 8, ["content-title"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.userIsSuperUser && !_ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_74, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_SetUpOAuthClientConfig')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_75, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ProvideYandexClientConfig')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "clientid",
      modelValue: _ctx.clientIdToUse,
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => _ctx.clientIdToUse = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_ClientId'),
      autocomplete: "off"
    }, null, 8, ["modelValue", "title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "text",
      name: "clientsecret",
      modelValue: _ctx.clientSecretToUse,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => _ctx.clientSecretToUse = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_ClientSecret'),
      autocomplete: "off"
    }, null, 8, ["modelValue", "title"]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "config_nonce",
      value: _ctx.formNonce
    }, null, 8, Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_76), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", Configurationvue_type_template_id_2d80ecca_scoped_true_hoisted_77, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Save')), 1)])]),
    _: 1
  }, 8, ["content-title"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=template&id=2d80ecca&scoped=true

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=script&lang=ts






/* harmony default export */ var Yandex_Configurationvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    isClientConfigured: Boolean,
    isClientConfigurable: Boolean,
    isOAuthConfigured: Boolean,
    clientId: String,
    clientSecret: String,
    configuredMeasurables: {
      type: Object,
      required: true
    },
    sitesInfos: {
      type: Object,
      required: true
    },
    currentSite: {
      type: Object,
      required: true
    },
    urlOptions: {
      type: [Object, Array],
      required: true
    },
    hasOAuthError: [String, Boolean],
    accounts: {
      type: Object,
      required: true
    },
    auth_nonce: {
      type: String,
      required: true
    },
    formNonce: {
      type: String,
      required: true
    },
    addYandexSiteConfigNonce: {
      type: String,
      required: true
    },
    removeYandexSiteConfigNonce: {
      type: String,
      required: true
    },
    removeYandexAccountNonce: {
      type: String,
      required: true
    },
    countOfAccountsWithAccess: Number,
    userIsSuperUser: String,
    baseDomain: String,
    baseDomainUrl: String
  },
  components: {
    SearchEngineNavigation: Navigation,
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    Notification: external_CoreHome_["Notification"],
    WebsitesAvailableModal: WebsitesAvailableModal
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"],
    Tooltips: external_CoreHome_["Tooltips"]
  },
  data() {
    return {
      removeAccountConfigName: '',
      removeAccountName: '',
      isAddingMeasurable: false,
      currentSiteToAdd: this.currentSite,
      yandexAccountAndHostIdToAdd: null,
      clientIdToUse: '',
      clientSecretToUse: ''
    };
  },
  methods: {
    accountHasAvailableSites(account) {
      return Object.values(account.urls).some(siteAccess => siteAccess.verified);
    },
    getAvailableWebsites(account) {
      return Object.entries(account.urls).filter(([, siteAccess]) => siteAccess.verified).map(([url]) => url.replaceAll('sc-domain:', '')).sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    },
    getUnverifiedWebsites(account) {
      return Object.entries(account.urls).filter(([, siteAccess]) => !siteAccess.verified).map(([url]) => url.replaceAll('sc-domain:', '')).sort((first, second) => first.localeCompare(second, undefined, {
        sensitivity: 'base'
      }));
    },
    getAdditionalWebsitesLinkLabel(websites) {
      return `+${websites.length - 1}`;
    },
    removeAccountConfig(siteId, event) {
      const siteInfos = this.sitesInfos;
      this.removeAccountConfigName = siteInfos[siteId].name;
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmRemoveAccountConfig, {
        yes() {
          event.target.submit();
        }
      });
    },
    removeAccount(account, event) {
      this.removeAccountName = account.name;
      external_CoreHome_["Matomo"].helper.modalConfirm(this.$refs.confirmDeleteAccount, {
        yes() {
          event.target.submit();
        }
      });
    }
  },
  computed: {
    unverifiedWebsitesModalTitle() {
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_UnverifiedWebsites');
    },
    configuredMeasurablesToDisplay() {
      const entries = Object.entries(this.configuredMeasurables);
      return Object.fromEntries(entries.filter(([, config]) => {
        const [account] = config.yandexAccountAndHostId.split('##');
        return !!this.accounts[account];
      }).map(([siteId, config]) => {
        const [account, host] = config.yandexAccountAndHostId.split('##');
        const accountInfo = this.accounts[account];
        const {
          apiKey
        } = accountInfo;
        const hostUrlPair = Object.entries(accountInfo.urls).find(([, data]) => data.host_id === host);
        const hostUrl = hostUrlPair === null || hostUrlPair === void 0 ? void 0 : hostUrlPair[0];
        return [siteId, Object.assign(Object.assign({}, config), {}, {
          account,
          host,
          hostUrl,
          apiKeyDisplay: getDisplayApiKey(apiKey)
        })];
      }));
    },
    forwardToYandexAuthUrl() {
      return `?${external_CoreHome_["MatomoUrl"].stringify(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        action: 'forwardToYandexAuth'
      }))}`;
    },
    visitOAuthHowTo() {
      const link = Object(external_CoreHome_["externalRawLink"])('https://matomo.org/faq/reports/import-yandex-search-keywords-into-matomo/');
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_VisitOAuthHowTo', `<a target="_blank" href="${link}" rel="noreferrer noopener">`, '</a>', 'Yandex');
    },
    accountsToDisplay() {
      const asArray = Object.entries(this.accounts);
      const filtered = asArray.filter(([, value]) => value.hasAccess);
      return Object.fromEntries(filtered);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=script&lang=ts
 
// EXTERNAL MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=style&index=0&id=2d80ecca&scoped=true&lang=css
var Configurationvue_type_style_index_0_id_2d80ecca_scoped_true_lang_css = __webpack_require__("536a");

// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue





Yandex_Configurationvue_type_script_lang_ts.render = Configurationvue_type_template_id_2d80ecca_scoped_true_render
Yandex_Configurationvue_type_script_lang_ts.__scopeId = "data-v-2d80ecca"

/* harmony default export */ var Yandex_Configuration = (Yandex_Configurationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=template&id=e6144e28

const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_1 = {
  class: "oauthAdvancedConfig"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_2 = {
  class: "form-group row"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_3 = {
  class: "col s12"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_4 = {
  class: "oauth-step-card"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_5 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "oauth-step-number"
}, "1", -1);
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_6 = {
  class: "oauth-step-body"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_7 = {
  class: "oauth-step-title"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_8 = {
  class: "oauth-config-values"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_9 = {
  class: "oauth-config-row"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_10 = {
  class: "oauth-config-label"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_11 = {
  class: "oauth-config-value"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_12 = {
  class: "oauth-config-row"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_13 = {
  class: "oauth-config-label"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_14 = {
  class: "oauth-config-value"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_15 = ["href"];
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_16 = {
  class: "oauth-step-card"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_17 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "oauth-step-number"
}, "2", -1);
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_18 = {
  class: "oauth-step-body"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_19 = {
  class: "oauth-step-title"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_20 = ["innerHTML"];
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_21 = {
  class: "oauth-step-card"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_22 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "oauth-step-number"
}, "3", -1);
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_23 = {
  class: "oauth-step-body"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_24 = {
  class: "oauth-step-title"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_25 = {
  id: "configFileUploadForm",
  action: "",
  method: "POST",
  enctype: "multipart/form-data"
};
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_26 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
  type: "hidden",
  id: "client",
  name: "client"
}, null, -1);
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_27 = ["value"];
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_28 = ["disabled"];
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_29 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-upload"
}, null, -1);
const ConfigureConnectionvue_type_template_id_e6144e28_hoisted_30 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-upload"
}, null, -1);
function ConfigureConnectionvue_type_template_id_e6144e28_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_copy_to_clipboard = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("copy-to-clipboard");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel1')), 1)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_4, [ConfigureConnectionvue_type_template_id_e6144e28_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AdvancedStep1Title')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthExampleText')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_10, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAuthorizedJavaScriptOrigin')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("pre", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_11, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseDomain), 1)])), [[_directive_copy_to_clipboard, {}]])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_12, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_13, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAuthorizedRedirectUri')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("pre", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseUrl) + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.redirectUri), 1)])), [[_directive_copy_to_clipboard, {}]])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    class: "btn",
    href: _ctx.faqUrl,
    target: "_blank",
    rel: "noreferrer noopener"
  }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_StepByStepInstructions')), 9, ConfigureConnectionvue_type_template_id_e6144e28_hoisted_15)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_16, [ConfigureConnectionvue_type_template_id_e6144e28_hoisted_17, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_19, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AdvancedStep2Title')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
    innerHTML: _ctx.$sanitize(_ctx.advancedStep2Desc)
  }, null, 8, ConfigureConnectionvue_type_template_id_e6144e28_hoisted_20)])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_21, [ConfigureConnectionvue_type_template_id_e6144e28_hoisted_22, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h4", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_24, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AdvancedStep3Title')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AdvancedStep3Desc')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", ConfigureConnectionvue_type_template_id_e6144e28_hoisted_25, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    type: "file",
    id: "clientfile",
    name: "clientfile",
    accept: ".json",
    onChange: _cache[0] || (_cache[0] = (...args) => _ctx.processFileChange && _ctx.processFileChange(...args)),
    style: {
      "display": "none"
    }
  }, null, 32), ConfigureConnectionvue_type_template_id_e6144e28_hoisted_26, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    type: "hidden",
    name: "config_nonce",
    value: _ctx.manualConfigNonce
  }, null, 8, ConfigureConnectionvue_type_template_id_e6144e28_hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
    type: "button",
    class: "btn",
    onClick: _cache[1] || (_cache[1] = $event => _ctx.selectConfigFile()),
    disabled: _ctx.isUploadButtonDisabled
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", null, [ConfigureConnectionvue_type_template_id_e6144e28_hoisted_29, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Upload')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isUploadButtonDisabled]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", null, [ConfigureConnectionvue_type_template_id_e6144e28_hoisted_30, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Uploading')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUploadButtonDisabled]])], 8, ConfigureConnectionvue_type_template_id_e6144e28_hoisted_28)])])])]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=template&id=e6144e28

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=script&lang=ts


/* harmony default export */ var ConfigureConnectionvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  directives: {
    CopyToClipboard: external_CoreHome_["CopyToClipboard"]
  },
  data() {
    return {
      redirectUri: '?module=SearchEngineKeywordsPerformance&action=processAuthCode',
      isSelectingFile: false,
      isUploading: false
    };
  },
  props: {
    manualConfigNonce: {
      type: String,
      required: true
    },
    baseDomain: {
      type: String,
      required: true
    },
    baseUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    selectConfigFile() {
      this.isSelectingFile = true;
      const fileInput = document.getElementById('clientfile');
      if (fileInput) {
        fileInput.click();
      }
    },
    processFileChange() {
      const fileInput = document.getElementById('clientfile');
      const configFileUploadForm = document.getElementById('configFileUploadForm');
      if (fileInput && fileInput.value && configFileUploadForm) {
        this.isUploading = true;
        configFileUploadForm.submit();
      }
    },
    checkForCancel() {
      // If we're not in currently selecting a file or if we're uploading, there's no point checking
      if (!this.isSelectingFile || this.isUploading) {
        return;
      }
      // Check if the file is empty and change back from selecting status
      const fileInput = document.getElementById('clientfile');
      if (fileInput && !fileInput.value) {
        this.isSelectingFile = false;
      }
    }
  },
  computed: {
    faqUrl() {
      return Object(external_CoreHome_["externalRawLink"])('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-search-console-and-verify-your-website');
    },
    advancedStep2Desc() {
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_AdvancedStep2Desc', '<strong>', '</strong>');
    },
    isUploadButtonDisabled() {
      return this.isSelectingFile || this.isUploading;
    }
  },
  mounted() {
    document.body.onfocus = this.checkForCancel;
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue



ConfigureConnectionvue_type_script_lang_ts.render = ConfigureConnectionvue_type_template_id_e6144e28_render

/* harmony default export */ var ConfigureConnection = (ConfigureConnectionvue_type_script_lang_ts);
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/index.ts
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
//# sourceMappingURL=SearchEngineKeywordsPerformance.umd.js.map