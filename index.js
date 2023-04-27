const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session')
const hbs = require('express-handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: 'CriarUmaChaveQualquer1234!semNexo',
    resave: false,
    saveUninitialized: true

}));

const Usuario = require('./models/Usuario');

app.get('/', (req,res)=>{
    if(req.session.errors){
        var arrayErros = req.session.errors;
        req.session.errors = "";
        return res.render('index',{NavActiveCad:true, error:arrayErros});
    }

    if(req.session.sucess){
        req.session.sucess = false;
        return res.render('index',{NavActiveCad:true, msgSuccess:true});
    }
    res.render('index',{NavActiveCad:true});
});



app.get('/users',(req,res)=>{
    Usuario.findAll().then((valores)=>{
       // console.log(valores.map(valores => valores.toJSON()));
       if(valores.length>0){
        return res.render('users',{NavActiveUsers:true, table:true, usuarios: valores.map(valores => valores.toJSON())});

       }else{
        res.render('users',{NavActiveUsers:true, table:false});
       }

    }).catch((err)=>{
        console.log(`Houve um erro: ${err}`)
    })

    //
});

app.post('/editar',(req,res)=>{
    var id = req.body.id;

    Usuario.findByPk(id).then((dados)=>{
        return res.render('editar',{error:false, id: dados.id, nome: dados.nome, email: dados.email})
    }).catch((err)=>{
        console.log(err);
        return res.render('editar', {error:true, problema: 'Não é possivel Registrar esse registro'})
    })
    //res.render('editar');
});

app.post('/cad',(req,res)=>{
   //VALORES QUE VEM DO FORMULÁRIO 
   var nome = req.body.nome;
   var email = req.body.email;

   //ARRAY COM OS ERROS
   const erros = [];

   //REMOVER ESPAÇOS EM BRANCO 
   nome = nome.trim();
   email = email.trim();

   //LIMPAR O NOME DE CARACTERES ESPECIAIS, SÓ PODE LETRAS
   nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');
   nome = nome.trim();
   console.log(nome)

   //VERIFICAR SE ESTÁ VAZIO OU NÃO CAMPO

   if(nome==''||typeof nome ==undefined|| nome == null){
    erros.push({mensagem: "Campo não pode ser Vazio!"});
   }

   //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
   if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
        erros.push({mensagem: "Nome Inválido"});
   }

   //VALIDAÇÃO EMAIL

   if(email==''||typeof email ==undefined|| email == null){
    erros.push({mensagem: "Campo Email não pode ser Vazio!"});
   };

   //VERIFICAR SE O EMAIL É VALIDO COM REGEX

   if(!/^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/.test(email)){
    erros.push({mensagem: "Email Inválido"});
   };

   if(erros.length > 0) {
        console.log(erros);
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect('/');
   };

   //SUCESSO NENHUM ERRO 
   //SALVAR NO BANCO DE DADOS

   Usuario.create({
    nome: nome,
    email: email.toLowerCase()
   }).then(function(){
        console.log('Cadastrado com Sucesso');
        req.session.sucess = true;
        return res.redirect('/');

   }).catch(function(erro){
        console.log(`Aconteceu um erro: ${erro}`);
   })

   



});



app.engine('hbs', hbs.engine({
    extname : 'hbs',
    defaultLayout : 'main'
}));app.set('view engine', 'hbs');


app.post('/update',(req,res)=>{

    //VALORES QUE VEM DO FORMULÁRIO 
   var nome = req.body.nome;
   var email = req.body.email;

   //ARRAY COM OS ERROS
   const erros = [];

   //REMOVER ESPAÇOS EM BRANCO 
   nome = nome.trim();
   email = email.trim();

   //LIMPAR O NOME DE CARACTERES ESPECIAIS, SÓ PODE LETRAS
   nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');
   nome = nome.trim();
   console.log(nome)

   //VERIFICAR SE ESTÁ VAZIO OU NÃO CAMPO

   if(nome==''||typeof nome ==undefined|| nome == null){
    erros.push({mensagem: "Campo não pode ser Vazio!"});
   }

   //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
   if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
        erros.push({mensagem: "Nome Inválido"});
   }

   //VALIDAÇÃO EMAIL

   if(email==''||typeof email ==undefined|| email == null){
    erros.push({mensagem: "Campo Email não pode ser Vazio!"});
   };

   //VERIFICAR SE O EMAIL É VALIDO COM REGEX

   if(!/^[a-zA-Z0-9][a-zA-Z0-9\._-]+@([a-zA-Z0-9\._-]+\.)[a-zA-Z-0-9]{2,3}/.test(email)){
    erros.push({mensagem: "Email Inválido"});
   };

   if(erros.length > 0) {
        console.log(erros);
        return res.status(400).send({status:400, erro: erros});
   };

   //SUCESSO E ATUALIZAÇÃO DO BANCO DE DADOS

   Usuario.update(
    {
    nome: nome,
    email: email.toLowerCase()
    }, {
        where: {
            id: req.body.id
        }
    }).then((resultado)=>{
        console.log(resultado);
        return res.redirect('/users')
    }).catch((err)=>{
        console.log(err);
    });


});

app.post('/del', (req,res)=>{
    Usuario.destroy({
        where: {
            id: req.body.id
        }
    }).then((retorno)=>{
    
        return res.redirect('/users');
    }).catch((err)=>{
        console.log(err);
    });
})

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});