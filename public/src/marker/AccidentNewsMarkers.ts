import NewsMarkers from "./NewsMarkers"

export default class AccidentNewsMarkers extends NewsMarkers {
  static displayName = "事故ニュース" 
  static url = "/news?category=accident"

  constructor(params){
    super(AccidentNewsMarkers.displayName, AccidentNewsMarkers.url+params)
  }
}