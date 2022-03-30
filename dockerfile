FROM nginx:stable

RUN rm -v /etc/nginx/nginx.conf
RUN rm -v /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/
COPY dist /usr/share/nginx/html

EXPOSE  8090    
ENTRYPOINT ["nginx", "-g", "daemon off;"]