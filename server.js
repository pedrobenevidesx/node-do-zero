//import { createServer } from 'node:http'

//const server = createServer((request, response) => {
 //   response.write("OI")

  //  return response.end()
//})

//server.listen(3333) 

import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./databse-postgress.js";

const server = fastify()

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

// nessa rota vou estar criando um novo video
server.post('/videos', async (request, reply) => {
    const { title, description, duration } = request.body

    await database.create({
        title: title,
        description: description,
        duration: duration,    
    })

    return reply.status(201).send()
})

server.get('/videos', async (request) => {
    const search = request.query.search

    console.log(search)

    const videos = await database.list(search)

    return videos

})

// Envia o id do video especifico por parametro
server.put('/videos/:id', async (request, reply) => {
    const videoId = request.params.id 
    const { title, description, duration } = request.body

    await database.update(videoId, {
        title,
        description,
        duration
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
    const videosId = request.params.id

    await database.delete(videosId)

    return reply.status(204).send()
})


server.listen({
    host: "0.0.0.0",
    port: process.env.PORT ?? 3333,
})