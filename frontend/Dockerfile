# Etapa de desarrollo
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Vite usa 5173 por defecto
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

# Etapa de produccion
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

FROM nginx:alpine AS production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
