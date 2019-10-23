import Markers from "./Markers";


export default class FireDeptMarkers extends Markers {
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

  public addOverlay(leaflet){
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