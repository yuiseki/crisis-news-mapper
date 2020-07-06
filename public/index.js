/******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/control/ExpandControl.ts":
/*!**************************************!*\
  !*** ./src/control/ExpandControl.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n * 日本全体表示に戻るボタン\r\n */\r\nclass ExpandControl extends L.Control {\r\n    constructor(options) {\r\n        super(options);\r\n        this.onAdd = (map) => {\r\n            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\r\n            container.innerHTML = '<i class=\"fas fa-expand\"></i>';\r\n            container.style.fontSize = '22px';\r\n            container.style.textAlign = 'center';\r\n            container.style.display = 'table-cell';\r\n            container.style.verticalAlign = 'middle';\r\n            container.style.backgroundColor = 'white';\r\n            container.style.cursor = 'pointer';\r\n            container.style.width = '30px';\r\n            container.style.height = '30px';\r\n            container.onclick = function () {\r\n                map.setView([36.56028, 139.19333], 6);\r\n            };\r\n            return container;\r\n        };\r\n    }\r\n}\r\nexports.default = ExpandControl;\r\n\n\n//# sourceURL=webpack:///./src/control/ExpandControl.ts?");

/***/ }),

/***/ "./src/control/GithubControl.ts":
/*!**************************************!*\
  !*** ./src/control/GithubControl.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n * GitHub移動ボタン\r\n */\r\nclass GithubControl extends L.Control {\r\n    constructor(options) {\r\n        super(options);\r\n        this.onAdd = (map) => {\r\n            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\r\n            container.innerHTML = '<i class=\"fab fa-github\"></i>';\r\n            container.style.fontSize = '30px';\r\n            container.style.textAlign = 'center';\r\n            container.style.display = 'table-cell';\r\n            container.style.verticalAlign = 'middle';\r\n            container.style.backgroundColor = 'white';\r\n            container.style.cursor = 'pointer';\r\n            container.style.width = '40px';\r\n            container.style.height = '40px';\r\n            container.onclick = function () {\r\n                // @ts-ignore\r\n                //firebase.analytics().logEvent('show_github_control');\r\n                const url = 'https://github.com/yuiseki/crisis-news-mapper';\r\n                const newWindow = window.open(url, '_blank');\r\n                newWindow.focus();\r\n            };\r\n            return container;\r\n        };\r\n    }\r\n}\r\nexports.default = GithubControl;\r\n\n\n//# sourceURL=webpack:///./src/control/GithubControl.ts?");

/***/ }),

/***/ "./src/control/SponsorControl.ts":
/*!***************************************!*\
  !*** ./src/control/SponsorControl.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n * スポンサー募集ボタン\r\n */\r\nclass SponsorControl extends L.Control {\r\n    constructor(options) {\r\n        super(options);\r\n        this.onAdd = (map) => {\r\n            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\r\n            container.innerHTML = '<span class=\"gatagata\">💸</span>';\r\n            container.style.fontSize = '30px';\r\n            container.style.textAlign = 'center';\r\n            container.style.display = 'table-cell';\r\n            container.style.verticalAlign = 'middle';\r\n            container.style.backgroundColor = 'white';\r\n            container.style.cursor = 'pointer';\r\n            container.style.width = '40px';\r\n            container.style.height = '40px';\r\n            const modalContent = `\r\n    <div style=\"text-align: center;margin: auto;\">\r\n    <h1>運営費支援のお願い</h1>\r\n    <p>毎月3000円ほどかかっているので一年間で36000円くらいの出費になる予測です。オタスケ……</p>\r\n    <h2>kyashによる支援</h2>\r\n    <p><a href=\"kyash://qr/u/4235924052635520477\">kyash://qr/u/4235924052635520477</a></p>\r\n    <p><img width=\"200\" height=\"200\" src=\"/img/kyash_qr_yuiseki.png\"></p>\r\n    <h2>polcaによ支援</h2>\r\n    <p><a href=\"https://polca.jp/projects/gRNhd5LhkQ6\">https://polca.jp/projects/gRNhd5LhkQ6</a></p>\r\n    <p><img width=\"200\" height=\"200\" src=\"/img/polca_qr.png\"></p>\r\n    </div>\r\n    `;\r\n            container.onclick = function () {\r\n                // @ts-ignore\r\n                //firebase.analytics().logEvent('show_sponsor_control');\r\n                map.openModal({\r\n                    content: modalContent,\r\n                    closeTitle: '✕',\r\n                    zIndex: 10000,\r\n                    transitionDuration: 0,\r\n                });\r\n            };\r\n            return container;\r\n        };\r\n    }\r\n}\r\nexports.default = SponsorControl;\r\n\n\n//# sourceURL=webpack:///./src/control/SponsorControl.ts?");

/***/ }),

/***/ "./src/geojson/GeoJson.ts":
/*!********************************!*\
  !*** ./src/geojson/GeoJson.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n * GeoJsonを表現する基底クラス\r\n */\r\nclass GeoJson {\r\n    /**\r\n     * コンストラクタ\r\n     * await geojson.ready すると geojson\b を読み込む\r\n     * @param displayName geojsonの表示名\r\n     * @param url jsonのURL\r\n     * @param icon 表示に使いたいアイコン\r\n     */\r\n    constructor(displayName, url, icon, style, pane) {\r\n        /**\r\n         * jsonがGeoJSONではないとき、変換処理をする必要があるときに上書きする\r\n         */\r\n        this.toGeoJson = (json) => {\r\n            return json;\r\n        };\r\n        /**\r\n         * coordinatesが[lat, lng]形式ではないときに上書きする\r\n         */\r\n        this.pointToLayer = (feature, coordinates) => {\r\n            return L.marker(coordinates, { icon: this.icon, pane: this.pane });\r\n        };\r\n        this.onEachFeature = (feature, layer) => {\r\n        };\r\n        this.displayName = displayName;\r\n        this.url = url;\r\n        this.icon = icon;\r\n        this.style = style;\r\n        this.pane = pane;\r\n        this.ready = new Promise(async (resolve) => {\r\n            const res = await fetch(this.url);\r\n            let json = await res.json();\r\n            json = this.toGeoJson(json);\r\n            this.geojson = L.geoJSON(json, {\r\n                style: this.style,\r\n                pointToLayer: this.pointToLayer,\r\n                onEachFeature: this.onEachFeature\r\n            });\r\n            resolve();\r\n        });\r\n    }\r\n    addOverlay(leaflet, groupName) {\r\n        leaflet.layerControl.addOverlay(this.geojson, this.displayName, groupName);\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this.geojson);\r\n    }\r\n    hide(leaflet) {\r\n        leaflet.map.removeLayer(this.geojson);\r\n    }\r\n}\r\nexports.default = GeoJson;\r\n\n\n//# sourceURL=webpack:///./src/geojson/GeoJson.ts?");

/***/ }),

/***/ "./src/geojson/JapanCitiesGeoJson.ts":
/*!*******************************************!*\
  !*** ./src/geojson/JapanCitiesGeoJson.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GeoJson_1 = __webpack_require__(/*! ./GeoJson */ \"./src/geojson/GeoJson.ts\");\r\nclass JapanCitiesGeoJson extends GeoJson_1.default {\r\n    constructor() {\r\n        super(JapanCitiesGeoJson.displayName, JapanCitiesGeoJson.url, JapanCitiesGeoJson.icon, JapanCitiesGeoJson.style);\r\n        this.onEachFeature = (feature, layer) => {\r\n            layer.bindTooltip(feature.properties.cityname_k);\r\n        };\r\n    }\r\n}\r\nexports.default = JapanCitiesGeoJson;\r\nJapanCitiesGeoJson.displayName = \"市区町村境界\";\r\nJapanCitiesGeoJson.url = \"/geojson/japan_cities.geojson\";\r\nJapanCitiesGeoJson.icon = null;\r\nJapanCitiesGeoJson.style = {\r\n    weight: 2,\r\n    opacity: 0.5,\r\n    fillOpacity: 0.2\r\n};\r\n\n\n//# sourceURL=webpack:///./src/geojson/JapanCitiesGeoJson.ts?");

/***/ }),

/***/ "./src/geojson/JapanPrefsGeoJson.ts":
/*!******************************************!*\
  !*** ./src/geojson/JapanPrefsGeoJson.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst GeoJson_1 = __webpack_require__(/*! ./GeoJson */ \"./src/geojson/GeoJson.ts\");\r\nclass JapanPrefsGeoJson extends GeoJson_1.default {\r\n    constructor() {\r\n        super(JapanPrefsGeoJson.displayName, JapanPrefsGeoJson.url, JapanPrefsGeoJson.icon, JapanPrefsGeoJson.style);\r\n    }\r\n}\r\nexports.default = JapanPrefsGeoJson;\r\nJapanPrefsGeoJson.displayName = \"都道府県境界\";\r\nJapanPrefsGeoJson.url = \"/geojson/japan.geojson\";\r\nJapanPrefsGeoJson.icon = null;\r\nJapanPrefsGeoJson.style = {\r\n    weight: 5,\r\n    opacity: 0.5\r\n};\r\n\n\n//# sourceURL=webpack:///./src/geojson/JapanPrefsGeoJson.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// control\r\nconst SponsorControl_1 = __webpack_require__(/*! ./control/SponsorControl */ \"./src/control/SponsorControl.ts\");\r\nconst GithubControl_1 = __webpack_require__(/*! ./control/GithubControl */ \"./src/control/GithubControl.ts\");\r\nconst ExpandControl_1 = __webpack_require__(/*! ./control/ExpandControl */ \"./src/control/ExpandControl.ts\");\r\n// tile\r\nconst PaleTileLayer_1 = __webpack_require__(/*! ./tile/PaleTileLayer */ \"./src/tile/PaleTileLayer.ts\");\r\nconst ReliefTileLayer_1 = __webpack_require__(/*! ./tile/ReliefTileLayer */ \"./src/tile/ReliefTileLayer.ts\");\r\nconst RainTileLayer_1 = __webpack_require__(/*! ./tile/RainTileLayer */ \"./src/tile/RainTileLayer.ts\");\r\n// geojson\r\n//import FloodArcGisJson from './geojson/FloodArcGisJson';\r\n//import VolunteerGeoJson from './geojson/VolunteerGeoJson';\r\n// marker\r\nconst CrisisNewsMarkers_1 = __webpack_require__(/*! ./marker/CrisisNewsMarkers */ \"./src/marker/CrisisNewsMarkers.ts\");\r\nconst AccidentNewsMarkers_1 = __webpack_require__(/*! ./marker/AccidentNewsMarkers */ \"./src/marker/AccidentNewsMarkers.ts\");\r\nconst IncidentNewsMarkers_1 = __webpack_require__(/*! ./marker/IncidentNewsMarkers */ \"./src/marker/IncidentNewsMarkers.ts\");\r\nconst ChildrenNewsMarkers_1 = __webpack_require__(/*! ./marker/ChildrenNewsMarkers */ \"./src/marker/ChildrenNewsMarkers.ts\");\r\nconst DrugNewsMarkers_1 = __webpack_require__(/*! ./marker/DrugNewsMarkers */ \"./src/marker/DrugNewsMarkers.ts\");\r\nconst SelfDefenseMarkers_1 = __webpack_require__(/*! ./marker/SelfDefenseMarkers */ \"./src/marker/SelfDefenseMarkers.ts\");\r\nconst FireDeptMarkers_1 = __webpack_require__(/*! ./marker/FireDeptMarkers */ \"./src/marker/FireDeptMarkers.ts\");\r\nconst JapanPrefsGeoJson_1 = __webpack_require__(/*! ./geojson/JapanPrefsGeoJson */ \"./src/geojson/JapanPrefsGeoJson.ts\");\r\nconst JapanCitiesGeoJson_1 = __webpack_require__(/*! ./geojson/JapanCitiesGeoJson */ \"./src/geojson/JapanCitiesGeoJson.ts\");\r\n// ツイートボタン\r\n// @ts-ignore\r\nwindow.twttr = (function (d, s, id) {\r\n    var js, fjs = d.getElementsByTagName(s)[0], \r\n    // @ts-ignore\r\n    t = window.twttr || {};\r\n    if (d.getElementById(id))\r\n        return t;\r\n    js = d.createElement(s);\r\n    js.id = id;\r\n    js.src = \"https://platform.twitter.com/widgets.js\";\r\n    fjs.parentNode.insertBefore(js, fjs);\r\n    t._e = [];\r\n    t.ready = function (f) {\r\n        t._e.push(f);\r\n    };\r\n    return t;\r\n}(document, \"script\", \"twitter-wjs\"));\r\n/**\r\n * Leafletを初期化するクラス\r\n */\r\nclass LeafletInitializer {\r\n    constructor() {\r\n        this.daysago = \"3\";\r\n        this.baseLayerData = null;\r\n        this.overlayLayerData = null;\r\n        this.onOverlayAdd = async (event) => {\r\n            let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'));\r\n            if (selectedLayers === null) {\r\n                selectedLayers = [];\r\n            }\r\n            if (selectedLayers.indexOf(event.name) === -1) {\r\n                selectedLayers.push(event.name);\r\n            }\r\n            localStorage.setItem('leaflet-selectedLayers', JSON.stringify(selectedLayers));\r\n        };\r\n        this.onOverlayRemove = (event) => {\r\n            let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'));\r\n            if (selectedLayers === null) {\r\n                selectedLayers = [];\r\n            }\r\n            if (selectedLayers.indexOf(event.name) > -1) {\r\n                selectedLayers.splice(selectedLayers.indexOf(event.name), 1);\r\n            }\r\n            localStorage.setItem('leaflet-selectedLayers', JSON.stringify(selectedLayers));\r\n        };\r\n        this.onMoveEnd = (event) => {\r\n            const center = this.map.getCenter();\r\n            const lat = center.lat;\r\n            const lng = center.lng;\r\n            localStorage.setItem('leaflet-center-lat', lat);\r\n            localStorage.setItem('leaflet-center-lng', lng);\r\n        };\r\n        this.onZoomEnd = (event) => {\r\n            localStorage.setItem('leaflet-zoom', this.map.getZoom());\r\n        };\r\n        this.onChangeTimeRange = (event) => {\r\n            if (this.daysago != String(event.value)) {\r\n                this.daysago = String(event.value);\r\n                localStorage.setItem('leaflet-daysago', this.daysago);\r\n                location.reload();\r\n            }\r\n        };\r\n        this.initView = () => {\r\n            const lat = localStorage.getItem('leaflet-center-lat');\r\n            const lng = localStorage.getItem('leaflet-center-lng');\r\n            const zoom = localStorage.getItem('leaflet-zoom');\r\n            if (lat !== undefined && lat !== null\r\n                && lng !== undefined && lng !== null\r\n                && zoom !== undefined && zoom !== null) {\r\n                const center = [Number(lat), Number(lng)];\r\n                this.map.panTo(center);\r\n                this.map.setZoom(zoom);\r\n            }\r\n            else {\r\n                // 初期座標とズームを指定\r\n                this.map.setView([36.56028, 139.19333], 6);\r\n            }\r\n        };\r\n        /**\r\n         * マーカーの重なる順番を指定するために使うやつを初期化しておく\r\n         * https://leafletjs.com/reference-1.0.0.html#map-pane\r\n         */\r\n        this.initPanes = () => {\r\n            this.map.createPane(\"pane610\").style.zIndex = \"610\";\r\n            this.map.createPane(\"pane620\").style.zIndex = \"620\";\r\n            this.map.createPane(\"pane630\").style.zIndex = \"630\";\r\n            this.map.createPane(\"pane640\").style.zIndex = \"640\";\r\n            this.map.createPane(\"pane650\").style.zIndex = \"650\";\r\n            this.map.createPane(\"pane660\").style.zIndex = \"660\";\r\n            this.map.createPane(\"pane670\").style.zIndex = \"670\";\r\n            this.map.createPane(\"pane680\").style.zIndex = \"680\";\r\n            this.map.createPane(\"pane690\").style.zIndex = \"690\";\r\n        };\r\n        this.renderControls = () => {\r\n            // @ts-ignore\r\n            this.timelineControl = L.control.timelineSlider({\r\n                position: 'topright',\r\n                timelineItems: [\"1日前\", \"2日前\", \"3日前\", \"4日前\", \"5日前\", \"6日前\", \"7日前\"],\r\n                labelWidth: \"50px\",\r\n                betweenLabelAndRangeSpace: \"10px\",\r\n                initializeChange: false,\r\n                changeMap: this.onChangeTimeRange\r\n            }).addTo(this.map);\r\n            // スポンサー募集ボタン\r\n            this.sponsorControl = new SponsorControl_1.default({\r\n                position: 'bottomleft'\r\n            }).addTo(this.map);\r\n            // GitHubボタン\r\n            this.githubControl = new GithubControl_1.default({\r\n                position: 'bottomleft'\r\n            }).addTo(this.map);\r\n            // ズームインズームアウトするやつ\r\n            this.zoomControl = L.control.zoom({\r\n                position: 'bottomright'\r\n            }).addTo(this.map);\r\n            // 全体表示に戻るやつ\r\n            this.expandControl = new ExpandControl_1.default({\r\n                position: 'bottomright'\r\n            }).addTo(this.map);\r\n            // 現在地に移動するやつ\r\n            // @ts-ignore\r\n            this.locatorControl = L.control.locate({\r\n                icon: 'fa fa-map-marker-alt',\r\n                position: 'bottomright',\r\n                locateOptions: {\r\n                    maxZoom: 10\r\n                }\r\n            }).addTo(this.map);\r\n            // 地名で検索するやつ\r\n            // @ts-ignore\r\n            this.searchControl = L.esri.Geocoding.geosearch({\r\n                position: 'bottomright',\r\n                placeholder: '地名で検索'\r\n            }).addTo(this.map);\r\n            // レイヤーの表示非表示を切り替えるやつ\r\n            // @ts-ignore\r\n            this.layerControl = L.control.groupedLayers(this.baseLayerData, this.overlayLayerData, {\r\n                collapsed: true,\r\n                position: 'bottomright',\r\n                exclusiveGroups: [\"ニュース\"],\r\n                groupCheckboxes: false\r\n            }).addTo(this.map);\r\n        };\r\n        this.renderBaseLayer = async () => {\r\n            this.layer = new PaleTileLayer_1.default();\r\n            this.layer.addTo(this.map);\r\n            this.baseLayerData = {\r\n                \"国土地理院淡色地図\": this.layer\r\n            };\r\n            const japanPrefsGeoJson = new JapanPrefsGeoJson_1.default();\r\n            japanPrefsGeoJson.ready.then(() => {\r\n                japanPrefsGeoJson.show(this);\r\n            });\r\n            const japanCitiesGeoJson = new JapanCitiesGeoJson_1.default();\r\n            japanCitiesGeoJson.ready.then(() => {\r\n                japanCitiesGeoJson.show(this);\r\n            });\r\n        };\r\n        this.renderOverlayLayers = async () => {\r\n            // 選択していたレイヤーを復元\r\n            let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'));\r\n            if (selectedLayers === null) {\r\n                selectedLayers = [\"災害ニュース\", \"災害ボランティアセンター\", \"水害発生箇所\", \"自衛隊災害派遣\", \"消防災害出動\", \"消防火災出動\", \"消防救急出動\"];\r\n            }\r\n            // 標高図\r\n            const reliefTileLayer = new ReliefTileLayer_1.default();\r\n            reliefTileLayer.addOverlay(this, \"基本\");\r\n            if (selectedLayers.indexOf(ReliefTileLayer_1.default.displayName) > -1) {\r\n                // @ts-ignore\r\n                //firebase.analytics().logEvent('show_relief_layer');\r\n                reliefTileLayer.show(this);\r\n            }\r\n            // 雨雲レーダー\r\n            const rainTileLayer = new RainTileLayer_1.default();\r\n            rainTileLayer.addOverlay(this, \"基本\");\r\n            if (selectedLayers.indexOf(RainTileLayer_1.default.displayName) > -1) {\r\n                // @ts-ignore\r\n                //firebase.analytics().logEvent('show_rain_layer');\r\n                rainTileLayer.show(this);\r\n            }\r\n            // 水害発生箇所\r\n            /*\r\n            const floodArcGisJson = new FloodArcGisJson()\r\n            floodArcGisJson.ready.then(()=>{\r\n              floodArcGisJson.addOverlay(this, \"情報\")\r\n              if(selectedLayers.indexOf(FloodArcGisJson.displayName)>-1){\r\n                floodArcGisJson.show(this)\r\n              }\r\n            })\r\n            */\r\n            // 災害ボランティアセンター\r\n            /*\r\n            const volunteerGeoJson = new VolunteerGeoJson()\r\n            volunteerGeoJson.ready.then(()=>{\r\n              volunteerGeoJson.addOverlay(this, \"情報\")\r\n              if(selectedLayers.indexOf(VolunteerGeoJson.displayName)>-1){\r\n                volunteerGeoJson.show(this)\r\n              }\r\n            })\r\n            */\r\n            // 自衛隊災害派遣\r\n            const selfDefenseMarkers = new SelfDefenseMarkers_1.default(\"?daysago=\" + this.daysago);\r\n            selfDefenseMarkers.ready.then(() => {\r\n                selfDefenseMarkers.addOverlay(this, \"自衛隊\");\r\n                if (selectedLayers.indexOf(SelfDefenseMarkers_1.default.displayName) > -1) {\r\n                    selfDefenseMarkers.show(this);\r\n                }\r\n            });\r\n            // 消防災害出動\r\n            const fireDeptMarkers = new FireDeptMarkers_1.default(\"?daysago=\" + this.daysago);\r\n            fireDeptMarkers.ready.then(() => {\r\n                fireDeptMarkers.addOverlay(this);\r\n                if (selectedLayers.indexOf(FireDeptMarkers_1.default.crisisDisplayName) > -1) {\r\n                    fireDeptMarkers.showCrisis(this);\r\n                }\r\n                if (selectedLayers.indexOf(FireDeptMarkers_1.default.fireDisplayName) > -1) {\r\n                    fireDeptMarkers.showFire(this);\r\n                }\r\n                if (selectedLayers.indexOf(FireDeptMarkers_1.default.rescueDisplayName) > -1) {\r\n                    fireDeptMarkers.showRescue(this);\r\n                }\r\n                if (selectedLayers.indexOf(FireDeptMarkers_1.default.otherDisplayName) > -1) {\r\n                    fireDeptMarkers.showOther(this);\r\n                }\r\n            });\r\n            // 災害ニュース\r\n            const crisisNewsMarkers = new CrisisNewsMarkers_1.default(\"&daysago=\" + this.daysago);\r\n            crisisNewsMarkers.ready.then(() => {\r\n                crisisNewsMarkers.addOverlay(this);\r\n                if (selectedLayers.indexOf(CrisisNewsMarkers_1.default.displayName) > -1) {\r\n                    // @ts-ignore\r\n                    //firebase.analytics().logEvent('show_crisis_news');\r\n                    crisisNewsMarkers.show(this);\r\n                }\r\n            });\r\n            // 事故ニュース\r\n            const accidentNewsMarkers = new AccidentNewsMarkers_1.default(\"&daysago=\" + this.daysago);\r\n            accidentNewsMarkers.ready.then(() => {\r\n                accidentNewsMarkers.addOverlay(this);\r\n                if (selectedLayers.indexOf(AccidentNewsMarkers_1.default.displayName) > -1) {\r\n                    // @ts-ignore\r\n                    //firebase.analytics().logEvent('show_accident_news');\r\n                    accidentNewsMarkers.show(this);\r\n                }\r\n            });\r\n            // 事件ニュース\r\n            const incidentNewsMarkers = new IncidentNewsMarkers_1.default(\"&daysago=\" + this.daysago);\r\n            incidentNewsMarkers.ready.then(() => {\r\n                incidentNewsMarkers.addOverlay(this);\r\n                if (selectedLayers.indexOf(IncidentNewsMarkers_1.default.displayName) > -1) {\r\n                    // @ts-ignore\r\n                    //firebase.analytics().logEvent('show_incident_news');\r\n                    incidentNewsMarkers.show(this);\r\n                }\r\n            });\r\n            // 虐待ニュース\r\n            const childrenNewsMarkers = new ChildrenNewsMarkers_1.default(\"&daysago=\" + this.daysago);\r\n            childrenNewsMarkers.ready.then(() => {\r\n                childrenNewsMarkers.addOverlay(this);\r\n                if (selectedLayers.indexOf(ChildrenNewsMarkers_1.default.displayName) > -1) {\r\n                    // @ts-ignore\r\n                    //firebase.analytics().logEvent('show_children_news');\r\n                    childrenNewsMarkers.show(this);\r\n                }\r\n            });\r\n            // 薬物ニュース\r\n            const drugNewsMarkers = new DrugNewsMarkers_1.default(\"&daysago=\" + this.daysago);\r\n            drugNewsMarkers.ready.then(() => {\r\n                drugNewsMarkers.addOverlay(this);\r\n                if (selectedLayers.indexOf(DrugNewsMarkers_1.default.displayName) > -1) {\r\n                    // @ts-ignore\r\n                    //firebase.analytics().logEvent('show_drug_news');\r\n                    drugNewsMarkers.show(this);\r\n                }\r\n            });\r\n        };\r\n        this.ready = new Promise(async (resolve) => {\r\n            // Leafletの初期化\r\n            this.map = L.map('map', { zoomControl: false });\r\n            // TODO: overlayadd時にデータを読み込む\r\n            this.map.on('overlayadd', this.onOverlayAdd);\r\n            this.map.on('overlayremove', this.onOverlayRemove);\r\n            this.map.on('moveend', this.onMoveEnd);\r\n            this.map.on('zoomend', this.onZoomEnd);\r\n            this.initView();\r\n            this.initPanes();\r\n            this.renderControls();\r\n            await this.renderBaseLayer();\r\n            this.daysago = localStorage.getItem('leaflet-daysago');\r\n            if (this.daysago === null) {\r\n                this.daysago = \"3\";\r\n            }\r\n            this.renderOverlayLayers();\r\n            this.timelineControl.rangeInput.value = Number(this.daysago);\r\n            const inputEvent = new Event('input');\r\n            this.timelineControl.rangeInput.dispatchEvent(inputEvent);\r\n            resolve();\r\n        });\r\n    }\r\n}\r\nconst renderLeafLetPromise = new Promise(async (resolve) => {\r\n    const leaflet = new LeafletInitializer();\r\n    await leaflet.ready;\r\n    // レイヤー選択ボタンを開いておく\r\n    let element;\r\n    setTimeout(() => {\r\n        element = document.getElementsByClassName('leaflet-control-layers')[0];\r\n        element.classList.add('leaflet-control-layers-expanded');\r\n    }, 2000);\r\n    // 10秒後に閉じる\r\n    setTimeout(() => {\r\n        element.classList.remove('leaflet-control-layers-expanded');\r\n    }, 10000);\r\n    resolve();\r\n});\r\ndocument.addEventListener(\"ready\", async function () {\r\n    console.log(\"ready\");\r\n    await renderLeafLetPromise;\r\n}, false);\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/marker/AccidentNewsMarkers.ts":
/*!*******************************************!*\
  !*** ./src/marker/AccidentNewsMarkers.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst NewsMarkers_1 = __webpack_require__(/*! ./NewsMarkers */ \"./src/marker/NewsMarkers.ts\");\r\nclass AccidentNewsMarkers extends NewsMarkers_1.default {\r\n    constructor(params) {\r\n        super(AccidentNewsMarkers.displayName, AccidentNewsMarkers.url + params);\r\n    }\r\n}\r\nexports.default = AccidentNewsMarkers;\r\nAccidentNewsMarkers.displayName = \"事故ニュース\";\r\nAccidentNewsMarkers.url = \"/news?category=accident\";\r\n\n\n//# sourceURL=webpack:///./src/marker/AccidentNewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/ChildrenNewsMarkers.ts":
/*!*******************************************!*\
  !*** ./src/marker/ChildrenNewsMarkers.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst NewsMarkers_1 = __webpack_require__(/*! ./NewsMarkers */ \"./src/marker/NewsMarkers.ts\");\r\nclass ChildrenNewsMarkers extends NewsMarkers_1.default {\r\n    constructor(params) {\r\n        super(ChildrenNewsMarkers.displayName, ChildrenNewsMarkers.url + params);\r\n    }\r\n}\r\nexports.default = ChildrenNewsMarkers;\r\nChildrenNewsMarkers.displayName = \"虐待ニュース\";\r\nChildrenNewsMarkers.url = \"/news?category=children\";\r\n\n\n//# sourceURL=webpack:///./src/marker/ChildrenNewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/CrisisNewsMarkers.ts":
/*!*****************************************!*\
  !*** ./src/marker/CrisisNewsMarkers.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst NewsMarkers_1 = __webpack_require__(/*! ./NewsMarkers */ \"./src/marker/NewsMarkers.ts\");\r\nclass CrisisNewsMarkers extends NewsMarkers_1.default {\r\n    constructor(params) {\r\n        super(CrisisNewsMarkers.displayName, CrisisNewsMarkers.url + params);\r\n    }\r\n}\r\nexports.default = CrisisNewsMarkers;\r\nCrisisNewsMarkers.displayName = \"災害ニュース\";\r\nCrisisNewsMarkers.url = \"/news?category=crisis\";\r\n\n\n//# sourceURL=webpack:///./src/marker/CrisisNewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/DrugNewsMarkers.ts":
/*!***************************************!*\
  !*** ./src/marker/DrugNewsMarkers.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst NewsMarkers_1 = __webpack_require__(/*! ./NewsMarkers */ \"./src/marker/NewsMarkers.ts\");\r\nclass DrugNewsMarkers extends NewsMarkers_1.default {\r\n    constructor(params) {\r\n        super(DrugNewsMarkers.displayName, DrugNewsMarkers.url + params);\r\n    }\r\n}\r\nexports.default = DrugNewsMarkers;\r\nDrugNewsMarkers.displayName = \"薬物ニュース\";\r\nDrugNewsMarkers.url = \"/news?category=drug\";\r\n\n\n//# sourceURL=webpack:///./src/marker/DrugNewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/FireDeptMarkers.ts":
/*!***************************************!*\
  !*** ./src/marker/FireDeptMarkers.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Markers_1 = __webpack_require__(/*! ./Markers */ \"./src/marker/Markers.ts\");\r\nclass FireDeptMarkers extends Markers_1.default {\r\n    constructor(params) {\r\n        super(null, FireDeptMarkers.url + params, null);\r\n        this.fireDeptDispatchCrisis = [];\r\n        this.fireDeptDispatchFire = [];\r\n        this.fireDeptDispatchRescue = [];\r\n        this.fireDeptDispatchOther = [];\r\n        this.fireDeptDispatchCrisisLayerGroup = null;\r\n        this.fireDeptDispatchFireLayerGroup = null;\r\n        this.fireDeptDispatchRescueLayerGroup = null;\r\n        this.fireDeptDispatchOtherLayerGroup = null;\r\n        this.layerGroups = [];\r\n        this.getContent = (element) => {\r\n            let created_at = new Date(element.created_at._seconds * 1000);\r\n            let content = \"<b>\" + element.division + \"</b>:\" + element.detail + '<br /> (' + created_at.toLocaleString() + ')';\r\n            return content;\r\n        };\r\n        this.getIcon = (element) => {\r\n            let icon;\r\n            switch (element.category) {\r\n                case \"crisis\":\r\n                    icon = FireDeptMarkers.firetruckIcon;\r\n                    break;\r\n                case \"fire\":\r\n                    icon = FireDeptMarkers.fireIcon;\r\n                    break;\r\n                case \"rescue\":\r\n                    icon = FireDeptMarkers.ambulanceIcon;\r\n                    break;\r\n                case \"caution\":\r\n                    icon = FireDeptMarkers.cautionIcon;\r\n                    break;\r\n                case \"survey\":\r\n                    icon = FireDeptMarkers.cautionIcon;\r\n                    break;\r\n                case \"support\":\r\n                    FireDeptMarkers.cautionIcon;\r\n                    break;\r\n            }\r\n            return icon;\r\n        };\r\n        this.pushTo = (element, marker) => {\r\n            switch (element.category) {\r\n                case \"crisis\":\r\n                    this.fireDeptDispatchCrisis.push(marker);\r\n                    break;\r\n                case \"fire\":\r\n                    this.fireDeptDispatchFire.push(marker);\r\n                    break;\r\n                case \"rescue\":\r\n                    this.fireDeptDispatchRescue.push(marker);\r\n                    break;\r\n                case \"caution\":\r\n                    this.fireDeptDispatchOther.push(marker);\r\n                    break;\r\n                case \"survey\":\r\n                    this.fireDeptDispatchOther.push(marker);\r\n                    break;\r\n                case \"support\":\r\n                    this.fireDeptDispatchOther.push(marker);\r\n                    break;\r\n            }\r\n        };\r\n    }\r\n    addOverlay(leaflet) {\r\n        this.fireDeptDispatchCrisisLayerGroup = L.layerGroup(this.fireDeptDispatchCrisis);\r\n        this.layerGroups.push(this.fireDeptDispatchCrisisLayerGroup);\r\n        this.fireDeptDispatchFireLayerGroup = L.layerGroup(this.fireDeptDispatchFire);\r\n        this.layerGroups.push(this.fireDeptDispatchFireLayerGroup);\r\n        this.fireDeptDispatchRescueLayerGroup = L.layerGroup(this.fireDeptDispatchRescue);\r\n        this.layerGroups.push(this.fireDeptDispatchFireLayerGroup);\r\n        this.fireDeptDispatchOtherLayerGroup = L.layerGroup(this.fireDeptDispatchOther);\r\n        this.layerGroups.push(this.fireDeptDispatchFireLayerGroup);\r\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchCrisisLayerGroup, FireDeptMarkers.crisisDisplayName, \"消防署\");\r\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchFireLayerGroup, FireDeptMarkers.fireDisplayName, \"消防署\");\r\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchRescueLayerGroup, FireDeptMarkers.rescueDisplayName, \"消防署\");\r\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchOtherLayerGroup, FireDeptMarkers.otherDisplayName, \"消防署\");\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup);\r\n    }\r\n    showCrisis(leaflet) {\r\n        leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup);\r\n    }\r\n    showFire(leaflet) {\r\n        leaflet.map.addLayer(this.fireDeptDispatchFireLayerGroup);\r\n    }\r\n    showRescue(leaflet) {\r\n        leaflet.map.addLayer(this.fireDeptDispatchRescueLayerGroup);\r\n    }\r\n    showOther(leaflet) {\r\n        leaflet.map.addLayer(this.fireDeptDispatchOtherLayerGroup);\r\n    }\r\n}\r\nexports.default = FireDeptMarkers;\r\nFireDeptMarkers.crisisDisplayName = \"消防災害出動\";\r\nFireDeptMarkers.fireDisplayName = \"消防火災出動\";\r\nFireDeptMarkers.rescueDisplayName = \"消防救急出動\";\r\nFireDeptMarkers.otherDisplayName = \"消防その他出動\";\r\nFireDeptMarkers.url = \"/firedept\";\r\nFireDeptMarkers.firetruckIcon = L.icon({\r\n    iconUrl: '/img/firetruck_fast.png',\r\n    iconSize: [20, 20],\r\n    iconAnchor: [10, 10],\r\n    popupAnchor: [0, -10]\r\n});\r\nFireDeptMarkers.ambulanceIcon = L.icon({\r\n    iconUrl: '/img/ambulance_fast.png',\r\n    iconSize: [20, 20],\r\n    iconAnchor: [10, 10],\r\n    popupAnchor: [0, -10]\r\n});\r\nFireDeptMarkers.fireIcon = L.icon({\r\n    iconUrl: '/img/fire_icon.png',\r\n    iconSize: [20, 20],\r\n    iconAnchor: [10, 10],\r\n    popupAnchor: [0, -10]\r\n});\r\nFireDeptMarkers.cautionIcon = L.icon({\r\n    iconUrl: '/img/caution.png',\r\n    iconSize: [20, 20],\r\n    iconAnchor: [10, 10],\r\n    popupAnchor: [0, -10]\r\n});\r\n\n\n//# sourceURL=webpack:///./src/marker/FireDeptMarkers.ts?");

/***/ }),

/***/ "./src/marker/IncidentNewsMarkers.ts":
/*!*******************************************!*\
  !*** ./src/marker/IncidentNewsMarkers.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst NewsMarkers_1 = __webpack_require__(/*! ./NewsMarkers */ \"./src/marker/NewsMarkers.ts\");\r\nclass IncidentNewsMarkers extends NewsMarkers_1.default {\r\n    constructor(params) {\r\n        super(IncidentNewsMarkers.displayName, IncidentNewsMarkers.url + params);\r\n    }\r\n}\r\nexports.default = IncidentNewsMarkers;\r\nIncidentNewsMarkers.displayName = \"事件ニュース\";\r\nIncidentNewsMarkers.url = \"/news?category=incident\";\r\n\n\n//# sourceURL=webpack:///./src/marker/IncidentNewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/Markers.ts":
/*!*******************************!*\
  !*** ./src/marker/Markers.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n *  lat, longプロパティを持つjsonを読み込んで描画する基底クラス\r\n */\r\nclass Markers {\r\n    constructor(displayName, url, icon) {\r\n        this.markers = [];\r\n        this.layerGroup = null;\r\n        /**\r\n         * 描画したくないマーカーの条件があるときに上書きする\r\n         */\r\n        this.shouldIgnore = (element) => {\r\n            return false;\r\n        };\r\n        /**\r\n         * 条件に応じてアイコンを切り替えたいときに上書きする\r\n         */\r\n        this.getIcon = (element) => {\r\n            return this.icon;\r\n        };\r\n        /**\r\n         * マーカーのポップアップに指定するHTMLを構築するために上書きする\r\n         */\r\n        this.getContent = (element) => {\r\n            return null;\r\n        };\r\n        this.forEach = (element) => {\r\n            if (element.lat === undefined || element.lat === null || element.long === undefined || element.long === null) {\r\n                return;\r\n            }\r\n            if (this.shouldIgnore(element)) {\r\n                return;\r\n            }\r\n            const icon = this.getIcon(element);\r\n            let marker;\r\n            if (icon === null) {\r\n                marker = L.marker([element.lat, element.long], { pane: 'pane660' });\r\n            }\r\n            else {\r\n                marker = L.marker([element.lat, element.long], { icon: icon, pane: 'pane660' });\r\n            }\r\n            const content = this.getContent(element);\r\n            marker.bindPopup(content);\r\n            this.pushTo(element, marker);\r\n        };\r\n        this.displayName = displayName;\r\n        this.url = url;\r\n        this.icon = icon;\r\n        this.ready = new Promise(async (resolve) => {\r\n            const res = await fetch(this.url);\r\n            let json = await res.json();\r\n            json.forEach(this.forEach);\r\n            resolve();\r\n        });\r\n    }\r\n    /**\r\n     * 条件に応じて複数のカテゴリに分類して表示したいときに上書きする\r\n     * addOverlayも上書きする必要がある\r\n     * @param element\r\n     * @param marker\r\n     */\r\n    pushTo(element, marker) {\r\n        this.markers.push(marker);\r\n    }\r\n    addOverlay(leaflet, groupName) {\r\n        this.layerGroup = L.layerGroup(this.markers);\r\n        leaflet.layerControl.addOverlay(this.layerGroup, this.displayName, groupName);\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this.layerGroup);\r\n    }\r\n    hide(leaflet) {\r\n        leaflet.map.removeLayer(this.layerGroup);\r\n    }\r\n}\r\nexports.default = Markers;\r\n\n\n//# sourceURL=webpack:///./src/marker/Markers.ts?");

/***/ }),

/***/ "./src/marker/NewsMarkers.ts":
/*!***********************************!*\
  !*** ./src/marker/NewsMarkers.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Markers_1 = __webpack_require__(/*! ./Markers */ \"./src/marker/Markers.ts\");\r\nclass NewsMarkers extends Markers_1.default {\r\n    constructor(displayName, url) {\r\n        super(displayName, url, NewsMarkers.icon);\r\n        this.clusterGroup = null;\r\n        this.shouldIgnore = (element) => {\r\n            return (element.og_title === undefined || element.og_title === null\r\n                || element.og_desc === undefined || element.og_desc === null);\r\n        };\r\n        this.getContent = (element) => {\r\n            const created_at = new Date(element.created_at._seconds * 1000);\r\n            let content = \"<h3 title='\" + element.category + \"'>\" + element.og_title + \"</h3><p>\";\r\n            if (element.og_url) {\r\n                content = content + \"<a href='\" + element.og_url + \"'>\";\r\n            }\r\n            content = content + element.og_desc;\r\n            if (element.og_url) {\r\n                content = content + \"</a>\";\r\n            }\r\n            content = content + \" (\" + created_at.toLocaleString() + \")\";\r\n            content = content + \"</p>\";\r\n            if (element.og_image) {\r\n                content = content + \"<img width=150 height=100 src='\" + element.og_image + \"' />\";\r\n            }\r\n            return content;\r\n        };\r\n        this.addOverlay = (leaflet) => {\r\n            // @ts-ignore\r\n            const newsClusterGroup = L.markerClusterGroup.layerSupport({ clusterPane: 'pane690' });\r\n            const newsLayerGroup = L.layerGroup(this.markers);\r\n            newsClusterGroup.addTo(leaflet.map);\r\n            newsClusterGroup.checkIn(newsLayerGroup);\r\n            this.layerGroup = newsLayerGroup;\r\n            this.clusterGroup = newsClusterGroup;\r\n            leaflet.layerControl.addOverlay(this.layerGroup, this.displayName, \"ニュース\");\r\n        };\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this.layerGroup);\r\n    }\r\n}\r\nexports.default = NewsMarkers;\r\nNewsMarkers.icon = L.icon({\r\n    iconUrl: '/img/news_icon.png',\r\n    iconSize: [30, 30],\r\n    iconAnchor: [15, 15],\r\n    popupAnchor: [0, -15]\r\n});\r\n\n\n//# sourceURL=webpack:///./src/marker/NewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/SelfDefenseMarkers.ts":
/*!******************************************!*\
  !*** ./src/marker/SelfDefenseMarkers.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst Markers_1 = __webpack_require__(/*! ./Markers */ \"./src/marker/Markers.ts\");\r\nclass SelfDefenseMarkers extends Markers_1.default {\r\n    constructor(params) {\r\n        super(SelfDefenseMarkers.displayName, SelfDefenseMarkers.url + params, SelfDefenseMarkers.selfDefenseIcon);\r\n        this.getIcon = (element) => {\r\n            if (element.text.indexOf('給水') !== -1) {\r\n                return SelfDefenseMarkers.waterTruckIcon;\r\n            }\r\n            else {\r\n                return SelfDefenseMarkers.selfDefenseIcon;\r\n            }\r\n        };\r\n        this.getContent = (element) => {\r\n            const tweeted_at = new Date(element.tweeted_at._seconds * 1000);\r\n            var content = \"<h3><img width=20 height=20 src='\" + element.icon_url + \"' />\" + element.display_name + \"</h3>\";\r\n            content = content + \"<p>\";\r\n            content = content + \"<a href='https://twitter.com/\" + element.screen_name + \"/status/\" + element.tweet_id_str + \"'>\";\r\n            content = content + element.text;\r\n            content = content + \"</a>\";\r\n            content = content + \" (\" + tweeted_at.toLocaleString() + \")\";\r\n            content = content + \"</p>\";\r\n            if (element.photos.length > 0) {\r\n                content = content + \"<img width=150 height=100 src='\" + element.photos[0] + \"' />\";\r\n            }\r\n            return content;\r\n        };\r\n    }\r\n}\r\nexports.default = SelfDefenseMarkers;\r\nSelfDefenseMarkers.displayName = \"自衛隊災害派遣\";\r\nSelfDefenseMarkers.url = \"/selfdefense\";\r\nSelfDefenseMarkers.selfDefenseIcon = L.icon({\r\n    iconUrl: '/img/selfdefense.png',\r\n    iconSize: [20, 20],\r\n    iconAnchor: [10, 10],\r\n    popupAnchor: [0, -10]\r\n});\r\nSelfDefenseMarkers.waterTruckIcon = L.icon({\r\n    iconUrl: '/img/water_truck.png',\r\n    iconSize: [20, 20],\r\n    iconAnchor: [10, 10],\r\n    popupAnchor: [0, -10]\r\n});\r\n\n\n//# sourceURL=webpack:///./src/marker/SelfDefenseMarkers.ts?");

/***/ }),

/***/ "./src/tile/PaleTileLayer.ts":
/*!***********************************!*\
  !*** ./src/tile/PaleTileLayer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass PaleTileLayer extends L.TileLayer {\r\n    constructor() {\r\n        super(PaleTileLayer.urlTemplate, PaleTileLayer.options);\r\n    }\r\n    addOverlay(leaflet) {\r\n        leaflet.layerControl.addOverlay(this, PaleTileLayer.displayName, \"基本\");\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this);\r\n    }\r\n    hide(leaflet) {\r\n        leaflet.map.removeLayer(this);\r\n    }\r\n}\r\nexports.default = PaleTileLayer;\r\nPaleTileLayer.displayName = '国土地理院淡色地図';\r\nPaleTileLayer.urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';\r\nPaleTileLayer.options = {\r\n    id: 'CyberJapanPaleTile',\r\n    attribution: '<a href=\"https://maps.gsi.go.jp/development/ichiran.html#pale\">国土地理院淡色地図</a>',\r\n    minZoom: 5,\r\n    maxZoom: 18,\r\n    opacity: 1,\r\n};\r\n\n\n//# sourceURL=webpack:///./src/tile/PaleTileLayer.ts?");

/***/ }),

/***/ "./src/tile/RainTileLayer.ts":
/*!***********************************!*\
  !*** ./src/tile/RainTileLayer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass RainTileLayer extends L.TileLayer {\r\n    constructor() {\r\n        super(RainTileLayer.urlTemplate, RainTileLayer.options);\r\n        this.getTileUrl = (coords) => {\r\n            //雨雲リクエスト日付の作成\r\n            const now = new Date();\r\n            const year = now.getFullYear();\r\n            const month = now.getMonth() + 1;\r\n            let monthStr = String(month);\r\n            if (month < 10)\r\n                monthStr = '0' + String(month);\r\n            const day = now.getDate();\r\n            let dayStr = String(day);\r\n            if (day < 10)\r\n                dayStr = '0' + String(day);\r\n            const hours = now.getHours();\r\n            let hoursStr = String(hours);\r\n            if (hours < 10)\r\n                hoursStr = '0' + String(hours);\r\n            let minutes = now.getMinutes();\r\n            minutes *= 0.1;\r\n            minutes = Math.floor(minutes);\r\n            minutes *= 10;\r\n            let minutesStr = String(minutes);\r\n            if (minutes < 10)\r\n                minutesStr = '0' + String(minutes);\r\n            const dateStr = \"\" + String(year) + monthStr + dayStr + hoursStr + minutesStr;\r\n            // @ts-ignore\r\n            return L.Util.template(this._url, L.extend({\r\n                d: dateStr,\r\n                x: coords.x,\r\n                y: Math.pow(2, this._getZoomForUrl() - 1) - 1 - coords.y,\r\n                z: this._getZoomForUrl() + 1\r\n            }, this.options));\r\n        };\r\n    }\r\n    addOverlay(leaflet, groupName) {\r\n        leaflet.layerControl.addOverlay(this, RainTileLayer.displayName, groupName);\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this);\r\n    }\r\n    hide(leaflet) {\r\n        leaflet.map.removeLayer(this);\r\n    }\r\n}\r\nexports.default = RainTileLayer;\r\nRainTileLayer.displayName = \"YOLP 雨雲レーダー\";\r\nRainTileLayer.urlTemplate = 'http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}';\r\nRainTileLayer.options = {\r\n    id: 'YOLPRainRadar',\r\n    attribution: '<a href=\"https://developer.yahoo.co.jp/webapi/map/\">Yahoo! Open Local Platform</a>',\r\n    minZoom: null,\r\n    maxZoom: 18,\r\n    opacity: 0.5,\r\n    pane: 'pane650'\r\n};\r\n\n\n//# sourceURL=webpack:///./src/tile/RainTileLayer.ts?");

/***/ }),

/***/ "./src/tile/ReliefTileLayer.ts":
/*!*************************************!*\
  !*** ./src/tile/ReliefTileLayer.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass ReliefTileLayer extends L.TileLayer {\r\n    constructor() {\r\n        super(ReliefTileLayer.urlTemplate, ReliefTileLayer.options);\r\n    }\r\n    addOverlay(leaflet, groupName) {\r\n        leaflet.layerControl.addOverlay(this, ReliefTileLayer.displayName, groupName);\r\n    }\r\n    show(leaflet) {\r\n        leaflet.map.addLayer(this);\r\n    }\r\n    hide(leaflet) {\r\n        leaflet.map.removeLayer(this);\r\n    }\r\n}\r\nexports.default = ReliefTileLayer;\r\nReliefTileLayer.displayName = '国土地理院色別標高図';\r\nReliefTileLayer.urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png';\r\nReliefTileLayer.options = {\r\n    id: 'CyberJapanReliefTile',\r\n    attribution: '<a href=\"https://maps.gsi.go.jp/development/ichiran.html#relief\">国土地理院色別標高図</a>',\r\n    minZoom: 5,\r\n    maxZoom: 15,\r\n    opacity: 0.4,\r\n};\r\n\n\n//# sourceURL=webpack:///./src/tile/ReliefTileLayer.ts?");

/***/ })

/******/ });