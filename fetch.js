var http = require('http');
var mongo = require('mongoskin');

var host = 'http://ws.audioscrobbler.com',
	key = '7ff3425714d0a04bba083bbe2d303657';

var db = mongo.db('localhost:27017/shitou?auto_reconnect');

var coll = db.collection('musics');

function getTracksByMood(mood, page, limit){
	var page = page || 0,
		limit = limit || 100;
	var request = http.get(host + '/2.0/?method=tag.gettoptracks&tag='+mood+'&limit='+limit+'&page='+page+'&format=json&api_key=' + key, function(res){
		console.log(host + '/2.0/?method=tag.gettoptracks&tag='+mood+'&limit='+limit+'&page='+page+'&format=json&api_key=' + key)
		res.setEncoding('utf8');
		var data = '';
		var json;
		res.on('data', function(chunk){
			data += chunk;
		})
		res.on('end', function(){
			
			json = JSON.parse(data);

			if( ! json.toptracks){
				return;
			}

			function walk(index){

				var track = json.toptracks.track[index];
				
				if( ! track){
					return;
				}

				coll.findOne({
					name : track.name,
					artist_name : track.artist.name
				}, function(err, result){
					if(err){
						throw err;
					}

					if( ! result){

						track.mood = mood;
						track.artist_name = track.artist.name;

						coll.save(track, function(err, result){
							console.log('inseted ', track.name, index);
							walk(index+1);
						})
					}
				})
			}

			walk(0);
		})
	});
}
//http://140.118.9.222/publications/conference/color_mood_cgaa.pdf
var moodList = ['Powerful', 'Rich', 'Romantic', 'Vital', 'Earthy', 'Friendly',
				'Soft', 'Welcoming', 'Moving', 'Elegant', 'Trendy', 'Fresh',
				'Traditional', 'Refreshing', 'Tropical', 'Classic', 'Dependable', 'Calm',
				'Regal', 'Magical', 'Nostalgic', 'Energetic', 'Subdued', 'Professional']

moodList.forEach(function(mood){

	getTracksByMood(mood, 0, 500);
})
