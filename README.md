# React + TypeScript + Vite + Ant Designのショップサンプル、Node.jsとMySqlとNginxをサポートしている
## ウェブサイトアドレス： http://133.242.132.37/shop_sample/#/goods
<img width="1222" alt="スクリーンショット 0007-05-20 23 55 58" src="https://github.com/user-attachments/assets/69028c70-d900-4229-9697-cd2de3d720f5" />


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
