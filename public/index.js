// ツイートボタン
// @ts-ignore
window.twttr = (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0], 
    // @ts-ignore
    t = window.twttr || {};
    if (d.getElementById(id))
        return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function (f) {
        t._e.push(f);
    };
    return t;
}(document, "script", "twitter-wjs"));
/**
 * Leafletを初期化するクラス
 */
class LeafletInitializer {
    constructor() {
        this.baseLayerData = null;
        this.overlayLayerData = null;
        /**
         * マーカーの重なる順番を指定するために使うやつを初期化しておく
         * https://leafletjs.com/reference-1.0.0.html#map-pane
         */
        this.createPane = () => {
            this.map.createPane("pane610").style.zIndex = "610";
            this.map.createPane("pane620").style.zIndex = "620";
            this.map.createPane("pane630").style.zIndex = "630";
            this.map.createPane("pane640").style.zIndex = "640";
            this.map.createPane("pane650").style.zIndex = "650";
            this.map.createPane("pane660").style.zIndex = "660";
            this.map.createPane("pane670").style.zIndex = "670";
            this.map.createPane("pane680").style.zIndex = "680";
            this.map.createPane("pane690").style.zIndex = "690";
        };
        this.renderBaseLayer = () => {
            this.layer = new PaleTileLayer();
            this.layer.addTo(this.map);
            this.baseLayerData = {
                "国土地理院淡色地図": this.layer
            };
        };
        this.renderControls = () => {
            // 現在地に移動するやつ
            // @ts-ignore
            this.locatorControl = L.control.locate({
                position: 'bottomright',
                locateOptions: {
                    maxZoom: 10
                }
            }).addTo(this.map);
            // ズームインズームアウトするやつ
            L.control.zoom({
                position: 'bottomright'
            }).addTo(this.map);
            // レイヤーの表示非表示を切り替えるやつ
            // @ts-ignore
            this.layerControl = L.control.groupedLayers(this.baseLayerData, this.overlayLayerData, {
                collapsed: true,
                position: 'bottomright'
            }).addTo(this.map);
        };
        // 都道府県の境界線の描画
        this.renderPref = async () => {
            const japanGeoJsonRes = await fetch("/geojson/japan.geojson");
            const japanGeoJsonJson = await japanGeoJsonRes.json();
            const japanGeoJson = L.geoJSON(japanGeoJsonJson, {
                style: {
                    weight: 5
                },
                onEachFeature: function (feature, layer) {
                }
            });
            japanGeoJson.addTo(this.map);
        };
        // 市区町村の境界線の描画
        this.renderCity = async () => {
            const japanCitiesGeoJsonRes = await fetch("/geojson/japan_cities.geojson");
            const japanCitiesGeoJsonJson = await japanCitiesGeoJsonRes.json();
            const japanCitiesGeoJson = L.geoJSON(japanCitiesGeoJsonJson, {
                style: {
                    weight: 2,
                    opacity: 0.3
                },
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(feature.properties.cityname_k);
                }
            });
            japanCitiesGeoJson.addTo(this.map);
        };
        this.ready = new Promise(async (resolve) => {
            // Leafletの初期化
            this.map = L.map('map', { zoomControl: false });
            this.map.on('overlayadd', (event) => { console.log('overlayadd: ', event); });
            this.map.on('overlayremove', (event) => { console.log('overlayremove: ', event); });
            // 初期座標とズームを指定
            this.map.setView([36.56028, 139.19333], 7);
            this.createPane();
            this.renderBaseLayer();
            this.renderControls();
            await this.renderPref();
            await this.renderCity();
            resolve();
        });
    }
}
/**
 * 国土地理院淡色地図タイル
 */
class PaleTileLayer extends L.TileLayer {
    constructor() {
        super(PaleTileLayer.urlTemplate, PaleTileLayer.options);
    }
    addOverlay(leaflet) {
        leaflet.layerControl.addOverlay(this, PaleTileLayer.displayName, "基本");
    }
    show(leaflet) {
        leaflet.map.addLayer(this);
    }
    hide(leaflet) {
        leaflet.map.removeLayer(this);
    }
}
PaleTileLayer.displayName = '国土地理院淡色地図';
PaleTileLayer.urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
PaleTileLayer.options = {
    id: 'CyberJapanPaleTile',
    attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#pale">国土地理院淡色地図</a>',
    minZoom: 5,
    maxZoom: 18,
    opacity: 1,
};
/**
 * 国土地理院色別標高図タイル
 */
class ReliefTileLayer extends L.TileLayer {
    constructor() {
        super(ReliefTileLayer.urlTemplate, ReliefTileLayer.options);
    }
    addOverlay(leaflet) {
        leaflet.layerControl.addOverlay(this, ReliefTileLayer.displayName, "基本");
    }
    show(leaflet) {
        leaflet.map.addLayer(this);
    }
    hide(leaflet) {
        leaflet.map.removeLayer(this);
    }
}
ReliefTileLayer.displayName = '国土地理院色別標高図';
ReliefTileLayer.urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png';
ReliefTileLayer.options = {
    id: 'CyberJapanReliefTile',
    attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>',
    minZoom: 5,
    maxZoom: 15,
    opacity: 0.4,
};
/**
 * YOLP 雨雲レーダータイル
 */
class RainTileLayer extends L.TileLayer {
    constructor() {
        super(RainTileLayer.urlTemplate, RainTileLayer.options);
        this.getTileUrl = (coords) => {
            //雨雲リクエスト日付の作成
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            let monthStr = String(month);
            if (month < 10)
                monthStr = '0' + String(month);
            const day = now.getDate();
            let dayStr = String(day);
            if (day < 10)
                dayStr = '0' + String(day);
            const hours = now.getHours();
            let hoursStr = String(hours);
            if (hours < 10)
                hoursStr = '0' + String(hours);
            let minutes = now.getMinutes();
            minutes *= 0.1;
            minutes = Math.floor(minutes);
            minutes *= 10;
            let minutesStr = String(minutes);
            if (minutes < 10)
                minutesStr = '0' + String(minutes);
            const dateStr = "" + String(year) + monthStr + dayStr + hoursStr + minutesStr;
            // @ts-ignore
            return L.Util.template(this._url, L.extend({
                d: dateStr,
                x: coords.x,
                y: Math.pow(2, this._getZoomForUrl() - 1) - 1 - coords.y,
                z: this._getZoomForUrl() + 1
            }, this.options));
        };
    }
    addOverlay(leaflet) {
        leaflet.layerControl.addOverlay(this, RainTileLayer.displayName, "基本");
    }
    show(leaflet) {
        leaflet.map.addLayer(this);
    }
    hide(leaflet) {
        leaflet.map.removeLayer(this);
    }
}
RainTileLayer.displayName = "YOLP 雨雲レーダー";
RainTileLayer.urlTemplate = 'http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}';
RainTileLayer.options = {
    id: 'YOLPRainRadar',
    attribution: '<a href="https://developer.yahoo.co.jp/webapi/map/">Yahoo! Open Local Platform</a>',
    minZoom: null,
    maxZoom: 18,
    opacity: 0.7,
};
/**
 * GeoJsonを表現する基底クラス
 */
class GeoJson {
    /**
     * コンストラクタ
     * await geojson.ready すると geojson を読み込む
     * @param displayName geojsonの表示名
     * @param url jsonのURL
     * @param icon 表示に使いたいアイコン
     */
    constructor(displayName, url, icon) {
        this.geojson = null;
        /**
         * jsonがGeoJSONではないとき、変換処理をする必要があるときに上書きする
         */
        this.toGeoJson = (json) => {
            return json;
        };
        /**
         * coordinatesが[lat, lng]形式ではないときに上書きする
         */
        this.pointToLayer = (feature, coordinates) => {
            return L.marker(coordinates, { icon: this.icon });
        };
        this.onEachFeature = (feature, layer) => {
        };
        this.displayName = displayName;
        this.url = url;
        this.icon = icon;
        this.ready = new Promise(async (resolve) => {
            const res = await fetch(this.url);
            let json = await res.json();
            json = this.toGeoJson(json);
            this.geojson = L.geoJSON(json, {
                pointToLayer: this.pointToLayer,
                onEachFeature: this.onEachFeature
            });
            resolve();
        });
    }
    addOverlay(leaflet, groupName) {
        leaflet.layerControl.addOverlay(this.geojson, this.displayName, groupName);
    }
    show(leaflet) {
        leaflet.map.addLayer(this.geojson);
    }
    hide(leaflet) {
        leaflet.map.removeLayer(this.geojson);
    }
}
/**
 * 水害情報GeoJson
 * http://crs.bosai.go.jp/DynamicCRS/index.html?appid=9424c7b32d784b60a9b70d59ff32ac96
 * ここからデータを拝借している
 * コツ
 * Chrome developer tools の Network タブで `query` で filter してそれっぽいデータを探す
 * https://services8.arcgis.com/rGc6Kyg1ETR5TWY9/arcgis/rest/services/river19/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&outSR=4326&outFields=*&maxRecordCountFactor=4&resultOffset=0&resultRecordCount=8000&cacheHint=true
 *   - `f=pbf` を `f=json` にする
 *   - `outSR=xxxx` を `outSR=4326` にする
 * こうしないとarcgisToGeoJSONでGeoJSONに変換できる座標を持ったJSONにならない
 */
class FloodArcGisJson extends GeoJson {
    constructor() {
        super(FloodArcGisJson.displayName, FloodArcGisJson.url, FloodArcGisJson.icon);
        this.toGeoJson = (arcgisjson) => {
            // @ts-ignore
            return ArcgisToGeojsonUtils.arcgisToGeoJSON(arcgisjson);
        };
        this.onEachFeature = (feature, layer) => {
            layer.bindPopup(feature.properties['name']);
        };
    }
}
FloodArcGisJson.displayName = "水害情報";
FloodArcGisJson.url = "/geojson/2019_typhoon19_flood.arcgisjson";
FloodArcGisJson.icon = L.icon({
    iconUrl: '/img/flood.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
/**
 * 災害ボランティアセンターGeoJson
 */
class VolunteerGeoJson extends GeoJson {
    constructor() {
        super(VolunteerGeoJson.displayName, VolunteerGeoJson.url, VolunteerGeoJson.icon);
        this.pointToLayer = (feature, coordinates) => {
            let lat = feature.properties['緯度_十進数_'];
            let long = feature.properties['経度_十進数_'];
            // @ts-ignore
            return L.marker([lat, long], { icon: VolunteerGeoJson.icon });
        };
        this.onEachFeature = (feature, layer) => {
            let content = '<b>' + feature.properties['都道府県名'] + feature.properties['市町村名'] + '</b><br />';
            content = content + feature.properties['災害ボランティアセンター名'] + '<br />';
            if (feature.properties['詳細情報URL']) {
                content = content + '<a href="' + feature.properties['詳細情報URL'] + '">ウェブサイト</a><br />';
            }
            if (feature.properties['電話番号']) {
                content = content + '電話番号: ' + feature.properties['電話番号'];
            }
            layer.bindPopup(content);
        };
    }
}
VolunteerGeoJson.displayName = "災害ボランティアセンター";
VolunteerGeoJson.url = "/geojson/2019_typhoon19_volunteer.geojson";
VolunteerGeoJson.icon = L.icon({
    iconUrl: '/img/volunteer.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
/**
 *  lat, longプロパティを持つjsonを読み込んで描画する基底クラス
 */
class Markers {
    constructor(displayName, url, icon) {
        this.markers = [];
        this.layerGroup = null;
        /**
         * 描画したくないマーカーの条件があるときに上書きする
         */
        this.shouldIgnore = (element) => {
            return false;
        };
        /**
         * 条件に応じてアイコンを切り替えたいときに上書きする
         */
        this.getIcon = (element) => {
            return this.icon;
        };
        /**
         * マーカーのポップアップに指定するHTMLを構築するために上書きする
         */
        this.getContent = (element) => {
            return null;
        };
        this.forEach = (element) => {
            if (element.lat === undefined || element.lat === null || element.long === undefined || element.long === null) {
                return;
            }
            if (this.shouldIgnore(element)) {
                return;
            }
            const icon = this.getIcon(element);
            let marker;
            if (icon === null) {
                marker = L.marker([element.lat, element.long]);
            }
            else {
                marker = L.marker([element.lat, element.long], { icon: icon });
            }
            const content = this.getContent(element);
            marker.bindPopup(content);
            this.pushTo(element, marker);
        };
        this.displayName = displayName;
        this.url = url;
        this.icon = icon;
        this.ready = new Promise(async (resolve) => {
            const res = await fetch(this.url);
            let json = await res.json();
            json.forEach(this.forEach);
            resolve();
        });
    }
    /**
     * 条件に応じて複数のカテゴリに分類して表示したいときに上書きする
     * addOverlayも上書きする必要がある
     * @param element
     * @param marker
     */
    pushTo(element, marker) {
        this.markers.push(marker);
    }
    addOverlay(leaflet, groupName) {
        this.layerGroup = L.layerGroup(this.markers);
        leaflet.layerControl.addOverlay(this.layerGroup, this.displayName, groupName);
    }
    show(leaflet) {
        leaflet.map.addLayer(this.layerGroup);
    }
    hide(leaflet) {
        leaflet.map.removeLayer(this.layerGroup);
    }
}
class SelfDefenseMarkers extends Markers {
    constructor() {
        super(SelfDefenseMarkers.displayName, SelfDefenseMarkers.url, SelfDefenseMarkers.selfDefenseIcon);
        this.shouldIgnore = (element) => {
            return element.text.startsWith("RT");
        };
        this.getIcon = (element) => {
            if (element.text.indexOf('給水') !== -1) {
                return SelfDefenseMarkers.waterTruckIcon;
            }
            else {
                return SelfDefenseMarkers.selfDefenseIcon;
            }
        };
        this.getContent = (element) => {
            const tweeted_at = new Date(element.tweeted_at._seconds * 1000);
            var content = "<h3><img width=20 height=20 src='" + element.icon_url + "' />" + element.display_name + "</h3>";
            content = content + "<p>";
            content = content + "<a href='https://twitter.com/" + element.screen_name + "/status/" + element.tweet_id_str + "'>";
            content = content + element.text;
            content = content + "</a>";
            content = content + " (" + tweeted_at.toLocaleString() + ")";
            content = content + "</p>";
            if (element.photos.length > 0) {
                content = content + "<img width=150 height=100 src='" + element.photos[0] + "' />";
            }
            return content;
        };
    }
}
SelfDefenseMarkers.displayName = "自衛隊災害派遣";
SelfDefenseMarkers.url = "/selfdefense";
SelfDefenseMarkers.selfDefenseIcon = L.icon({
    iconUrl: '/img/selfdefense.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
SelfDefenseMarkers.waterTruckIcon = L.icon({
    iconUrl: '/img/water_truck.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
class FireDeptMarkers extends Markers {
    constructor() {
        super(null, FireDeptMarkers.url, null);
        this.fireDeptDispatchCrisis = [];
        this.fireDeptDispatchFire = [];
        this.fireDeptDispatchRescue = [];
        this.fireDeptDispatchOther = [];
        this.fireDeptDispatchCrisisLayerGroup = null;
        this.fireDeptDispatchFireLayerGroup = null;
        this.fireDeptDispatchRescueLayerGroup = null;
        this.fireDeptDispatchOtherLayerGroup = null;
        this.getContent = (element) => {
            let created_at = new Date(element.created_at._seconds * 1000);
            let content = "<b>" + element.division + "</b>:" + element.detail + '<br /> (' + created_at.toLocaleString() + ')';
            return content;
        };
        this.getIcon = (element) => {
            let icon;
            switch (element.category) {
                case "crisis":
                    icon = FireDeptMarkers.firetruckIcon;
                    break;
                case "fire":
                    icon = FireDeptMarkers.fireIcon;
                    break;
                case "rescue":
                    icon = FireDeptMarkers.ambulanceIcon;
                    break;
                case "caution":
                    icon = FireDeptMarkers.cautionIcon;
                    break;
                case "survey":
                    icon = FireDeptMarkers.cautionIcon;
                    break;
                case "support":
                    FireDeptMarkers.cautionIcon;
                    break;
            }
            return icon;
        };
        this.pushTo = (element, marker) => {
            switch (element.category) {
                case "crisis":
                    this.fireDeptDispatchCrisis.push(marker);
                    break;
                case "fire":
                    this.fireDeptDispatchFire.push(marker);
                    break;
                case "rescue":
                    this.fireDeptDispatchRescue.push(marker);
                    break;
                case "caution":
                    this.fireDeptDispatchOther.push(marker);
                    break;
                case "survey":
                    this.fireDeptDispatchOther.push(marker);
                    break;
                case "support":
                    this.fireDeptDispatchOther.push(marker);
                    break;
            }
        };
    }
    addOverlay(leaflet) {
        this.fireDeptDispatchCrisisLayerGroup = L.layerGroup(this.fireDeptDispatchCrisis);
        this.fireDeptDispatchFireLayerGroup = L.layerGroup(this.fireDeptDispatchFire);
        this.fireDeptDispatchRescueLayerGroup = L.layerGroup(this.fireDeptDispatchRescue);
        this.fireDeptDispatchOtherLayerGroup = L.layerGroup(this.fireDeptDispatchOther);
        leaflet.layerControl.addOverlay(this.fireDeptDispatchCrisisLayerGroup, "消防災害出動情報", "消防署");
        leaflet.layerControl.addOverlay(this.fireDeptDispatchFireLayerGroup, "消防火災出動情報", "消防署");
        leaflet.layerControl.addOverlay(this.fireDeptDispatchRescueLayerGroup, "消防救急出動情報", "消防署");
        leaflet.layerControl.addOverlay(this.fireDeptDispatchOtherLayerGroup, "消防その他出動情報", "消防署");
    }
    show(leaflet) {
        leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup);
    }
}
FireDeptMarkers.url = "/firedept";
FireDeptMarkers.firetruckIcon = L.icon({
    iconUrl: '/img/firetruck_fast.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
FireDeptMarkers.ambulanceIcon = L.icon({
    iconUrl: '/img/ambulance_fast.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
FireDeptMarkers.fireIcon = L.icon({
    iconUrl: '/img/fire_icon.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
FireDeptMarkers.cautionIcon = L.icon({
    iconUrl: '/img/caution.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
});
class NewsMarkers extends Markers {
    constructor(category) {
        super(NewsMarkers.displayName, NewsMarkers.url + category, null);
        this.clusterGroup = null;
        this.shouldIgnore = (element) => {
            return (element.og_title === undefined || element.og_title === null
                || element.og_desc === undefined || element.og_desc === null);
        };
        this.getContent = (element) => {
            let content = "<h3 title='" + element.category + "'>" + element.og_title + "</h3><p>";
            if (element.og_url) {
                content = content + "<a href='" + element.og_url + "'>";
            }
            content = content + element.og_desc;
            if (element.og_url) {
                content = content + "</a>";
            }
            content = content + "</p>";
            if (element.og_image) {
                content = content + "<img width=150 height=100 src='" + element.og_image + "' />";
            }
            return content;
        };
        this.addOverlay = (leaflet) => {
            // @ts-ignore
            const newsClusterGroup = L.markerClusterGroup.layerSupport({ clusterPane: 'pane690' });
            const newsLayerGroup = L.layerGroup(this.markers);
            newsClusterGroup.addTo(leaflet.map);
            newsClusterGroup.checkIn(newsLayerGroup);
            this.layerGroup = newsLayerGroup;
            this.clusterGroup = newsClusterGroup;
            leaflet.layerControl.addOverlay(this.layerGroup, NewsMarkers.displayName, "情報");
        };
    }
    show(leaflet) {
        leaflet.map.addLayer(this.layerGroup);
    }
}
NewsMarkers.displayName = "災害関連ニュース";
NewsMarkers.url = "/news";
const renderLeafLetPromise = new Promise(async (resolve) => {
    const leaflet = new LeafletInitializer();
    await leaflet.ready;
    const reliefTileLayer = new ReliefTileLayer();
    reliefTileLayer.addOverlay(leaflet);
    const rainTileLayer = new RainTileLayer();
    rainTileLayer.addOverlay(leaflet);
    const element = document.getElementsByClassName('leaflet-control-layers')[0];
    element.classList.add('leaflet-control-layers-expanded');
    let category = "";
    switch (location.hash) {
        case "#drug":
            category = "?category=drug";
            break;
        case "#children":
            category = "?category=children";
            break;
        default:
            category = "?category=crisis";
    }
    const newsLayer = new NewsMarkers(category);
    await newsLayer.ready;
    newsLayer.addOverlay(leaflet);
    newsLayer.show(leaflet);
    const floodArcGisJson = new FloodArcGisJson();
    await floodArcGisJson.ready;
    floodArcGisJson.addOverlay(leaflet, "情報");
    floodArcGisJson.show(leaflet);
    const volunteerGeoJson = new VolunteerGeoJson();
    await volunteerGeoJson.ready;
    volunteerGeoJson.addOverlay(leaflet, "情報");
    volunteerGeoJson.show(leaflet);
    const selfDefenseMarkers = new SelfDefenseMarkers();
    await selfDefenseMarkers.ready;
    selfDefenseMarkers.addOverlay(leaflet, "自衛隊");
    selfDefenseMarkers.show(leaflet);
    const fireDeptMarkers = new FireDeptMarkers();
    await fireDeptMarkers.ready;
    fireDeptMarkers.addOverlay(leaflet);
    fireDeptMarkers.show(leaflet);
    setTimeout(() => {
        element.classList.remove('leaflet-control-layers-expanded');
    }, 2000);
    resolve();
});
window.addEventListener("load", async function () {
    console.log("load");
    await renderLeafLetPromise;
}, false);
//# sourceMappingURL=index.js.map