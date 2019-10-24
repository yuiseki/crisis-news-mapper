/**
 * GitHub移動ボタン
 */
export default class GithubControl extends L.Control {
  constructor(options){
    super(options)
  }

  public onAdd = (map) => {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
    container.innerHTML = '<i class="fab fa-github"></i>'
    container.style.fontSize = '30px'
    container.style.textAlign = 'center'
    container.style.display = 'table-cell'
    container.style.verticalAlign = 'middle'
    container.style.backgroundColor = 'white'
    container.style.cursor = 'pointer'
    container.style.width = '40px'
    container.style.height = '40px'
    
    container.onclick = function(){
      const url = 'https://github.com/yuiseki/crisis-news-mapper';
      const newWindow = window.open(url, '_blank');
      newWindow.focus();
    }
    return container;
  }
}