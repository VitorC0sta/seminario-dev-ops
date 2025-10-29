    # --- Estágio 1: "Buildar" a App React com Vite ---
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    # Este é o comando que o Vite usa para "buildar"
    RUN npm run build

    # --- Estágio 2: Servir os ficheiros estáticos com Nginx ---
    FROM nginx:1.23-alpine
    # Copiar os ficheiros "buildados" (da pasta 'dist') para o Nginx
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Expor a porta 80 (padrão do Nginx)
    EXPOSE 80
    
    # O Nginx inicia automaticamente quando o contentor começa
    
