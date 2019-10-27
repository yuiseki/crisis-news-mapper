import GeoJson from "./GeoJson"

export default class JapanPrefsGeoJson extends GeoJson {
  static displayName = "都道府県境界"
  static url = "/geojson/japan.geojson"
  static icon = null
  static style = {
    weight: 5
  }

  constructor(){
    super(
      JapanPrefsGeoJson.displayName,
      JapanPrefsGeoJson.url,
      JapanPrefsGeoJson.icon,
      JapanPrefsGeoJson.style
      )
  }
}