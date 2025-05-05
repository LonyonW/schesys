# Utiliza la imagen oficial de Node.js como base
FROM node

# Instala las herramientas necesarias para compilar bcrypt
RUN apt-get update && apt-get install -y build-essential python3


# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json (o yarn.lock si usas Yarn) al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Compila bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copia el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto en el que la aplicación NestJS se ejecuta
EXPOSE 3000

# Compila la aplicación NestJS
RUN npm run build

# Comando para ejecutar la aplicación cuando se inicia el contenedor
CMD ["npm", "run", "start:prod"] 
# CMD ["npm", "run", "start:dev"]

