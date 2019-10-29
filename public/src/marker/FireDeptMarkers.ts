import Markers from "./Markers";

export default class FireDeptMarkers extends Markers {
  static crisisDisplayName = "消防災害出動"
  static fireDisplayName = "消防火災出動"
  static rescueDisplayName = "消防救急出動"
  static otherDisplayName = "消防その他出動"
  static url = "/firedept"
  static firetruckIcon = L.icon({
    iconUrl: '/img/firetruck_fast.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  })
  static ambulanceIcon = L.icon({
    iconUrl: '/img/ambulance_fast.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  })
  static fireIcon = L.icon({
    iconUrl: '/img/fire_icon.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  })
  static cautionIcon = L.icon({
    iconUrl: '/img/caution.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  })
  fireDeptDispatchCrisis = []
  fireDeptDispatchFire = []
  fireDeptDispatchRescue = []
  fireDeptDispatchOther = []
  fireDeptDispatchCrisisLayerGroup: any = null
  fireDeptDispatchFireLayerGroup: any = null
  fireDeptDispatchRescueLayerGroup: any = null
  fireDeptDispatchOtherLayerGroup: any = null
  layerGroups = []

  constructor(params){
    super(null, FireDeptMarkers.url+params, null)
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

  public addOverlay(leaflet){
    this.fireDeptDispatchCrisisLayerGroup = L.layerGroup(this.fireDeptDispatchCrisis)
    this.layerGroups.push(this.fireDeptDispatchCrisisLayerGroup)
    this.fireDeptDispatchFireLayerGroup = L.layerGroup(this.fireDeptDispatchFire)
    this.layerGroups.push(this.fireDeptDispatchFireLayerGroup)
    this.fireDeptDispatchRescueLayerGroup = L.layerGroup(this.fireDeptDispatchRescue)
    this.layerGroups.push(this.fireDeptDispatchFireLayerGroup)
    this.fireDeptDispatchOtherLayerGroup = L.layerGroup(this.fireDeptDispatchOther)
    this.layerGroups.push(this.fireDeptDispatchFireLayerGroup)
    leaflet.layerControl.addOverlay(this.fireDeptDispatchCrisisLayerGroup, FireDeptMarkers.crisisDisplayName, "消防署")
    leaflet.layerControl.addOverlay(this.fireDeptDispatchFireLayerGroup, FireDeptMarkers.fireDisplayName, "消防署")
    leaflet.layerControl.addOverlay(this.fireDeptDispatchRescueLayerGroup, FireDeptMarkers.rescueDisplayName, "消防署")
    leaflet.layerControl.addOverlay(this.fireDeptDispatchOtherLayerGroup, FireDeptMarkers.otherDisplayName, "消防署")
  }

  public show(leaflet){
    leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup)
  }

  public showCrisis(leaflet){
    leaflet.map.addLayer(this.fireDeptDispatchCrisisLayerGroup)
  }

  public showFire(leaflet){
    leaflet.map.addLayer(this.fireDeptDispatchFireLayerGroup)
  }

  public showRescue(leaflet){
    leaflet.map.addLayer(this.fireDeptDispatchRescueLayerGroup)
  }

  public showOther(leaflet){
    leaflet.map.addLayer(this.fireDeptDispatchOtherLayerGroup)
  }
}