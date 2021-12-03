import * as dotenv from 'dotenv';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express, {Request} from "express";
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {makeExecutableSchema} from "graphql-tools";
import {execute, subscribe} from 'graphql';
import {createServer} from 'http';

import {type_Defs} from "./auth/graphQl/schema/type_defs";

import {userResolver} from "./auth/graphQl/resolver/user.resolver";
import {formationResolver} from './auth/graphQl/resolver/formation.resolver';
import {GroupResolver} from './auth/graphQl/resolver/group.resolver';

const PORT = 4000;

const dbConnect = require("./auth/config/config.db");
const jwt = require("jsonwebtoken");
dotenv.config();
dbConnect();

(async function () {
    const app = express();
    const httpServer = createServer(app);

    app.get("/", (req, res) => {
        res.send("Pygma.Link Server is is up :)");
      });

    const schema = makeExecutableSchema({
        typeDefs: type_Defs,
        // @ts-ignore
        resolvers: [userResolver, GroupResolver, formationResolver],
    });

    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect(connectionParams: any) {
                const token = connectionParams.authorization
                if (token) {
                    let payload = jwt.verify(token, process.env.SECRET)
                    return {user: payload}
                }
            }
        },
        {server: httpServer, path: '/graphql'},
    );

    const io = require('socket.io')(httpServer, {
        handlePreflightRequest: (req: { header: { origin: any; }; }, res: { writeHead: (arg0: number, arg1: { "Access-Control-Allow-Headers": string; "Access-Control-Allow-Origin": any; "Access-Control-Allow-Credentials": boolean; }) => void; end: () => void; }) => {
          const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin":
              (req.header && req.header.origin) || "https://excalidraw.com",
            "Access-Control-Allow-Credentials": true,
          };
          res.writeHead(200, headers);
          res.end();
        },
      });

      io.on("connection", (socket: { id: any; on: (arg0: string, arg1: { (roomID: any): void; (roomID: string, encryptedData: ArrayBuffer, iv: Uint8Array): void; (roomID: string, encryptedData: ArrayBuffer, iv: Uint8Array): void; }) => void; join: (arg0: any) => void; broadcast: { to: (arg0: string) => { (): any; new(): any; emit: { (arg0: string, arg1: ArrayBuffer, arg2: Uint8Array | undefined): void; new(): any; }; }; }; volatile: { broadcast: { to: (arg0: string) => { (): any; new(): any; emit: { (arg0: string, arg1: ArrayBuffer, arg2: Uint8Array): void; new(): any; }; }; }; }; }) => {
        io.to(`${socket.id}`).emit("init-room");
        //@ts-ignore
        socket.on("join-room", (roomID) => {
          console.log(`${socket.id} has joined ${roomID}`);
          socket.join(roomID);
          if (io.sockets.adapter.rooms[roomID].length <= 1) {
            io.to(`${socket.id}`).emit("first-in-room");
          } else {
              //@ts-ignore
              socket.broadcast.to(roomID).emit("new-user", socket.id);
            }
            io.in(roomID).emit(
                "room-user-change",
                Object.keys(io.sockets.adapter.rooms[roomID].sockets),
                );
            });
            
            socket.on(
                "server-broadcast",
                //@ts-ignore
                (roomID: string, encryptedData: ArrayBuffer, iv: Uint8Array) => {
                    console.log(`${socket.id} sends update to ${roomID}`);
                    socket.broadcast.to(roomID).emit("client-broadcast", encryptedData, iv);
                },
                );
                
                socket.on(
                    "server-volatile-broadcast",
                    //@ts-ignore
                    (roomID: string, encryptedData: ArrayBuffer, iv: Uint8Array) => {
                        console.log(`${socket.id} sends volatile update to ${roomID}`);
                        socket.volatile.broadcast
                        .to(roomID)
                        .emit("client-broadcast", encryptedData, iv);
                    },
                    );
                    
                    socket.on("disconnecting", () => {
                        const rooms = io.sockets.adapter.rooms;
                        //@ts-ignore
                        for (const roomID in socket.rooms) {
                            const clients = Object.keys(rooms[roomID].sockets).filter(
                                (id) => id !== socket.id,
                                );
                                if (clients.length > 0) {
                  //@ts-ignore
                  socket.broadcast.to(roomID).emit("room-user-change", clients);
                }
            }
        });
        
        socket.on("disconnect", () => {
              //@ts-ignore
            socket.removeAllListeners();
          });
        });
    
    const server = new ApolloServer({
        schema,
        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        },
            ApolloServerPluginDrainHttpServer({httpServer})
        ],

        context: ({req}: { req: Request }) => {
            const token = req.headers.authorization;
            if (token) {
                let payload;
                try {
                    payload = jwt.verify(token, process.env.SECRET);
                    return {authenticatedUserEmail: payload};
                } catch (err) {
                    console.log(err)
                }
            }
        }

    });
    await server.start();
    server.applyMiddleware({
        app,
        cors: {
            origin: '*',
            credentials: true
        }
    });

    httpServer.listen(PORT, () =>
        console.log(`\n🚀 GraphQl Server is now running on http://localhost:${PORT}/graphql`)
    );
})();