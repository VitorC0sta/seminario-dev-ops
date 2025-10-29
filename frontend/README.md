# 🖥️ Frontend do Projeto (Seminário DevOps)

Esta pasta contém todo o **código-fonte do frontend** da aplicação, construído com **React** e **Vite**.

---

## 🚀 Sobre o Frontend

Este é um **aplicativo de página única (SPA)** em React que serve como a **interface de usuário** para o seminário.  
Ele foi projetado para:

- Consumir a **API do backend**.  
- Mostrar o **status da conectividade** com o banco de dados **RDS**.  
- Ser **containerizado com Docker** para o deploy na **AWS**.

---

## 🛠️ Tecnologias Utilizadas

- **React** → Biblioteca para construção da interface.  
- **Vite** → Ferramenta de build e servidor de desenvolvimento local.  
- **Docker** → Para empacotar e rodar a aplicação em containers.  
- **Nginx** → Servidor utilizado na imagem de produção.  
- **AWS ECS / ECR** → Para o deploy automatizado em ambiente de nuvem.

---

## 🏃 Como Rodar Localmente

Para testar o frontend em modo de desenvolvimento na sua máquina:

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

O servidor do Vite iniciará (geralmente em [http://localhost:5173](http://localhost:5173)).

> 💡 **Importante:** Para que os testes de API funcionem, o **backend deve estar rodando localmente** na porta **8080**.

---

## 📦 Deploy (Produção)

Este projeto **não é feito para ser “subido” manualmente**.  
O processo de DevOps do seminário utiliza o **Dockerfile** presente nesta pasta para:

1. **Buildar** a aplicação (`npm run build`) e gerar os arquivos estáticos.  
2. Criar uma **imagem Docker otimizada** usando **Nginx** para servir os arquivos.  
3. **Enviar a imagem** para o **Amazon ECR**.  
4. **Fazer o deploy automático** no **Amazon ECS**, garantindo zero downtime.

---
