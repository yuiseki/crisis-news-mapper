

/**
 * 国土地理院色別標高図タイル
 */
export default class ReliefTileLayer extends L.TileLayer {
  static displayName = '国土地理院色別標高図'
  static urlTemplate = 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png'
  static options = {
    id: 'CyberJapanReliefTile',
    attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html#relief">国土地理院色別標高図</a>',
    minZoom: 5,
    maxZoom: 15,
    opacity: 0.4,
  }
  constructor(){
    super(ReliefTileLayer.urlTemplate, ReliefTileLayer.options)
  }
  public addOverlay(leaflet, groupName){
    leaflet.layerControl.addOverlay(this, ReliefTileLayer.displayName, groupName)
  }
  public show(leaflet){
    leaflet.map.addLayer(this)
  }
  public hide(leaflet){
    leaflet.map.removeLayer(this)
  }
}