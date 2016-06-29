debugger;

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
  // this.capture('capture-desknets1.png');
  casper.thenOpen(url + 'cmd=plantweekgrp&log=on');
});

casper.then(function() {
  // ここは少し時間がかかりそう
  casper.wait(5000, function() {
    var schedules = [];
    var schedule = {};
    //{
    //    "room_id": "A",
    //    "title": "MTGタイトル",
    //    "description": "MTG詳細情報",
    //    "start_at": "2016-06-21T01:00:00.000Z",
    //    "end_at": "2016-06-21T02:00:00.000Z"
    //}

    // 当日の会議情報だけ取得するため今日の日付を固定で設定する
    var now = new Date();
    var meeting_date = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();

    // 会議室名の列からroom_idを取得
    var ids = this.evaluate(function(){
      var rooms = document.querySelectorAll('#jsch-plantweekgrp > form > div.sch-gweek.sch-cal-group-week.jsch-cal-list.jco-print-template > div');
      return Array.prototype.map.call(rooms, function (e) {
        return e.getAttribute('data-target');
      });
    });
    this.echo('ROOM IDs: ' + ids);

    // 会議室ごとにスケジュールを取得
    // 会議室ごとにdivの子要素をnth-child(i)で取得したいので1からカウントアップしてループで取得する
    for(var i=1; i<=ids.length; i++) {
      schedule.room_id = ids[i - 1];
      schedule.description = this.evaluate(function(room_num) {
        return document.querySelector('#jsch-plantweekgrp > form > div.sch-gweek.sch-cal-group-week.jsch-cal-list.jco-print-template > div:nth-child(' + room_num + ') > div.sch-gcal-target-header.other > div > div > div > a').textContent;
      }, i);

      // その部屋の今日の全会議スケジュールを取得
      var meetings = this.evaluate(function(room_num) {
        return document.querySelectorAll('#jsch-plantweekgrp > form > div.sch-gweek.sch-cal-group-week.jsch-cal-list.jco-print-template > div:nth-child(' + room_num + ') > div.cal-h-week > table > tbody > tr > td.cal-day.co-today > div > div');
      }, i);
      // スケジュールを順番に取得する
      // 会議室と同じでdivの子要素をnth-child(j)で取得したいので1からカウントアップ
      for(var j=1; j<=meetings.length; j++){
        schedule.title = this.evaluate(function(room_num, meeting_num) {
          return document.querySelector('#jsch-plantweekgrp > form > div.sch-gweek.sch-cal-group-week.jsch-cal-list.jco-print-template > div:nth-child(' + room_num + ') > div.cal-h-week > table > tbody > tr > td.cal-day.co-today > div > div:nth-child(' + meeting_num +') > a').textContent;
        }, i, j);

        // 時間は「11:00 - 12:00」の形式なので "-" でsplit
        var start_end = this.evaluate(function(room_num, meeting_num) {
          return document.querySelector('#jsch-plantweekgrp > form > div.sch-gweek.sch-cal-group-week.jsch-cal-list.jco-print-template > div:nth-child(' + room_num + ') > div.cal-h-week > table > tbody > tr > td.cal-day.co-today > div > div:nth-child(' + meeting_num +') > a > span').textContent.split('-');
        }, i, j);

        schedule.start_at = new Date(meeting_date + ' ' + start_end[0].trim());
        schedule.end_at = new Date(meeting_date + ' ' + start_end[1].trim());

        // 取得した会議情報などは次に使いまわしたいのでディープコピーして配列にセット
        schedules.push(JSON.parse(JSON.stringify(schedule)));
      }
      // for debug 時間がかかるので1回でループを抜ける
      // break;
    }
    this.echo('ALL SCHEDULE: ' + JSON.stringify(schedules));

    // サーバにPOSTする

  });

});

// 画面のキャプチャを取る
//casper.then(function() {
//  casper.wait(3000, function() {
//    this.capture('capture-desknets.png');
//  });
//});

casper.run();
