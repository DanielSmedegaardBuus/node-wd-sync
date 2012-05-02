// Generated by CoffeeScript 1.3.1
(function() {
  var Wd, should, testWithBrowser, wd, _ref;

  _ref = require('../../index'), wd = _ref.wd, Wd = _ref.Wd;

  should = require('should');

  testWithBrowser = function(browserName) {
    return it("using " + browserName, function(done) {
      var browser;
      browser = wd.remote({
        mode: 'async'
      });
      return browser.init({
        browserName: "" + browserName
      }, function(err) {
        return browser.get("http://google.com", function(err) {
          return browser.title(function(err, title) {
            title.toLowerCase().should.include('google');
            return browser.elementByName('q', function(err, queryField) {
              return browser.type(queryField, "Hello World", function(err) {
                return browser.type(queryField, "\n", function(err) {
                  return browser.setWaitTimeout(3000, function(err) {
                    return browser.elementByCss('#ires', function(err, resDiv) {
                      return browser.title(function(err, title) {
                        title.toLowerCase().should.include('hello world');
                        return browser.quit(function() {
                          return done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  describe("wd-async", function() {
    var browserName, _i, _len, _ref1, _results;
    _ref1 = ['firefox', 'chrome'];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      browserName = _ref1[_i];
      _results.push(testWithBrowser(browserName));
    }
    return _results;
  });

}).call(this);
