import Markers from "./Markers";

export default class RiverLevelMarkers extends Markers {
  static displayName = "氾濫箇所"
  static url = "/riverlevel"
  static floodIcon = L.icon({
    iconUrl: '/img/flood.png',
    iconSize:     [50, 50],
    iconAnchor:   [25, 25],
    popupAnchor:  [0, -25]
  })
  riverLevels = []
  riverLevelsLayerGroup: any = null
  layerGroups = []

  constructor(params){
    super(null, RiverLevelMarkers.url+params, null)
  }

  public getContent = (element) => {
    let created_at = new Date(element.created_at._seconds*1000)
    let content = "<b>"+element.name+"</b> <br /> 氾濫水位:"+element.fladLevel+'<br /> 現在水位:'+element.level+' <br /> ('+created_at.toLocaleString()+')'
    return content
  }

  public getIcon = (element) => {
    return RiverLevelMarkers.floodIcon
  }

  public pushTo = (element, marker) => {
    this.riverLevels.push(marker)
  }

  public addOverlay(leaflet){
    this.riverLevelsLayerGroup = L.layerGroup(this.riverLevels)
    this.layerGroups.push(this.riverLevelsLayerGroup)
    leaflet.layerControl.addOverlay(this.riverLevelsLayerGroup, RiverLevelMarkers.displayName, "河川水位情報")
  }

  public show(leaflet){
    leaflet.map.addLayer(this.riverLevelsLayerGroup)
  }
}