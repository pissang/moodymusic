var express = require('express');
var mongo = require('mongodb');
var app = express.createServer();
var http = require('http');

app.use(express.static(__dirname+'/static'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:'shitou'}));

var db;
mongo.connect('mongodb://localhost:27017/shitou', function(err, conn){
	db = conn;
});

app.get('/get/musics/:page/:count', function(req, res){

	var page = parseInt(req.params.page) || 1,
		count = parseInt(req.params.count) || 50;

	db.collection('musics').find({})
		.limit(count)
		.skip((page-1)*count)
		.toArray(function(err, result){

			res.send({
				err : null,
				result : result
			})
		})
})

app.get('/get/musics/:mood', function(req, res){

	var mood = req.params.mood;

	db.collection('musics').find({
		mood : mood
	}).limit(20)
		.toArray(function(err, result){
			res.send({
				err : null,
				result : result
			})
		})
})

app.get('/get/baidump3/:title/:artist', function(req, _res){

	http.get('http://box.zhangmen.baidu.com/x?op=12&count=1&title='+ req.params.title +'$$'+ req.params.artist +'$$$$',
		function(res){
			res.setEncoding('utf-8');
			var data = '';
			res.on('data', function(chunck){
				data+=chunck;
			})
			res.on('end', function(){
				var result = /<encode><!\[CDATA\[([\s\S]*?)\]\]><\/encode><decode><!\[CDATA\[([\s\S]*?)\]\]><\/decode>/.exec(data);
				
				if(result){	
					_res.send({
						err : null,
						result : result[2]+result[2]
					});
				}else{
					_res.send({
						err : 'can not find mp3 file',
						result : ''
					})
				}
			})
		})
})

app.listen(8888);