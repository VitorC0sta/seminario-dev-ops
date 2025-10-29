    # 1. Base: Usar a versão 20 do Node (como o Vite precisa)
    FROM node:20-alpine

    # 2. Definir o diretório de trabalho dentro do contentor
    WORKDIR /usr/src/app

    # 3. Copiar o package.json e instalar dependências
    # Isto aproveita o cache do Docker
    COPY package*.json ./
    RUN npm ci --only=production

    # 4. Copiar o resto do código da aplicação
    COPY . .

    # 5. Expor a porta que o server.js usa
    EXPOSE 8080

    # 6. Comando para iniciar o servidor
    CMD [ "node", "server.js" ]
    