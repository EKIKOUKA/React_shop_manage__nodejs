# NodejsとMySqlとNginxをサポートしているのReact + Ant Designのテーブルサンプル

## ウェブサイトアドレス： http://133.242.132.37/table_sample/
<img width="1222" alt="スクリーンショット 0007-05-20 23 55 58" src="https://github.com/user-attachments/assets/30720c9a-d86b-413c-b8cd-2fe2bb018119" />

#### memory: free -h
#### top: cpu
#### disk: df -h

## Nodejs
#### pm2 start server.js
#### pm2 restart server

## Nginxのコマンド
#### sudo nginx -t  # 設定の間違いがないようにチェクして
#### sudo systemctl restart nginx
#### sudo systemctl reload nginx // setting changed

## Nginx 配置
### sudo vi /etc/nginx/sites-available/default
```
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        server_name 133.242.132.37 _;

        location /table_sample {
            alias /home/debian/React_table_training_nodejs/build/;
            index index.html;
            try_files $uri $uri/ /index.html;
       }

       location /table_sample/api/ {
          proxy_pass http://localhost:3000/;
          proxy_set_header Host $host;
       }
}
```

## Mysqlのコマンド
```
ssh debian@133.242.132.37
sudo mysql -u root -p

CREATE DATABASE myDatabase;
SELECT user();
SHOW DATABASES;
use myDatabase;
SHOW tables;
SELECT * FROM sp_goods ORDER BY goods_id DESC;
INSERT INTO sp_goods (goods_name, add_time)
    VALUES (?, UNIX_TIMESTAMP(NOW()));
UPDATE sp_goods SET goods_name = ? WHERE goods_id = ?;
DELETE FROM sp_goods WHERE goods_id = ${id};

DROP TABLE IF EXISTS `sp_user`;
CREATE TABLE `sp_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `username` varchar(128) NOT NULL DEFAULT '' COMMENT '',
  `password` char(64) NOT NULL DEFAULT '' COMMENT '',
  `user_email` varchar(64) NOT NULL DEFAULT '' COMMENT '',
  `is_active` enum('YES','NO') DEFAULT 'NO' COMMENT '',
  `user_sex` enum('秘密','女','男') NOT NULL DEFAULT '男' COMMENT '',
  `user_tel` varchar(32) NOT NULL DEFAULT '' COMMENT '',
  `user_educational_background` enum('小学博士','博士','碩士','本科','專科','高中','初中','小学') NOT NULL DEFAULT '本科' COMMENT '学歴',
  `user_hobby` varchar(32) NOT NULL DEFAULT '' COMMENT '',
  `user_introduce` text COMMENT '',
  `create_time` int(11) NOT NULL COMMENT '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='user';

-- ----------------------------
-- Records of sp_user
-- ----------------------------
INSERT INTO `sp_user` VALUES ('1', '習維尼', '$2a$08$lV0Gr4AKx7xH7cCU4KCGCOikNzGPaWIpw9W7A9BONIxoJ2.hGC9qi', 'w@zce.me', '1242d9b5', '', '', '', '小学博士', '', null, '1512033129', '1512033129');
INSERT INTO `sp_user` VALUES ('11', 'ww', '$2a$08$09nUxs.9czzXc4JZJTOdteeXSd/mxZVg96AhqciGbTMB6cfbGUWC2', 'i@zce.me', 'f9a9d0cc', '', '', '12313211', '博士', '123123', '123123123', '1512122098', '1512122098');
```
