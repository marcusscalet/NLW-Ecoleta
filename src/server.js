const express = require("express")
const server = express()

//pegando a conexao do db
const db = require("./database/db.js")

//config pasta publica
server.use(express.static("public"))

// habilita o uso do reqbody
server.use(express.urlencoded({ extended: true }))

//template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})




//configurar caminhos da aplicação
server.get("/", (req, res) =>{
    return res.render("index.html")
}) 


server.get("/create-point", (req, res) => {

    // console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    // console.log(req.body)

    const query = `
       INSERT INTO places (
           image,
           name,
           address,
           address2,
           state,
           city,
           items
       ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterInsertData(err){
        if (err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        
       console.log("Cadastrado com sucesso")
       console.log(this)

       return res.render("create-point.html", {saved:true})
    }

    //função será executda quando chegar a resposta do callback
    db.run(query, values, afterInsertData) 

})



server.get("/search", (req, res) =>{

    const search = req.query.search

    if (search =="")
       return res.render("search-results.html", {total:0})

    //pegar dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if (err){
            return console.log(err)
        }

        // para mostrar quantidade de dados encontrados
        const total = rows.length

        //mostra a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total})
    })

}) 


//ligar servidor (ouvindo a porta 3000)
server.listen(3000)