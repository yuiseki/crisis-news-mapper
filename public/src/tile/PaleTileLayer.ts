
/**
 * 国土地理院淡色地図タイル
 */
export default class PaleTileLayer extends L.TileLayer {
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
  public addOverlay(leaflet){
    leaflet.layerControl.addOverlay(this, PaleTileLayer.displayName, "基本")
  }
  public show(leaflet){
    leaflet.map.addLayer(this)
  }
  public hide(leaflet){
    leaflet.map.removeLayer(this)
  }
}