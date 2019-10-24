/**
 * 日本全体表示に戻るボタン
 */
export default class ExpandControl extends L.Control {
  constructor(options){
    super(options)
  }

  public onAdd = (map) => {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
    container.innerHTML = '<i class="fas fa-expand"></i>'
    container.style.fontSize = '22px'
    container.style.textAlign = 'center'
    container.style.display = 'table-cell'
    container.style.verticalAlign = 'middle'
    container.style.backgroundColor = 'white'
    container.style.cursor = 'pointer'
    container.style.width = '30px'
    container.style.height = '30px'
    
    container.onclick = function(){
      map.setView([36.56028, 139.19333], 6)
    }
    return container;
  }
}