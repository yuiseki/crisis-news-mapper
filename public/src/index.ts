
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
import JapanPrefsGeoJson from './geojson/JapanPrefsGeoJson';
import JapanCitiesGeoJson from './geojson/JapanCitiesGeoJson';

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
      this.map.on('overlayadd',    this.onOverlayAdd)
      this.map.on('overlayremove', this.onOverlayRemove)
      this.map.on('moveend',       this.onMoveEnd)
      this.map.on('zoomend',       this.onZoomEnd)
      this.initView()
      this.initPanes()
      this.renderControls()
      await this.renderBaseLayer()
      this.renderOverlayLayers()
      resolve()
    });
  }

  private onOverlayAdd = async (event) => {
    let layers = JSON.parse(localStorage.getItem('leaflet-layers'))
    if(layers===null){
      layers = []
    }
    if(layers.indexOf(event.name)===-1){
      layers.push(event.name)
    }
    localStorage.setItem('leaflet-layers', JSON.stringify(layers))
  }

  private onOverlayRemove = (event) => {
    let layers = JSON.parse(localStorage.getItem('leaflet-layers'))
    if(layers===null){
      layers = []
    }
    if(layers.indexOf(event.name) > -1){
      layers.splice(layers.indexOf(event.name), 1)
    }
    localStorage.setItem('leaflet-layers', JSON.stringify(layers))
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

  private initView = () => {
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

  /**
   * マーカーの重なる順番を指定するために使うやつを初期化しておく
   * https://leafletjs.com/reference-1.0.0.html#map-pane
   */
  private initPanes = () => {
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

  private renderBaseLayer = async () => {
    this.layer = new PaleTileLayer()
    this.layer.addTo(this.map)
    this.baseLayerData = {
      "国土地理院淡色地図": this.layer
    }
    const japanPrefsGeoJson = new JapanPrefsGeoJson()
    japanPrefsGeoJson.ready.then(()=>{
      japanPrefsGeoJson.show(this)
    })
    const japanCitiesGeoJson = new JapanCitiesGeoJson()
    japanCitiesGeoJson.ready.then(()=>{
      japanCitiesGeoJson.show(this)
    })
  }

  private renderOverlayLayers = async () => {
    const element = document.getElementsByClassName('leaflet-control-layers')[0]
    element.classList.add('leaflet-control-layers-expanded')
    const layers = JSON.parse(localStorage.getItem('leaflet-layers'))

    const reliefTileLayer = new ReliefTileLayer()
    reliefTileLayer.addOverlay(this, "基本")
    if(layers.indexOf(ReliefTileLayer.displayName)>-1){
      reliefTileLayer.show(this)
    }

    const rainTileLayer = new RainTileLayer()
    rainTileLayer.addOverlay(this, "基本")
    if(layers.indexOf(RainTileLayer.displayName)>-1){
      rainTileLayer.show(this)
    }

    const floodArcGisJson = new FloodArcGisJson()
    floodArcGisJson.ready.then(()=>{
      floodArcGisJson.addOverlay(this, "情報")
      if(layers.indexOf(FloodArcGisJson.displayName)>-1){
        floodArcGisJson.show(this)
      }
    })

    const volunteerGeoJson = new VolunteerGeoJson()
    volunteerGeoJson.ready.then(()=>{
      volunteerGeoJson.addOverlay(this, "情報")
      if(layers.indexOf(VolunteerGeoJson.displayName)>-1){
        volunteerGeoJson.show(this)
      }
    })

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
    const newsMarkers = new NewsMarkers(category)
    newsMarkers.ready.then(()=>{
      newsMarkers.addOverlay(this)
      if(layers.indexOf(NewsMarkers.displayName)>-1){
        newsMarkers.show(this)
      }
    })

    const selfDefenseMarkers = new SelfDefenseMarkers()
    selfDefenseMarkers.ready.then(()=>{
      selfDefenseMarkers.addOverlay(this, "自衛隊")
      if(layers.indexOf(SelfDefenseMarkers.displayName)>-1){
        selfDefenseMarkers.show(this)
      }
    })

    const fireDeptMarkers = new FireDeptMarkers()
    fireDeptMarkers.ready.then(()=>{
      fireDeptMarkers.addOverlay(this)
      if(layers.indexOf(FireDeptMarkers.displayName)>-1){
        fireDeptMarkers.show(this)
      }
    })

    setTimeout(()=>{
      element.classList.remove('leaflet-control-layers-expanded')
    }, 5000)
  }

}

const renderLeafLetPromise = new Promise(async resolve => {

  const leaflet = new LeafletInitializer()
  await leaflet.ready

  


  resolve()
})

window.addEventListener("load", async function(){
  console.log("load");
  await renderLeafLetPromise
}, false)
