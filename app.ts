import express, { json } from 'express';
import upload from 'express-fileupload'
// const app = express();
// const PORT = process.env.PORT || 4004;
import cors from 'cors'
import axios from 'axios';
import https from 'https'
import * as WebSocket from 'ws';


const app = express();
const PORT = process.env.PORT || 4008;

//for post method
app.use(express.json());
app.use(upload())
app.use(express.urlencoded({
    extended: true
}));



// At request level
const agent = new https.Agent({
    rejectUnauthorized: false
});


app.use(express.static(__dirname))
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


import sql from 'mssql';
import e from 'express';



app.listen(PORT, () => {
    console.log('manager on port 4008');
})

app.get('/animation', (req, res) => {
    const session = req.query.session?.toString();
    const masqueid = req.query.masqueid;
    const animation = req.query.animation;

    if (clients.get(session!)) {
        clients.get(session!)!.send(JSON.stringify({ event: 'animation', animation: animation }));
        console.log('send')
    }

    res.send(`param1 is ${masqueid} and param2 is ${animation}`);
})

app.get('/ping', (req, res) => {
    res.send('ping im masque system')
})

function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

interface Client extends WebSocket {
    id: number
    session: string
}

const server = new WebSocket.Server({ port: 4009 });
const clients = new Map<string, Client>

let counter = 0

server.on('connection', (client: Client) => {

    console.log('connect')
    client.id = counter
    counter++
    client.session = makeid(28)

    clients.set(client.session, client)

    client.on('message', (message: string) => {
        const data = JSON.parse(JSON.parse(message));
        console.log(data)
    });

    client.on('close', (message) => {
        clients.delete(client.session)
        console.log('disconnected');
    });

    client.send(JSON.stringify({ event: 'connected', session: client.session }));

});


