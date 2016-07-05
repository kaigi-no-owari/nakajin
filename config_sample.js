// config.jsにリネームして利用する
var config = {
  "userid": "your id",
  "password": "your password",
  "url":  "your url (https://example.co.jp/hoge/dneo.exe) ",
  "post_url": "http://your_server/api/meetings"
    // 設定したroom_idだけを処理したい場合に設定する
    // "room_ids": [16,29] 
    // titleとdescriptionは取得する場合はtrueを設定する
    // "check_title": true,
    // "check_description": true
};

module.exports = config;

