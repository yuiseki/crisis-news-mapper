import GeoJson from "./GeoJson"

/**
 * 水害情報GeoJson
 * http://crs.bosai.go.jp/DynamicCRS/index.html?appid=9424c7b32d784b60a9b70d59ff32ac96
 * ここからデータを拝借している
 * コツ
 * Chrome developer tools の Network タブで `query` で filter してそれっぽいデータを探す
 * https://services8.arcgis.com/rGc6Kyg1ETR5TWY9/arcgis/rest/services/river19/FeatureServer/0/query?f=pbf&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&maxRecordCountFactor=4&outSR=102100&resultOffset=0&resultRecordCount=8000&cacheHint=true&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1.0583354500042303%2C%22extent%22%3A%7B%22xmin%22%3A15203799.647455202%2C%22ymin%22%3A4108790.7298450815%2C%22xmax%22%3A15716437.813743742%2C%22ymax%22%3A4655115.429990286%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D%7D
 *   - 余計なパラメーターを全部削る
 *   - `f=pbf` を `f=json` にする
 *   - `outSR=xxxx` を `outSR=4326` にする
 * https://services8.arcgis.com/rGc6Kyg1ETR5TWY9/arcgis/rest/services/river19/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&outSR=4326&outFields=*&maxRecordCountFactor=4&resultOffset=0&resultRecordCount=8000&cacheHint=true
 * こうしないとarcgisToGeoJSONでGeoJSONに変換できる座標を持ったJSONにならない
 */
export default class FloodArcGisJson extends GeoJson {
  static displayName = "水害発生箇所"
  static url = "/geojson/2019_typhoon19_flood.arcgisjson"
  static icon = L.icon({
    iconUrl: '/img/flood.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  })

  constructor(){
    super(FloodArcGisJson.displayName, FloodArcGisJson.url, FloodArcGisJson.icon, null, 'pane660')
  }

  public toGeoJson = (arcgisjson) => {
    // @ts-ignore
    return ArcgisToGeojsonUtils.arcgisToGeoJSON(arcgisjson)
  }

  public onEachFeature = (feature, layer) => {
    layer.bindPopup(feature.properties['name']);
  }

}