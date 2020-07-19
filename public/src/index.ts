
// control
import SponsorControl from './control/SponsorControl';
import GithubControl from './control/GithubControl';
import ExpandControl from './control/ExpandControl';
// tile
import PaleTileLayer from './tile/PaleTileLayer';
import ReliefTileLayer from './tile/ReliefTileLayer';
import RainTileLayer from './tile/RainTileLayer';
// geojson
//import FloodArcGisJson from './geojson/FloodArcGisJson';
//import VolunteerGeoJson from './geojson/VolunteerGeoJson';
// marker
import CrisisNewsMarkers from './marker/CrisisNewsMarkers';
import AccidentNewsMarkers from './marker/AccidentNewsMarkers';
import IncidentNewsMarkers from './marker/IncidentNewsMarkers';
import ChildrenNewsMarkers from './marker/ChildrenNewsMarkers';
import DrugNewsMarkers from './marker/DrugNewsMarkers';

import SelfDefenseMarkers from './marker/SelfDefenseMarkers';
import FireDeptMarkers from './marker/FireDeptMarkers';
import RiverLevelMarkers from './marker/RiverLevelMarkers';
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

  timelineControl:any

  githubControl:any
  sponsorControl:any

  layerControl:any
  searchControl:any
  locatorControl:any
  expandControl:any
  zoomControl:any

  daysago:string = "3"

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
      this.daysago = localStorage.getItem('leaflet-daysago')
      if(this.daysago===null){
        this.daysago = "3"
      }
      this.renderOverlayLayers()
      this.timelineControl.rangeInput.value = Number(this.daysago);
      const inputEvent = new Event('input');
      this.timelineControl.rangeInput.dispatchEvent(inputEvent);
      resolve()
    });
  }

  private onOverlayAdd = async (event) => {
    let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'))
    if(selectedLayers===null){
      selectedLayers = []
    }
    if(selectedLayers.indexOf(event.name)===-1){
      selectedLayers.push(event.name)
    }
    localStorage.setItem('leaflet-selectedLayers', JSON.stringify(selectedLayers))
  }

  private onOverlayRemove = (event) => {
    let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'))
    if(selectedLayers===null){
      selectedLayers = []
    }
    if(selectedLayers.indexOf(event.name) > -1){
      selectedLayers.splice(selectedLayers.indexOf(event.name), 1)
    }
    localStorage.setItem('leaflet-selectedLayers', JSON.stringify(selectedLayers))
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

  private onChangeTimeRange = (event) => {
    if(this.daysago != String(event.value)){
      this.daysago = String(event.value)
      localStorage.setItem('leaflet-daysago', this.daysago)
      location.reload()
    }
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
    // @ts-ignore
    this.timelineControl = L.control.timelineSlider({
      position: 'topright',
      timelineItems: ["1日前", "2日前", "3日前", "4日前", "5日前", "6日前", "7日前"],
      labelWidth: "50px",
      betweenLabelAndRangeSpace: "10px",
      initializeChange: false,
      changeMap: this.onChangeTimeRange
    }).addTo(this.map)
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
        position: 'bottomright',
        exclusiveGroups: ["ニュース"],
        groupCheckboxes: false
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
    // 選択していたレイヤーを復元
    let selectedLayers = JSON.parse(localStorage.getItem('leaflet-selectedLayers'))
    if(selectedLayers===null){
      selectedLayers = ["災害ニュース", "災害ボランティアセンター", "水害発生箇所", "自衛隊災害派遣", "消防災害出動", "消防火災出動", "消防救急出動"]
    }

    // 標高図
    const reliefTileLayer = new ReliefTileLayer()
    reliefTileLayer.addOverlay(this, "基本")
    if(selectedLayers.indexOf(ReliefTileLayer.displayName)>-1){
      // @ts-ignore
      firebase?.analytics().logEvent('show_relief_layer');
      reliefTileLayer.show(this)
    }

    // 雨雲レーダー
    const rainTileLayer = new RainTileLayer()
    rainTileLayer.addOverlay(this, "基本")
    if(selectedLayers.indexOf(RainTileLayer.displayName)>-1){
      // @ts-ignore
      firebase?.analytics().logEvent('show_rain_layer');
      rainTileLayer.show(this)
    }

    // 水害発生箇所
    /*
    const floodArcGisJson = new FloodArcGisJson()
    floodArcGisJson.ready.then(()=>{
      floodArcGisJson.addOverlay(this, "情報")
      if(selectedLayers.indexOf(FloodArcGisJson.displayName)>-1){
        floodArcGisJson.show(this)
      }
    })
    */

    // 災害ボランティアセンター
    /*
    const volunteerGeoJson = new VolunteerGeoJson()
    volunteerGeoJson.ready.then(()=>{
      volunteerGeoJson.addOverlay(this, "情報")
      if(selectedLayers.indexOf(VolunteerGeoJson.displayName)>-1){
        volunteerGeoJson.show(this)
      }
    })
    */

    // 自衛隊災害派遣
    const selfDefenseMarkers = new SelfDefenseMarkers("?daysago="+this.daysago)
    selfDefenseMarkers.ready.then(()=>{
      selfDefenseMarkers.addOverlay(this, "自衛隊")
      if(selectedLayers.indexOf(SelfDefenseMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_selfdefense_layer');
        selfDefenseMarkers.show(this)
      }
    })

    // 消防災害出動
    const fireDeptMarkers = new FireDeptMarkers("?daysago="+this.daysago)
    fireDeptMarkers.ready.then(()=>{
      fireDeptMarkers.addOverlay(this)
      if(selectedLayers.indexOf(FireDeptMarkers.crisisDisplayName)>-1){
        fireDeptMarkers.showCrisis(this)
      }
      if(selectedLayers.indexOf(FireDeptMarkers.fireDisplayName)>-1){
        fireDeptMarkers.showFire(this)
      }
      if(selectedLayers.indexOf(FireDeptMarkers.rescueDisplayName)>-1){
        fireDeptMarkers.showRescue(this)
      }
      if(selectedLayers.indexOf(FireDeptMarkers.otherDisplayName)>-1){
        fireDeptMarkers.showOther(this)
      }
    })

    const riverLevelMarkers = new RiverLevelMarkers("?daysago="+this.daysago)
    riverLevelMarkers.ready.then(()=>{
      riverLevelMarkers.addOverlay(this)
      if(selectedLayers.indexOf(RiverLevelMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_riverlevel_layer');
        riverLevelMarkers.show(this)
      }
    })

    // 災害ニュース
    const crisisNewsMarkers = new CrisisNewsMarkers("&daysago="+this.daysago)
    crisisNewsMarkers.ready.then(()=>{
      crisisNewsMarkers.addOverlay(this)
      if(selectedLayers.indexOf(CrisisNewsMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_crisis_news');
        crisisNewsMarkers.show(this)
      }
    })
    // 事故ニュース
    const accidentNewsMarkers = new AccidentNewsMarkers("&daysago="+this.daysago)
    accidentNewsMarkers.ready.then(()=>{
      accidentNewsMarkers.addOverlay(this)
      if(selectedLayers.indexOf(AccidentNewsMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_accident_news');
        accidentNewsMarkers.show(this)
      }
    })
    // 事件ニュース
    const incidentNewsMarkers = new IncidentNewsMarkers("&daysago="+this.daysago)
    incidentNewsMarkers.ready.then(()=>{
      incidentNewsMarkers.addOverlay(this)
      if(selectedLayers.indexOf(IncidentNewsMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_incident_news');
        incidentNewsMarkers.show(this)
      }
    })
    // 虐待ニュース
    const childrenNewsMarkers = new ChildrenNewsMarkers("&daysago="+this.daysago)
    childrenNewsMarkers.ready.then(()=>{
      childrenNewsMarkers.addOverlay(this)
      if(selectedLayers.indexOf(ChildrenNewsMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_children_news');
        childrenNewsMarkers.show(this)
      }
    })
    // 薬物ニュース
    const drugNewsMarkers = new DrugNewsMarkers("&daysago="+this.daysago)
    drugNewsMarkers.ready.then(()=>{
      drugNewsMarkers.addOverlay(this)
      if(selectedLayers.indexOf(DrugNewsMarkers.displayName)>-1){
        // @ts-ignore
        firebase?.analytics().logEvent('show_drug_news');
        drugNewsMarkers.show(this)
      }
    })

  }

}

const renderLeafLetPromise = new Promise(async resolve => {
  const leaflet = new LeafletInitializer()
  await leaflet.ready
  // レイヤー選択ボタンを開いておく
  let element
  setTimeout(()=>{
    element = document.getElementsByClassName('leaflet-control-layers')[0]
    element.classList.add('leaflet-control-layers-expanded')
  }, 2000)
  // 10秒後に閉じる
  setTimeout(()=>{
    element.classList.remove('leaflet-control-layers-expanded')
  }, 10000)
  resolve()
})

const handler = async (event) => {
  console.log("handler")
  // @ts-ignore
  if(firebase!==null){
    // @ts-ignore
    firebase.analytics()
    await renderLeafLetPromise
  }
}

window.onload = function() {
  if(document.readyState == "interactive"
  || document.readyState == "complete"){
    handler(null);
  } else {
    document.addEventListener(
      "DOMContentLoaded", handler, false);
  }
}
