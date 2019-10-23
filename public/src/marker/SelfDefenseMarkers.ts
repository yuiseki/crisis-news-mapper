import Markers from "./Markers";

export default class SelfDefenseMarkers extends Markers {
  static displayName = "自衛隊災害派遣"
  static url = "/selfdefense"
  static selfDefenseIcon = L.icon({
    iconUrl: '/img/selfdefense.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });
  static waterTruckIcon = L.icon({
    iconUrl: '/img/water_truck.png',
    iconSize:     [20, 20],
    iconAnchor:   [10, 10],
    popupAnchor:  [0, -10]
  });

  constructor(){
    super(SelfDefenseMarkers.displayName, SelfDefenseMarkers.url, SelfDefenseMarkers.selfDefenseIcon)
  }

  public shouldIgnore = (element) => {
    return element.text.startsWith("RT")
  }

  public getIcon = (element) => {
    if(element.text.indexOf('給水')!==-1){
      return SelfDefenseMarkers.waterTruckIcon
    }else{
      return SelfDefenseMarkers.selfDefenseIcon
    }
  }

  public getContent = (element) => {
    const tweeted_at = new Date(element.tweeted_at._seconds*1000)
    var content = "<h3><img width=20 height=20 src='"+element.icon_url+"' />"+element.display_name+"</h3>"
    content = content + "<p>"
    content = content + "<a href='https://twitter.com/"+element.screen_name+"/status/"+element.tweet_id_str+"'>";
    content = content + element.text
    content = content + "</a>"
    content = content + " (" + tweeted_at.toLocaleString() + ")"
    content = content + "</p>"
    if (element.photos.length>0){
      content = content + "<img width=150 height=100 src='"+element.photos[0]+"' />";
    }
    return content
  }

}