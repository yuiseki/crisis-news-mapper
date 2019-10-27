import GeoJson from "./GeoJson"

export default class JapanCitiesGeoJson extends GeoJson {
  static displayName = "市区町村境界"
  static url = "/geojson/japan_cities.geojson"
  static icon = null
  static style = {
    weight: 2,
    opacity: 0.3
  }

  constructor(){
    super(
      JapanCitiesGeoJson.displayName,
      JapanCitiesGeoJson.url,
      JapanCitiesGeoJson.icon,
      JapanCitiesGeoJson.style
      )
  }

  public onEachFeature = (feature, layer) => {
    layer.bindTooltip(feature.properties.cityname_k);
  }
}