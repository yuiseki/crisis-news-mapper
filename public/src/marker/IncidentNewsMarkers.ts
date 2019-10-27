import NewsMarkers from "./NewsMarkers"

export default class IncidentNewsMarkers extends NewsMarkers {
  static displayName = "事件ニュース" 
  static url = "/news?category=incident"

  constructor(params){
    super(IncidentNewsMarkers.displayName, IncidentNewsMarkers.url+params)
  }
}