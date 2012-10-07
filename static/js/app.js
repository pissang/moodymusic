var App = Em.Application.create();

App.status = Em.Object.create({
	playing : null,
	thumb_url : '',
	mood : null,
	mood_color_bgc : function(){

		return 'background-color:'+this.get('mood').color_str
	}.property('mood')
})
/**
 * song list view
 */
App.SongsView = Em.View.extend({

});
/**
 * mood item in the moods list view
 */
App.MoodView = Em.View.extend({
	tagName : 'li',
	attributeBindings : ['title', 'style'],
	titleBinding : 'mood.mood',
	// template : Ember.Handlebars.compile('{{mood.mood}}'),
	style : function(){
		return 'background-color:'+this.get('mood').color_str
	}.property(),

	click : function(){
		App.songsList.fetch('http://'+location.host+'/get/musics/'+this.get('mood').mood );
		App.status.set('mood', this.get('mood'));
	}
})
/**
 * song item in the songs list view
 */
App.SongView = Em.View.extend({
	tagName : 'li',
	template : Ember.Handlebars.compile('<a href="#">{{song.name}} <span> - {{song.artist.name}}</span></a>'),

	click : function(){
		var song = this.get('song')
		App.status.set('playing', song );

		App.status.set('thumb_url', '#');
		if( song.image){

			App.status.set('thumb_url', song.image[3]['#text'] );
		}

		$.get('http://'+location.host+'/get/baidump3/'+song.name+'/'+song.artist.name,
			function(result){
				if( result.result){

				}
			})
	}
})
/**
 * Player view
 */
App.PlayerView = Em.View.extend({
	// binding not work ?
	// songBinding : 'App.status.playing',
	// thumb : function(){
	// 	if( this.get('song') ){
	// 		return this.get('song').image[3]['#text'];
	// 	}
	// }.property('song')
})

document.body.addEventListener('dragover', function(e){
	e.stopPropagation();
	e.preventDefault();
});

document.body.addEventListener('drop', function(e){
	e.stopPropagation();
	e.preventDefault();

	for(var i = 0; i < e.dataTransfer.files.length; i++){

		(function(){
			var file = e.dataTransfer.files[i];

			if( file.type.match('image/.*') ){

				var reader = new FileReader();
				reader.onload = function(evt){

					if(evt.target.readyState == FileReader.DONE){

						var img = document.createElement('img'),
							hist;
						img.onload = function(){
							hist = App.computeHistogram( img );
						}

						img.src = evt.target.result;

						var $li = $('<li></li>');
						$li.append( img );
						$('#ImageList').append($li);

						$li.click(function(){

							var idx = App.getMainColor( hist );
							var mood = App.moodsList[idx].mood;

							App.songsList.fetch('http://'+location.host+'/get/musics/'+mood);
							App.status.set('mood', App.moodsList[idx]);

							$('#ImageList li').removeClass('active');
							$li.addClass('active');
						})
					}
				}
				reader.readAsDataURL( file );
			}
		})()
	}
})

/**
 * Songs list
 */
App.songsList = Em.ArrayController.create({
	content : [],
	init : function(){
		this.fetch('http://'+location.host+'/get/musics/0/20');
	},

	fetch : function(url){
		console.log(url);
		var self = this;
		$.get(url, function(data){
			if( data.result ){
				self.set('content', data.result);
			}
		})
	}
})

App.moodsList =[{color:0xed2026, color_str:'#ed2026', mood:'Powerful'},
				{color:0x881619, color_str:'#881619', mood:'Rich'},
				{color:0xf289b6, color_str:'#f289b6', mood:'Romantic'},
				{color:0xed213b, color_str:'#ed213b', mood:'Vital'},
				{color:0xbb2126, color_str:'#bb2126', mood:'Earthy'},
				{color:0xf26724, color_str:'#f26724', mood:'Friendly'},
				{color:0xf89a66, color_str:'#f89a66', mood:'Soft'},
				{color:0xf79820, color_str:'#f79820', mood:'Welcoming'},
				{color:0xefe91c, color_str:'#efe91c', mood:'Moving'},
				{color:0xf5f29d, color_str:'#f5f29d', mood:'Elegant'},
				{color:0x84c441, color_str:'#84c441', mood:'Trendy'},
				{color:0x6bbd46, color_str:'#6bbd46', mood:'Fresh'},
				{color:0x108843, color_str:'#108843', mood:'Traditional'},
				{color:0x6ec282, color_str:'#6ec282', mood:'Refreshing'},
				{color:0x89cda7, color_str:'#89cda7', mood:'Tropical'},
				{color:0x326ab2, color_str:'#326ab2', mood:'Classic'},
				{color:0x233d82, color_str:'#233d82', mood:'Dependable'},
				{color:0x6690ca, color_str:'#6690ca', mood:'Calm'},
				{color:0x3856a4, color_str:'#3856a4', mood:'Regal'},
				{color:0x4552a3, color_str:'#4552a3', mood:'Magical'},
				{color:0x6860aa, color_str:'#6860aa', mood:'Nostalgic'},
				{color:0x7950a0, color_str:'#7950a0', mood:'Energetic'},
				{color:0x946eaf, color_str:'#946eaf', mood:'Subdued'},
				{color:0xcacccb, color_str:'#cacccb', mood:'Professional'}];

App.colors = [];
// hex to rgb;
App.moodsList.forEach(function(item){

	var r = ( item.color >> 16 & 255 );
	var g = ( item.color >> 8 & 255 );
	var b = ( item.color & 255 );

	App.colors.push(r);
	App.colors.push(g);
	App.colors.push(b);
})
App.colors = new Uint8Array( App.colors );

App.computeHistogram = function(image){

	var canvas = document.createElement('canvas');

	canvas.width = 512;
	canvas.height = 512;

	var ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

	var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	var histogram = [];
	for( var i = 0; i < App.moodsList.length; i++){
		histogram[i] = 0;
	}

	var len = App.moodsList.length;
	var x, y, k, offset, r1, g1, b1, r2, g2, b2, rgbDist, min, minIndex,
		colors = App.colors,
		width = canvas.width,
		height = canvas.height;

	for(var y = 0; y < height; y++){
		for(var x = 0; x < width; x++){

			offset = (width*y+x)*4;
			for( var k = 0; k < len; k++){
				r1 = data[ offset ];
				g1 = data[ offset +1 ];
				b1 = data[ offset +2 ];

				r2 = colors[ k*3 ];
				g2 = colors[ k*3 +1 ];
				b2 = colors[ k*3 +2 ];

				rgbDist = Math.sqrt( (r1-r2)*(r1-r2)+(g1-g2)*(g1-g2)+(b1-b2)*(b1-b2) );

				histogram[k] += rgbDist/255;
			}
		}
	}

	return histogram;

}

App.drawHistogram = function(hist){

	var canvas = document.createElement('canvas');
	canvas.width = 100;
	canvas.height = 100;

	var ctx = canvas.getContext('2d');
	hist.forEach(function(size, idx){
		var color = App.moodsList[idx]['color'];
		ctx.fillStyle = '#'+color;

	})
}

App.getMainColor = function(hist){
	var min = 9999999,
		minIdx = 0;

	hist.forEach(function(size, idx){
		if( size < min){
			min = size;
			minIdx = idx;
		}
	})

	return minIdx;
}