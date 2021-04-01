User Management Application
===========================

## Introduction
This application is used for backend for User management.
## Dependencies
 - Nodejs >=12.x.x
 - Mongodb >=4.x.x

## How to install Node and Mongodb
This application requires node and mongo to be installed on your system. Please check [upstream documentation](https://nodejs.org/en/download/) & [docs.mongodb.com](https://docs.mongodb.com/manual/administration/install-community)
for how to install node & mongo on your system.

## Install PM2
```bash
  npm install pm2 -g
  ````

## Development build
In application root path run following commands
```bash
cd ROOT-DIR
npm install
````
## Start mongo db
After installing mongo you should start mongo
 - Linux: sudo service mongod start
 - Window: 
    - Create a folder in any drive i.e. D:\\data
    - Open command prompt
    - Go C:\Program Files\MongoDB\Server\4.0\bin
    - mongod.exe --dbpath="D:\data" and then enter. You may see running status

## Start Application
```bash
cd ROOT-DIR
pm2 start ecosystem.config.js --env development
````

## Restart Application
```bash
cd ROOT-DIR
pm2 restart ecosystem.config.js --env development
````

## Environment variables
Environment variables is the main mechanism of manipulating application settings. Currently application recognizes
following environment variables: ecosystem.config.js

| Variable           | Default value                     | Description             |
| ------------------ | ----------------------------------| ----------------------- |
| HOST               | localhost                         | Address to listen on    |
| PORT               | 3500                              | Port to listen on       |
| DB_NAME            | mydb                              |                         |
| SECERET_KEY        | anyrandomstring                   |                         |
| TOKEN_EXPIRE_IN    | 30d                               |                         |

http://localhost:3500/graphql

## File System Access
Application does not require any kind of persistent or temporary volumes.

## Signup
````
mutation{
  signup(input:{
    fullName:"Test User",
    email:"test@gmail.com",
    type:"Independent"
  }) {
    error{
      key
      value
    }
    message
    activationCode
  }
}
````
Response
````
{
  "data": {
    "signup": {
      "error": null,
      "message": "Account has been created successfully",
      "activationCode": "2xcebsSTM99wxjRfEdaVdPhIFsKZa4cd"
    }
  }
}
````

## Activate Account and set Password
````
mutation{
  activateAccount(input:{
    email:"test@gmail.com",
    activationCode:"2xcebsSTM99wxjRfEdaVdPhIFsKZa4cd",
    password:"123456"
    confirmPassword:"123456"
  }){
    error{
      key
      value
    }
    message
  }
}
````
Response
````
{
  "data": {
    "activateAccount": {
      "error": null,
      "message": "Account actaviated successfully"
    }
  }
}
````

## Login
````
mutation{
  logIn(input:{
    email:"test@gmail.com",
    password:"123456"
  }){
    error{
      key
      value
    }
    message
    response{
      _id
      fullName
      email
      type
      hasEmailVerified
      status
    }
    jwToken
  }
}
````
Response
````
{
  "data": {
    "logIn": {
      "error": null,
      "message": "User logged in successfully",
      "response": {
        "_id": "6065b32ae08b2453b7a4764f",
        "fullName": "Test User",
        "email": "test@gmail.com",
        "type": "Independent",
        "hasEmailVerified": 1,
        "status": 1
      },
      "jwToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYwNjViMzJhZTA4YjI0NTNiN2E0NzY0ZiJ9LCJpYXQiOjE2MTcyNzg1NTUsImV4cCI6MTYxOTg3MDU1NX0.WlZlLh7kWIDc93_e5XJrSrR_POf-xbxuK496fU5jKlg"
    }
  }
}
````

## Forgot Password Request
````
mutation{
  forgotPasswordRequest(input:{
    email:"test@gmail.com"
  }){
    error{
      key
      value
    }
    message
    token
  }
}
````
Response
````
{
  "data": {
    "forgotPasswordRequest": {
      "error": null,
      "message": "Forgot password token generated",
      "token": "AvPj1msDDShiLBbvKOe01jOiZKsxaPIZ"
    }
  }
}
````

## Forgot Password
````
mutation{
  forgotPassword(input:{
    forgotPasswordToken:"AvPj1msDDShiLBbvKOe01jOiZKsxaPIZ",
    password:"1234567",
    confirmPassword: "1234567"
  }){
    error{
      key
      value
    }
    message
  }
}
````
Response
````
{
  "data": {
    "forgotPassword": {
      "error": null,
      "message": "Password has been changed successfully"
    }
  }
}
````

## User List
````
query{
  userList(input:{
    key:""
    value:""
  }){
    response{
      _id
      fullName
      email
      password
      type
      code
      forgotPasswordToken
      hasEmailVerified
      status
      createdAt
      updatedAt
    }
  }
}
````
Response
````
{
  "data": {
    "userList": {
      "response": [
        {
          "_id": "6065b32ae08b2453b7a4764f",
          "fullName": "Test User",
          "email": "test@gmail.com",
          "password": "2d3853febf3d02a9e8046ece4242a2b3:23db8810f0844daad63a61d83c422426",
          "type": "Independent",
          "code": "864REVGoLxgYvwIr9RWxI9UweZN53VKM",
          "forgotPasswordToken": "",
          "hasEmailVerified": 1,
          "status": 1,
          "createdAt": "04-01-2021",
          "updatedAt": "04-01-2021"
        }
      ]
    }
  }
}
````

## Find User By ID
````
query{
  findUserById(_id:"6065b32ae08b2453b7a4764f"){
    response{
      _id
      fullName
      email
      password
      type
      code
      forgotPasswordToken
      hasEmailVerified
      status
      createdAt
      updatedAt
    }
  }
}
````
Response
````
{
  "data": {
    "findUserById": {
      "response": {
        "_id": "6065b32ae08b2453b7a4764f",
        "fullName": "Test User",
        "email": "test@gmail.com",
        "password": "2d3853febf3d02a9e8046ece4242a2b3:23db8810f0844daad63a61d83c422426",
        "type": "Independent",
        "code": "864REVGoLxgYvwIr9RWxI9UweZN53VKM",
        "forgotPasswordToken": "",
        "hasEmailVerified": 1,
        "status": 1,
        "createdAt": "1617277738000",
        "updatedAt": "1617278873000"
      }
    }
  }
}
````

