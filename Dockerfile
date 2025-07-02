# Usar uma imagem base oficial do Python
FROM python:3.12-slim

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instalar dependências de sistema, se necessário
# RUN apt-get update && apt-get install -y ...

# Copiar o ficheiro de dependências
COPY requirements.txt .

# Instalar as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o resto do código do projeto para o contêiner
COPY . .
