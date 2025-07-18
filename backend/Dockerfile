FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
# Gerekli ağ araçlarını yükle: netcat-traditional (nc için) ve iputils-ping (ping için)
RUN apt-get update && apt-get install -y netcat-traditional iputils-ping
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
