const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);
   return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }

  const existingRepository = repositories[repositoryIndex];

  const repository = {
    id: id,
    title: title ?? existingRepository.title,
    url: url ?? existingRepository.url,
    techs: techs ?? existingRepository.techs,
    likes: existingRepository.likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

  if ( repositoryIndex < 0 ) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories[repositoryIndex].likes++;
  


  return response.json(repositories[repositoryIndex]);


  
});

module.exports = app;
