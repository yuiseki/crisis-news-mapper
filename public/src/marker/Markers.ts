

/**
 *  lat, longプロパティを持つjsonを読み込んで描画する基底クラス
 */
export default class Markers {
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

  /**
   * 描画したくないマーカーの条件があるときに上書きする
   */
  public shouldIgnore = (element) => {
    return false
  }

  /**
   * 条件に応じてアイコンを切り替えたいときに上書きする
   */
  public getIcon = (element) => {
    return this.icon
  }

  /**
   * 条件に応じて複数のカテゴリに分類して表示したいときに上書きする
   * addOverlayも上書きする必要がある
   * @param element 
   * @param marker 
   */
  public pushTo(element, marker){
    this.markers.push(marker)
  }

  /**
   * マーカーのポップアップに指定するHTMLを構築するために上書きする
   */
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

  public addOverlay(leaflet, groupName){
    this.layerGroup = L.layerGroup(this.markers)
    leaflet.layerControl.addOverlay(this.layerGroup, this.displayName, groupName)
  }

  public show(leaflet){
    leaflet.map.addLayer(this.layerGroup)
  }

  public hide(leaflet){
    leaflet.map.removeLayer(this.layerGroup)
  }
}
