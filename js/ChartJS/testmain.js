 
 var pricedata = new Array ()

StockRender.AppRender.register({
  id: "49e90eee6ce1942a94136fc8db19319c",
  name: "Heat Map",
  version: "1.0.0",
  defaults: {
    terminal: {
      x: 0,
      y: 0,
      w: 100,
      h: 100
    }
  },
  beforeRender: function () {
    console.log('running beforeRender!');
  },
  ready: function(AppMemory, AppData) {
  
   AppData.v1.pricedata.GET("A")
  .then(function(data){
    for (var i = 0; i <data.response.data.length; i++) {
      var fuu = {"volume": data.response.data[i][5], "price": data.response.data[i][1], "date": data.response.data[i][0]}
      pricedata.push(fuu)


    };
        
    console.log(pricedata)
   
  });
  
}
}); 

