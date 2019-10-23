import GeoJson from "./GeoJson";


/**
 * 災害ボランティアセンターGeoJson
 */
export default class VolunteerGeoJson extends GeoJson {
  static displayName = "災害ボランティアセンター"
  static url = "/geojson/2019_typhoon19_volunteer.geojson"
  static icon = L.icon({
    iconUrl: '/img/volunteer.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });

  constructor(){
    super(VolunteerGeoJson.displayName, VolunteerGeoJson.url, VolunteerGeoJson.icon)
  }

  public pointToLayer = (feature, coordinates) => {
    let lat = feature.properties['緯度_十進数_']
    let long = feature.properties['経度_十進数_']
    // @ts-ignore
    return L.marker([lat, long], {icon: VolunteerGeoJson.icon})
  }

  public onEachFeature = (feature, layer) => {
    let content = '<b>'+feature.properties['都道府県名']+feature.properties['市町村名']+'</b><br />'
    content = content + feature.properties['災害ボランティアセンター名']+'<br />'
    if(feature.properties['詳細情報URL']){
      content = content + '<a href="'+feature.properties['詳細情報URL']+'">ウェブサイト</a><br />'
    }
    if(feature.properties['電話番号']){
      content = content + '電話番号: '+feature.properties['電話番号']
    }
    layer.bindPopup(content);
  }
}