import mysql, { Connection, ConnectionOptions , QueryError } from 'mysql2/promise';
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'

const app = fastify()
app.register(cors,{
    origin:"*",
    methods:["GET", "POST", "PUT", "DELETE"],
})

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Fastify Funcionando!")
})
app.get("/atletas", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'peneiras',
            port: 3306
        });
        const resultado = await conn.query("SELECT * FROM atletas")
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(dados)
        
    } catch (erro:any) {
        if (erro.code === "ECONNREFUSED") {
            console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGÃO!!! CABEÇA!"})
        } else if (erro.code === "ER_BAD_DB_ERROR") {
            console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO"})
        } else if (erro.code === "ER_ACCESS_DENIED_ERROR") {
            console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO DESCONHECIDO OLHE O TERMINAL"})
        }
    }
})

app.delete("/atletas/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as any;  // Usando request.params para pegar o id
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'peneiras',
            port: 3306
        });
        const [resultado] = await conn.query("DELETE FROM atletas WHERE id = ?", [id]);
    } catch (erro) {
        console.error(erro);
        reply.status(500).send({ mensagem: "Erro ao deletar atleta" });
    }
});
  

app.post("/atletas", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, nome, idade, posicao, altura, forca, impulsao, velocidade, resistencia, arremesso } = request.body as any
    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'peneiras',
            port: 3306
        });
        const resultado = await conn.query(
            "INSERT INTO atletas (id, nome, idade, posicao, altura, forca, impulsao, velocidade, resistencia, arremesso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id, nome, idade, posicao, altura, forca, impulsao, velocidade, resistencia, arremesso]
          )
        const [dados,estruturaTabela] = resultado
        reply.status(200).send(dados)
        
    } catch (erro:any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            case "ER_DUP_ENTRY":
                console.log("ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA");
                reply.status(400).send({ mensagem: "ERRO: VOCÊ DUPLICOU A CHAVE PRIMÁRIA" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "ERRO DESCONHECIDO OLHE O TERMINAL DO BACKEND" });
                break;
          } 
         }

})

app.listen({ port: 8001 }, (erro, endereco) => {
    if (erro) {
        console.log("ERRO: Fastify não iniciou")
    }
    console.log(`Fastify iniciado na porta: ${endereco}`)
})