/**
 * Copyright (C) InnoCraft Ltd - All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of InnoCraft Ltd.
 * The intellectual and technical concepts contained herein are protected by trade secret or copyright law.
 * Redistribution of this information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from InnoCraft Ltd.
 *
 * You shall use this code only in accordance with the license agreement obtained from InnoCraft Ltd.
 *
 * @link https://www.innocraft.com/
 * @license For license details see https://www.innocraft.com/license
 */

function HsrRecordingIframe (url) {
    url = String(url);
    if (url.indexOf('?') >= 0) {
        url = url.substr(0, url.indexOf('?'));
    }

    if (url.indexOf('#') >= 0) {
        url = url.substr(0, url.indexOf('#'));
    }

    if (url.indexOf('http') === -1) {
        // we need to load http or at least same protocol as current piwik install
        url = String(location.protocol) + '//' + url;
    }

    var requireSecureProtocol = String(location.protocol).toLowerCase() === 'https:';

    function convertUrlToSecureProtocolIfNeeded(url)
    {
        // otherwise we get problems re insecure content
        if (requireSecureProtocol && String(url).toLowerCase().indexOf('http:') === 0) {
            url = 'https' + url.substr('http'.length);
        }

        return url;
    }

    url = convertUrlToSecureProtocolIfNeeded(url);

    var baseUrl = url;

    this.enableDebugMode = false;

    function addRemoveSupport(window)
    {
        if (window && !('remove' in window.Element.prototype)) {
            window.Element.prototype.remove = function() {
                if (this.parentNode && this.parentNode.removeChild) {
                    this.parentNode.removeChild(this);
                }
            };
        }
    }

    addRemoveSupport(window);

    this.isSupportedBrowser = function () {
        if (typeof WebKitMutationObserver !== 'undefined') {
            return true;
        } else if (typeof MutationObserver !== 'undefined') {
            return true;
        }

        return false;
    };

    this.scrollTo = function (x,y) {
        window.scrollTo(x,y);
    };

    this.getIframeWindow = function () {
        return window;
    };

    this.findElement = function (selector) {
        return $(selector);
    };

    this.makeSvg = function (width, height) {
        var canvas = this.findElement('#mouseMoveCanvas');
        if (canvas.length) {
            canvas.empty();
        } else {
            this.appendContent('<div id="mouseMoveCanvas" style="position:absolute !important;top: 0 !important;left:0 !important;z-index: 99999998 !important;display: block !important;visibility: visible !important;" width="100%" height="100%"></div>');
        }

        this.draw = SVG('mouseMoveCanvas').size(width, height);
    };

    this.drawLine = function (x1, y1, x2, y2, color) {
        if (this.draw) {
            var line = this.draw.line(x1, y1, x2, y2);
            line.stroke({ width: 1,color:color });
        }
    };

    this.drawCircle = function (x, y, color) {
        if (this.draw) {
            if (x > 4) {
                x = x - 4; // because of radius of 8 we need to center it
            }
            if (y > 4) {
                y = y - 4; // because of radius of 8 we need to center it
            }
            var circle = this.draw.circle(8);
            circle.fill(color);
            circle.move(x,y);
        }
    };

    this.appendContent = function (html) {
        return $('body').append(html);
    };

    this.initialMutation = function(event) {

        if (document.documentElement) {
            document.documentElement.remove();
        }

        if (document && document.doctype) {
            if (document.doctype && document.doctype.remove) {
                document.doctype.remove();
            } else if (document.doctype) {
                // fix remove is not available on IE
                document.removeChild(document.doctype);
            }
        }

        addRemoveSupport(window);

        this.mirror = new TreeMirror(document, {
            createElement: function(tagName, data) {
                if (!tagName) {
                    return;
                }

                tagName = tagName.toLowerCase().trim();

                if (tagName === 'script') {
                    // prevent execution of this element! we still need to have it in the dom eg for nth-child selector etc.
                    var element = document.createElement('NO_SCRIPT');
                    element.style.display = 'none';
                    return element;

                } else if (tagName === 'form') {
                    var element = document.createElement('FORM');
                    element.addEventListener('submit', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    });
                    return element;

                } else if (tagName === 'link' || tagName === 'img' || tagName === 'iframe') {
                    var element;
                    var isLinkHrefAttr = (tagName === 'link' && data && typeof data.attributes === 'object');
                    function shouldUnresolve(href) {
                        var posHref = href.toLowerCase().indexOf('.scr.kaspersky-labs.com');
                        if (posHref > 5 && posHref < 20) {
                            return true;
                        }
                        return false;
                    }
                    if (tagName === 'iframe' && 'src' in data.attributes && data.attributes.src.indexOf('google.com/recaptcha') !== -1) {
                        var element = document.createElement('NO_SCRIPT');
                        element.style.display = 'none';
                        return element;
                    }
                    if (isLinkHrefAttr && 'href' in data.attributes && data.attributes['href']) {
                        if (shouldUnresolve(String(data.attributes['href']))) {
                            data.attributes['href'] = '#not_possible_to_resolve';
                            // this URL cannot be resolved and is injected dynamically
                            element = document.createElement('NO_LINK');
                            element.style.display = 'none';
                        }
                    }
                    if (isLinkHrefAttr && 'data-matomo-href' in data.attributes && data.attributes['data-matomo-href']) {
                        if (shouldUnresolve(String(data.attributes['data-matomo-href']))) {
                            data.attributes['href'] = '#not_possible_to_resolve';
                            // this URL cannot be resolved and is injected dynamically
                            element = document.createElement('NO_LINK');
                            element.style.display = 'none';
                        } else {
                            data.attributes['href'] = data.attributes['data-matomo-href'];
                        }
                    }

                    if (!element) {
                        element = document.createElement(tagName.toUpperCase());
                    }

                    if (element.tagName === 'IFRAME') {
                        element.setAttribute('sandbox', 'allow-scripts');
                    }

                    element.setAttribute('referrerpolicy', 'no-referrer');
                    return element;
                } else if (tagName === 'head') {
                    var element = document.createElement('HEAD');

                    // we need to add ours first, because multiple base elements may exist and their base might only
                    // appear after few resources are already loaded
                    element.appendChild(document.createElement('BASE'));
                    element.firstChild.href = baseUrl;

                    var style = document.createElement('style');
                    style.setAttribute('type', 'text/css')
                    style.appendChild(document.createTextNode('[data-matomo-mask] {background-image: none !important; }' +
                        ' img[data-matomo-mask][src^="http"] {visibility:hidden !important;opacity: 0; }' +
                        ' img[data-matomo-mask][src^="/"] {visibility:hidden !important;opacity: 0; }' +
                        ' img[data-matomo-mask][src*=".png"] {visibility:hidden !important;opacity: 0; }' +
                        ' img[data-matomo-mask][src*=".jpg"] {visibility:hidden !important;opacity: 0; }' +
                        ' img[data-matomo-mask][src*=".webp"] {visibility:hidden !important;opacity: 0; }' +
                        ' img[data-matomo-mask][src*=".jepg"] {visibility:hidden !important;opacity: 0; }' +
                        ' img[data-matomo-mask][src*=".gif"] {visibility:hidden !important;opacity: 0; }' +
                        ' input:not([type="submit"]):not([type="button"]):not([value=""]){ background: unset !important; }'
                    ));
                    element.appendChild(style);
                    element.appendChild(document.createElement('BASE'));

                    var metaElement = document.createElement('META');
                    metaElement.name = 'referrer';
                    metaElement.content = 'no-referrer';
                    element.appendChild(metaElement);

                    if (typeof data === 'object' && 'childNodes' in data && data.childNodes && data.childNodes.length) {
                        for (var k = 0; k < data.childNodes.length; k++) {
                            if (k in data.childNodes && 'object' === typeof data.childNodes[k] && 'tagName' in data.childNodes[k] && data.childNodes[k].tagName && data.childNodes[k].tagName === 'BASE') {
                                if ('attributes' in data.childNodes[k] && data.childNodes[k].attributes && data.childNodes[k].attributes.href) {
                                    // no need to add a BASE ourselves, we prefer to use existing base set by user

                                    var thisBaseUrl = data.childNodes[k].attributes.href;

                                    var lowerThisBaseUrl = ('' + thisBaseUrl).toLowerCase();
                                    if (lowerThisBaseUrl.indexOf('http') === 0 || lowerThisBaseUrl.indexOf('//') === 0) {
                                        // absolute base URL is set, we can simply use that URL
                                        continue; // there might be multiple base URLs so need to continue
                                    }

                                    // it has to be a relative URL, trying to resolve it
                                    if ('function' === typeof URL) {
                                        var theUrl = new URL(thisBaseUrl, baseUrl);
                                        if (theUrl && theUrl.href) {
                                            baseUrl = theUrl.href;
                                        } else if (theUrl) {
                                            baseUrl = '' + theUrl;
                                        }
                                    } else {
                                        // browser does not support URL api... won't work in IE11 or lower
                                        if ('undefined' !== typeof console && 'undefined' !== typeof console.log){
                                            console.log('browser does not support URL api, cannot resolve relative base URL');
                                        }
                                    }

                                    // make sure to use this absolute base url
                                    data.childNodes[k].attributes.href = baseUrl;
                                    continue; // there might be multiple base URLs so need to continue
                                }
                            }
                        }
                    }

                    return element;

                } else if (tagName === 'a') {
                    var element = document.createElement('A');
                    element.addEventListener('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    });
                    return element;

                } else if (['svg', 'path', 'g', 'polygon', 'polyline', 'rect', 'text', 'circle', 'line'].indexOf(tagName) !== -1) {
                    return document.createElementNS('http://www.w3.org/2000/svg', tagName)
                } else if (tagName === 'meta') {
                    if (data && typeof data.attributes === 'object') {
                        if ('http-equiv' in data.attributes && data.attributes['http-equiv']) {
                            var httpEquiv = String(data.attributes['http-equiv']).toLowerCase();

                            if (httpEquiv === 'content-security-policy' || httpEquiv === 'refresh') {
                                return document.createElement('NO_META');
                            }
                        }
                        if ('name' in data.attributes && data.attributes['name']) {
                            var metaName = String(data.attributes['name']).toLowerCase();
                            if (metaName === 'csrf-token') {
                                return document.createElement('NO_META');
                            }
                            if (metaName === 'referrer') {
                                // we want to apply our own policy
                                return document.createElement('NO_META');
                            }
                        }
                    }
                }
            },
            setAttribute: function(node, name, value) {
                if (!name) {
                    return node;
                }

                var nameLower = String(name).trim().toLowerCase();

                if (nameLower === 'src' && value && (String(value).indexOf('/piwik.js') >= 0 || String(value).indexOf('/matomo.js') >= 0)) {
                    // we do not want to set piwik.js
                    return node;
                }

                if (nameLower === 'srcdoc') {
                    // we ignore srcdoc
                    return node;
                }

                if (nameLower === 'referrerpolicy') {
                    // we always set our value
                    node.setAttribute(nameLower, 'no-referrer');
                    return node;
                }

                if (nameLower === 'src' && value && String(value).indexOf('/HeatmapSessionRecording/') > 0) {
                    // we do not want to set configs.php etc
                    return node;
                }

                if (value
                  && (String(value).toLowerCase().replace(/\x09|\x0a|\x0d/g, '').indexOf('javascript') >= 0
                      || String(value).toLowerCase().replace(/\x09|\x0a|\x0d/g, '').indexOf('ecmascript') >= 0
                      || String(value).toLowerCase().replace(/\x09|\x0a|\x0d/g, '').indexOf('vbscript') >= 0
                      || String(value).toLowerCase().replace(/\x09|\x0a|\x0d/g, '').indexOf('jscript') >= 0)) {
                    // we do not want to set any javascript URL, eg href and src and attribute
                    return node;
                }
                if (value && String(value).toLowerCase().indexOf('xmlhttprequest') >= 0) {
                    // prevent simple input of xmlhttprequest
                    return node;
                }
                if (value && /fetch\s*\(/.test(String(value).toLowerCase())) {
                    // prevent simple input of fetch(
                    return node;
                }

                var blockedAttributes = ['onchange', 'onload', 'onshow', 'onhashchange', 'onstorage', 'onchecking', 'ondownloading', 'onnoupdate', 'onupdateready', 'onabort', 'oncopy','ondrop','onwheel', 'onpaste', 'oncut', 'onbeforeunload', 'onreset','onsubmit', 'onunload', 'onerror', 'onclose','onopen','onpagehide','onpageshow','onpopstate','onmessage', 'onclick', 'ondblclick', 'oncontextmenu', 'onauxclick', 'onfocus', 'onfocusin', 'onfocusout', 'onblur', 'onselect', 'onplay', 'onpause', 'onended', 'onsuspend', 'onwaiting', 'onprogress', 'ontimeout', 'onchange', 'ontimeupdate', 'onstalled', 'onseeking', 'onplaying', 'onloadeddata', 'onended', 'onemptied', 'ondurationchange', 'oncanplay', 'oncomplete', 'onaudioprocess']
                // we block any on... per regex but adding few other checks just in case the regex fails
                if (/^on([a-zA-Z])+$/.test(nameLower)
                    || blockedAttributes.indexOf(nameLower) > -1
                    || nameLower.indexOf('onmouse') === 0
                    || nameLower.indexOf('onkey') === 0
                    || nameLower.indexOf('onanimation') === 0
                    || nameLower.indexOf('ondrag') === 0
                    || nameLower.indexOf('onload') === 0
                    || nameLower.indexOf('ontransition') === 0
                    || nameLower.indexOf('oncomposition') === 0
                    || nameLower.indexOf('ontouch') === 0) {
                    // do not execute any onload method or when we set form element values
                    return node;
                }

                if (node.tagName === 'LINK') {
                    if (nameLower === 'crossorigin') {
                        // cross origin relevant for images only, not for scripts as we rename them anyway
                        return node
                    }

                    if (nameLower === 'integrity') {
                        // hash of a file should be ignored as file fetched later might have different hash etc
                        return node
                    }

                    if (nameLower === 'referrerpolicy') {
                        // do not overwrite our policy
                        return node
                    }

                    if (requireSecureProtocol) {
                        if (nameLower === 'href' && value && String(value).indexOf('http:') === 0) {
                            value = convertUrlToSecureProtocolIfNeeded(value);
                            node.setAttribute(name, value);
                            return node;
                        }
                    }
                }

                if (node.tagName === 'IMG') {
                    var isHeatmap = window.location.search.indexOf('idLogHsr') === -1;
                    //To support images rendered using lazy load, we check if allowed dataset attributes are set and no src attributes are present replace it with available data attributes
                    if (isHeatmap && (typeof node.attributes.src === "undefined" || node.getAttribute('src') === '') && Object.keys(node.dataset).length) {
                        var allowedDatasetsToReplaceImageSrc = ['src', 'original', 'lazy'];
                        var newSrcValue = '';
                        for (var i = 0; i < allowedDatasetsToReplaceImageSrc.length; i++) {
                            if (typeof node.dataset[allowedDatasetsToReplaceImageSrc[i]] !== "undefined" && node.dataset[allowedDatasetsToReplaceImageSrc[i]]) {
                                newSrcValue = node.dataset[allowedDatasetsToReplaceImageSrc[i]];
                                break;
                            }
                        }

                        //srcset is also used to lazy load with responsive images
                        //the value of srcset is "{imagePath} screenSize1,{imagePath} screenSize2" for responsive lazy load
                        //Eg data-scrset="images/400.jpg 400w, images/400.webp 400w, images/600.jpg 600w"
                        //we pick the last size and to determine it by checking the last character has w
                        // if we cannot find last character as 'w' we just set the src else we replace with the last size determined
                        if (newSrcValue === '' && typeof node.dataset.srcset !== "undefined" && node.dataset.srcset) {
                            var srcSetValue = node.dataset.srcset;
                            var srcSetLength = srcSetValue.length;
                            if (srcSetValue[srcSetLength-1] === 'w') {
                                var splitSrcSetSizes = srcSetValue.split('w,');
                                var lastSizeValue = splitSrcSetSizes[splitSrcSetSizes.length-1];
                                newSrcValue = lastSizeValue.replace( / \d+w/g,'').trim();
                            } else {
                                newSrcValue = srcSetValue;
                            }
                        }
                        if (newSrcValue) {
                            node.setAttribute('src', convertUrlToSecureProtocolIfNeeded(newSrcValue));
                        }
                    }

                    if (requireSecureProtocol) {
                        if (nameLower === 'src' && value && String(value).indexOf('http:') === 0) {
                            value = convertUrlToSecureProtocolIfNeeded(value);
                            node.setAttribute(name, value);
                            return node;
                        }
                    }

                    if (nameLower === 'referrerpolicy') {
                        // do not overwrite our policy
                        return node
                    }
                }

                if (node.tagName === 'FORM') {
                    if (requireSecureProtocol) {
                        if (nameLower === 'action' && value && String(value).indexOf('http:') === 0) {
                            value = convertUrlToSecureProtocolIfNeeded(value);
                            node.setAttribute(name, value);
                            return node;
                        }
                    }
                }

                if (node.tagName === 'IFRAME') {
                    var youtubeRegex = /^((?:https?:)\/\/)((?:www|m)\.)?((?:youtube\.com|youtube-nocookie\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)([a-zA-Z_=&]*)?$/;
                    if (node.src && youtubeRegex.test(node.src.toLowerCase())) {
                        node.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                    } else {
                        node.setAttribute('sandbox', 'allow-scripts');
                    }

                    if (requireSecureProtocol) {
                        if (nameLower === 'src' && value && String(value).indexOf('http:') === 0) {
                            value = convertUrlToSecureProtocolIfNeeded(value);
                            node.setAttribute(name, value);
                            return node;
                        }
                    }

                    if (nameLower === 'src' && value) {
                        if (youtubeRegex.test(String(value).toLowerCase())) {
                            node.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                        }
                    }

                    if (nameLower === 'referrerpolicy') {
                        // do not overwrite our policy
                        return node
                    }
                    if (nameLower === 'sandbox') {
                        // do not overwrite our policy
                        return node
                    }
                }

                if (node.tagName === 'BASE') {
                    if (requireSecureProtocol) {
                        if (nameLower === 'href' && value && String(value).indexOf('http:') === 0) {
                            value = convertUrlToSecureProtocolIfNeeded(value);
                            node.setAttribute(name, value);
                            return node;
                        }
                    }
                }
            }
        });

        if (event) {
            this.mirror.initialize(event.rootId, event.children);

            this.addClass('html', 'piwikHsr');
            this.addClass('html', 'matomoHsr');
        }
    };

    this.addClass = function (selector, className) {
        $(selector).addClass(className);
    };

    this.addWorkaroundForSharepointHeatmaps = function () {
        // only needed for heatmaps... instead of having a scrollable element we show all content
        var doc = document.getElementById('s4-workspace');
        if (doc && doc.tagName === 'DIV' && doc.className && String(doc.className).indexOf('ms-core-overlay') >= 0) {
            doc.style += ';height: auto !important;width: auto !important';
        }
    };

    this.applyMutation = function (event) {
        if (event) {
            this.mirror.applyChanged(event.rem || [], event.adOrMo || [], event.att || [], event.text || []);
        }
    };
    this.trim = function(text)
    {
        if (text && String(text) === text) {
            return text.replace(/^\s+|\s+$/g, '');
        }

        return text;
    };

    this.parseExcludedElementSelectors = function (excludedElements) {
        if (!excludedElements) {
            return [];
        }

        excludedElements = String(excludedElements);
        excludedElements = this.trim(excludedElements);

        if (!excludedElements) {
            return [];
        }

        excludedElements = excludedElements.split(',');

        if (!excludedElements || !excludedElements.length) {
            return [];
        }

        var selectors = [];
        for (var i = 0; i < excludedElements.length; i++) {
            var selector = this.trim(excludedElements[i]);
            selectors.push(selector);
        }
        return selectors;
    };

    this.excludeElements = function (excludedElements) {
        excludedElements = this.parseExcludedElementSelectors(excludedElements);
        if (!excludedElements || !excludedElements.length) {
            return;
        }

        var self = this;

        var style = (function() {
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(''));
            document.head.appendChild(style);

            return style;
        })();

        for (var i = 0; i < excludedElements.length; i++) {
            var selector = this.decodeHTMLEntities(excludedElements[i]); // decodeHTMLEntities fixes cases like p>a[href="test.html"] or a[href="test.html"] as the quotes are escaped and results in error
            if (selector && style && style.sheet) {
                if('insertRule' in style.sheet) {
                    style.sheet.insertRule(selector + "{ visibility: hidden; }", i);
                } else if('addRule' in sheet) {
                    style.sheet.addRule(selector, 'visibility: hidden; ', i);
                }

            }
        }
    };

    this.decodeHTMLEntities = function (text) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };

    this.getCoordinatesInFrame = function (selector, offsetx, offsety, offsetAccuracy, ignoreHiddenElement) {
        var $node = $(selector);

        if (!$node.length) {
            if (this.enableDebugMode) {
                if ('undefined' !== typeof console && 'undefined' !== typeof console.log){
                    console.log(selector, 'selector not found');
                }
            }
            return;
        }

        var width = $node.outerWidth();
        var height = $node.outerHeight();

        if (ignoreHiddenElement && ignoreHiddenElement === true && width === 0 || height === 0 || !$node.is(':visible')) {
            // not visible
            return;
        }

        var width = width / offsetAccuracy;
        var height = height / offsetAccuracy;
        var coordinates = $node.offset();

        var dataPoint = {
            x: parseInt(coordinates.left, 10) + parseInt(offsetx * width, 10),
            y: parseInt(coordinates.top, 10) + parseInt(offsety * height, 10),
        }

        return dataPoint;
    };

    this.getScrollTop = function () {
        return $(window).scrollTop();
    };

    this.getScrollLeft = function () {
        return $(window).scrollLeft();
    };

    this.getIframeHeight = function () {
        var documentHeight = Math.max(document.body ? document.body.offsetHeight : 0, document.body ? document.body.scrollHeight : 0, document.documentElement ? document.documentElement.offsetHeight : 0, document.documentElement ? document.documentElement.clientHeight : 0, document.documentElement ? document.documentElement.scrollHeight : 0);
        return documentHeight;
    };

    this.getIframeWidth = function () {
        var documentHeight = Math.max(document.body ? document.body.offsetWidth : 0, document.body ? document.body.scrollWidth : 0, document.documentElement ? document.documentElement.offsetWidth : 0, document.documentElement ? document.documentElement.clientWidth : 0, document.documentElement ? document.documentElement.scrollWidth : 0);
        return documentHeight;
    };

}
