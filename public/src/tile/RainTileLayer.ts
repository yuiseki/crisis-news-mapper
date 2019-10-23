

/**
 * YOLP 雨雲レーダータイル
 */
export default class RainTileLayer extends L.TileLayer {
  static displayName = "YOLP 雨雲レーダー"
  static urlTemplate = 'http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}'
  static options = {
    id: 'YOLPRainRadar',
    attribution: '<a href="https://developer.yahoo.co.jp/webapi/map/">Yahoo! Open Local Platform</a>',
    minZoom: null,
    maxZoom: 18,
    opacity: 0.7,
  }
  constructor(){
    super(RainTileLayer.urlTemplate, RainTileLayer.options)
  }
  public addOverlay(leaflet){
    leaflet.layerControl.addOverlay(this, RainTileLayer.displayName, "基本")
  }
  public show(leaflet){
    leaflet.map.addLayer(this)
  }
  public hide(leaflet){
    leaflet.map.removeLayer(this)
  }
  public getTileUrl = (coords) => {
    //雨雲リクエスト日付の作成
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    let monthStr = String(month)
    if (month < 10) monthStr = '0' + String(month);
    const day = now.getDate();
    let dayStr = String(day)
    if (day < 10) dayStr = '0' + String(day);
    const hours = now.getHours();
    let hoursStr = String(hours)
    if (hours < 10) hoursStr = '0' + String(hours);
    let minutes = now.getMinutes();
    minutes *= 0.1;
    minutes = Math.floor(minutes);
    minutes *= 10;
    let minutesStr = String(minutes)
    if (minutes < 10) minutesStr = '0' + String(minutes);
    const dateStr = "" + String(year) + monthStr + dayStr + hoursStr + minutesStr;
    // @ts-ignore
    return L.Util.template(this._url, L.extend({
      d: dateStr,
      x: coords.x,
      y: Math.pow(2, this._getZoomForUrl() - 1) - 1 - coords.y,
      z: this._getZoomForUrl() + 1
    }, this.options))
  }
}