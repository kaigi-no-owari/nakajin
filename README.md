# nakajin
+会議室のスケジュールを取得する機能

## Sample
*
Yahoo!Japanを開いてキャプチャを `capture-yahoo.png` に保存

```` bash
$ npm run sample
````


## 会議室のスケジュール取得

ログインして会議室のスケジュール情報を取得する

`config_sample.js` を `config.js` にリネームしてサンプルを参考にして内容を編集する。

```` bash
$ npm run check
````

### リモートデバッガ

PhantomJS Remote Debuggerで実行する

``` bash
$ npm run debug
```

http://localhost:9000 にアクセス

「about:blank」をクリックし、コンソールに `__run();` を入力して実行

