import NewsMarkers from "./NewsMarkers"

export default class CrisisNewsMarkers extends NewsMarkers {
  static displayName = "災害ニュース" 
  static url = "/news?category=crisis"

  constructor(params){
    super(CrisisNewsMarkers.displayName, CrisisNewsMarkers.url+params)
  }
}





