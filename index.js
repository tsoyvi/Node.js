/*
Используя наработки практического задания прошлого урока, создайте веб-версию приложения.
Сделайте так, чтобы при запуске она:
● показывала содержимое текущей директории;
● давала возможность навигации по каталогам из исходной папки;
● при выборе файла показывала его содержимое.

*/

const colors = require("colors/safe");

const readline = require("readline");
const http = require('http');
const path = require("path");
const fsp = require("fs/promises");
const url = require("url");
const fs = require('fs');


const host = 'localhost';
const port = 3000;


let dirName = path.resolve();


async function handel(queryParams) {
    console.log(queryParams.pathname);
    const pathName = queryParams.pathname;

    const obj = Object.assign({}, queryParams.query)
    if (obj.file !== undefined) {

        const filePath = path.join(dirName, pathName, obj.file);
        const readStream = fs.createReadStream(filePath, { encoding: 'utf-8', highWaterMark: 64 })

        readStream.on('data', (chunk) => {
            console.log(chunk)
            // response.write(chunk)
        })

        /*  readStream.on('end', () => {
              response.end()
          })*/

    }

    result = await readDir(pathName);
    return result;
}

const server = http.createServer();


server.on('request', (request, response) => {

    if (request.method === 'GET') {
        response.setHeader('Content-Type', 'text/html');


        const queryParams = url.parse(request.url, true);

        console.log(queryParams.pathname);
        const pathName = queryParams.pathname;

        const obj = Object.assign({}, queryParams.query);

        if (obj.file !== undefined) {
            const filePath = path.join(dirName, pathName, obj.file);
            const readStream = fs.createReadStream(filePath, { encoding: 'utf-8', highWaterMark: 64})

            readStream.on('data', (chunk) => {
                // console.log(chunk)
                response.write(chunk);
            })
            readStream.on('end', () => {
               // response.end()
            })
        }

        readDir(pathName).then((result) => {
            response.write(result);
            response.end();

        });


    } else {
        response.end('Method Not Allowed');
    }

})


server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`))



async function listDirHTML(pathName, list) {
    let strHTML = '<ul>';
    strHTML += `<a href="${path.dirname(pathName)}"><li>[...]</a></li>`;

    for (const item of list) {
        result = await checkingForFolder(path.join(pathName, item));
        if (result) {
            strHTML += `<li><a href="${path.join(pathName, item)}">${item}</a></li>`;
        } else {
            strHTML += `<li><a href="?file=${item}">${item}</a></li>`;
        }
    }

    strHTML += '</ul>';
    return strHTML;
}


async function checkingForFolder(fileName) {
    const scr = await fsp.stat(path.join(dirName, fileName))
    if (!scr.isFile()) {
        return true;
    }
    return false;
}

async function readDir(pathName) {
    console.log(colors.yellow(path.join(dirName, pathName)));
    result = await fsp.readdir(path.join(dirName, pathName));

    result = await listDirHTML(pathName, result);
    // console.log(colors.red(result));
    return result;
}