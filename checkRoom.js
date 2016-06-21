var casper = require('casper').create({});
var config = require('./config');
var url = config.url;

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.10 Safari/537.36 OPR/39.0.2256.4 (Edition beta)');

casper.start(url, function() {
  this.evaluate(function(userId, password) {
    document.querySelector('#inputfrm > input:nth-child(7)').value = userId;
    document.querySelector('#inputfrm > input:nth-child(11)').value = password;
    document.querySelector("#inputfrm > input.jlogin-submit").click();
  }, config.userid, config.password);
  this.echo('access ' + url);
});


// URLにcmd=plantweekgrp&log=onをつけるとスケジュール画面
casper.then(function(){
  casper.wait(3000);
  this.capture('capture-desknets1.png');
  casper.thenOpen(url + 'cmd=plantweekgrp&log=on');
});

casper.then(function() {
  casper.wait(3000, function() {
    this.capture('capture-desknets.png');
  });

});

casper.run();
