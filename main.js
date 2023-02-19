
const bodyparser=require("body-parser");
const ejse = require('ejs-electron')
const electron = require('electron');
const {app, BrowserWindow,ipcMain} = electron;


let server = require('./server/server.js');





app.on('ready', function(){

const mainWindow=  new BrowserWindow({show:false});
mainWindow.maximize();
mainWindow.show();
mainWindow.loadURL("http://localhost:3000");


});
