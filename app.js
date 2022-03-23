/*#####################################################################
 CHAT BOT - PARA TRIAGEM DE PACIENTES COM SUSPEITA DE DIABETES
 Autor: Leandro Fernandes - Engenheiro de dados do Squad AWS
 Projeto para o desafio Stack Labs

 Referenicas:

 API Telegram - https://core.telegram.org/bots/api
 Botgram - https://github.com/botgram/botgram/blob/master/docs/tutorial.md
 Marco Bruno - https://medium.com/collabcode/como-criar-um-chatbot-no-telegram-em-nodejs-b5ad0e1b4a9
 Guia do desenvolvedor - https://docs.aws.amazon.com/pt_br/sdk-for-javascript/v2/developer-guide/s3-example-access-permissions.html
 Guia do usuario - https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html
 Knitting tutorials - https://flaviocopes.com/node-upload-files-s3/
 Flavio - https://flaviocopes.com/node-upload-files-s3/
#####################################################################*/
var fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.update({region: 'sa-east-1'});

//passando a imagem do score para retorno
const botgram = require("./node_modules/botgram")

//Passando o Token do bot no telegram
const bot = botgram("5276408480:AAGk9lvXpomkc8yBtIdIMod093uSY53zumY")

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01',
                    accessKeyId: process.env.accessKeyId,
                    secretAccessKey: process.env.secretAccessKey});



//fluxo de atendimento
bot.text(function (msg, reply, next) {
  reply.text("Ola "+ msg.chat.firstname + " vamos realizar o seu cadastro em 5 passos! digite /1 seguido do seu nome para iniciar");
});
bot.command("start", "help", (msg, reply) => {
  reply.text("To schedule an alert, do: /alert <seconds> <text>")
});


bot.command("cadastrar", "help", (msg, reply) => {
  _sendToS3(msg)
  reply.text("Bem vindo ao cadastro basico do inquerito de saude, gentileza informe o seu nome.")
});

bot.command("1", "help", (msg, reply) => {
  _sendToS3(msg)
  reply.text("Informe o seu cep e o comando /2 antes da sua resposta.")
});

bot.command("2", "help", (msg, reply) => {
  _sendToS3(msg)
  reply.text("Quantas vez você faz atividade fisica na semana? Informe o comando /3 antes da sua resposta.")
});

bot.command("3", "help", (msg, reply) => {
  _sendToS3(msg)
  reply.text("Como esta a sua alimentação? Informe o comando /4 antes da sua resposta.")
});

bot.command("4", "help", (msg, reply) => {
  _sendToS3(msg)
  reply.text("Você come muito doce? Informe o comando /5 antes da sua resposta.")
});

bot.command("5", "help", (msg, reply) =>
  reply.photo( fs.createReadStream("./progresso.jpg"), "Este é o seu score"))

bot.photo(function (msg, reply, next) {
   reply.markdown("Here's some _good_ sticker:");
   reply.sticker("BQADAgAD3gAD9HsZAAFphGBFqImfGAI");
});

//persistindo json no s3 camada RAW
function _sendToS3(data){
  
  const jsonStr = JSON.stringify(data);
  // call S3 to retrieve upload file to specified bucket
  // Configure the file stream and obtain the upload parameters
  //var fs = require('fs');
  fName = 'user_data_'+data.chat.id+'_'+data.date+'.json';
  f = fs.appendFile('C:/labs/rosie-bot/user_data.json', jsonStr, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  var fileStream = fs.createReadStream('C:/labs/rosie-bot/user_data.json');
  fileStream.on('error', function(err) {
    console.log('File Error', err);
  });

  var uploadParams = {Bucket: 'sqad-aws-staging/rosie-bot', Key: fName, Body: fileStream};
  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    } 
  });

  console.log(jsonStr);
}


