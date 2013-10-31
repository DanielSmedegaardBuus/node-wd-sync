// Generated by CoffeeScript 1.6.3
(function() {
  var CoffeeScript, Express, testInfo;

  testInfo = {
    name: 'api',
    tags: ['midway']
  };

  require("../common/setup");

  Express = require("../common/express-helper").Express;

  CoffeeScript = require('coffee-script');

  describe("api specs " + env.TEST_ENV_DESC, function() {
    var allPassed, browser, express, sync, wrap, _ref;
    this.timeout(env.TIMEOUT);
    _ref = {}, browser = _ref.browser, sync = _ref.sync;
    wrap = wdSync.wrap({
      "with": (function() {
        return browser;
      })
    });
    allPassed = true;
    express = new Express(__dirname + '/assets');
    before(function() {
      var _ref1;
      express.start();
      _ref1 = wdSync.remote(env.REMOTE_CONFIG), browser = _ref1.browser, sync = _ref1.sync;
      if (env.VERBOSE) {
        browser.on("status", function(info) {
          return console.log("\u001b[36m%s\u001b[0m", info);
        });
        return browser.on("command", function(meth, path) {
          return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
        });
      }
    });
    before(wrap(function() {
      return this.init(desiredWithTestInfo(testInfo));
    }));
    beforeEach(function(done) {
      var cleanTitle;
      cleanTitle = this.currentTest.title.replace(/@[-\w]+/g, '').trim();
      return sync(function() {
        this.get(env.MIDWAY_ROOT_URL + '/test-page?partial=' + encodeURIComponent(cleanTitle));
        return done();
      });
    });
    afterEach(function() {
      return allPassed = allPassed && (this.currentTest.state === 'passed');
    });
    after(wrap(function() {
      express.stop();
      this.quit();
      if (env.SAUCE) {
        return this.sauceJobStatus(allPassed);
      }
    }));
    express.partials['browser.eval'] = '<div id="theDiv"><ul><li>line 1</li><li>line 2</li></ul></div>';
    it("browser.eval", wrap(function() {
      (this["eval"]("1+2")).should.equal(3);
      (this["eval"]("document.title")).should.equal("WD Sync Tests");
      (this["eval"]("$('#theDiv').length")).should.equal(1);
      return (this["eval"]("$('#theDiv li').length")).should.equal(2);
    }));
    it("browser.execute (with args)", wrap(function() {
      var script;
      script = "window.wd_sync_execute_test = 'It worked! ' + (arguments[0] + arguments[1])";
      this.execute(script, [10, 5]);
      return (this["eval"]("window.wd_sync_execute_test")).should.equal('It worked! 15');
    }));
    it("browser.executeAsync (async mode, no args)", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      return browser.executeAsync(scriptAsJs, function(err, res) {
        res.should.equal("OK");
        return done();
      });
    });
    it("browser.executeAsync (sync mode, no args)", wrap(function() {
      var res, scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.executeAsync(scriptAsJs);
      return res.should.equal("OK");
    }));
    it("browser.executeAsync (sync mode, with args)", wrap(function() {
      var res, scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0] + args[1]))";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.executeAsync(scriptAsJs, [10, 2]);
      return res.should.equal("OK 12");
    }));
    it("browser.safeExecuteAsync (sync mode, with args)", wrap(function() {
      var res, scriptAsCoffee, scriptAsJs,
        _this = this;
      scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0] + args[1]))";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.safeExecuteAsync(scriptAsJs, [10, 2]);
      res.should.equal("OK 12");
      return (function() {
        return _this.safeExecuteAsync("!!!a wrong expr", [10, 2]);
      }).should["throw"](/Error response status/);
    }));
    express.partials['browser.click'] = '<div id="theDiv">\n  <div class="numOfClicks">not clicked</div>\n  <div class="buttonNumber">not clicked</div>\n</div>';
    it("browser.click", wrap(function() {
      var buttonNumberDiv, numOfClicksDiv, scriptAsCoffee, scriptAsJs;
      numOfClicksDiv = this.elementByCss("#theDiv .numOfClicks");
      buttonNumberDiv = this.elementByCss("#theDiv .buttonNumber");
      scriptAsCoffee = 'jQuery ->\n  window.numOfClick = 0\n  numOfClicksDiv = $(\'#theDiv .numOfClicks\')\n  buttonNumberDiv = $(\'#theDiv .buttonNumber\')\n  numOfClicksDiv.mousedown (eventObj) ->\n    button = eventObj.button\n    button = \'default\' unless button?\n    window.numOfClick = window.numOfClick + 1\n    numOfClicksDiv.html "clicked #{window.numOfClick}"\n    buttonNumberDiv.html "#{button}"\n    false';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      (this.text(numOfClicksDiv)).should.equal("not clicked");
      this.moveTo(numOfClicksDiv);
      this.click(0);
      (this.text(numOfClicksDiv)).should.equal("clicked 1");
      (this.text(buttonNumberDiv)).should.equal("0");
      this.moveTo(numOfClicksDiv);
      if (!env.SAUCE) {
        this.click();
        (this.text(numOfClicksDiv)).should.equal("clicked 2");
        return (this.text(buttonNumberDiv)).should.equal("0");
      }
    }));
    express.partials['browser.type'] = '<div id="theDiv"><input class="input-text" type="text"></div>';
    it("browser.type", wrap(function() {
      var altKey, inputField, nullKey;
      altKey = wdSync.SPECIAL_KEYS['Alt'];
      nullKey = wdSync.SPECIAL_KEYS['NULL'];
      inputField = this.elementByCss("#theDiv input");
      should.exist(inputField);
      this.type(inputField, "Hello");
      (this.getValue(inputField)).should.equal("Hello");
      this.type(inputField, [altKey, nullKey, " World"]);
      (this.getValue(inputField)).should.equal("Hello World");
      this.type(inputField, [wdSync.SPECIAL_KEYS.Return]);
      return (this.getValue(inputField)).should.equal("Hello World");
    }));
    express.partials['browser.keys'] = '<div id="theDiv"><input class="input-text" type="text"></div>';
    it("browser.keys", wrap(function() {
      var altKey, inputField, nullKey;
      altKey = wdSync.SPECIAL_KEYS['Alt'];
      nullKey = wdSync.SPECIAL_KEYS['NULL'];
      inputField = this.elementByCss("#theDiv input");
      should.exist(inputField);
      this.clickElement(inputField);
      this.keys("Hello");
      (this.getValue(inputField)).should.equal("Hello");
      this.keys([altKey, nullKey, " World"]);
      (this.getValue(inputField)).should.equal("Hello World");
      this.type(inputField, [wdSync.SPECIAL_KEYS.Return]);
      return (this.getValue(inputField)).should.equal("Hello World");
    }));
    express.partials['browser.text'] = '<div id="theDiv"><div>text content</div></div>';
    it("browser.text", wrap(function() {
      var textDiv;
      textDiv = this.elementByCss("#theDiv");
      should.exist(textDiv);
      this.text(textDiv).should.include("text content");
      this.text(textDiv).should.not.include("div");
      textDiv.text().should.include("text content");
      return this.text('body').should.include("text content");
    }));
    express.partials['browser.acceptAlert'] = '<div id="theDiv"><a>click me</a></div>';
    it("browser.acceptAlert", wrap(function() {
      var a, res, scriptAsCoffee, scriptAsJs;
      a = this.elementByCss("#theDiv a");
      should.exist(a);
      scriptAsCoffee = "a = $('#theDiv a')\na.click ->\n  alert \"coffee is running out\"\n  false";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.execute(scriptAsJs);
      this.clickElement(a);
      return this.acceptAlert();
    }));
    express.partials['browser.active'] = '<div id="theDiv">\n  <input class="i1" type="text" value="input 1">\n  <input class="i2" type="text" value="input 2">\n</div>';
    it("browser.active", wrap(function() {
      var i1, i2;
      i1 = this.elementByCss("#theDiv .i1");
      i2 = this.elementByCss("#theDiv .i2");
      i1.click();
      this.active().getValue().should.equal("input 1");
      this.clickElement(i2);
      return this.active().getValue().should.equal("input 2");
    }));
    it("browser.url", wrap(function() {
      var url;
      url = this.url();
      url.should.include("test-page");
      return url.should.include("http://");
    }));
    it("browser.<cookie methods>", wrap(function() {
      var cookies;
      this.deleteAllCookies();
      this.allCookies().should.eql([]);
      this.setCookie({
        name: 'fruit1',
        value: 'apple'
      });
      cookies = this.allCookies();
      (cookies.filter(function(c) {
        return c.name === 'fruit1' && c.value === 'apple';
      })).should.have.length(1);
      this.setCookie({
        name: 'fruit2',
        value: 'pear'
      });
      cookies = this.allCookies();
      cookies.should.have.length(2);
      (cookies.filter(function(c) {
        return c.name === 'fruit2' && c.value === 'pear';
      })).should.have.length(1);
      this.setCookie({
        name: 'fruit3',
        value: 'orange'
      });
      this.allCookies().should.have.length(3);
      this.deleteCookie('fruit2');
      cookies = this.allCookies();
      cookies.should.have.length(2);
      (cookies.filter(function(c) {
        return c.name === 'fruit2' && c.value === 'pear';
      })).should.have.length(0);
      this.deleteAllCookies();
      this.allCookies().should.eql([]);
      this.setCookie({
        name: 'fruit3',
        value: 'orange',
        secure: true
      });
      return this.deleteAllCookies();
    }));
    it("browser.uploadFile", wrap(function() {
      var filepath;
      filepath = this.uploadFile("test/mocha.opts");
      should.exist(filepath);
      return filepath.should.include('mocha.opts');
    }));
    express.partials['browser.waitForCondition'] = '<div id="theDiv"></div>';
    it("browser.waitForCondition", wrap(function() {
      var exprCond, scriptAsCoffee, scriptAsJs,
        _this = this;
      scriptAsCoffee = 'setTimeout ->\n  $(\'#theDiv\').html \'<div class="child">a waitForCondition child</div>\'\n, 1500';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      should.not.exist(this.elementByCssIfExists("#theDiv .child"));
      exprCond = "$('#theDiv .child').length > 0";
      (this.waitForCondition(exprCond, 2000, 200)).should.be["true"];
      (this.waitForCondition(exprCond, 2000)).should.be["true"];
      (this.waitForCondition(exprCond)).should.be["true"];
      return (function() {
        return _this.waitForCondition("sdsds ;;sdsd {}");
      }).should["throw"](/Error response status/);
    }));
    return it("err.inspect", wrap(function() {
      var err, _err;
      err = null;
      try {
        browser.safeExecute("invalid-code> here");
      } catch (_error) {
        _err = _error;
        err = _err;
      }
      should.exist(err);
      (err instanceof Error).should.be["true"];
      return (err.inspect().length <= 510).should.be["true"];
    }));
  });

}).call(this);
