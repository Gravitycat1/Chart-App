'use strict';

StockRender.AppRender.register({
	id: "49e90eee6ce1942a94136fc8db19319c",
	name: "Tables",
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
		/*Defining Variables*/
		var last_input;

		/*Reading User-Data*/
		AppMemory.read('last_input')
			.success(function(data){
				if(!data) {
					AppMemory.write('last_input','A');
					last_input = 'A';
				} else {
					last_input = data;
				}
			})
			.error(function(err, data){
				if(err) {
					console.log('AppMemory not retrieved',data);
					AppMemory.write('last_input','A');
					last_input = 'A';
				}
			});

		/*Running Program*/
		Runner.loadData(AppData,last_input);

		/*Setting click events*/
		$('#ticker-btn').click(function(){
			Runner.toggleOverhead();					
			Runner.loadData(AppData, $('#stock')[0].value);
			return;
		});

		$('#stock').keypress(function(e){
			if( e.which === 13 ) {
				Runner.toggleOverhead();
				Runner.loadData(AppData, $('#stock')[0].value);
				return;
			}
		})
	}
});