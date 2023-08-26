const http = require("http");
const express = require("express");
const app = express();

app.use(express.static("public"));

const serverPort = 5000;

const WebSocket = require("ws");


app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

const API = "http://yerkee.com/api/fortune";
const wss = new WebSocket.Server(
  {
    port: serverPort,
  },
  () => console.log("Server started on 5000")
);

const fetchFortuneCookie = async () => {
  const response = await fetch(API);
  const cookie = await response.json();
  return cookie?.fortune;
};

wss.on("connection", function connection(ws, req) {
  console.log("Connection Opened");

  const messageInterval = setInterval(async () => {
    const data = await fetchFortuneCookie();
    const cookie = {
      fortune: data,
      id: Date.now(),
      date: Date.now(),
    };

    ws.send(JSON.stringify(cookie));
  }, 5000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(messageInterval);
  });
});
