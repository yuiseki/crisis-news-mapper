import Markers from "./Markers"


export default class NewsMarkers extends Markers {
  static displayName = "災害関連ニュース" 
  static url = "/news"
  static icon
  clusterGroup:any = null

  constructor(params){
    super(NewsMarkers.displayName, NewsMarkers.url+params, null)
  }

  public shouldIgnore = (element) => {
    return (element.og_title===undefined || element.og_title===null 
      || element.og_desc===undefined || element.og_desc===null)
  }

  public getContent = (element) => {
    let content = "<h3 title='"+element.category+"'>"+element.og_title+"</h3><p>";
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

  public addOverlay = (leaflet) => {
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
    this.ready.then(()=>{
      leaflet.map.addLayer(this.layerGroup)
    })
  }
}