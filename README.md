# React + TypeScript + Vite + Ant Designのショップ管理システムサンプル、Node.jsとMySqlとNginxをサポートしている
## ウェブサイトアドレス： https://www.makotodeveloper.website/shop_sample/
<img width="1222" alt="スクリーンショット 0007-05-20 23 55 58" src="https://github.com/user-attachments/assets/69028c70-d900-4229-9697-cd2de3d720f5" />
<img width="751" alt="スクリーンショット 0007-06-15 20 37 54" src="https://github.com/user-attachments/assets/f0856ed5-2ba8-452c-93eb-a1c92746498f" />

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
