# Sobre  
API desenvolvida utilizando:  
- NodeJs >= v18
- Typescript  
- Express.js  
- TypeORM com banco de dados SQLite3.  
- Jest  

Para maiores informações sobre requisitos e suas especificações, consulte o arquivo: `/docs/Especificação Backend.pdf`.

# Pré Requisitos  
É necessário ter previamente instalado no local de execução o NodeJS(>=v18) e npm.  

Ref: https://nodejs.org/en/download  

# Instalação  

1. Clone o repositório:  
   git clone https://github.com/aneto88/movies-node-api.git  

2. Navegue até o diretório do projeto:  
   cd movies-node-api  

3. Instale as dependências:  
   npm install  

4. Para rodar o projeto localmente, utilize o comando:  
   npm start  

5. Para rodar os testes automatizados, utilize o comando:  
   npm test  

# Estrutura do Projeto  

- **src**: Contém o código fonte da aplicação.  
- **src/tests**: Contém os testes da aplicação.  
- **docs**: Documentação do projeto.  

# Endpoints  

Swagger com as apis disponiveis em:
   http://localhost:3000/api-docs

# Observações
 O arquivo a ser importado na rota POST '/api/movies/import' deve ser no formato CSV, separando os campos por ";" e as linhas por quebra de linhas.

 Na primeira linha deve conter os títulos das colunas, sendo: "year;title;studios;producers;winner", conforme exemplo presente no diretório /docs/movies.csv

 
