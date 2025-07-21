## Tecnologias Utilizadas

### Frontend

- **React**  

- **Vite**  
  Build tool rápida para desenvolvimento frontend.

- **TypeScript**  
  Superset JavaScript com tipagem estática.

- **Tailwind CSS**  
  Framework CSS utilitário para estilização rápida e responsiva.

- **Axios**  
  Cliente HTTP para requisições à API.

---

### Backend

- **Django**  

- **Django REST Framework**  

- **djangorestframework-simplejwt**  
  Utilizado para autenticação baseada em tokens JWT (JSON Web Token), garantindo segurança e praticidade no controle de acesso à API.

- **django-cors-headers**  
  Permite o controle de CORS, facilitando a integração entre frontend e backend.

- **django-filter**  
  Facilita a filtragem de dados nas APIs.

- **psycopg**  
  Driver PostgreSQL para Python/Django, garantindo integração eficiente com o banco de dados.

---

### Banco de Dados

- **PostgreSQL**  
  Banco de dados relacional robusto, seguro. Tive ótimas experiências em processos de ETL usando-o.


## Projeto: Evolução para Kanban

Minha ideia principal é evoluir a aplicação para um modelo **Kanban**, onde as tarefas possam ser organizadas em colunas (ex: "A Fazer", "Em Progresso", "Concluído") e movidas entre elas, possivelmente com drag-and-drop.  
A base do código já está preparada para isso, e a refatoração vai facilitar muito a implementação desse tipo de funcionalidade.

---

### Componentização

- Dividir o código em componentes menores e reutilizáveis, como `TaskItem`, `Message` e outros.
- Tornar o código mais legível e fácil de testar.

---

### Validação e Acessibilidade

- Melhorar a validação dos campos tanto no frontend quanto no backend.
- Aprimorar a acessibilidade com o uso de elementos semânticos e `aria-labels`.

---

### Tratamento de Erros

- Garantir que mensagens de erro vindas do backend sejam exibidas de forma clara e amigável para o usuário.

---

### Organização e Escalabilidade

- Separar as chamadas de API em arquivos próprios.
- Caso o projeto cresça, utilizar contextos ou Redux para gerenciamento de estado global.

---

### Inclusão de Testes

- Acrescentar testes automatizados, tanto para o frontend (componentes React, hooks e integrações) quanto para o backend (views, serializers e models).

---

### Deploy da Aplicação

- Preparar o projeto para deploy em ambientes de produção, garantindo facilidade de publicação e manutenção.

---
