'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const USERS_TABLE = process.env.USERS_TABLE;

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('express');
});

app.post('/users', (req, res) => {

  const { userId, email } = req.body;

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId, email
    }
  };

  dynamoDB.put(params, (error) => {
    if(error) {
      console.log(error);
      res.status(400).json({
       error: 'No se ha podido crear el usuario' 
      })
    } else {
      res.json({userId, email});
    }
  })

})

app.get('/users', (req, res) => {

  const params = {
    TableName: USERS_TABLE,
  }

  dynamoDB.scan(params, (error, result) => {
    if(error) {
      console.log(error);
      res.status(400).json({
       error: 'No se ha podido acceder a los usuario' 
      })
    } else {
      const { Items } = result; 
      res.json({
        success: true,
        message: 'Usuarios cargados correctamente',
        users: Items
      });
    }
  })
});

app.get('/users/:userId', (req, res) => {

  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    }
  }

  dynamoDB.get(params, (error, result) => {
    if(error) {
      console.log(error);
      return res.status(400).json({
       error: 'No se ha podido acceder al usuario' 
      })
    } 
    if(result.Item) {
      const { userId, email } = result.Item;
      return res.json({userId, email});
    } else {
      res.status(404).json({error: 'Usuario no encontrado'});       
    }
  })
});

module.exports.generic = serverless(app);
