# Usa una imagen oficial de Node.js con versión explícita
FROM node:18

# Instala herramientas necesarias para compilar dependencias nativas como bcrypt
RUN apt-get update && apt-get install -y build-essential python3

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero para aprovechar la caché
COPY package*.json ./

# Instala dependencias del proyecto
RUN npm install

# Reconstruye bcrypt con las herramientas ya instaladas
RUN npm rebuild bcrypt --build-from-source

# Copia el resto de la aplicación al contenedor
COPY . .

# Compila el código TypeScript a JavaScript (necesario para start:prod)
RUN npm run build

# Expone el puerto que usará NestJS (Render detecta este automáticamente)
EXPOSE 3000

# Inicia la app en modo producción usando el archivo ya compilado
CMD ["node", "dist/main.js"]
