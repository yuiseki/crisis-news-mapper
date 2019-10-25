
// control
import SponsorControl from './control/SponsorControl';
import GithubControl from './control/GithubControl';
import ExpandControl from './control/ExpandControl';
// tile
import PaleTileLayer from './tile/PaleTileLayer';
import ReliefTileLayer from './tile/ReliefTileLayer';
import RainTileLayer from './tile/RainTileLayer';
// geojson
import FloodArcGisJson from './geojson/FloodArcGisJson';
import VolunteerGeoJson from './geojson/VolunteerGeoJson';
// marker
import NewsMarkers from './marker/NewsMarkers';
import SelfDefenseMarkers from './marker/SelfDefenseMarkers';
import FireDeptMarkers from './marker/FireDeptMarkers';

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

/**
 * Leafletを初期化するクラス
 */
class LeafletInitializer {
  ready:Promise<any>
  map:any
  layer:any
  layerGroup:any

  githubControl:any
  sponsorControl:any
  layerControl:any
  searchControl:any
  locatorControl:any
  expandControl:any
  zoomControl:any

  private baseLayerData = null
  private overlayLayerData = null

  constructor(){
    this.ready = new Promise(async resolve => {
      // Leafletの初期化
      this.map = L.map('map', { zoomControl: false })
      // TODO: overlayadd時にデータを読み込む
      this.map.on('overlayadd',    (event)=>{console.log('overlayadd: ',    event)})
      this.map.on('overlayremove', (event)=>{console.log('overlayremove: ', event)})
      this.map.on('moveend',       this.onMoveEnd)
      this.map.on('zoomend',       this.onZoomEnd)
      this.setView()
      this.createPane()
      this.renderBaseLayer()
      this.renderControls()
      await this.renderPref()
      await this.renderCity()
      resolve()
    });
  }

  private setView = () => {
    const lat = localStorage.getItem('leaflet-center-lat')
    const lng = localStorage.getItem('leaflet-center-lng')
    const zoom = localStorage.getItem('leaflet-zoom')
    if(lat!==undefined && lat!==null 
      && lng!==undefined && lng!==null 
      && zoom!==undefined && zoom!==null){
        const center = [Number(lat), Number(lng)]
        this.map.panTo(center)
        this.map.setZoom(zoom)
    }else{
      // 初期座標とズームを指定
      this.map.setView([36.56028, 139.19333], 6)
    }
  }

  private onMoveEnd = (event) => {
    const center = this.map.getCenter()
    const lat = center.lat
    const lng = center.lng
    localStorage.setItem('leaflet-center-lat', lat)
    localStorage.setItem('leaflet-center-lng', lng)
  }

  private onZoomEnd = (event) => {
    localStorage.setItem('leaflet-zoom', this.map.getZoom())
  }

  /**
   * マーカーの重なる順番を指定するために使うやつを初期化しておく
   * https://leafletjs.com/reference-1.0.0.html#map-pane
   */
  private createPane = () => {
    this.map.createPane("pane610").style.zIndex = "610"
    this.map.createPane("pane620").style.zIndex = "620"
    this.map.createPane("pane630").style.zIndex = "630"
    this.map.createPane("pane640").style.zIndex = "640"
    this.map.createPane("pane650").style.zIndex = "650"
    this.map.createPane("pane660").style.zIndex = "660"
    this.map.createPane("pane670").style.zIndex = "670"
    this.map.createPane("pane680").style.zIndex = "680"
    this.map.createPane("pane690").style.zIndex = "690"
  }

  private renderControls = () => {
    // スポンサー募集ボタン
    this.sponsorControl = new SponsorControl({
      position: 'bottomleft'
    }).addTo(this.map)
    // GitHubボタン
    this.githubControl = new GithubControl({
      position: 'bottomleft'
    }).addTo(this.map)
    // ズームインズームアウトするやつ
    this.zoomControl = L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map)
    // 全体表示に戻るやつ
    this.expandControl = new ExpandControl({
      position: 'bottomright'
    }).addTo(this.map)
    // 現在地に移動するやつ
    // @ts-ignore
    this.locatorControl = L.control.locate({
      icon: 'fa fa-map-marker-alt',
      position: 'bottomright',
      locateOptions: {
        maxZoom: 10
      }
    }).addTo(this.map)
    // 地名で検索するやつ
    // @ts-ignore
    this.searchControl = L.esri.Geocoding.geosearch({
      position: 'bottomright',
      placeholder: '地名で検索'
    }).addTo(this.map)
    // レイヤーの表示非表示を切り替えるやつ
    // @ts-ignore
    this.layerControl = L.control.groupedLayers(
      this.baseLayerData, this.overlayLayerData,
      {
        collapsed:true,
        position: 'bottomright'
      }
    ).addTo(this.map)
  }

  private renderBaseLayer = () => {
    this.layer = new PaleTileLayer()
      this.layer.addTo(this.map)
      this.baseLayerData = {
        "国土地理院淡色地図": this.layer
      }
  }

  // 都道府県の境界線の描画
  private renderPref = async () =>{
    const japanGeoJsonRes = await fetch("/geojson/japan.geojson")
    const japanGeoJsonJson = await japanGeoJsonRes.json()
    const japanGeoJson = L.geoJSON(japanGeoJsonJson, {
      style: {
        weight: 5
      },
      onEachFeature: function (feature, layer) {
      }
    })
    japanGeoJson.addTo(this.map)
  }

  // 市区町村の境界線の描画
  private renderCity = async () => {
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
    japanCitiesGeoJson.addTo(this.map)
  }
}

const renderLeafLetPromise = new Promise(async resolve => {

  const leaflet = new LeafletInitializer()
  await leaflet.ready

  const reliefTileLayer = new ReliefTileLayer()
  reliefTileLayer.addOverlay(leaflet)
  const rainTileLayer = new RainTileLayer()
  rainTileLayer.addOverlay(leaflet)
  const element = document.getElementsByClassName('leaflet-control-layers')[0]
  element.classList.add('leaflet-control-layers-expanded')

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
  newsLayer.addOverlay(leaflet)
  newsLayer.show(leaflet)


  const floodArcGisJson = new FloodArcGisJson()
  await floodArcGisJson.ready
  floodArcGisJson.addOverlay(leaflet, "情報")
  floodArcGisJson.show(leaflet)

  const volunteerGeoJson = new VolunteerGeoJson()
  await volunteerGeoJson.ready
  volunteerGeoJson.addOverlay(leaflet, "情報")
  volunteerGeoJson.show(leaflet)

  const selfDefenseMarkers = new SelfDefenseMarkers()
  await selfDefenseMarkers.ready
  selfDefenseMarkers.addOverlay(leaflet, "自衛隊")
  selfDefenseMarkers.show(leaflet)

  const fireDeptMarkers = new FireDeptMarkers()
  await fireDeptMarkers.ready
  fireDeptMarkers.addOverlay(leaflet)
  fireDeptMarkers.show(leaflet)

  setTimeout(()=>{
    element.classList.remove('leaflet-control-layers-expanded')
  }, 2000)
  resolve()
})

window.addEventListener("load", async function(){
  console.log("load");
  await renderLeafLetPromise
}, false)
