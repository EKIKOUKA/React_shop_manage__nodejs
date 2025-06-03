# React + Vite + Ant Designのショップサンプル、Node.jsとMySqlとNginxをサポートしている
## ウェブサイトアドレス： http://133.242.132.37/shop_sample/#/goods
<img width="1222" alt="スクリーンショット 0007-05-20 23 55 58" src="https://github.com/user-attachments/assets/69028c70-d900-4229-9697-cd2de3d720f5" />


## Nodejs
#### pm2 start server.js --name shop_sample
#### pm2 restart shop_sample
#### pm2 delete *

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

        location /shop_sample {
            alias /home/debian/React_shop_manage__nodejs/dist/;
            index index.html;
            try_files $uri $uri/ /index.html;
       }

       location /shop_sample/api/ {
          proxy_pass http://localhost:3000/;
          proxy_set_header Host $host;
       }
}
```

#### memory: free -h
#### top: cpu
#### disk: df -h

## Mysqlのコマンド
```
ssh user@133.242.132.37
sudo mysql -u root -p

CREATE DATABASE myDatabase;
SELECT user();
SHOW DATABASES;
use myDatabase;
SHOW tables;
mysql -u user -p < /home/db.sql

SELECT * FROM sp_goods ORDER BY goods_id DESC;
INSERT INTO sp_goods (goods_name, add_time)
    VALUES (?, UNIX_TIMESTAMP(NOW()));
UPDATE sp_goods SET goods_name = ? WHERE goods_id = ?;
DELETE FROM sp_goods WHERE goods_id = ${id};

DROP TABLE IF EXISTS `sp_user`;
CREATE TABLE `sp_user` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar NOT NULL DEFAULT '' COMMENT '',
  `password` char NOT NULL DEFAULT '' COMMENT '',
  `user_sex` enum('秘密','女','男') NOT NULL DEFAULT '男' COMMENT '',
  `user_educational_background` enum('小学博士','博士','碩士','本科','專科','高中','初中','小学') NOT NULL DEFAULT '本科' COMMENT '学歴',
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成時間',
  `update_time` TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '変更時間'
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8 COMMENT='user';

CREATE TABLE meal_records (
  id INT PRIMARY KEY AUTOINCREMENT,
  ingredient_id INT NOT NULL,
  event_day DATE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

-- ----------------------------
-- Records of sp_user
-- ----------------------------
INSERT INTO `sp_user` VALUES ('1', '習維尼', '$2a$08$lV0Gr4AKx7xH7cCU4KCGCOikNzGPaWIpw9W7A9BONIxoJ2.hGC9qi', 'w@zce.me', '1242d9b5', '', '小学博士', '1512033129', '1512033129');
INSERT INTO `sp_user` VALUES ('11', 'ww', '$2a$08$09nUxs.9czzXc4JZJTOdteeXSd/mxZVg96AhqciGbTMB6cfbGUWC2', 'i@zce.me', 'f9a9d0cc', '12313211', '博士', '1512122098', '1512122098');
```
