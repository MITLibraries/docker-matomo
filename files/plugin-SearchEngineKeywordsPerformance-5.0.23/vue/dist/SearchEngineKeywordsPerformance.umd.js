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

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=template&id=6ea8181b

const _hoisted_1 = {
  class: "keywordproviders"
};
const _hoisted_2 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "clear"
}, null, -1);
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Provider = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Provider");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigurationDescription')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ProviderListDescription')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_1, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.providers, provider => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(_component_Provider, {
        key: provider.id,
        provider: provider
      }, null, 8, ["provider"]);
    }), 128)), _hoisted_2])]),
    _: 1
  }, 8, ["content-title"]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=template&id=6ea8181b

// EXTERNAL MODULE: external "CoreHome"
var external_CoreHome_ = __webpack_require__("19dc");

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=template&id=5cbccceb

const Providervue_type_template_id_5cbccceb_hoisted_1 = ["title"];
const Providervue_type_template_id_5cbccceb_hoisted_2 = ["src", "alt"];
const _hoisted_3 = ["innerHTML"];
const _hoisted_4 = ["innerHTML"];
const _hoisted_5 = {
  key: 0,
  class: "experimental"
};
const _hoisted_6 = ["href"];
const _hoisted_7 = {
  key: 0,
  class: "btn"
};
const _hoisted_8 = {
  key: 1,
  class: "btn"
};
function Providervue_type_template_id_5cbccceb_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])({
      keywordprovider: true,
      warning: _ctx.hasWarning,
      configured: !_ctx.hasWarning && _ctx.provider.is_configured
    })
  }, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.provider.logos, (logo, index) => {
    return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
      key: index,
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`logo ${_ctx.provider.logos.length > 1 ? 'double' : ''}`),
      title: _ctx.logoTooltip
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
      src: logo,
      alt: _ctx.provider.name
    }, null, 8, Providervue_type_template_id_5cbccceb_hoisted_2)], 10, Providervue_type_template_id_5cbccceb_hoisted_1);
  }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.provider.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
    innerHTML: _ctx.$sanitize(_ctx.provider.description)
  }, null, 8, _hoisted_3), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("em", {
    innerHTML: _ctx.$sanitize(_ctx.provider.note)
  }, null, 8, _hoisted_4)]), _ctx.provider.is_experimental ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", _hoisted_5, "experimental")) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("a", {
    href: _ctx.configureUrl,
    class: "cta"
  }, [_ctx.provider.is_configured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", _hoisted_7, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ChangeConfiguration')), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", _hoisted_8, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_SetupConfiguration')), 1))], 8, _hoisted_6)], 2);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=template&id=5cbccceb

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=script&lang=ts


/* harmony default export */ var Providervue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    provider: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasWarning() {
      const provider = this.provider;
      return provider.is_configured && (Object.keys(provider.configured_site_ids).length === 0 || Object.keys(provider.problems.sites).length || Object.keys(provider.problems.accounts).length);
    },
    logoTooltip() {
      const provider = this.provider;
      const isConfiguredWithoutSite = provider.is_configured && Object.keys(provider.configured_site_ids).length === 0;
      if (isConfiguredWithoutSite) {
        return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_ConfigAvailableNoWebsiteConfigured');
      }
      if (provider.is_configured) {
        return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_IntegrationConfigured');
      }
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_IntegrationNotConfigured');
    },
    configureUrl() {
      return `?${external_CoreHome_["MatomoUrl"].stringify(Object.assign(Object.assign({}, external_CoreHome_["MatomoUrl"].urlParsed.value), {}, {
        action: `configure${this.provider.id}`
      }))}`;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/Provider.vue



Providervue_type_script_lang_ts.render = Providervue_type_template_id_5cbccceb_render

/* harmony default export */ var Provider = (Providervue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=script&lang=ts



/* harmony default export */ var AdminPagevue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
  props: {
    providers: {
      type: Array,
      required: true
    }
  },
  components: {
    ContentBlock: external_CoreHome_["ContentBlock"],
    Provider: Provider
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Admin/AdminPage.vue



AdminPagevue_type_script_lang_ts.render = render

/* harmony default export */ var AdminPage = (AdminPagevue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=template&id=752192ce

const Configurationvue_type_template_id_752192ce_hoisted_1 = {
  class: "ui-confirm",
  id: "confirmRemoveAccountConfig",
  ref: "confirmRemoveAccountConfig"
};
const Configurationvue_type_template_id_752192ce_hoisted_2 = ["value"];
const Configurationvue_type_template_id_752192ce_hoisted_3 = ["value"];
const Configurationvue_type_template_id_752192ce_hoisted_4 = {
  class: "measurableList"
};
const Configurationvue_type_template_id_752192ce_hoisted_5 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, null, -1);
const Configurationvue_type_template_id_752192ce_hoisted_6 = {
  key: 0
};
const Configurationvue_type_template_id_752192ce_hoisted_7 = {
  colspan: "6"
};
const Configurationvue_type_template_id_752192ce_hoisted_8 = {
  key: 0,
  class: "icon-error"
};
const _hoisted_9 = {
  key: 0,
  class: "icon-error"
};
const _hoisted_10 = ["onSubmit"];
const _hoisted_11 = ["value"];
const _hoisted_12 = ["value"];
const _hoisted_13 = ["title"];
const _hoisted_14 = {
  key: 1
};
const _hoisted_15 = {
  colspan: "6",
  align: "right"
};
const _hoisted_16 = {
  key: 2,
  class: "configureMeasurableForm"
};
const _hoisted_17 = {
  colspan: "2"
};
const _hoisted_18 = {
  class: "bingAccountAndUrlToAdd"
};
const _hoisted_19 = {
  colspan: "3"
};
const _hoisted_20 = {
  action: "",
  method: "post"
};
const _hoisted_21 = ["value"];
const _hoisted_22 = ["value"];
const _hoisted_23 = ["value"];
const _hoisted_24 = ["value"];
const _hoisted_25 = {
  class: "ui-confirm",
  id: "confirmDeleteAccount",
  ref: "confirmDeleteAccount"
};
const _hoisted_26 = ["value"];
const _hoisted_27 = ["value"];
const _hoisted_28 = {
  class: "accounts"
};
const _hoisted_29 = ["innerHTML"];
const _hoisted_30 = {
  key: 0,
  class: "accounterror"
};
const _hoisted_31 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const _hoisted_32 = {
  key: 1
};
const _hoisted_33 = {
  key: 0,
  class: "accounterror"
};
const _hoisted_34 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const _hoisted_35 = {
  key: 1
};
const _hoisted_36 = {
  key: 0
};
const _hoisted_37 = {
  class: "websites-list"
};
const _hoisted_38 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-success"
}, null, -1);
const _hoisted_39 = {
  key: 1
};
const _hoisted_40 = {
  class: "accounterror"
};
const _hoisted_41 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const _hoisted_42 = {
  key: 2
};
const _hoisted_43 = {
  class: "websites-list"
};
const _hoisted_44 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-error"
}, null, -1);
const _hoisted_45 = {
  class: "cta"
};
const _hoisted_46 = ["onSubmit"];
const _hoisted_47 = ["value"];
const _hoisted_48 = ["value"];
const _hoisted_49 = {
  type: "submit",
  class: "btn"
};
const _hoisted_50 = {
  method: "POST",
  action: ""
};
const _hoisted_51 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "icon-add logo"
}, null, -1);
const _hoisted_52 = ["innerHTML"];
const _hoisted_53 = {
  key: 0,
  class: "accounterror"
};
const _hoisted_54 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const _hoisted_55 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const _hoisted_56 = ["value"];
const _hoisted_57 = {
  class: "cta"
};
const _hoisted_58 = {
  type: "submit",
  class: "btn"
};
const _hoisted_59 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "clear"
}, null, -1);
function Configurationvue_type_template_id_752192ce_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingConfigurationTitle')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingConfigurationDescription')), 1)]),
    _: 1
  }, 8, ["content-title"]), Object.keys(_ctx.accounts).length > 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`websiteconfiguration ${Object.keys(_ctx.configuredMeasurables).length ? 'configured' : ''}`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_752192ce_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigRemovalConfirm', _ctx.removeAccountConfigName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_752192ce_hoisted_2), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_752192ce_hoisted_3)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_752192ce_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Measurable')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Mobile_Account')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_LastImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CreatedBy')), 1), Configurationvue_type_template_id_752192ce_hoisted_5])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [!Object.keys(_ctx.configuredMeasurables).length ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_752192ce_hoisted_6, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_752192ce_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured')), 1)])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.configuredMeasurablesToDisplay, (config, siteId, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: index,
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(!_ctx.sitesInfos[siteId].accountValid || !_ctx.sitesInfos[siteId].urlValid ? 'error' : '')
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].name) + " ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", null, "(" + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].main_url) + ")", 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].accountValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_752192ce_hoisted_8)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.apiKeyDisplay), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].urlValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", _hoisted_9)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.url), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].lastRun), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.createdByUser), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccountConfig(siteId, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeConfig",
        value: siteId
      }, null, 8, _hoisted_11), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeSiteConfigNonce",
        value: _ctx.removeBingSiteConfigNonce
      }, null, 8, _hoisted_12), config.isDeletionAllowed ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
        key: 0,
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, _hoisted_13)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 40, _hoisted_10)])], 2);
    }), 128)), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", _hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
      class: "btn",
      onClick: _cache[0] || (_cache[0] = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.isAddingMeasurable = true, ["prevent"]))
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddConfiguration')), 1)])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", _hoisted_16, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "site",
      modelValue: _ctx.currentSiteToAdd,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.currentSiteToAdd = $event),
      title: _ctx.translate('CoreHome_ChooseX', _ctx.translate('General_Measurable'))
    }, null, 8, ["modelValue", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      modelValue: _ctx.bingAccountAndUrlToAdd,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.bingAccountAndUrlToAdd = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_UrlOfAccount'),
      options: _ctx.urlOptions
    }, null, 8, ["modelValue", "title", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", _hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", _hoisted_20, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "bingSiteId",
      value: _ctx.currentSiteToAdd.id
    }, null, 8, _hoisted_21), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "addSiteConfigNonce",
      value: _ctx.addBingSiteConfigNonce
    }, null, 8, _hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "bingAccountAndUrl",
      value: _ctx.bingAccountAndUrlToAdd
    }, null, 8, _hoisted_23), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "submit",
      class: "btn",
      value: _ctx.translate('General_Save')
    }, null, 8, _hoisted_24)])])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])), [[_directive_content_table]])])]),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`accountconfiguration ${Object.keys(_ctx.accounts).length > 0 ? 'configured' : ''}`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ManageAPIKeys')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_25, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountRemovalConfirm', _ctx.removeAccountName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, _hoisted_26), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, _hoisted_27)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_28, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.accountsToDisplay, account => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        key: account.username,
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`account ${Object.keys(account.urls).length === 0 || typeof account.hasError === 'string' ? 'invalid' : ''}`)
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`icon-${Object.keys(account.urls).length === 0 || typeof account.hasError === 'string' ? 'warning' : 'success'} logo`)
      }, null, 2), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.getDisplayApiKey(account.apiKey)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
        innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_AccountAddedBy', account.username, account.created_formatted))
      }, null, 8, _hoisted_29), typeof account.hasError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", _hoisted_30, [_hoisted_31, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingAccountError', account.hasError)), 1)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_32, [Object.keys(account.urls).length === 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", _hoisted_33, [_hoisted_34, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccess')), 1)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_35, [Object.values(account.urls).some(isVerified => isVerified) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_36, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AvailableSites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", _hoisted_37, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(Object.entries(account.urls).filter(([, isVerified]) => isVerified), ([url], index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: index
        }, [_hoisted_38, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(url), 1)]);
      }), 128))])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_39, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", _hoisted_40, [_hoisted_41, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccess')), 1)])])), Object.values(account.urls).some(isVerified => !isVerified) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_42, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_UnverifiedSites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", _hoisted_43, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(Object.entries(account.urls).filter(([, isVerified]) => !isVerified), ([url], index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: index
        }, [_hoisted_44, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(url), 1)]);
      }), 128))])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]))])), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_45, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccount(account, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "remove",
        value: account.apiKey
      }, null, 8, _hoisted_47), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeAccountNonce",
        value: _ctx.removeBingAccountNonce
      }, null, 8, _hoisted_48), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_49, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Remove')), 1)], 40, _hoisted_46)])], 2);
    }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
      class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`account add ${_ctx.hasApiKeyError ? 'invalid' : ''}`)
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", _hoisted_50, [_hoisted_51, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddAPIKey')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
      innerHTML: _ctx.$sanitize(_ctx.bingApiKeyInstructionText)
    }, null, 8, _hoisted_52), _ctx.hasApiKeyError ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", _hoisted_53, [_hoisted_54, _hoisted_55, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_BingAccountError', _ctx.error)), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
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
    }, null, 8, _hoisted_56), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_57, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_58, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddAPIKey')), 1)])])], 2), _hoisted_59])]),
    _: 1
  }, 8, ["content-title"])], 2)]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=template&id=752192ce

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
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"]
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
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
    }
  },
  computed: {
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
      const url = Object(external_CoreHome_["externalRawLink"])('https://matomo.org/faq/reports/import-bing-and-yahoo-search-keywords-into-matomo/');
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_BingAPIKeyInstruction', '<a href="https://www.bing.com/webmasters" target="_new" rel="noreferrer noopener">', '</a>', `<a href="${url}" target="_blank" rel="noreferrer noopener">`, '</a>');
    },
    accountsToDisplay() {
      const asArray = Object.entries(this.accounts);
      const filtered = asArray.filter(([, value]) => value.hasAccess);
      return Object.fromEntries(filtered);
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Bing/Configuration.vue



Configurationvue_type_script_lang_ts.render = Configurationvue_type_template_id_752192ce_render

/* harmony default export */ var Configuration = (Configurationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=template&id=f24fe118

const Configurationvue_type_template_id_f24fe118_hoisted_1 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_2 = {
  class: "alert alert-warning"
};
const Configurationvue_type_template_id_f24fe118_hoisted_3 = {
  key: 1
};
const Configurationvue_type_template_id_f24fe118_hoisted_4 = {
  class: "ui-confirm",
  id: "confirmRemoveAccountConfig",
  ref: "confirmRemoveAccountConfig"
};
const Configurationvue_type_template_id_f24fe118_hoisted_5 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_6 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_7 = {
  class: "measurableList"
};
const Configurationvue_type_template_id_f24fe118_hoisted_8 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_9 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_10 = {
  colspan: "7"
};
const Configurationvue_type_template_id_f24fe118_hoisted_11 = ["innerHTML"];
const Configurationvue_type_template_id_f24fe118_hoisted_12 = {
  key: 0,
  class: "icon-error"
};
const Configurationvue_type_template_id_f24fe118_hoisted_13 = {
  key: 0,
  class: "icon-error"
};
const Configurationvue_type_template_id_f24fe118_hoisted_14 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_15 = ["title"];
const Configurationvue_type_template_id_f24fe118_hoisted_16 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-info"
}, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_17 = ["title"];
const Configurationvue_type_template_id_f24fe118_hoisted_18 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-info"
}, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_19 = ["onSubmit"];
const Configurationvue_type_template_id_f24fe118_hoisted_20 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_21 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_22 = ["title"];
const Configurationvue_type_template_id_f24fe118_hoisted_23 = {
  key: 1,
  class: "configureMeasurableForm"
};
const Configurationvue_type_template_id_f24fe118_hoisted_24 = {
  class: "account-select"
};
const Configurationvue_type_template_id_f24fe118_hoisted_25 = {
  colspan: "4"
};
const Configurationvue_type_template_id_f24fe118_hoisted_26 = {
  action: "",
  method: "post"
};
const Configurationvue_type_template_id_f24fe118_hoisted_27 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_28 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_29 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_30 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_31 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_32 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_33 = {
  key: 2,
  class: "oauthconfiguration"
};
const Configurationvue_type_template_id_f24fe118_hoisted_34 = {
  class: "section-heading"
};
const Configurationvue_type_template_id_f24fe118_hoisted_35 = {
  class: "ui-confirm",
  id: "confirmDeleteAccount",
  ref: "confirmDeleteAccount"
};
const Configurationvue_type_template_id_f24fe118_hoisted_36 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_37 = ["value"];
const Configurationvue_type_template_id_f24fe118_hoisted_38 = {
  class: "oauthconfigoptions"
};
const Configurationvue_type_template_id_f24fe118_hoisted_39 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_40 = {
  key: 1
};
const Configurationvue_type_template_id_f24fe118_hoisted_41 = {
  key: 2
};
const Configurationvue_type_template_id_f24fe118_hoisted_42 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_43 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_44 = {
  class: "accounts"
};
const Configurationvue_type_template_id_f24fe118_hoisted_45 = {
  class: "logo"
};
const Configurationvue_type_template_id_f24fe118_hoisted_46 = ["src"];
const Configurationvue_type_template_id_f24fe118_hoisted_47 = ["innerHTML"];
const Configurationvue_type_template_id_f24fe118_hoisted_48 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_49 = {
  class: "accounterror"
};
const Configurationvue_type_template_id_f24fe118_hoisted_50 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_51 = {
  key: 1
};
const Configurationvue_type_template_id_f24fe118_hoisted_52 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_53 = {
  class: "accounterror"
};
const Configurationvue_type_template_id_f24fe118_hoisted_54 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_55 = {
  key: 1
};
const Configurationvue_type_template_id_f24fe118_hoisted_56 = {
  key: 0
};
const Configurationvue_type_template_id_f24fe118_hoisted_57 = {
  class: "websites-list"
};
const Configurationvue_type_template_id_f24fe118_hoisted_58 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-success"
}, null, -1);
const Configurationvue_type_template_id_f24fe118_hoisted_59 = {
  key: 1,
  class: "accounterror"
};
const _hoisted_60 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const _hoisted_61 = {
  key: 2
};
const _hoisted_62 = {
  class: "websites-list"
};
const _hoisted_63 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-error"
}, null, -1);
const _hoisted_64 = {
  class: "cta"
};
const _hoisted_65 = ["onSubmit"];
const _hoisted_66 = ["value"];
const _hoisted_67 = ["value"];
const _hoisted_68 = {
  type: "submit",
  class: "btn"
};
const _hoisted_69 = {
  class: "account add"
};
const _hoisted_70 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "icon-add logo"
}, null, -1);
const _hoisted_71 = ["innerHTML"];
const _hoisted_72 = ["innerHTML"];
const _hoisted_73 = ["innerHTML"];
const _hoisted_74 = {
  class: "cta"
};
const _hoisted_75 = ["action"];
const _hoisted_76 = ["value"];
const _hoisted_77 = {
  type: "submit",
  class: "btn"
};
const _hoisted_78 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "clear"
}, null, -1);
const _hoisted_79 = {
  key: 3,
  class: "clientconfiguration"
};
const _hoisted_80 = {
  class: "section-heading"
};
const _hoisted_81 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const _hoisted_82 = ["action"];
const _hoisted_83 = ["value"];
const _hoisted_84 = {
  type: "submit",
  class: "btn"
};
const _hoisted_85 = {
  key: 4
};
function Configurationvue_type_template_id_f24fe118_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_Notification = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Notification");
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [!_ctx.isClientConfigured && _ctx.isClientConfigurable && !_ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_2, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GooglePendingConfigurationErrorMessage')), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured && _ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_3, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigRemovalConfirm', _ctx.removeAccountConfigName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_5), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_6)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_f24fe118_hoisted_7, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Measurable')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_EnabledSearchTypes')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Mobile_Account')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_LastImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CreatedBy')), 1), Configurationvue_type_template_id_f24fe118_hoisted_8])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [Object.keys(_ctx.configuredMeasurablesToDisplay).length === 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_f24fe118_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_f24fe118_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_NoWebsiteConfigured')), 1)])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.configuredMeasurablesToDisplay, (config, siteId, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
        key: index,
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(!_ctx.sitesInfos[siteId].accountValid || !_ctx.sitesInfos[siteId].urlValid ? 'error' : '')
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
        innerHTML: _ctx.$sanitize(_ctx.sitesInfos[siteId].name)
      }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_11), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleWebKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeWeb') : '') + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleImageKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeImage') : '') + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleVideoKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeVideo') : '') + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.googleNewsKeywords ? _ctx.translate('SearchEngineKeywordsPerformance_KeywordTypeNews') : ''), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].accountValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_f24fe118_hoisted_12)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.accounts[config.account].name), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].urlValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_f24fe118_hoisted_13)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.url.replaceAll('sc-domain:', '')) + " ", 1), Configurationvue_type_template_id_f24fe118_hoisted_14, /^sc-domain:/.test(config.url) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 1,
        class: "property-type",
        title: _ctx.translate('SearchEngineKeywordsPerformance_DomainPropertyInfo')
      }, [Configurationvue_type_template_id_f24fe118_hoisted_16, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" (" + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_DomainProperty')) + ") ", 1)], 8, Configurationvue_type_template_id_f24fe118_hoisted_15)) : /^http/.test(config.url) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", {
        key: 2,
        class: "property-type",
        title: _ctx.translate('SearchEngineKeywordsPerformance_URLPrefixPropertyInfo')
      }, [Configurationvue_type_template_id_f24fe118_hoisted_18, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" (" + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_URLPrefixProperty')) + ") ", 1)], 8, Configurationvue_type_template_id_f24fe118_hoisted_17)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].lastRun), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.createdByUser), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccountConfig(siteId, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeConfig",
        value: siteId
      }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_20), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeSiteConfigNonce",
        value: _ctx.removeGoogleSiteConfigNonce
      }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_21), config.isDeletionAllowed ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
        key: 0,
        type: "submit",
        class: "btn-flat icon-delete",
        title: _ctx.translate('General_Delete')
      }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_22)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 40, Configurationvue_type_template_id_f24fe118_hoisted_19)])], 2);
    }), 128)), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_f24fe118_hoisted_23, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
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
    }, null, 8, ["modelValue", "options"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_24, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
      uicontrol: "select",
      modelValue: _ctx.googleAccountAndUrlToAdd,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.googleAccountAndUrlToAdd = $event),
      title: _ctx.translate('SearchEngineKeywordsPerformance_UrlOfAccount'),
      "full-width": true,
      options: _ctx.urlOptions
    }, null, 8, ["modelValue", "title", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_f24fe118_hoisted_25, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", Configurationvue_type_template_id_f24fe118_hoisted_26, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "googleSiteId",
      value: _ctx.currentSiteToAdd.id
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_27), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "addSiteConfigNonce",
      value: _ctx.addGoogleSiteConfigNonce
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_28), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "googleAccountAndUrl",
      value: _ctx.googleAccountAndUrlToAdd
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_29), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "googleTypes",
      value: _ctx.googleTypesToAdd.length ? _ctx.googleTypesToAdd : 'web'
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_30), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "submit",
      class: "btn",
      value: _ctx.translate('General_Save')
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_31)])])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])), [[_directive_content_table]]), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_32, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
      id: "addWebsiteBtn",
      class: "btn",
      onClick: _cache[3] || (_cache[3] = $event => _ctx.isAddingMeasurable = true)
    }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddConfiguration')), 1)], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_33, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", Configurationvue_type_template_id_f24fe118_hoisted_34, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectGoogleAccounts')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_35, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountRemovalConfirm', _ctx.removeAccountName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_36), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_37)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_38, [_ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_f24fe118_hoisted_39, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts', _ctx.countOfAccountsWithAccess)), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_f24fe118_hoisted_40, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectFirstAccount')), 1)), _ctx.hasOAuthError ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_f24fe118_hoisted_41, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Notification, {
      context: "error",
      type: "transient"
    }, {
      default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthError')) + " ", 1), _ctx.hasOAuthError.length > 5 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_f24fe118_hoisted_42, [Configurationvue_type_template_id_f24fe118_hoisted_43, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.hasOAuthError), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
      _: 1
    })])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_44, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.accountsToDisplay, (account, accountId) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        key: accountId,
        class: "account"
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_f24fe118_hoisted_45, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
        src: account.picture
      }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_46)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
        innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_AccountAddedBy', account.username, account.created_formatted))
      }, null, 8, Configurationvue_type_template_id_f24fe118_hoisted_47), typeof account.hasError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_48, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Configurationvue_type_template_id_f24fe118_hoisted_49, [Configurationvue_type_template_id_f24fe118_hoisted_50, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountConnectionValidationError')) + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.hasError), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ReAddAccountIfPermanentError')), 1)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_51, [Object.keys(account.urls).length === 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_52, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Configurationvue_type_template_id_f24fe118_hoisted_53, [Configurationvue_type_template_id_f24fe118_hoisted_54, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccess')), 1)])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_55, [_ctx.accountHasAvailableSites(account) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_f24fe118_hoisted_56, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AvailableSites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", Configurationvue_type_template_id_f24fe118_hoisted_57, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(Object.entries(account.urls).filter(([, level]) => level !== 'siteUnverifiedUser'), ([url], index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: index
        }, [Configurationvue_type_template_id_f24fe118_hoisted_58, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(url.replaceAll('sc-domain:', '')), 1)]);
      }), 128))])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_f24fe118_hoisted_59, [_hoisted_60, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccess')), 1)])), Object.values(account.urls).indexOf('siteUnverifiedUser') !== -1 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_61, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_UnverifiedSites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", _hoisted_62, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(Object.entries(account.urls).filter(([, accessLevel]) => accessLevel === 'siteUnverifiedUser'), ([url], index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: index
        }, [_hoisted_63, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(url.replaceAll('sc-domain:', '')), 1)]);
      }), 128))])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]))])), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_64, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccount(account, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "remove",
        value: accountId
      }, null, 8, _hoisted_66), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeAccountNonce",
        value: _ctx.removeGoogleAccountNonce
      }, null, 8, _hoisted_67), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_68, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Remove')), 1)], 40, _hoisted_65)])]);
    }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_69, [_hoisted_70, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccount')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccountDescription', 'Google')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_RequiredAccessTypes')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", {
      innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAccountAccessTypeSearchConsoleData'))
    }, null, 8, _hoisted_71), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", {
      innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAccountAccessTypeProfileInfo'))
    }, null, 8, _hoisted_72), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("li", {
      innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAccountAccessTypeOfflineAccess'))
    }, null, 8, _hoisted_73)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", _hoisted_74, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      method: "post",
      action: _ctx.forwardToAuthUrl,
      id: "clientauthform"
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "auth_nonce",
      value: _ctx.authNonce
    }, null, 8, _hoisted_76), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_77, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_StartOAuth')), 1)], 8, _hoisted_75)])]), _hoisted_78])])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigurable && _ctx.isClientConfigured && _ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_79, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", _hoisted_80, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthClientConfig')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientId')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientId), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientSecret')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientSecret), 1)]), _hoisted_81, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      action: _ctx.removeConfigUrl,
      method: "POST",
      enctype: "multipart/form-data",
      id: "removeConfigForm"
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_DeleteUploadedClientConfig')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "config_nonce",
      value: _ctx.formNonce
    }, null, 8, _hoisted_83), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", _hoisted_84, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Remove')), 1)], 8, _hoisted_82)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", _hoisted_85, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.componentExtensions, (refComponent, index) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        key: index
      }, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createBlock"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDynamicComponent"])(refComponent), {
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
        "connected-with": _ctx.configConnectProps.connectedWith
      }, null, 8, ["manual-config-nonce", "base-domain", "base-url", "manual-action-url", "primary-text", "radio-options", "manual-config-text", "connect-accounts-url", "connect-accounts-btn-text", "auth-url", "unlink-url", "strategy", "connected-with"]))]);
    }), 128))])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
    _: 1
  }, 8, ["content-title"])]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=template&id=f24fe118

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
    Notification: external_CoreHome_["Notification"]
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
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
    }
  },
  computed: {
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
    visitOAuthHowTo() {
      const link = Object(external_CoreHome_["externalRawLink"])('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-oauth-client-config');
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_VisitOAuthHowTo', `<a target="_blank" href="${link}" rel="noreferrer noopener">`, '</a>', 'Google');
    },
    componentExtensions() {
      const entries = this.extensions;
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["markRaw"])(entries.map(ref => Object(external_CoreHome_["useExternalPluginComponent"])(ref.plugin, ref.component)));
    },
    configConnectProps() {
      return this.configureConnectionProps;
    }
  }
}));
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue?vue&type=script&lang=ts
 
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Google/Configuration.vue



Google_Configurationvue_type_script_lang_ts.render = Configurationvue_type_template_id_f24fe118_render

/* harmony default export */ var Google_Configuration = (Google_Configurationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=template&id=a80179ac

const Configurationvue_type_template_id_a80179ac_hoisted_1 = {
  class: "ui-confirm",
  id: "confirmRemoveAccountConfig",
  ref: "confirmRemoveAccountConfig"
};
const Configurationvue_type_template_id_a80179ac_hoisted_2 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_3 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_4 = {
  class: "measurableList"
};
const Configurationvue_type_template_id_a80179ac_hoisted_5 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_6 = ["innerHTML"];
const Configurationvue_type_template_id_a80179ac_hoisted_7 = {
  key: 0,
  class: "icon-error"
};
const Configurationvue_type_template_id_a80179ac_hoisted_8 = {
  key: 0,
  class: "icon-error"
};
const Configurationvue_type_template_id_a80179ac_hoisted_9 = ["onSubmit"];
const Configurationvue_type_template_id_a80179ac_hoisted_10 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_11 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_12 = ["title"];
const Configurationvue_type_template_id_a80179ac_hoisted_13 = {
  key: 0
};
const Configurationvue_type_template_id_a80179ac_hoisted_14 = {
  colspan: "6",
  align: "right"
};
const Configurationvue_type_template_id_a80179ac_hoisted_15 = {
  key: 1,
  class: "configureMeasurableForm"
};
const Configurationvue_type_template_id_a80179ac_hoisted_16 = {
  colspan: "2"
};
const Configurationvue_type_template_id_a80179ac_hoisted_17 = {
  class: "account-select"
};
const Configurationvue_type_template_id_a80179ac_hoisted_18 = {
  colspan: "3"
};
const Configurationvue_type_template_id_a80179ac_hoisted_19 = {
  action: "",
  method: "post"
};
const Configurationvue_type_template_id_a80179ac_hoisted_20 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_21 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_22 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_23 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_24 = {
  class: "ui-confirm",
  id: "confirmDeleteAccount",
  ref: "confirmDeleteAccount"
};
const Configurationvue_type_template_id_a80179ac_hoisted_25 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_26 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_27 = {
  class: "oauthconfigoptions"
};
const Configurationvue_type_template_id_a80179ac_hoisted_28 = {
  key: 0
};
const Configurationvue_type_template_id_a80179ac_hoisted_29 = {
  key: 1
};
const Configurationvue_type_template_id_a80179ac_hoisted_30 = {
  key: 2
};
const Configurationvue_type_template_id_a80179ac_hoisted_31 = {
  key: 0
};
const Configurationvue_type_template_id_a80179ac_hoisted_32 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_33 = {
  class: "accounts"
};
const Configurationvue_type_template_id_a80179ac_hoisted_34 = {
  class: "logo"
};
const Configurationvue_type_template_id_a80179ac_hoisted_35 = ["src"];
const Configurationvue_type_template_id_a80179ac_hoisted_36 = ["innerHTML"];
const Configurationvue_type_template_id_a80179ac_hoisted_37 = {
  key: 0
};
const Configurationvue_type_template_id_a80179ac_hoisted_38 = {
  class: "accounterror"
};
const Configurationvue_type_template_id_a80179ac_hoisted_39 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_40 = {
  key: 1
};
const Configurationvue_type_template_id_a80179ac_hoisted_41 = {
  key: 0,
  class: "accounterror"
};
const Configurationvue_type_template_id_a80179ac_hoisted_42 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_43 = {
  key: 1
};
const Configurationvue_type_template_id_a80179ac_hoisted_44 = {
  key: 0
};
const Configurationvue_type_template_id_a80179ac_hoisted_45 = {
  class: "websites-list"
};
const Configurationvue_type_template_id_a80179ac_hoisted_46 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-success"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_47 = {
  key: 1,
  class: "accounterror"
};
const Configurationvue_type_template_id_a80179ac_hoisted_48 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_49 = {
  key: 2
};
const Configurationvue_type_template_id_a80179ac_hoisted_50 = {
  class: "websites-list"
};
const Configurationvue_type_template_id_a80179ac_hoisted_51 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-error"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_52 = {
  key: 2,
  class: "accounterror"
};
const Configurationvue_type_template_id_a80179ac_hoisted_53 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_54 = {
  key: 3,
  class: "accounterror"
};
const Configurationvue_type_template_id_a80179ac_hoisted_55 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-warning"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_56 = ["innerHTML"];
const Configurationvue_type_template_id_a80179ac_hoisted_57 = ["innerHTML"];
const Configurationvue_type_template_id_a80179ac_hoisted_58 = {
  class: "cta"
};
const Configurationvue_type_template_id_a80179ac_hoisted_59 = ["action"];
const Configurationvue_type_template_id_a80179ac_hoisted_60 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_61 = {
  type: "submit",
  class: "btn"
};
const Configurationvue_type_template_id_a80179ac_hoisted_62 = ["onSubmit"];
const Configurationvue_type_template_id_a80179ac_hoisted_63 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_64 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_65 = {
  type: "submit",
  class: "btn"
};
const Configurationvue_type_template_id_a80179ac_hoisted_66 = {
  class: "account add"
};
const Configurationvue_type_template_id_a80179ac_hoisted_67 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "icon-add logo"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_68 = {
  class: "cta"
};
const Configurationvue_type_template_id_a80179ac_hoisted_69 = ["action"];
const Configurationvue_type_template_id_a80179ac_hoisted_70 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_71 = {
  type: "submit",
  class: "btn"
};
const Configurationvue_type_template_id_a80179ac_hoisted_72 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", {
  class: "clear"
}, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_73 = {
  key: 3,
  class: "clientconfighelp"
};
const Configurationvue_type_template_id_a80179ac_hoisted_74 = ["innerHTML"];
const Configurationvue_type_template_id_a80179ac_hoisted_75 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_76 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const Configurationvue_type_template_id_a80179ac_hoisted_77 = {
  method: "post",
  action: "",
  id: "clientconfigform"
};
const Configurationvue_type_template_id_a80179ac_hoisted_78 = ["value"];
const Configurationvue_type_template_id_a80179ac_hoisted_79 = {
  type: "submit",
  class: "btn"
};
function Configurationvue_type_template_id_a80179ac_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ContentBlock = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("ContentBlock");
  const _component_Field = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Field");
  const _component_Notification = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])("Notification");
  const _directive_content_table = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveDirective"])("content-table");
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_SearchEngineKeywordsPerformance')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexConfigurationTitle')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexConfigurationDescription')), 1)]),
    _: 1
  }, 8, ["content-title"]), _ctx.isClientConfigured && _ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 0,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(Object.keys(_ctx.configuredMeasurables).length ? 'configured' : '')
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurables')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => {
      var _ctx$currentSiteToAdd;
      return [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureMeasurableBelow')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigRemovalConfirm', _ctx.removeAccountConfigName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "yes",
        type: "button",
        value: _ctx.translate('General_Yes')
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_2), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        role: "no",
        type: "button",
        value: _ctx.translate('General_No')
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_3)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("table", Configurationvue_type_template_id_a80179ac_hoisted_4, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("thead", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tr", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Measurable')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Mobile_Account')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('Goals_URL')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_LastImport')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("th", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CreatedBy')), 1), Configurationvue_type_template_id_a80179ac_hoisted_5])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("tbody", null, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.configuredMeasurablesToDisplay, (config, siteId, index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", {
          key: index,
          class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(!_ctx.sitesInfos[siteId].accountValid || !_ctx.sitesInfos[siteId].urlValid ? 'error' : '')
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", {
          innerHTML: _ctx.$sanitize(_ctx.sitesInfos[siteId].name)
        }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_6), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].accountValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_a80179ac_hoisted_7)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.accounts[config.account].name), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [!_ctx.sitesInfos[siteId].urlValid ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_a80179ac_hoisted_8)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.hostUrl || config.host), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.sitesInfos[siteId].lastRun), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(config.createdByUser), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
          method: "POST",
          action: "",
          onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccountConfig(siteId, $event), ["prevent"])
        }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
          type: "hidden",
          name: "removeConfig",
          value: siteId
        }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_10), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
          type: "hidden",
          name: "removeSiteConfigNonce",
          value: _ctx.removeYandexSiteConfigNonce
        }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_11), config.isDeletionAllowed ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("button", {
          key: 0,
          type: "submit",
          class: "btn-flat icon-delete",
          title: _ctx.translate('General_Delete')
        }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_12)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)], 40, Configurationvue_type_template_id_a80179ac_hoisted_9)])], 2);
      }), 128)), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_a80179ac_hoisted_13, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_a80179ac_hoisted_14, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
        class: "btn",
        onClick: _cache[0] || (_cache[0] = $event => _ctx.isAddingMeasurable = true)
      }, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AddConfiguration')), 1)])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.countOfAccountsWithAccess ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])((Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("tr", Configurationvue_type_template_id_a80179ac_hoisted_15, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "site",
        "full-width": true,
        modelValue: _ctx.currentSiteToAdd,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.currentSiteToAdd = $event),
        title: _ctx.translate('CoreHome_ChooseX', _ctx.translate('General_Measurable'))
      }, null, 8, ["modelValue", "title"])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_a80179ac_hoisted_16, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_17, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
        uicontrol: "select",
        modelValue: _ctx.yandexAccountAndHostIdToAdd,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.yandexAccountAndHostIdToAdd = $event),
        title: _ctx.translate('SearchEngineKeywordsPerformance_UrlOfAccount'),
        "full-width": true,
        options: _ctx.urlOptions
      }, null, 8, ["modelValue", "title", "options"])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("td", Configurationvue_type_template_id_a80179ac_hoisted_18, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", Configurationvue_type_template_id_a80179ac_hoisted_19, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "yandexSiteId",
        value: (_ctx$currentSiteToAdd = _ctx.currentSiteToAdd) === null || _ctx$currentSiteToAdd === void 0 ? void 0 : _ctx$currentSiteToAdd.id
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_20), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "addSiteConfigNonce",
        value: _ctx.addYandexSiteConfigNonce
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_21), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "yandexAccountAndHostId",
        value: _ctx.yandexAccountAndHostIdToAdd
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_22), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "submit",
        class: "btn",
        value: _ctx.translate('General_Save')
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_23)])])], 512)), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isAddingMeasurable]]) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)])])), [[_directive_content_table]])];
    }),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 1,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`oauthconfiguration ${_ctx.isOAuthConfigured ? 'configured' : ''} yandex`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_ConnectYandexAccounts')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_24, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h2", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountRemovalConfirm', _ctx.removeAccountName)), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "yes",
      type: "button",
      value: _ctx.translate('General_Yes')
    }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_25), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      role: "no",
      type: "button",
      value: _ctx.translate('General_No')
    }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_26)], 512), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_27, [_ctx.isOAuthConfigured ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_28, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_CurrentlyConnectedAccounts', _ctx.countOfAccountsWithAccess)), 1)) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_29, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectFirstAccount')), 1)), _ctx.hasOAuthError ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_30, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Notification, {
      context: "error"
    }, {
      default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthError')) + " ", 1), typeof _ctx.hasOAuthError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("span", Configurationvue_type_template_id_a80179ac_hoisted_31, [Configurationvue_type_template_id_a80179ac_hoisted_32, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.hasOAuthError), 1)])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]),
      _: 1
    })])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_33, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(_ctx.accountsToDisplay, (account, accountId) => {
      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
        key: accountId,
        class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`account ${Object.keys(account.urls).length === 0 || typeof account.hasError === 'string' ? 'invalid' : ''}`)
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_34, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("img", {
        src: account.picture
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_35)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.name), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
        innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_AccountAddedBy', account.username, account.created_formatted))
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_36), typeof account.hasError === 'string' ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_a80179ac_hoisted_37, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", Configurationvue_type_template_id_a80179ac_hoisted_38, [Configurationvue_type_template_id_a80179ac_hoisted_39, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountConnectionValidationError')) + " " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(account.hasError), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ReAuthenticateIfPermanentError')), 1)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_a80179ac_hoisted_40, [Object.keys(account.urls).length === 0 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_41, [Configurationvue_type_template_id_a80179ac_hoisted_42, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccess')), 1)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_a80179ac_hoisted_43, [Object.values(account.urls).some(hostdata => hostdata.verified) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_a80179ac_hoisted_44, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AvailableSites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", Configurationvue_type_template_id_a80179ac_hoisted_45, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(Object.entries(account.urls).filter(([, hostdata]) => hostdata.verified), ([url], index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: index
        }, [Configurationvue_type_template_id_a80179ac_hoisted_46, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(url), 1)]);
      }), 128))])])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_47, [Configurationvue_type_template_id_a80179ac_hoisted_48, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_AccountNoAccess')), 1)])), Object.values(account.urls).some(hostdata => !hostdata.verified) ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_a80179ac_hoisted_49, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_UnverifiedSites')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("ul", Configurationvue_type_template_id_a80179ac_hoisted_50, [(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(true), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["renderList"])(Object.entries(account.urls).filter(([, hostdata]) => !hostdata.verified), ([url], index) => {
        return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("li", {
          key: index
        }, [Configurationvue_type_template_id_a80179ac_hoisted_51, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(url), 1)]);
      }), 128))])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]))])), account.authDaysAgo >= 180 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_52, [Configurationvue_type_template_id_a80179ac_hoisted_53, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthAccessTimedOut')), 1)])) : account.authDaysAgo >= 150 ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", Configurationvue_type_template_id_a80179ac_hoisted_54, [Configurationvue_type_template_id_a80179ac_hoisted_55, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
        innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_OAuthAccessWillTimeOutSoon', 180 - account.authDaysAgo))
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_56)])) : (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("p", {
        key: 4,
        innerHTML: _ctx.$sanitize(_ctx.translate('SearchEngineKeywordsPerformance_OAuthAccessWillTimeOut', 180, 180 - account.authDaysAgo))
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_57)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_58, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "post",
        action: _ctx.forwardToYandexAuthUrl
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "auth_nonce",
        value: _ctx.auth_nonce
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_60), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", Configurationvue_type_template_id_a80179ac_hoisted_61, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Reauthenticate')), 1)], 8, Configurationvue_type_template_id_a80179ac_hoisted_59), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
        method: "POST",
        action: "",
        onSubmit: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withModifiers"])($event => _ctx.removeAccount(account, $event), ["prevent"])
      }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "remove",
        value: accountId
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_63), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
        type: "hidden",
        name: "removeAccountNonce",
        value: _ctx.removeYandexAccountNonce
      }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_64), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", Configurationvue_type_template_id_a80179ac_hoisted_65, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Remove')), 1)], 40, Configurationvue_type_template_id_a80179ac_hoisted_62)])], 2);
    }), 128)), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_66, [Configurationvue_type_template_id_a80179ac_hoisted_67, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("h3", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccount')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccountDescription', 'Yandex')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConnectAccountYandex', '180')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", Configurationvue_type_template_id_a80179ac_hoisted_68, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", {
      method: "post",
      action: _ctx.forwardToYandexAuthUrl,
      id: "clientauthform"
    }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
      type: "hidden",
      name: "auth_nonce",
      value: _ctx.auth_nonce
    }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_70), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", Configurationvue_type_template_id_a80179ac_hoisted_71, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_StartOAuth')), 1)], 8, Configurationvue_type_template_id_a80179ac_hoisted_69)])]), Configurationvue_type_template_id_a80179ac_hoisted_72])])]),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.isClientConfigured && _ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 2,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(`clientconfiguration ${_ctx.isClientConfigured ? 'configured' : ''}`)
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_OAuthClientConfig')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientId')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientId), 1)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ClientSecret')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.clientSecret), 1)])]),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", Configurationvue_type_template_id_a80179ac_hoisted_73, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_HowToGetOAuthClientConfig')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", {
      innerHTML: _ctx.visitOAuthHowTo
    }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_74), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthExampleText')) + " ", 1), Configurationvue_type_template_id_a80179ac_hoisted_75, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexFieldUrlToAppSite')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseDomain) + " ", 1), Configurationvue_type_template_id_a80179ac_hoisted_76, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_YandexFieldCallbackUri')) + ":", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseDomainUrl) + "?module=SearchEngineKeywordsPerformance&action=processYandexAuthCode ", 1)])]),
    _: 1
  }, 8, ["content-title"])])) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true), _ctx.userIsSuperUser ? (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])("div", {
    key: 4,
    class: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["normalizeClass"])(!_ctx.isClientConfigured ? 'clientconfiguration' : '')
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_ContentBlock, {
    "content-title": _ctx.translate('SearchEngineKeywordsPerformance_SetUpOAuthClientConfig')
  }, {
    default: Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withCtx"])(() => [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", Configurationvue_type_template_id_a80179ac_hoisted_77, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ProvideYandexClientConfig')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createVNode"])(_component_Field, {
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
    }, null, 8, Configurationvue_type_template_id_a80179ac_hoisted_78), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", Configurationvue_type_template_id_a80179ac_hoisted_79, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Save')), 1)])]),
    _: 1
  }, 8, ["content-title"])], 2)) : Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createCommentVNode"])("", true)]);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue?vue&type=template&id=a80179ac

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
    ContentBlock: external_CoreHome_["ContentBlock"],
    Field: external_CorePluginsAdmin_["Field"],
    Notification: external_CoreHome_["Notification"]
  },
  directives: {
    ContentTable: external_CoreHome_["ContentTable"]
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
 
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Yandex/Configuration.vue



Yandex_Configurationvue_type_script_lang_ts.render = Configurationvue_type_template_id_a80179ac_render

/* harmony default export */ var Yandex_Configuration = (Yandex_Configurationvue_type_script_lang_ts);
// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-babel/node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/@vue/cli-plugin-babel/node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist/templateLoader.js??ref--6!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=template&id=9e9de9fe

const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_1 = {
  class: "form-group row"
};
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_2 = {
  class: "col s12"
};
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_3 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_4 = ["innerHTML"];
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_5 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_6 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_7 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("br", null, null, -1);
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_8 = {
  class: "form-group row"
};
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_9 = {
  class: "col s12 m6"
};
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_10 = {
  id: "configFileUploadForm",
  action: "",
  method: "POST",
  enctype: "multipart/form-data"
};
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_11 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
  type: "hidden",
  id: "client",
  name: "client"
}, null, -1);
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_12 = ["value"];
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_13 = ["disabled"];
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_14 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-upload"
}, null, -1);
const ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_15 = /*#__PURE__*/Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
  class: "icon-upload"
}, null, -1);
function ConfigureConnectionvue_type_template_id_9e9de9fe_render(_ctx, _cache, $props, $setup, $data, $options) {
  return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["openBlock"])(), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementBlock"])(external_commonjs_vue_commonjs2_vue_root_Vue_["Fragment"], null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_1, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_2, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel1')), 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel2')), 1), ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_3, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", {
    innerHTML: _ctx.$sanitize(_ctx.setupGoogleAnalyticsImportFaq)
  }, null, 8, ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_4)]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("p", null, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_OAuthExampleText')), 1), ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_5, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAuthorizedJavaScriptOrigin')) + ": ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseDomain), 1), ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_6, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("strong", null, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_GoogleAuthorizedRedirectUri')) + ": ", 1), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.baseUrl) + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.redirectUri), 1), ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_7])])]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_8, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("div", ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_9, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("form", ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_10, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    type: "file",
    id: "clientfile",
    name: "clientfile",
    accept: ".json",
    onChange: _cache[0] || (_cache[0] = (...args) => _ctx.processFileChange && _ctx.processFileChange(...args)),
    style: {
      "display": "none"
    }
  }, null, 32), ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_11, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("input", {
    type: "hidden",
    name: "config_nonce",
    value: _ctx.manualConfigNonce
  }, null, 8, ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_12), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("button", {
    type: "button",
    class: "btn",
    onClick: _cache[1] || (_cache[1] = $event => _ctx.selectConfigFile()),
    disabled: _ctx.isUploadButtonDisabled
  }, [Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", null, [ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_14, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('General_Upload')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], !_ctx.isUploadButtonDisabled]]), Object(external_commonjs_vue_commonjs2_vue_root_Vue_["withDirectives"])(Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createElementVNode"])("span", null, [ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_15, Object(external_commonjs_vue_commonjs2_vue_root_Vue_["createTextVNode"])(" " + Object(external_commonjs_vue_commonjs2_vue_root_Vue_["toDisplayString"])(_ctx.translate('SearchEngineKeywordsPerformance_Uploading')), 1)], 512), [[external_commonjs_vue_commonjs2_vue_root_Vue_["vShow"], _ctx.isUploadButtonDisabled]])], 8, ConfigureConnectionvue_type_template_id_9e9de9fe_hoisted_13)])])])], 64);
}
// CONCATENATED MODULE: ./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=template&id=9e9de9fe

// CONCATENATED MODULE: ./node_modules/@vue/cli-plugin-typescript/node_modules/cache-loader/dist/cjs.js??ref--15-0!./node_modules/babel-loader/lib!./node_modules/@vue/cli-plugin-typescript/node_modules/ts-loader??ref--15-2!./node_modules/@vue/cli-service/node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/@vue/cli-service/node_modules/vue-loader-v16/dist??ref--1-1!./plugins/SearchEngineKeywordsPerformance/vue/src/Configure/ConfigureConnection.vue?vue&type=script&lang=ts


/* harmony default export */ var ConfigureConnectionvue_type_script_lang_ts = (Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
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
    setupGoogleAnalyticsImportFaq() {
      const url = Object(external_CoreHome_["externalRawLink"])('https://matomo.org/faq/reports/import-google-search-keywords-in-matomo/#how-to-set-up-google-search-console-and-verify-your-website');
      return Object(external_CoreHome_["translate"])('SearchEngineKeywordsPerformance_ConfigureTheImporterLabel3', `<a href="${url}" rel="noreferrer noopener" target="_blank">`, '</a>');
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



ConfigureConnectionvue_type_script_lang_ts.render = ConfigureConnectionvue_type_template_id_9e9de9fe_render

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