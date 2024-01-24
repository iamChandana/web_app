FROM nginx:1.15.8
LABEL maintainer="nithin@bambu.co"
RUN apt update && \
  apt install openssl && \
  apt install wget -y && \
  apt install make && \
  apt install libnss3-tools -y
COPY default.conf /etc/nginx/conf.d/default.conf