import NewsMarkers from "./NewsMarkers"

export default class DrugNewsMarkers extends NewsMarkers {
  static displayName = "薬物ニュース" 
  static url = "/news?category=drug"

  constructor(params){
    super(DrugNewsMarkers.displayName, DrugNewsMarkers.url+params)
  }
}