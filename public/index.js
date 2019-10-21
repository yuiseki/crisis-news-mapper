window.twttr = (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
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
const renderLeafLetPromise = new Promise(async (resolve) => {
    // Leafletの初期化
    const map = L.map('map');
    // 初期座標とズームを指定
    map.setView([35.3622222, 138.7313889], 8);
    // 都道府県の境界線の描画
    const japanGeoJsonRes = await fetch("/geojson/japan.geojson");
    const japanGeoJsonJson = await japanGeoJsonRes.json();
    const japanGeoJson = L.geoJSON(japanGeoJsonJson, {
        style: {
            weight: 5
        },
        onEachFeature: function (feature, layer) {
        }
    });
    japanGeoJson.addTo(map);
    // 市区町村の境界線の描画
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
    japanCitiesGeoJson.addTo(map);
    // 国土地理院淡色地図タイルの定義
    const cyberJapanPaleTileLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        id: 'CyberJapanPaleTile',
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#pale">国土地理院淡色地図</a>',
        minZoom: 5,
        maxZoom: 18,
    }).addTo(map);
    // 国土地理院色別標高図タイルの定義
    const cyberJapanReliefTileLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png', {
        id: 'CyberJapanReliefTile',
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>',
        minZoom: 5,
        maxZoom: 15,
    }).setOpacity(0.4);
    // YOLPのタイルをleafletで読み込むためのクラスの定義
    // @ts-ignore
    L.YOLPTileLayer = L.TileLayer.extend({
        getTileUrl: function (coords) {
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
        }
    });
    // YOLP雨雲画像タイルの定義
    // @ts-ignore
    const rainMapTileLayer = new L.YOLPTileLayer('http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}', {
        attribution: '<a href="https://developer.yahoo.co.jp/webapi/map/">Yahoo! Open Local Platform</a>',
        maxZoom: 18,
    }).setOpacity(0.7);
    // 自衛隊災害派遣情報マーカーレイヤーの定義
    var selfdefenseIcon = L.icon({
        iconUrl: '/img/selfdefense.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
    var waterTruckIcon = L.icon({
        iconUrl: '/img/water_truck.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
    const selfDefenseDispatchRes = await fetch("/selfdefense");
    const selfDefenseDispatchJson = await selfDefenseDispatchRes.json();
    const selfDefenseDispatch = [];
    selfDefenseDispatchJson.forEach(function (element) {
        if (element.lat === undefined || element.lat === null || element.long === undefined || element.long === null) {
            return;
        }
        if (element.text.startsWith("RT")) {
            return;
        }
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
        var marker;
        if (content.indexOf('給水') === -1) {
            marker = L.marker([element.lat, element.long], { icon: selfdefenseIcon });
        }
        else {
            marker = L.marker([element.lat, element.long], { icon: waterTruckIcon });
        }
        marker.bindPopup(content);
        selfDefenseDispatch.push(marker);
    });
    const selfDefenseDispatchLayerGroup = L.layerGroup(selfDefenseDispatch);
    map.addLayer(selfDefenseDispatchLayerGroup);
    // 消防出動情報マーカーレイヤーの定義
    const firetruckIcon = L.icon({
        iconUrl: '/img/firetruck_fast.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
    const ambulanceIcon = L.icon({
        iconUrl: '/img/ambulance_fast.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
    const fireIcon = L.icon({
        iconUrl: '/img/fire_icon.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
    const cautionIcon = L.icon({
        iconUrl: '/img/caution.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
    const fireDeptDispatchRes = await fetch("/firedept");
    const fireDeptDispatchJson = await fireDeptDispatchRes.json();
    const fireDeptDispatchCrisis = [];
    const fireDeptDispatchFire = [];
    const fireDeptDispatchRescue = [];
    const fireDeptDispatchOther = [];
    fireDeptDispatchJson.forEach(function (element) {
        if (element.lat === undefined || element.lat === null || element.long === undefined || element.long === null) {
            return;
        }
        let marker;
        let created_at = new Date(element.created_at._seconds * 1000);
        let content = "<b>" + element.division + "</b>:" + element.detail + '<br /> (' + created_at.toLocaleString() + ')';
        switch (element.category) {
            case "crisis":
                marker = L.marker([element.lat, element.long], { icon: firetruckIcon });
                marker.bindPopup(content);
                fireDeptDispatchCrisis.push(marker);
                break;
            case "fire":
                marker = L.marker([element.lat, element.long], { icon: fireIcon });
                marker.bindPopup(content);
                fireDeptDispatchFire.push(marker);
                break;
            case "rescue":
                marker = L.marker([element.lat, element.long], { icon: ambulanceIcon });
                marker.bindPopup(content);
                fireDeptDispatchRescue.push(marker);
                break;
            case "caution":
                marker = L.marker([element.lat, element.long], { icon: cautionIcon });
                marker.bindPopup(content);
                fireDeptDispatchOther.push(marker);
                break;
            case "survey":
                marker = L.marker([element.lat, element.long], { icon: cautionIcon });
                marker.bindPopup(content);
                fireDeptDispatchOther.push(marker);
                break;
            case "support":
                marker = L.marker([element.lat, element.long], { icon: cautionIcon });
                marker.bindPopup("<b>" + element.division + "</b>:" + element.detail + ' (' + created_at.toLocaleString() + ')');
                fireDeptDispatchOther.push(marker);
                break;
        }
    });
    const fireDeptDispatchCrisisLayerGroup = L.layerGroup(fireDeptDispatchCrisis);
    const fireDeptDispatchFireLayerGroup = L.layerGroup(fireDeptDispatchFire);
    const fireDeptDispatchRescueLayerGroup = L.layerGroup(fireDeptDispatchRescue);
    const fireDeptDispatchOtherLayerGroup = L.layerGroup(fireDeptDispatchOther);
    map.addLayer(fireDeptDispatchCrisisLayerGroup);
    // ニュース記事マーカーレイヤーの定義
    let category = "";
    switch (location.hash) {
        case "#drug":
            category = "?category=drug";
            break;
        case "#children":
            category = "?category=children";
            break;
        default:
            category = "";
    }
    const newsRes = await fetch("/news" + category);
    const newsJson = await newsRes.json();
    const news = [];
    newsJson.forEach(function (element) {
        if (element.lat === undefined || element.lat === null || element.long === undefined || element.long === null) {
            return;
        }
        if (element.og_title === undefined || element.og_title === null || element.og_desc === undefined || element.og_desc === null) {
            return;
        }
        let content = "<h3>" + element.og_title + "</h3><p>";
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
        const marker = L.marker([element.lat, element.long]);
        marker.bindPopup(content);
        news.push(marker);
    });
    // @ts-ignore
    const newsClusterGroup = L.markerClusterGroup.layerSupport();
    //newsClusterGroup.freezeAtZoom(11);
    const newsLayerGroup = L.layerGroup(news);
    newsClusterGroup.addTo(map);
    newsClusterGroup.checkIn(newsLayerGroup);
    map.addLayer(newsLayerGroup);
    const baseLayerData = {
        "国土地理院淡色地図": cyberJapanPaleTileLayer
    };
    const overlayLayerData = {
        "国土地理院色別標高図": cyberJapanReliefTileLayer,
        "YOLP 雨雲レーダー": rainMapTileLayer,
        "災害ニュース記事": newsLayerGroup,
        "自衛隊災害派遣情報": selfDefenseDispatchLayerGroup,
        "消防災害出動情報": fireDeptDispatchCrisisLayerGroup,
        "消防火災出動情報": fireDeptDispatchFireLayerGroup,
        "消防救急出動情報": fireDeptDispatchRescueLayerGroup,
        "消防その他出動情報": fireDeptDispatchOtherLayerGroup,
    };
    // レイヤー切り替えコントロールを追加
    L.control.layers(baseLayerData, overlayLayerData, { collapsed: false, position: 'bottomright' }).addTo(map);
    resolve();
});
window.addEventListener("load", async function () {
    console.log("load");
    await renderLeafLetPromise;
}, false);
//# sourceMappingURL=index.js.map