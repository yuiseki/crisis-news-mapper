
/**
 * GeoJsonを表現する基底クラス
 */
export default class GeoJson {
  displayName:string
  url:string
  icon:any
  ready:Promise<any>
  geojson:any = null

  /**
   * コンストラクタ
   * await geojson.ready すると geojson を読み込む 
   * @param displayName geojsonの表示名
   * @param url jsonのURL
   * @param icon 表示に使いたいアイコン
   */
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

  /**
   * jsonがGeoJSONではないとき、変換処理をする必要があるときに上書きする
   */
  public toGeoJson = (json) => {
    return json
  }

  /**
   * coordinatesが[lat, lng]形式ではないときに上書きする
   */
  public pointToLayer = (feature, coordinates) => {
    return L.marker(coordinates, {icon: this.icon})
  }

  public onEachFeature = (feature, layer) => {
  }

  public addOverlay(leaflet, groupName){
    leaflet.layerControl.addOverlay(this.geojson, this.displayName, groupName)
  }

  public show(leaflet){
    leaflet.map.addLayer(this.geojson)
  }

  public hide(leaflet){
    leaflet.map.removeLayer(this.geojson)
  }
}