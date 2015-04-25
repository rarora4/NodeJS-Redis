// Require External module 'express'
var express = require('express');

var redis = require("redis"),
        client = redis.createClient(), client2 = redis.createClient();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.get('/views', function(req, res){
  res.render('index.html');
});
var server = require('http').createServer(app);

// Port for application to run
var port = 3000;

// Establishing socket.io connection with the web broswer client
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);

//Create Web Socket Object and connect it to http server
var sio = require('socket.io').listen(server);

sio.sockets.on('connection', function(socket){

	console.log('Web client connected');

	/*const subscribe = redis.createClient();
	subscribe.subscribe('pubsub'); //    listen to messages from channel pubsub

        subscribe.on("message", function(channel, message) {
		console.log(message);
            //client.send(message);
		socket.emit('ss-tweet',  {user: message});
        });

        client.on('message', function(msg) {
		console.log(msg);
        });

        client.on('disconnect', function() {
            subscribe.quit();
        });*/
	
	// if you'd like to select database 3, instead of 0 (default), call
    	// client.select(3, function() { /* ... */ });

    	/*client.on("error", function (err) {
        	console.log("Error " + err);
    	});*/

    	client.set("string key", "string val", redis.print);
    	client.hset("hash key", "hashtest 1", "some value", redis.print);
    	client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
	client.hset("hash key", "hashtest 3", "some value", redis.print);
    	client.hset(["hash key", "hashtest 4", "some other value"], redis.print);
    	client.hset("hash key", "hashtest 5", "some value", redis.print);
    	client.hset(["hash key", "hashtest 6", "some other value"], redis.print);
	client.hset("hash key", "hashtest 7", "some value", redis.print);
    	client.hset(["hash key", "hashtest 8", "some other value"], redis.print);
	client.hset("hash key", "hashtest 9", "some value", redis.print);
    	client.hset(["hash key", "hashtest 10", "some other value"], redis.print);
    	client.hkeys("hash key", function (err, replies) {
		console.log(replies.length + " replies:");
		replies.forEach(function (reply, i) {
		    	console.log("    " + i + ": " + reply);
			socket.emit('ss-tweet', {user: "    " + i + ": " + reply});
		});
		client.quit();
    	});
	
	client.hgetall("time_slot:22", function(err,obj){
		console.dir(obj);
	});

	//client.sort("try3", "by", "nosort", "get", "*->slot", redis.print);
	/*client.sort("try3", "by", "*->slot", "get", "*->slot","get","*->tweets","get","*->sentiment", function(err,replies){
		console.log(replies.length + " replies:");
		replies.forEach(function (reply, i) {
		    	console.log("    " + i + ": " + reply);
			//socket.emit('ss-tweet', {user: "    " + i + ": " + reply});
		});
	});*/

	var result = [];
	client.sort("cricinfo", "by", "time_slot:*", function(err,replies){
		console.log(replies.length + " replies got:");
		replies.forEach(function (reply, i) {
		    	client2.hgetall(reply, function(err,slot_info){
				console.dir(slot_info);
				result.push(['slot: ' + i, Number(slot_info.tweet_count)]);
				
			});	
		});
	});

	//socket.emit('tweet-count', result);
	setTimeout(function () {socket.emit('tweet-count', result)}, 2000);

	socket.on('disconnect', function(){
		console.log('Web client disconnected');
	});
});


/*if(slot_info != null)
					result.push({x:i, y:Number(slot_info.tweet_count)});
				else{
					console.dir(i);
					console.log(slot_info);
				}*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
