import NewsMarkers from "./NewsMarkers"

export default class ChildrenNewsMarkers extends NewsMarkers {
  static displayName = "虐待ニュース" 
  static url = "/news?category=children"

  constructor(params){
    super(ChildrenNewsMarkers.displayName, ChildrenNewsMarkers.url+params)
  }
}