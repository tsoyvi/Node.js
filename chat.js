/*
В разделе, посвящённом веб-сокетам, мы сделали базовую основу для простого чата. В ней клиент
может посылать сообщения серверу и получать их обратно в виде обратно отображаемой строки. Мы
сделали оповещение всех клиентов о подключении нового клиента.

Дополните это приложение следующим инструментарием:
 
+ 1. Пользователи должны видеть не только сообщение о подключении нового клиента, но и об
отключении клиента или переподключении.

+ 2. На странице приложения важно, чтобы сообщения от разных клиентов различались. Для этого
генерируйте ник пользователя при каждом его подключении.

+ 3. Пользователи должны видеть сообщения к серверу от других пользователей.

 Дополните вашу веб-версию файлового менеджера следующим инструментарием:

+ 1. Добавьте счётчик посетителей на странице, который работал бы через сокеты и динамически
обновлялся на всех клиентах при их подключении или отключении.
 
 2. Вынесете инструментарий поиска по содержимому файла из заданий уроков 3 и 4 в
отдельный поток воркера.
*/


const { workerData, parentPort } = require('worker_threads');

const http = require('http');
const fs = require('fs');
const path = require("path");

const Server = require('socket.io');

const host = "localhost";
const { portOfSet } = workerData;
const port = 3000 + portOfSet;

const allClients = [];

const server = http.createServer((req, res) => {
    if (["GET", "POST", "PUT"].includes(req.method)) {

        const filePath = path.join(process.cwd(), "./index.html");
        const rs = fs.createReadStream(filePath);

        rs.pipe(res);
    }
});

const io = Server(server);
io.on('connection', (client) => {

    // console.log(client);
    console.log('Websocket connected')

    client.on('client-msg', (data) => {
        client.broadcast.emit('server-msg', { msg: data.msg, nickName: data.nickName })
        client.emit('server-msg', { msg: data.msg, nickName: data.nickName })
    });

    client.on('userData', (data) => {
        client.nickName = data.nickName;
        allClients.push(client);

        sendMessageServer(client, { msg: `Подключился пользователь:  ${data.nickName}` });
        sendCountClients(client);

    });

    client.on('disconnect', () => {
        const clientIndex = allClients.indexOf(client);
        sendMessageServer(client, { msg: `Пользователь :  ${allClients[clientIndex].nickName} отключился` });
        console.log(`Пользователь :  ${allClients[clientIndex].nickName} отключился`);

        allClients.splice(clientIndex, 1);
        sendCountClients(client);
    });

});


const sendCountClients = (client) => {
    client.broadcast.emit('count-clients', { countClients: allClients.length });
    client.emit('count-clients', { countClients: allClients.length });
}

const sendMessageServer = (client, payload) => {
    client.broadcast.emit('server-msg-service', payload);
    client.emit('server-msg-service', payload);
}


server.listen(port, host, () =>
    // console.log(`Server running at http://${host}:${port}`)
    parentPort.postMessage({ result: `Server was started: ${host}:${port}` })
);