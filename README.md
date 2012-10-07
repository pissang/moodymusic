# Mood Music

MoodMusic是一个根据情绪来分类音乐信息的Web App，并且能够根据上传的图片来推荐相应的心情的歌曲。

整个Web App前端的构建主要基于 [Ember.js](http://emberjs.com/) 和 [Bootstrap](http://twitter.github.com/bootstrap/)，后端使用 [Node.js](http://nodejs.org/) 和 [Mangodb](http://www.mongodb.org/) 来抓取，保存和处理歌曲信息，


## features

- 歌曲信息来自last.fm，播放的url从baidu mp3抓取（但是大部分都没有=.=）

- 通过情绪来分类歌曲

- 拖拽本地图片来获取与这张图片情绪相似的歌曲


## 目录结构

`node_modules` node.js依赖模块，包括 [express](http://expressjs.com/), [mongoskin](https://github.com/kissjs/node-mongoskin)等

`static` html, js, css等静态文件

`test_images` 测试图片

`fetch.js` 用来从last.fm抓取歌曲信息的node程序

`server.js` 是后端处理请求的node程序

`shitou.json` 目前抓取的歌曲数据


## 环境配置

1.安装 [Node.js](http://nodejs.org/)

2.安装 [Mangodb](http://www.mongodb.org/)

3.运行目录下的server.js
	
	node server.js
4.浏览器中 [http://localhost:8888](http://localhost:8888) 访问


## 歌曲数据抓取

`fetch.js`会对目前预定义规则中的20多个情绪分别从last.fm中分类抓歌，目前主要是根据歌曲的标签来判断这首歌的情绪。

	node fetch.js

`fetch.js`中的`getTracksByMood`方法可以根据指定的情绪标签来抓取一定数量的歌曲

	getTracksByMood('Sad', page, count)

目录下的shitou.json是现在已经抓取的少部分歌曲。

## screeshots
![1](https://raw.github.com/pissang/moodmusic/master/screenshots/1.png)

![2](https://raw.github.com/pissang/moodmusic/master/screenshots/2.png)

![3](https://raw.github.com/pissang/moodmusic/master/screenshots/3.png)

![4](https://raw.github.com/pissang/moodmusic/master/screenshots/4.png)

## mood modal

参考 [Automatic Mood-Transferring 
between Color Images](http://140.118.9.222/publications/conference/color_mood_cgaa.pdf)

## todo

- 歌曲播放
- 完善歌曲分类