#!/usr/bin/env node

var http = require('http')
  , director = require('director')
  , kt = require('kyoto-client')
  , router, server, db
  , options = {
    'name': 'default.kct'
  };

// Opne database
db = new kt.Db(options.name).open();

/** Define controllers **/

var mainController, feedsController, feedController;

mainController = function () {
  var res = this.res;

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write('hello world');
  res.end();
}

feedsController = function () {
  this.res.write('hello feeds');
  this.res.end();
}

feedController = {
  /**
   * GET method
   *
   * @param id
   */
  'get': function(id) {
    var res = this.res;

    // Get the record
    db.get('test:'+id, function (error, data, expires) {
      if (data) {
        res.write('hello feed #' + id + '\n');
        res.write('data: \n' + data);
        res.write('\nexpires: ' + expires);
        res.end();
      } else {
        res.writeHead(404);
        res.write('Not found');
        res.end();
      }

    });
  }
  /**
   * POST method
   *
   * @param id
   */
  , 'post': function(id) {
    var res = this.res
      , body = '';

    // Set the record
    db.set('test:'+id, 'Str #1', {expiry: new Date("1 Jan 2020")}, function (error) {
      res.write('hello feed #' + id + '\n');
      res.end();
    });
  }
  /**
   * DELETE method
   *
   * @param id
   */
  , 'delete': function (id) {
    var res = this.res;

    db.remove('test:'+id, function(error) {
      res.write('bye feed #' + id + '\n');
      res.end();
    });
  }
}

/** Define a routing table **/

router = new director.http.Router({
  '/': {
    get: mainController
  },
  '/feeds': {
    get: feedsController
  }
});

router.get(/\/feed\/(\w+)/, feedController.get);
router.post(/\/feed\/(\w+)/, feedController.post);
router.delete(/\/feed\/(\w+)/, feedController.delete);

/** Setup a server **/
server = http.createServer(function (req, res) {
  router.dispatch(req, res, function (err) {
    if (err) {
      res.writeHead(404);
      res.write('Not found');
      res.end();
    }
  });
}).listen(3000);