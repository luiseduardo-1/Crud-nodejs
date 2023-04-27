const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_crud','root','',{
    host: '127.0.0.1',
    dialect:'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    logging: false
})

//TESTANDO CONEXÃO COM O BANCO

// sequelize.authenticate().then(function(){
//     console.log("Conectado com sucesso ao banco");
// }).catch(function(err){
//     console.log("Falha ao se conctar: "+err)
// });

module.exports = {Sequelize, sequelize}

