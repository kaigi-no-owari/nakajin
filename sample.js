var casper = require('casper').create({});
var url = "http://www.yahoo.co.jp/";

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.10 Safari/537.36 OPR/39.0.2256.4 (Edition beta)');

casper.start(url, function() {
  this.echo('access ' + url);
});

casper.wait(3000);

casper.then(function() {
  this.capture('capture-yahoo.png');
});

casper.run();
