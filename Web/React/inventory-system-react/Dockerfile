FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . /app/

# Exponer el puerto 5173 (puerto por defecto de Vite)
EXPOSE 3000

# Comando para iniciar el servidor de desarrollo
CMD ["npm", "start"]