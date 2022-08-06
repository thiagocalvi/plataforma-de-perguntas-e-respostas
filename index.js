const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;

//MODELS
const connection = require('./database/database')
const pergunta = require('./database/Pergunta')
const resposta = require('./database/Resposta')

//DATABASE CONNECTION
connection.authenticate()
    .then(()=>{
        console.log("Conexão feita com o database")
    })
    .catch((err)=>{
        console.log(err)
    })


// DEFININDO O REDERIZADOR DE HTML
app.set('view engine', 'ejs');
//USANDO ARQUIVOS STATICOS
app.use(express.static('public'))

//USANDO BODY-PARSER PARA OBTER OS DADOS DA REQUIZIÇÃO DO BODY PARA JSON
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//>>>>ROTAS<<<<

//HOME
app.get('/', (req, res)=>{
    //query no banco de dados
    pergunta.findAll( /*traz somente as informações importantes*/{raw:true, order:[
        ['id','DESC'] // ordenado os resultados pelo id de forma decresente
    ]}).then(perguntas => {
        console.log(perguntas)
        res.render("index", {
            perguntas: perguntas
        });
    })
    
})


//FAZER UMA PERGUNTA
app.get('/perguntar', (req, res)=>{
    res.render('perguntar')
})

// INSERIR UMA PERGUNDA NO BANCO DE DADOS
app.post('/salvarpergunta', (req, res)=>{
    //obtendo os dados do body
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    //inserindo os dados na tabela 
    pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
})

//VISUALIZAR A PERGUNTA E SUAS RESPOSTAS
app.get('/pergunta/:id', (req, res)=>{
    let id = req.params.id;
    pergunta.findOne({
        where: {id:id}
    }).then((pergunta)=>{
        if(pergunta != undefined){
            resposta.findAll({
                raw:true,
                where: {perguntaId:pergunta.id},
                order: [['id', 'DESC']]
            }).then((respostas)=>{
                res.render('pergunta', {
                    pergunta:pergunta,
                    respostas:respostas 
                })
            })
        }else{
            res.redirect('/')
        }
    })
})


app.post("/responder", (req, res)=>{
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;
    resposta.create({
        corpo: corpo,   
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/" + perguntaId)
    })
})













app.listen(port,(erro)=>{
    erro? console.log("Servido: erro inesperado") : console.log("Servido: funcionando normalmente") 
})


