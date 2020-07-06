/**
 * スポンサー募集ボタン
 */
export default class SponsorControl extends L.Control {
  constructor(options){
    super(options)
  }

  public onAdd = (map) => {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
    container.innerHTML = '<span class="gatagata">💸</span>'
    container.style.fontSize = '30px'
    container.style.textAlign = 'center'
    container.style.display = 'table-cell'
    container.style.verticalAlign = 'middle'
    container.style.backgroundColor = 'white'
    container.style.cursor = 'pointer'
    container.style.width = '40px'
    container.style.height = '40px'
    const modalContent =`
    <div style="text-align: center;margin: auto;">
    <h1>運営費支援のお願い</h1>
    <p>毎月3000円ほどかかっているので一年間で36000円くらいの出費になる予測です。オタスケ……</p>
    <h2>kyashによる支援</h2>
    <p><a href="kyash://qr/u/4235924052635520477">kyash://qr/u/4235924052635520477</a></p>
    <p><img width="200" height="200" src="/img/kyash_qr_yuiseki.png"></p>
    <h2>polcaによ支援</h2>
    <p><a href="https://polca.jp/projects/gRNhd5LhkQ6">https://polca.jp/projects/gRNhd5LhkQ6</a></p>
    <p><img width="200" height="200" src="/img/polca_qr.png"></p>
    </div>
    `
    container.onclick = function(){
      // @ts-ignore
      //firebase.analytics().logEvent('show_sponsor_control');
      map.openModal({
        content: modalContent,
        closeTitle: '✕',
        zIndex: 10000,
        transitionDuration: 0,
      });
    }
    return container;
  }
}