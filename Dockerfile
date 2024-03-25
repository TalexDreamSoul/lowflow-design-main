FROM nginx:1.24.0

# 将本地的nginx.conf文件复制到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将前端项目的全部源代码复制到容器中的默认目录
COPY ./dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]