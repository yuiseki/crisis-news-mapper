
class NewsInitializer {

}

const renderNewsPromise = new Promise(async resolve => {
  
})

window.addEventListener("load", async function(){
  console.log("load");
  $('.nav a').on('shown.bs.tab', function (e) {
    console.log(e.target)
  })
}, false)
