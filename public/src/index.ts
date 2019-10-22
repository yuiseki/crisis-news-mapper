
/**
 * Leafletを初期化するクラス
 */
class LeafletInitializer {
  ready:Promise<any>
  map:any
  layer:any
  layerGroup:any
  layerControl:any

  baseLayerData = null
  overlayLayerData = null

  constructor(){
    this.ready = new Promise(async resolve => {
      // Leafletの初期化
      this.map = L.map('map');
      // 初期座標とズームを指定
      this.map.setView([36.56028, 139.19333], 7);
      this.createPane()
      this.renderBaseLayer()
      this.renderLayerControl()
      await this.renderPref()
      await this.renderCity()
      resolve()
    });
  }

  public createPane = () => {
    // https://leafletjs.com/reference-1.0.0.html#map-pane
    this.map.createPane("pane610").style.zIndex = "610";
    this.map.createPane("pane620").style.zIndex = "620";
    this.map.createPane("pane630").style.zIndex = "630";
    this.map.createPane("pane640").style.zIndex = "640";
    this.map.createPane("pane650").style.zIndex = "650";
    this.map.createPane("pane660").style.zIndex = "660";
    this.map.createPane("pane670").style.zIndex = "670";
    this.map.createPane("pane680").style.zIndex = "680";
    this.map.createPane("pane690").style.zIndex = "690";
  }

  public renderBaseLayer = () => {
    this.layer = new PaleTileLayer()
      this.layer.addTo(this.map)
      this.baseLayerData = {
        "国土地理院淡色地図": this.layer
      }
  }

  public addOverlayLayer = (layer, name) => {
    this.layerControl.addOverlay(layer , name);
  }

  public renderLayerControl = () => {
    // @ts-ignore
    this.layerControl = L.control.groupedLayers(
      this.baseLayerData,
      this.overlayLayerData,
      {collapsed:false, position: 'bottomright'}
    ).addTo(this.map);
  }

  // 都道府県の境界線の描画
  public renderPref = async () =>{
    const japanGeoJsonRes = await fetch("/geojson/japan.geojson")
    const japanGeoJsonJson = await japanGeoJsonRes.json()
    const japanGeoJson = L.geoJSON(japanGeoJsonJson, {
      style: {
        weight: 5
      },
      onEachFeature: function (feature, layer) {
      }
    })
    japanGeoJson.addTo(this.map);
  }

  // 市区町村の境界線の描画
  public renderCity = async () => {
    const japanCitiesGeoJsonRes = await fetch("/geojson/japan_cities.geojson")
    const japanCitiesGeoJsonJson = await japanCitiesGeoJsonRes.json()
    const japanCitiesGeoJson = L.geoJSON(japanCitiesGeoJsonJson, {
      style: {
        weight: 2,
        opacity: 0.3
      },
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(feature.properties.cityname_k);
      }
    })
    japanCitiesGeoJson.addTo(this.map);
  }
}

/**
 * 国土地理院淡色地図タイル
 */
class PaleTileLayer extends L.TileLayer {
  static displayName = '国土地理院淡色地図'
  static urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png'
  static options = {
    id: 'CyberJapanPaleTile',
    attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#pale">国土地理院淡色地図</a>',
    minZoom: 5,
    maxZoom: 18,
    opacity: 1,
  }
  constructor(){
    super(PaleTileLayer.urlTemplate, PaleTileLayer.options)
  }
  public addToOverlay(leaflet){
    leaflet.layerControl.addOverlay(this, PaleTileLayer.displayName, "基本")
  }
  public show(leaflet){
    leaflet.map.addLayer(this)
  }
}

/**
 * 国土地理院色別標高図タイル
 */
class ReliefTileLayer extends L.TileLayer {
  static displayName = '国土地理院色別標高図'
  static urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png'
  static options = {
    id: 'CyberJapanReliefTile',
    attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>',
    minZoom: 5,
    maxZoom: 15,
    opacity: 0.4,
  }
  constructor(){
    super(ReliefTileLayer.urlTemplate, ReliefTileLayer.options)
  }
  public addToOverlay(leaflet){
    leaflet.layerControl.addOverlay(this, ReliefTileLayer.displayName, "基本")
  }
  public show(leaflet){
    leaflet.map.addLayer(this)
  }
}

/**
 * YOLP 雨雲レーダータイル
 */
class RainTileLayer extends L.TileLayer {
  static displayName = "YOLP 雨雲レーダー"
  static urlTemplate = 'http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}'
  static options = {
    id: 'YOLPRainRadar',
    attribution: '<a href="https://developer.yahoo.co.jp/webapi/map/">Yahoo! Open Local Platform</a>',
    minZoom: null,
    maxZoom: 18,
    opacity: 0.7,
  }
  constructor(){
    super(RainTileLayer.urlTemplate, RainTileLayer.options)
  }
  public addToOverlay(leaflet){
    leaflet.layerControl.addOverlay(this, RainTileLayer.displayName, "基本")
  }
  public show(leaflet){
    leaflet.map.addLayer(this)
  }
  public getTileUrl = (coords) => {
    //雨雲リクエスト日付の作成
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    let monthStr = String(month)
    if (month < 10) monthStr = '0' + String(month);
    const day = now.getDate();
    let dayStr = String(day)
    if (day < 10) dayStr = '0' + String(day);
    const hours = now.getHours();
    let hoursStr = String(hours)
    if (hours < 10) hoursStr = '0' + String(hours);
    let minutes = now.getMinutes();
    minutes *= 0.1;
    minutes = Math.floor(minutes);
    minutes *= 10;
    let minutesStr = String(minutes)
    if (minutes < 10) minutesStr = '0' + String(minutes);
    const dateStr = "" + String(year) + monthStr + dayStr + hoursStr + minutesStr;
    // @ts-ignore
    return L.Util.template(this._url, L.extend({
      d: dateStr,
      x: coords.x,
      y: Math.pow(2, this._getZoomForUrl() - 1) - 1 - coords.y,
      z: this._getZoomForUrl() + 1
    }, this.options))
  }
}

/**
 * GeoJson表現する基底クラス
 */
class GeoJson {
  displayName:string
  url:string
  icon:any
  ready:Promise<any>
  geojson:any = null

  constructor(displayName, url, icon){
    this.displayName = displayName
    this.url = url
    this.icon = icon
    this.ready = new Promise(async resolve => {
      const res = await fetch(this.url)
      let json = await res.json()
      json = this.toGeoJson(json)
      this.geojson = L.geoJSON(json, {
        pointToLayer: this.pointToLayer,
        onEachFeature: this.onEachFeature
      })
      resolve()
    })
  }

  public toGeoJson = (arcgisjson) => {
    return arcgisjson
  }

  public pointToLayer = (feature, coordinates) => {
    return L.marker(coordinates, {icon: this.icon})
  }

  public onEachFeature = (feature, layer) => {
  }

  public addToOverlay(leaflet, groupName){
    leaflet.layerControl.addOverlay(this.geojson, this.displayName, groupName)
  }

  public show(leaflet){
    leaflet.map.addLayer(this.geojson)
  }
}

/**
 * 水害情報GeoJson
 */
class FloodArcGisJson extends GeoJson {
  static displayName = "水害情報"
  static url = "/geojson/2019_typhoon19_flood.arcgisjson"
  static icon = L.icon({
    iconUrl: '/img/flood.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  })

  constructor(){
    super(FloodArcGisJson.displayName, FloodArcGisJson.url, FloodArcGisJson.icon)
  }

  public toGeoJson = (arcgisjson) => {
    // @ts-ignore
    return ArcgisToGeojsonUtils.arcgisToGeoJSON(arcgisjson)
  }

  public onEachFeature = (feature, layer) => {
    layer.bindPopup(feature.properties['name']);
  }

}

/**
 * 災害ボランティアセンターGeoJson
 */
class VolunteerGeoJson extends GeoJson {
  static displayName = "災害ボランティアセンター"
  static url = "/geojson/2019_typhoon19_volunteer.geojson"
  static icon = L.icon({
    iconUrl: '/img/volunteer.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });

  constructor(){
    super(VolunteerGeoJson.displayName, VolunteerGeoJson.url, VolunteerGeoJson.icon)
  }

  public pointToLayer = (feature, coordinates) => {
    let lat = feature.properties['緯度_十進数_']
    let long = feature.properties['経度_十進数_']
    // @ts-ignore
    return L.marker([lat, long], {icon: VolunteerGeoJson.icon})
  }

  public onEachFeature = (feature, layer) => {
    let content = '<b>'+feature.properties['都道府県名']+feature.properties['市町村名']+'</b><br />'
    content = content + feature.properties['災害ボランティアセンター名']+'<br />'
    if(feature.properties['詳細情報URL']){
      content = content + '<a href="'+feature.properties['詳細情報URL']+'">ウェブサイト</a><br />'
    }
    if(feature.properties['電話番号']){
      content = content + '電話番号: '+feature.properties['電話番号']
    }
    layer.bindPopup(content);
  }
}

/**
 *  マーカー読み込んで描画する基底クラス
 */
class Markers {
  displayName:string
  url:string
  icon:any
  ready:Promise<any>
  markers = []
  layerGroup:any = null

  constructor(displayName, url, icon){
    this.displayName = displayName
    this.url = url
    this.icon = icon
    this.ready = new Promise(async resolve => {
      const res = await fetch(this.url)
      let json = await res.json()
      json.forEach(this.forEach)
      resolve()
    })
  }

  public shouldIgnore = (element) => {
    return false
  }

  public getIcon = (element) => {
    return this.icon
  }

  public getContent = (element) => {
    return null
  }

  public forEach = (element) => {
    if (element.lat===undefined || element.lat===null || element.long===undefined || element.long===null){return;}
    if (this.shouldIgnore(element)){return;}
    const icon = this.getIcon(element)
    let marker
    if(icon===null){
      marker = L.marker([element.lat, element.long]);
    }else{
      marker = L.marker([element.lat, element.long], {icon: icon});
    }
    const content = this.getContent(element)
    marker.bindPopup(content)
    this.pushTo(element, marker)
  }

  public pushTo(element, marker){
    this.markers.push(marker)
  }

  public addToOverlay(leaflet, groupName){
    this.layerGroup = L.layerGroup(this.markers)
    leaflet.layerControl.addOverlay(this.layerGroup, this.displayName, groupName)
  }

  public show(leaflet){
    leaflet.map.addLayer(this.layerGroup)
  }
}



class SelfDefenseMarkers extends Markers {
  static displayName = "自衛隊災害派遣"
  static url = "/selfdefense"
  static selfDefenseIcon = L.icon({
    iconUrl: '/img/selfdefense.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });
  static waterTruckIcon = L.icon({
    iconUrl: '/img/water_truck.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });

  constructor(){
    super(SelfDefenseMarkers.displayName, SelfDefenseMarkers.url, SelfDefenseMarkers.selfDefenseIcon)
  }

  public shouldIgnore = (element) => {
    return element.text.startsWith("RT")
  }

  public getIcon = (element) => {
    if(element.text.indexOf('給水')!==-1){
      return SelfDefenseMarkers.waterTruckIcon
    }else{
      return SelfDefenseMarkers.selfDefenseIcon
    }
  }

  public getContent = (element) => {
    const tweeted_at = new Date(element.tweeted_at._seconds*1000)
    var content = "<h3><img width=20 height=20 src='"+element.icon_url+"' />"+element.display_name+"</h3>"
    content = content + "<p>"
    content = content + "<a href='https://twitter.com/"+element.screen_name+"/status/"+element.tweet_id_str+"'>";
    content = content + element.text
    content = content + "</a>"
    content = content + " (" + tweeted_at.toLocaleString() + ")"
    content = content + "</p>"
    if (element.photos.length>0){
      content = content + "<img width=150 height=100 src='"+element.photos[0]+"' />";
    }
    return content
  }

}



class FireDeptMarkers extends Markers {
  static url = "/firedept"
  static firetruckIcon = L.icon({
    iconUrl: '/img/firetruck_fast.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });
  static ambulanceIcon = L.icon({
    iconUrl: '/img/ambulance_fast.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });
  static fireIcon = L.icon({
    iconUrl: '/img/fire_icon.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });
  static cautionIcon = L.icon({
    iconUrl: '/img/caution.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });
  fireDeptDispatchCrisis = []
  fireDeptDispatchFire = []
  fireDeptDispatchRescue = []
  fireDeptDispatchOther = []
  fireDeptDispatchCrisisLayerGroup: any = null
  fireDeptDispatchFireLayerGroup: any = null
  fireDeptDispatchRescueLayerGroup: any = null
  fireDeptDispatchOtherLayerGroup: any = null

  constructor(){
    super(null, FireDeptMarkers.url, null)
  }

  public getContent = (element) => {
    let created_at = new Date(element.created_at._seconds*1000)
    let content = "<b>"+element.division+"</b>:"+element.detail+'<br /> ('+created_at.toLocaleString()+')'
    return content
  }

  public getIcon = (element) => {
    let icon
    switch(element.category){
      case "crisis":
        icon = FireDeptMarkers.firetruckIcon
        break
      case "fire":
        icon = FireDeptMarkers.fireIcon
        break
      case "rescue":
        icon = FireDeptMarkers.ambulanceIcon
        break
      case "caution":
        icon = FireDeptMarkers.cautionIcon
        break
      case "survey":
        icon = FireDeptMarkers.cautionIcon
        break
      case "support":
        FireDeptMarkers.cautionIcon
        break
    }
    return icon
  }

  public pushTo = (element, marker) => {
    switch(element.category){
      case "crisis":
        this.fireDeptDispatchCrisis.push(marker)
        break
      case "fire":
        this.fireDeptDispatchFire.push(marker)
        break
      case "rescue":
        this.fireDeptDispatchRescue.push(marker)
        break
      case "caution":
        this.fireDeptDispatchOther.push(marker)
        break
      case "survey":
        this.fireDeptDispatchOther.push(marker)
        break
      case "support":
        this.fireDeptDispatchOther.push(marker)
        break
    }
  }

  public addToOverlay(leaflet){
    this.fireDeptDispatchCrisisLayerGroup = L.layerGroup(this.fireDeptDispatchCrisis)
    this.fireDeptDispatchFireLayerGroup = L.layerGroup(this.fireDeptDispatchFire)
    this.fireDeptDispatchRescueLayerGroup = L.layerGroup(this.fireDeptDispatchRescue)
    this.fireDeptDispatchOtherLayerGroup = L.layerGroup(this.fireDeptDispatchOther)
    leaflet.layerControl.addOverlay(this.fireDeptDispatchCrisisLayerGroup, "消防災害出動情報", "消防署")
    leaflet.layerControl.addOverlay(this.fireDeptDispatchFireLayerGroup, "消防火災出動情報", "消防署")
    leaflet.layerControl.addOverlay(this.fireDeptDispatchRescueLayerGroup, "消防救急出動情報", "消防署")
    leaflet.layerControl.addOverlay(this.fireDeptDispatchOtherLayerGroup, "消防その他出動情報", "消防署")
  }

  public show(leaflet){
    leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup)
  }
}

class NewsMarkers extends Markers {
  static displayName = "災害関連ニュース" 
  static url = "/news"
  static icon
  clusterGroup:any = null

  constructor(category){
    super(NewsMarkers.displayName, NewsMarkers.url+category, null)
  }

  public shouldIgnore = (element) => {
    return (element.og_title===undefined || element.og_title===null 
      || element.og_desc===undefined || element.og_desc===null)
  }

  public getContent = (element) => {
    let content = "<h3>"+element.og_title+"</h3><p>";
    if (element.og_url){
      content = content + "<a href='"+element.og_url+"'>";
    }
    content = content + element.og_desc
    if (element.og_url){
      content = content + "</a>"
    }
    content = content + "</p>"
    if (element.og_image){
      content = content + "<img width=150 height=100 src='"+element.og_image+"' />";
    }
    return content
  }

  public addToOverlay = (leaflet) => {
    // @ts-ignore
    const newsClusterGroup = L.markerClusterGroup.layerSupport({clusterPane: 'pane690'})
    const newsLayerGroup = L.layerGroup(this.markers)
    newsClusterGroup.addTo(leaflet.map)
    newsClusterGroup.checkIn(newsLayerGroup)
    this.layerGroup = newsLayerGroup
    this.clusterGroup = newsClusterGroup
    leaflet.layerControl.addOverlay(this.layerGroup, NewsMarkers.displayName, "情報")
  }

  public show(leaflet){
    leaflet.map.addLayer(this.layerGroup)
  }
}

const renderLeafLetPromise = new Promise(async resolve => {

  const leaflet = new LeafletInitializer()
  await leaflet.ready

  
  const reliefTileLayer = new ReliefTileLayer()
  reliefTileLayer.addToOverlay(leaflet)
  const rainTileLayer = new RainTileLayer()
  rainTileLayer.addToOverlay(leaflet)


  let category = ""
  switch (location.hash){
    case "#drug":
      category = "?category=drug";
      break;
    case "#children":
      category = "?category=children";
      break;
    default:
      category = "?category=crisis"
  }
  const newsLayer = new NewsMarkers(category)
  await newsLayer.ready
  newsLayer.addToOverlay(leaflet)
  newsLayer.show(leaflet)


  const floodArcGisJson = new FloodArcGisJson()
  await floodArcGisJson.ready
  floodArcGisJson.addToOverlay(leaflet, "情報")
  floodArcGisJson.show(leaflet)

  const volunteerGeoJson = new VolunteerGeoJson()
  await volunteerGeoJson.ready
  volunteerGeoJson.addToOverlay(leaflet, "情報")
  volunteerGeoJson.show(leaflet)

  const selfDefenseMarkers = new SelfDefenseMarkers()
  await selfDefenseMarkers.ready
  selfDefenseMarkers.addToOverlay(leaflet, "自衛隊")
  selfDefenseMarkers.show(leaflet)

  const fireDeptMarkers = new FireDeptMarkers()
  await fireDeptMarkers.ready
  fireDeptMarkers.addToOverlay(leaflet)
  fireDeptMarkers.show(leaflet)

  resolve()
})

window.addEventListener("load", async function(){
  console.log("load");
  await renderLeafLetPromise
}, false)




// ツイートボタン
// @ts-ignore
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
  // @ts-ignore
  t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));