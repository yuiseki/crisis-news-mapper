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
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * 日本全体表示に戻るボタン\n */\nclass ExpandControl extends L.Control {\n    constructor(options) {\n        super(options);\n        this.onAdd = (map) => {\n            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\n            container.innerHTML = '<i class=\"fas fa-expand\"></i>';\n            container.style.fontSize = '22px';\n            container.style.textAlign = 'center';\n            container.style.display = 'table-cell';\n            container.style.verticalAlign = 'middle';\n            container.style.backgroundColor = 'white';\n            container.style.cursor = 'pointer';\n            container.style.width = '30px';\n            container.style.height = '30px';\n            container.onclick = function () {\n                map.setView([36.56028, 139.19333], 6);\n            };\n            return container;\n        };\n    }\n}\nexports.default = ExpandControl;\n\n\n//# sourceURL=webpack:///./src/control/ExpandControl.ts?");

/***/ }),

/***/ "./src/control/GithubControl.ts":
/*!**************************************!*\
  !*** ./src/control/GithubControl.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * GitHub移動ボタン\n */\nclass GithubControl extends L.Control {\n    constructor(options) {\n        super(options);\n        this.onAdd = (map) => {\n            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\n            container.innerHTML = '<i class=\"fab fa-github\"></i>';\n            container.style.fontSize = '30px';\n            container.style.textAlign = 'center';\n            container.style.display = 'table-cell';\n            container.style.verticalAlign = 'middle';\n            container.style.backgroundColor = 'white';\n            container.style.cursor = 'pointer';\n            container.style.width = '40px';\n            container.style.height = '40px';\n            container.onclick = function () {\n                const url = 'https://github.com/yuiseki/crisis-news-mapper';\n                const newWindow = window.open(url, '_blank');\n                newWindow.focus();\n            };\n            return container;\n        };\n    }\n}\nexports.default = GithubControl;\n\n\n//# sourceURL=webpack:///./src/control/GithubControl.ts?");

/***/ }),

/***/ "./src/control/SponsorControl.ts":
/*!***************************************!*\
  !*** ./src/control/SponsorControl.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * スポンサー募集ボタン\n */\nclass SponsorControl extends L.Control {\n    constructor(options) {\n        super(options);\n        this.onAdd = (map) => {\n            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');\n            container.innerHTML = '<span class=\"gatagata\">💸</span>';\n            container.style.fontSize = '30px';\n            container.style.textAlign = 'center';\n            container.style.display = 'table-cell';\n            container.style.verticalAlign = 'middle';\n            container.style.backgroundColor = 'white';\n            container.style.cursor = 'pointer';\n            container.style.width = '40px';\n            container.style.height = '40px';\n            const modalContent = `\n    <div style=\"text-align: center;margin: auto;\">\n    <h1>運営費支援のお願い</h1>\n    <p>毎月3000円ほどかかっているので一年間で36000円くらいの出費になる予測です。オタスケ……</p>\n    <h2>kyashによる支援</h2>\n    <p><a href=\"kyash://qr/u/4235924052635520477\">kyash://qr/u/4235924052635520477</a></p>\n    <p><img width=\"200\" height=\"200\" src=\"/img/kyash_qr_yuiseki.png\"></p>\n    <h2>polcaによ支援</h2>\n    <p><a href=\"https://polca.jp/projects/gRNhd5LhkQ6\">https://polca.jp/projects/gRNhd5LhkQ6</a></p>\n    <p><img width=\"200\" height=\"200\" src=\"/img/polca_qr.png\"></p>\n    </div>\n    `;\n            container.onclick = function () {\n                map.openModal({\n                    content: modalContent,\n                    closeTitle: '✕',\n                    zIndex: 10000,\n                    transitionDuration: 0,\n                });\n            };\n            return container;\n        };\n    }\n}\nexports.default = SponsorControl;\n\n\n//# sourceURL=webpack:///./src/control/SponsorControl.ts?");

/***/ }),

/***/ "./src/geojson/FloodArcGisJson.ts":
/*!****************************************!*\
  !*** ./src/geojson/FloodArcGisJson.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst GeoJson_1 = __webpack_require__(/*! ./GeoJson */ \"./src/geojson/GeoJson.ts\");\n/**\n * 水害情報GeoJson\n * http://crs.bosai.go.jp/DynamicCRS/index.html?appid=9424c7b32d784b60a9b70d59ff32ac96\n * ここからデータを拝借している\n * コツ\n * Chrome developer tools の Network タブで `query` で filter してそれっぽいデータを探す\n * https://services8.arcgis.com/rGc6Kyg1ETR5TWY9/arcgis/rest/services/river19/FeatureServer/0/query?f=pbf&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&maxRecordCountFactor=4&outSR=102100&resultOffset=0&resultRecordCount=8000&cacheHint=true&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1.0583354500042303%2C%22extent%22%3A%7B%22xmin%22%3A15203799.647455202%2C%22ymin%22%3A4108790.7298450815%2C%22xmax%22%3A15716437.813743742%2C%22ymax%22%3A4655115.429990286%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D\n *   - 余計なパラメーターを全部削る\n *   - `f=pbf` を `f=json` にする\n *   - `outSR=xxxx` を `outSR=4326` にする\n * https://services8.arcgis.com/rGc6Kyg1ETR5TWY9/arcgis/rest/services/river19/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&outSR=4326&outFields=*&maxRecordCountFactor=4&resultOffset=0&resultRecordCount=8000&cacheHint=true\n * こうしないとarcgisToGeoJSONでGeoJSONに変換できる座標を持ったJSONにならない\n */\nclass FloodArcGisJson extends GeoJson_1.default {\n    constructor() {\n        super(FloodArcGisJson.displayName, FloodArcGisJson.url, FloodArcGisJson.icon, null, 'pane660');\n        this.toGeoJson = (arcgisjson) => {\n            // @ts-ignore\n            return ArcgisToGeojsonUtils.arcgisToGeoJSON(arcgisjson);\n        };\n        this.onEachFeature = (feature, layer) => {\n            layer.bindPopup(feature.properties['name']);\n        };\n    }\n}\nexports.default = FloodArcGisJson;\nFloodArcGisJson.displayName = \"水害発生箇所\";\nFloodArcGisJson.url = \"/geojson/2019_typhoon19_flood.arcgisjson\";\nFloodArcGisJson.icon = L.icon({\n    iconUrl: '/img/flood.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\n\n\n//# sourceURL=webpack:///./src/geojson/FloodArcGisJson.ts?");

/***/ }),

/***/ "./src/geojson/GeoJson.ts":
/*!********************************!*\
  !*** ./src/geojson/GeoJson.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * GeoJsonを表現する基底クラス\n */\nclass GeoJson {\n    /**\n     * コンストラクタ\n     * await geojson.ready すると geojson\b を読み込む\n     * @param displayName geojsonの表示名\n     * @param url jsonのURL\n     * @param icon 表示に使いたいアイコン\n     */\n    constructor(displayName, url, icon, style, pane) {\n        /**\n         * jsonがGeoJSONではないとき、変換処理をする必要があるときに上書きする\n         */\n        this.toGeoJson = (json) => {\n            return json;\n        };\n        /**\n         * coordinatesが[lat, lng]形式ではないときに上書きする\n         */\n        this.pointToLayer = (feature, coordinates) => {\n            return L.marker(coordinates, { icon: this.icon, pane: this.pane });\n        };\n        this.onEachFeature = (feature, layer) => {\n        };\n        this.displayName = displayName;\n        this.url = url;\n        this.icon = icon;\n        this.style = style;\n        this.pane = pane;\n        this.ready = new Promise(async (resolve) => {\n            const res = await fetch(this.url);\n            let json = await res.json();\n            json = this.toGeoJson(json);\n            this.geojson = L.geoJSON(json, {\n                style: this.style,\n                pointToLayer: this.pointToLayer,\n                onEachFeature: this.onEachFeature\n            });\n            resolve();\n        });\n    }\n    addOverlay(leaflet, groupName) {\n        leaflet.layerControl.addOverlay(this.geojson, this.displayName, groupName);\n    }\n    show(leaflet) {\n        leaflet.map.addLayer(this.geojson);\n    }\n    hide(leaflet) {\n        leaflet.map.removeLayer(this.geojson);\n    }\n}\nexports.default = GeoJson;\n\n\n//# sourceURL=webpack:///./src/geojson/GeoJson.ts?");

/***/ }),

/***/ "./src/geojson/JapanCitiesGeoJson.ts":
/*!*******************************************!*\
  !*** ./src/geojson/JapanCitiesGeoJson.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst GeoJson_1 = __webpack_require__(/*! ./GeoJson */ \"./src/geojson/GeoJson.ts\");\nclass JapanCitiesGeoJson extends GeoJson_1.default {\n    constructor() {\n        super(JapanCitiesGeoJson.displayName, JapanCitiesGeoJson.url, JapanCitiesGeoJson.icon, JapanCitiesGeoJson.style);\n        this.onEachFeature = (feature, layer) => {\n            layer.bindTooltip(feature.properties.cityname_k);\n        };\n    }\n}\nexports.default = JapanCitiesGeoJson;\nJapanCitiesGeoJson.displayName = \"市区町村境界\";\nJapanCitiesGeoJson.url = \"/geojson/japan_cities.geojson\";\nJapanCitiesGeoJson.icon = null;\nJapanCitiesGeoJson.style = {\n    weight: 2,\n    opacity: 0.3\n};\n\n\n//# sourceURL=webpack:///./src/geojson/JapanCitiesGeoJson.ts?");

/***/ }),

/***/ "./src/geojson/JapanPrefsGeoJson.ts":
/*!******************************************!*\
  !*** ./src/geojson/JapanPrefsGeoJson.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst GeoJson_1 = __webpack_require__(/*! ./GeoJson */ \"./src/geojson/GeoJson.ts\");\nclass JapanPrefsGeoJson extends GeoJson_1.default {\n    constructor() {\n        super(JapanPrefsGeoJson.displayName, JapanPrefsGeoJson.url, JapanPrefsGeoJson.icon, JapanPrefsGeoJson.style);\n    }\n}\nexports.default = JapanPrefsGeoJson;\nJapanPrefsGeoJson.displayName = \"都道府県境界\";\nJapanPrefsGeoJson.url = \"/geojson/japan.geojson\";\nJapanPrefsGeoJson.icon = null;\nJapanPrefsGeoJson.style = {\n    weight: 5\n};\n\n\n//# sourceURL=webpack:///./src/geojson/JapanPrefsGeoJson.ts?");

/***/ }),

/***/ "./src/geojson/VolunteerGeoJson.ts":
/*!*****************************************!*\
  !*** ./src/geojson/VolunteerGeoJson.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst GeoJson_1 = __webpack_require__(/*! ./GeoJson */ \"./src/geojson/GeoJson.ts\");\n/**\n * 災害ボランティアセンターGeoJson\n */\nclass VolunteerGeoJson extends GeoJson_1.default {\n    constructor() {\n        super(VolunteerGeoJson.displayName, VolunteerGeoJson.url, VolunteerGeoJson.icon, null, \"pane660\");\n        this.pointToLayer = (feature, coordinates) => {\n            let lat = feature.properties['緯度_十進数_'];\n            let long = feature.properties['経度_十進数_'];\n            // @ts-ignore\n            return L.marker([lat, long], { icon: VolunteerGeoJson.icon });\n        };\n        this.onEachFeature = (feature, layer) => {\n            let content = '<b>' + feature.properties['都道府県名'] + feature.properties['市町村名'] + '</b><br />';\n            content = content + feature.properties['災害ボランティアセンター名'] + '<br />';\n            if (feature.properties['詳細情報URL']) {\n                content = content + '<a href=\"' + feature.properties['詳細情報URL'] + '\">ウェブサイト</a><br />';\n            }\n            if (feature.properties['電話番号']) {\n                content = content + '電話番号: ' + feature.properties['電話番号'];\n            }\n            layer.bindPopup(content);\n        };\n    }\n}\nexports.default = VolunteerGeoJson;\nVolunteerGeoJson.displayName = \"災害ボランティアセンター\";\nVolunteerGeoJson.url = \"/geojson/2019_typhoon19_volunteer.geojson\";\nVolunteerGeoJson.icon = L.icon({\n    iconUrl: '/img/volunteer.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\n\n\n//# sourceURL=webpack:///./src/geojson/VolunteerGeoJson.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n// control\nconst SponsorControl_1 = __webpack_require__(/*! ./control/SponsorControl */ \"./src/control/SponsorControl.ts\");\nconst GithubControl_1 = __webpack_require__(/*! ./control/GithubControl */ \"./src/control/GithubControl.ts\");\nconst ExpandControl_1 = __webpack_require__(/*! ./control/ExpandControl */ \"./src/control/ExpandControl.ts\");\n// tile\nconst PaleTileLayer_1 = __webpack_require__(/*! ./tile/PaleTileLayer */ \"./src/tile/PaleTileLayer.ts\");\nconst ReliefTileLayer_1 = __webpack_require__(/*! ./tile/ReliefTileLayer */ \"./src/tile/ReliefTileLayer.ts\");\nconst RainTileLayer_1 = __webpack_require__(/*! ./tile/RainTileLayer */ \"./src/tile/RainTileLayer.ts\");\n// geojson\nconst FloodArcGisJson_1 = __webpack_require__(/*! ./geojson/FloodArcGisJson */ \"./src/geojson/FloodArcGisJson.ts\");\nconst VolunteerGeoJson_1 = __webpack_require__(/*! ./geojson/VolunteerGeoJson */ \"./src/geojson/VolunteerGeoJson.ts\");\n// marker\nconst NewsMarkers_1 = __webpack_require__(/*! ./marker/NewsMarkers */ \"./src/marker/NewsMarkers.ts\");\nconst SelfDefenseMarkers_1 = __webpack_require__(/*! ./marker/SelfDefenseMarkers */ \"./src/marker/SelfDefenseMarkers.ts\");\nconst FireDeptMarkers_1 = __webpack_require__(/*! ./marker/FireDeptMarkers */ \"./src/marker/FireDeptMarkers.ts\");\nconst JapanPrefsGeoJson_1 = __webpack_require__(/*! ./geojson/JapanPrefsGeoJson */ \"./src/geojson/JapanPrefsGeoJson.ts\");\nconst JapanCitiesGeoJson_1 = __webpack_require__(/*! ./geojson/JapanCitiesGeoJson */ \"./src/geojson/JapanCitiesGeoJson.ts\");\n// ツイートボタン\n// @ts-ignore\nwindow.twttr = (function (d, s, id) {\n    var js, fjs = d.getElementsByTagName(s)[0], \n    // @ts-ignore\n    t = window.twttr || {};\n    if (d.getElementById(id))\n        return t;\n    js = d.createElement(s);\n    js.id = id;\n    js.src = \"https://platform.twitter.com/widgets.js\";\n    fjs.parentNode.insertBefore(js, fjs);\n    t._e = [];\n    t.ready = function (f) {\n        t._e.push(f);\n    };\n    return t;\n}(document, \"script\", \"twitter-wjs\"));\n/**\n * Leafletを初期化するクラス\n */\nclass LeafletInitializer {\n    constructor() {\n        this.daysago = \"3\";\n        this.baseLayerData = null;\n        this.overlayLayerData = null;\n        this.onOverlayAdd = async (event) => {\n            let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'));\n            if (selectedLayers === null) {\n                selectedLayers = [];\n            }\n            if (selectedLayers.indexOf(event.name) === -1) {\n                selectedLayers.push(event.name);\n            }\n            localStorage.setItem('leaflet-selectedLayers', JSON.stringify(selectedLayers));\n        };\n        this.onOverlayRemove = (event) => {\n            let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'));\n            if (selectedLayers === null) {\n                selectedLayers = [];\n            }\n            if (selectedLayers.indexOf(event.name) > -1) {\n                selectedLayers.splice(selectedLayers.indexOf(event.name), 1);\n            }\n            localStorage.setItem('leaflet-selectedLayers', JSON.stringify(selectedLayers));\n        };\n        this.onMoveEnd = (event) => {\n            const center = this.map.getCenter();\n            const lat = center.lat;\n            const lng = center.lng;\n            localStorage.setItem('leaflet-center-lat', lat);\n            localStorage.setItem('leaflet-center-lng', lng);\n        };\n        this.onZoomEnd = (event) => {\n            localStorage.setItem('leaflet-zoom', this.map.getZoom());\n        };\n        this.onChangeTimeRange = (event) => {\n            console.log(event.value);\n            if (this.daysago != String(event.value)) {\n                this.daysago = String(event.value);\n                localStorage.setItem('leaflet-daysago', this.daysago);\n                location.reload();\n            }\n        };\n        this.initView = () => {\n            const lat = localStorage.getItem('leaflet-center-lat');\n            const lng = localStorage.getItem('leaflet-center-lng');\n            const zoom = localStorage.getItem('leaflet-zoom');\n            if (lat !== undefined && lat !== null\n                && lng !== undefined && lng !== null\n                && zoom !== undefined && zoom !== null) {\n                const center = [Number(lat), Number(lng)];\n                this.map.panTo(center);\n                this.map.setZoom(zoom);\n            }\n            else {\n                // 初期座標とズームを指定\n                this.map.setView([36.56028, 139.19333], 6);\n            }\n        };\n        /**\n         * マーカーの重なる順番を指定するために使うやつを初期化しておく\n         * https://leafletjs.com/reference-1.0.0.html#map-pane\n         */\n        this.initPanes = () => {\n            this.map.createPane(\"pane610\").style.zIndex = \"610\";\n            this.map.createPane(\"pane620\").style.zIndex = \"620\";\n            this.map.createPane(\"pane630\").style.zIndex = \"630\";\n            this.map.createPane(\"pane640\").style.zIndex = \"640\";\n            this.map.createPane(\"pane650\").style.zIndex = \"650\";\n            this.map.createPane(\"pane660\").style.zIndex = \"660\";\n            this.map.createPane(\"pane670\").style.zIndex = \"670\";\n            this.map.createPane(\"pane680\").style.zIndex = \"680\";\n            this.map.createPane(\"pane690\").style.zIndex = \"690\";\n        };\n        this.renderControls = () => {\n            // @ts-ignore\n            this.timelineControl = L.control.timelineSlider({\n                position: 'topright',\n                timelineItems: [\"1日前\", \"2日前\", \"3日前\", \"4日前\", \"5日前\", \"6日前\", \"7日前\"],\n                labelWidth: \"50px\",\n                betweenLabelAndRangeSpace: \"10px\",\n                initializeChange: false,\n                changeMap: this.onChangeTimeRange\n            }).addTo(this.map);\n            // スポンサー募集ボタン\n            this.sponsorControl = new SponsorControl_1.default({\n                position: 'bottomleft'\n            }).addTo(this.map);\n            // GitHubボタン\n            this.githubControl = new GithubControl_1.default({\n                position: 'bottomleft'\n            }).addTo(this.map);\n            // ズームインズームアウトするやつ\n            this.zoomControl = L.control.zoom({\n                position: 'bottomright'\n            }).addTo(this.map);\n            // 全体表示に戻るやつ\n            this.expandControl = new ExpandControl_1.default({\n                position: 'bottomright'\n            }).addTo(this.map);\n            // 現在地に移動するやつ\n            // @ts-ignore\n            this.locatorControl = L.control.locate({\n                icon: 'fa fa-map-marker-alt',\n                position: 'bottomright',\n                locateOptions: {\n                    maxZoom: 10\n                }\n            }).addTo(this.map);\n            // 地名で検索するやつ\n            // @ts-ignore\n            this.searchControl = L.esri.Geocoding.geosearch({\n                position: 'bottomright',\n                placeholder: '地名で検索'\n            }).addTo(this.map);\n            // レイヤーの表示非表示を切り替えるやつ\n            // @ts-ignore\n            this.layerControl = L.control.groupedLayers(this.baseLayerData, this.overlayLayerData, {\n                collapsed: true,\n                position: 'bottomright'\n            }).addTo(this.map);\n        };\n        this.renderBaseLayer = async () => {\n            this.layer = new PaleTileLayer_1.default();\n            this.layer.addTo(this.map);\n            this.baseLayerData = {\n                \"国土地理院淡色地図\": this.layer\n            };\n            const japanPrefsGeoJson = new JapanPrefsGeoJson_1.default();\n            japanPrefsGeoJson.ready.then(() => {\n                japanPrefsGeoJson.show(this);\n            });\n            const japanCitiesGeoJson = new JapanCitiesGeoJson_1.default();\n            japanCitiesGeoJson.ready.then(() => {\n                japanCitiesGeoJson.show(this);\n            });\n        };\n        this.renderOverlayLayers = async () => {\n            // 選択していたレイヤーを復元\n            let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'));\n            if (selectedLayers === null) {\n                selectedLayers = [\"災害関連ニュース\", \"災害ボランティアセンター\", \"水害発生箇所\", \"自衛隊災害派遣\", \"消防災害出動\"];\n            }\n            // 標高図\n            const reliefTileLayer = new ReliefTileLayer_1.default();\n            reliefTileLayer.addOverlay(this, \"基本\");\n            if (selectedLayers.indexOf(ReliefTileLayer_1.default.displayName) > -1) {\n                reliefTileLayer.show(this);\n            }\n            // 雨雲レーダー\n            const rainTileLayer = new RainTileLayer_1.default();\n            rainTileLayer.addOverlay(this, \"基本\");\n            if (selectedLayers.indexOf(RainTileLayer_1.default.displayName) > -1) {\n                rainTileLayer.show(this);\n            }\n            // 水害発生箇所\n            const floodArcGisJson = new FloodArcGisJson_1.default();\n            floodArcGisJson.ready.then(() => {\n                floodArcGisJson.addOverlay(this, \"情報\");\n                if (selectedLayers.indexOf(FloodArcGisJson_1.default.displayName) > -1) {\n                    floodArcGisJson.show(this);\n                }\n            });\n            // 災害ボランティアセンター\n            const volunteerGeoJson = new VolunteerGeoJson_1.default();\n            volunteerGeoJson.ready.then(() => {\n                volunteerGeoJson.addOverlay(this, \"情報\");\n                if (selectedLayers.indexOf(VolunteerGeoJson_1.default.displayName) > -1) {\n                    volunteerGeoJson.show(this);\n                }\n            });\n            let params = \"\";\n            switch (location.hash) {\n                case \"#drug\":\n                    params = \"?category=drug\";\n                    break;\n                case \"#children\":\n                    params = \"?category=children\";\n                    break;\n                default:\n                    params = \"?category=crisis\";\n            }\n            params = params + \"&daysago=\" + this.daysago;\n            const newsMarkers = new NewsMarkers_1.default(params);\n            newsMarkers.ready.then(() => {\n                newsMarkers.addOverlay(this);\n                if (selectedLayers.indexOf(NewsMarkers_1.default.displayName) > -1) {\n                    newsMarkers.show(this);\n                }\n            });\n            const selfDefenseMarkers = new SelfDefenseMarkers_1.default(\"?daysago=\" + this.daysago);\n            selfDefenseMarkers.ready.then(() => {\n                selfDefenseMarkers.addOverlay(this, \"自衛隊\");\n                if (selectedLayers.indexOf(SelfDefenseMarkers_1.default.displayName) > -1) {\n                    selfDefenseMarkers.show(this);\n                }\n            });\n            const fireDeptMarkers = new FireDeptMarkers_1.default(\"?daysago=\" + this.daysago);\n            fireDeptMarkers.ready.then(() => {\n                fireDeptMarkers.addOverlay(this);\n                if (selectedLayers.indexOf(FireDeptMarkers_1.default.displayName) > -1) {\n                    fireDeptMarkers.show(this);\n                }\n            });\n        };\n        this.ready = new Promise(async (resolve) => {\n            // Leafletの初期化\n            this.map = L.map('map', { zoomControl: false });\n            // TODO: overlayadd時にデータを読み込む\n            this.map.on('overlayadd', this.onOverlayAdd);\n            this.map.on('overlayremove', this.onOverlayRemove);\n            this.map.on('moveend', this.onMoveEnd);\n            this.map.on('zoomend', this.onZoomEnd);\n            this.initView();\n            this.initPanes();\n            this.renderControls();\n            await this.renderBaseLayer();\n            this.daysago = localStorage.getItem('leaflet-daysago');\n            this.renderOverlayLayers();\n            this.timelineControl.rangeInput.value = Number(this.daysago);\n            const inputEvent = new Event('input');\n            this.timelineControl.rangeInput.dispatchEvent(inputEvent);\n            resolve();\n        });\n    }\n}\nconst renderLeafLetPromise = new Promise(async (resolve) => {\n    const leaflet = new LeafletInitializer();\n    await leaflet.ready;\n    // レイヤー選択ボタンを開いておく\n    let element;\n    setTimeout(() => {\n        element = document.getElementsByClassName('leaflet-control-layers')[0];\n        element.classList.add('leaflet-control-layers-expanded');\n    }, 2000);\n    // 10秒後に閉じる\n    setTimeout(() => {\n        element.classList.remove('leaflet-control-layers-expanded');\n    }, 10000);\n    resolve();\n});\nwindow.addEventListener(\"load\", async function () {\n    console.log(\"load\");\n    await renderLeafLetPromise;\n}, false);\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/marker/FireDeptMarkers.ts":
/*!***************************************!*\
  !*** ./src/marker/FireDeptMarkers.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Markers_1 = __webpack_require__(/*! ./Markers */ \"./src/marker/Markers.ts\");\nclass FireDeptMarkers extends Markers_1.default {\n    constructor(params) {\n        super(null, FireDeptMarkers.url + params, null);\n        this.fireDeptDispatchCrisis = [];\n        this.fireDeptDispatchFire = [];\n        this.fireDeptDispatchRescue = [];\n        this.fireDeptDispatchOther = [];\n        this.fireDeptDispatchCrisisLayerGroup = null;\n        this.fireDeptDispatchFireLayerGroup = null;\n        this.fireDeptDispatchRescueLayerGroup = null;\n        this.fireDeptDispatchOtherLayerGroup = null;\n        this.layerGroups = [];\n        this.getContent = (element) => {\n            let created_at = new Date(element.created_at._seconds * 1000);\n            let content = \"<b>\" + element.division + \"</b>:\" + element.detail + '<br /> (' + created_at.toLocaleString() + ')';\n            return content;\n        };\n        this.getIcon = (element) => {\n            let icon;\n            switch (element.category) {\n                case \"crisis\":\n                    icon = FireDeptMarkers.firetruckIcon;\n                    break;\n                case \"fire\":\n                    icon = FireDeptMarkers.fireIcon;\n                    break;\n                case \"rescue\":\n                    icon = FireDeptMarkers.ambulanceIcon;\n                    break;\n                case \"caution\":\n                    icon = FireDeptMarkers.cautionIcon;\n                    break;\n                case \"survey\":\n                    icon = FireDeptMarkers.cautionIcon;\n                    break;\n                case \"support\":\n                    FireDeptMarkers.cautionIcon;\n                    break;\n            }\n            return icon;\n        };\n        this.pushTo = (element, marker) => {\n            switch (element.category) {\n                case \"crisis\":\n                    this.fireDeptDispatchCrisis.push(marker);\n                    break;\n                case \"fire\":\n                    this.fireDeptDispatchFire.push(marker);\n                    break;\n                case \"rescue\":\n                    this.fireDeptDispatchRescue.push(marker);\n                    break;\n                case \"caution\":\n                    this.fireDeptDispatchOther.push(marker);\n                    break;\n                case \"survey\":\n                    this.fireDeptDispatchOther.push(marker);\n                    break;\n                case \"support\":\n                    this.fireDeptDispatchOther.push(marker);\n                    break;\n            }\n        };\n    }\n    addOverlay(leaflet) {\n        this.fireDeptDispatchCrisisLayerGroup = L.layerGroup(this.fireDeptDispatchCrisis);\n        this.layerGroups.push(this.fireDeptDispatchCrisisLayerGroup);\n        this.fireDeptDispatchFireLayerGroup = L.layerGroup(this.fireDeptDispatchFire);\n        this.layerGroups.push(this.fireDeptDispatchFireLayerGroup);\n        this.fireDeptDispatchRescueLayerGroup = L.layerGroup(this.fireDeptDispatchRescue);\n        this.layerGroups.push(this.fireDeptDispatchFireLayerGroup);\n        this.fireDeptDispatchOtherLayerGroup = L.layerGroup(this.fireDeptDispatchOther);\n        this.layerGroups.push(this.fireDeptDispatchFireLayerGroup);\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchCrisisLayerGroup, \"消防災害出動\", \"消防署\");\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchFireLayerGroup, \"消防火災出動\", \"消防署\");\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchRescueLayerGroup, \"消防救急出動\", \"消防署\");\n        leaflet.layerControl.addOverlay(this.fireDeptDispatchOtherLayerGroup, \"消防その他出動\", \"消防署\");\n    }\n    show(leaflet) {\n        this.ready.then(() => {\n            leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup);\n        });\n    }\n}\nexports.default = FireDeptMarkers;\nFireDeptMarkers.displayName = \"消防災害出動\";\nFireDeptMarkers.url = \"/firedept\";\nFireDeptMarkers.firetruckIcon = L.icon({\n    iconUrl: '/img/firetruck_fast.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\nFireDeptMarkers.ambulanceIcon = L.icon({\n    iconUrl: '/img/ambulance_fast.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\nFireDeptMarkers.fireIcon = L.icon({\n    iconUrl: '/img/fire_icon.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\nFireDeptMarkers.cautionIcon = L.icon({\n    iconUrl: '/img/caution.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\n\n\n//# sourceURL=webpack:///./src/marker/FireDeptMarkers.ts?");

/***/ }),

/***/ "./src/marker/Markers.ts":
/*!*******************************!*\
  !*** ./src/marker/Markers.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n *  lat, longプロパティを持つjsonを読み込んで描画する基底クラス\n */\nclass Markers {\n    constructor(displayName, url, icon) {\n        this.markers = [];\n        this.layerGroup = null;\n        /**\n         * 描画したくないマーカーの条件があるときに上書きする\n         */\n        this.shouldIgnore = (element) => {\n            return false;\n        };\n        /**\n         * 条件に応じてアイコンを切り替えたいときに上書きする\n         */\n        this.getIcon = (element) => {\n            return this.icon;\n        };\n        /**\n         * マーカーのポップアップに指定するHTMLを構築するために上書きする\n         */\n        this.getContent = (element) => {\n            return null;\n        };\n        this.forEach = (element) => {\n            if (element.lat === undefined || element.lat === null || element.long === undefined || element.long === null) {\n                return;\n            }\n            if (this.shouldIgnore(element)) {\n                return;\n            }\n            const icon = this.getIcon(element);\n            let marker;\n            if (icon === null) {\n                marker = L.marker([element.lat, element.long], { pane: 'pane660' });\n            }\n            else {\n                marker = L.marker([element.lat, element.long], { icon: icon, pane: 'pane660' });\n            }\n            const content = this.getContent(element);\n            marker.bindPopup(content);\n            this.pushTo(element, marker);\n        };\n        this.displayName = displayName;\n        this.url = url;\n        this.icon = icon;\n        this.ready = new Promise(async (resolve) => {\n            const res = await fetch(this.url);\n            let json = await res.json();\n            json.forEach(this.forEach);\n            resolve();\n        });\n    }\n    /**\n     * 条件に応じて複数のカテゴリに分類して表示したいときに上書きする\n     * addOverlayも上書きする必要がある\n     * @param element\n     * @param marker\n     */\n    pushTo(element, marker) {\n        this.markers.push(marker);\n    }\n    addOverlay(leaflet, groupName) {\n        this.layerGroup = L.layerGroup(this.markers);\n        leaflet.layerControl.addOverlay(this.layerGroup, this.displayName, groupName);\n    }\n    show(leaflet) {\n        this.ready.then(() => {\n            leaflet.map.addLayer(this.layerGroup);\n        });\n    }\n    hide(leaflet) {\n        leaflet.map.removeLayer(this.layerGroup);\n    }\n}\nexports.default = Markers;\n\n\n//# sourceURL=webpack:///./src/marker/Markers.ts?");

/***/ }),

/***/ "./src/marker/NewsMarkers.ts":
/*!***********************************!*\
  !*** ./src/marker/NewsMarkers.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Markers_1 = __webpack_require__(/*! ./Markers */ \"./src/marker/Markers.ts\");\nclass NewsMarkers extends Markers_1.default {\n    constructor(params) {\n        super(NewsMarkers.displayName, NewsMarkers.url + params, null);\n        this.clusterGroup = null;\n        this.shouldIgnore = (element) => {\n            return (element.og_title === undefined || element.og_title === null\n                || element.og_desc === undefined || element.og_desc === null);\n        };\n        this.getContent = (element) => {\n            let content = \"<h3 title='\" + element.category + \"'>\" + element.og_title + \"</h3><p>\";\n            if (element.og_url) {\n                content = content + \"<a href='\" + element.og_url + \"'>\";\n            }\n            content = content + element.og_desc;\n            if (element.og_url) {\n                content = content + \"</a>\";\n            }\n            content = content + \"</p>\";\n            if (element.og_image) {\n                content = content + \"<img width=150 height=100 src='\" + element.og_image + \"' />\";\n            }\n            return content;\n        };\n        this.addOverlay = (leaflet) => {\n            // @ts-ignore\n            const newsClusterGroup = L.markerClusterGroup.layerSupport({ clusterPane: 'pane690' });\n            const newsLayerGroup = L.layerGroup(this.markers);\n            newsClusterGroup.addTo(leaflet.map);\n            newsClusterGroup.checkIn(newsLayerGroup);\n            this.layerGroup = newsLayerGroup;\n            this.clusterGroup = newsClusterGroup;\n            leaflet.layerControl.addOverlay(this.layerGroup, NewsMarkers.displayName, \"情報\");\n        };\n    }\n    show(leaflet) {\n        this.ready.then(() => {\n            leaflet.map.addLayer(this.layerGroup);\n        });\n    }\n}\nexports.default = NewsMarkers;\nNewsMarkers.displayName = \"災害関連ニュース\";\nNewsMarkers.url = \"/news\";\n\n\n//# sourceURL=webpack:///./src/marker/NewsMarkers.ts?");

/***/ }),

/***/ "./src/marker/SelfDefenseMarkers.ts":
/*!******************************************!*\
  !*** ./src/marker/SelfDefenseMarkers.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst Markers_1 = __webpack_require__(/*! ./Markers */ \"./src/marker/Markers.ts\");\nclass SelfDefenseMarkers extends Markers_1.default {\n    constructor(params) {\n        super(SelfDefenseMarkers.displayName, SelfDefenseMarkers.url + params, SelfDefenseMarkers.selfDefenseIcon);\n        this.getIcon = (element) => {\n            if (element.text.indexOf('給水') !== -1) {\n                return SelfDefenseMarkers.waterTruckIcon;\n            }\n            else {\n                return SelfDefenseMarkers.selfDefenseIcon;\n            }\n        };\n        this.getContent = (element) => {\n            const tweeted_at = new Date(element.tweeted_at._seconds * 1000);\n            var content = \"<h3><img width=20 height=20 src='\" + element.icon_url + \"' />\" + element.display_name + \"</h3>\";\n            content = content + \"<p>\";\n            content = content + \"<a href='https://twitter.com/\" + element.screen_name + \"/status/\" + element.tweet_id_str + \"'>\";\n            content = content + element.text;\n            content = content + \"</a>\";\n            content = content + \" (\" + tweeted_at.toLocaleString() + \")\";\n            content = content + \"</p>\";\n            if (element.photos.length > 0) {\n                content = content + \"<img width=150 height=100 src='\" + element.photos[0] + \"' />\";\n            }\n            return content;\n        };\n    }\n}\nexports.default = SelfDefenseMarkers;\nSelfDefenseMarkers.displayName = \"自衛隊災害派遣\";\nSelfDefenseMarkers.url = \"/selfdefense\";\nSelfDefenseMarkers.selfDefenseIcon = L.icon({\n    iconUrl: '/img/selfdefense.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\nSelfDefenseMarkers.waterTruckIcon = L.icon({\n    iconUrl: '/img/water_truck.png',\n    iconSize: [20, 20],\n    iconAnchor: [10, 10],\n    popupAnchor: [0, -10]\n});\n\n\n//# sourceURL=webpack:///./src/marker/SelfDefenseMarkers.ts?");

/***/ }),

/***/ "./src/tile/PaleTileLayer.ts":
/*!***********************************!*\
  !*** ./src/tile/PaleTileLayer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * 国土地理院淡色地図タイル\n */\nclass PaleTileLayer extends L.TileLayer {\n    constructor() {\n        super(PaleTileLayer.urlTemplate, PaleTileLayer.options);\n    }\n    addOverlay(leaflet) {\n        leaflet.layerControl.addOverlay(this, PaleTileLayer.displayName, \"基本\");\n    }\n    show(leaflet) {\n        leaflet.map.addLayer(this);\n    }\n    hide(leaflet) {\n        leaflet.map.removeLayer(this);\n    }\n}\nexports.default = PaleTileLayer;\nPaleTileLayer.displayName = '国土地理院淡色地図';\nPaleTileLayer.urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';\nPaleTileLayer.options = {\n    id: 'CyberJapanPaleTile',\n    attribution: '<a href=\"https://maps.gsi.go.jp/development/ichiran.html#pale\">国土地理院淡色地図</a>',\n    minZoom: 5,\n    maxZoom: 18,\n    opacity: 1,\n};\n\n\n//# sourceURL=webpack:///./src/tile/PaleTileLayer.ts?");

/***/ }),

/***/ "./src/tile/RainTileLayer.ts":
/*!***********************************!*\
  !*** ./src/tile/RainTileLayer.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * YOLP 雨雲レーダータイル\n */\nclass RainTileLayer extends L.TileLayer {\n    constructor() {\n        super(RainTileLayer.urlTemplate, RainTileLayer.options);\n        this.getTileUrl = (coords) => {\n            //雨雲リクエスト日付の作成\n            const now = new Date();\n            const year = now.getFullYear();\n            const month = now.getMonth() + 1;\n            let monthStr = String(month);\n            if (month < 10)\n                monthStr = '0' + String(month);\n            const day = now.getDate();\n            let dayStr = String(day);\n            if (day < 10)\n                dayStr = '0' + String(day);\n            const hours = now.getHours();\n            let hoursStr = String(hours);\n            if (hours < 10)\n                hoursStr = '0' + String(hours);\n            let minutes = now.getMinutes();\n            minutes *= 0.1;\n            minutes = Math.floor(minutes);\n            minutes *= 10;\n            let minutesStr = String(minutes);\n            if (minutes < 10)\n                minutesStr = '0' + String(minutes);\n            const dateStr = \"\" + String(year) + monthStr + dayStr + hoursStr + minutesStr;\n            // @ts-ignore\n            return L.Util.template(this._url, L.extend({\n                d: dateStr,\n                x: coords.x,\n                y: Math.pow(2, this._getZoomForUrl() - 1) - 1 - coords.y,\n                z: this._getZoomForUrl() + 1\n            }, this.options));\n        };\n    }\n    addOverlay(leaflet, groupName) {\n        leaflet.layerControl.addOverlay(this, RainTileLayer.displayName, groupName);\n    }\n    show(leaflet) {\n        leaflet.map.addLayer(this);\n    }\n    hide(leaflet) {\n        leaflet.map.removeLayer(this);\n    }\n}\nexports.default = RainTileLayer;\nRainTileLayer.displayName = \"YOLP 雨雲レーダー\";\nRainTileLayer.urlTemplate = 'http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}';\nRainTileLayer.options = {\n    id: 'YOLPRainRadar',\n    attribution: '<a href=\"https://developer.yahoo.co.jp/webapi/map/\">Yahoo! Open Local Platform</a>',\n    minZoom: null,\n    maxZoom: 18,\n    opacity: 0.5,\n    pane: 'pane650'\n};\n\n\n//# sourceURL=webpack:///./src/tile/RainTileLayer.ts?");

/***/ }),

/***/ "./src/tile/ReliefTileLayer.ts":
/*!*************************************!*\
  !*** ./src/tile/ReliefTileLayer.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * 国土地理院色別標高図タイル\n */\nclass ReliefTileLayer extends L.TileLayer {\n    constructor() {\n        super(ReliefTileLayer.urlTemplate, ReliefTileLayer.options);\n    }\n    addOverlay(leaflet, groupName) {\n        leaflet.layerControl.addOverlay(this, ReliefTileLayer.displayName, groupName);\n    }\n    show(leaflet) {\n        leaflet.map.addLayer(this);\n    }\n    hide(leaflet) {\n        leaflet.map.removeLayer(this);\n    }\n}\nexports.default = ReliefTileLayer;\nReliefTileLayer.displayName = '国土地理院色別標高図';\nReliefTileLayer.urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png';\nReliefTileLayer.options = {\n    id: 'CyberJapanReliefTile',\n    attribution: '<a href=\"https://maps.gsi.go.jp/development/ichiran.html#relief\">国土地理院色別標高図</a>',\n    minZoom: 5,\n    maxZoom: 15,\n    opacity: 0.4,\n};\n\n\n//# sourceURL=webpack:///./src/tile/ReliefTileLayer.ts?");

/***/ })

/******/ });