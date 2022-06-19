import { WebSocketServer } from "ws";
import telnetlib from "telnetlib";
import Convert from "ansi-to-html";
import { config } from "./config";
import { emiitter } from "./emitter";

const convert = new Convert();
const wss = new WebSocketServer({ port: 8080 }, () => "MUX Bridge connected.");

wss.on("connection", (ws) => {
  const c = telnetlib.createConnection({
    host: config.get("connections.game.host"),
    port: config.get("connections.game.port"),
  });

  emiitter.emit("connected");

  // xfer data websocket => Telnet
  ws.on("message", (data) => {
    if (c.writable) c.write(data + "\r\n");
  });

  // xfer data Telnet => Websocket
  c.on("data", (data) => {
    ws.send(convert.toHtml(data.toString()));
  });

  // close connections
  ws.on("close", () => c.end());
  c.on("close", () => ws.close());
});

export { wss };
