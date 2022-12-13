/*
По ссылке вы найдёте файл с логами запросов к серверу весом более 2 Гб. Напишите программу,
которая находит в этом файле все записи с ip-адресами 89.123.1.41 и 34.48.240.111, а также
сохраняет их в отдельные файлы с названием %ip-адрес%_requests.log.
*/

const { EOL } = require("os");

const colors = require("colors/safe");
const readline = require("readline");
const fs = require("fs");
const path = "./access_tmp.log.txt";


const arrIpAddressFind = ['89.123.1.41', '34.48.240.111'];

const rl = readline.createInterface({
    input: fs.createReadStream(path),
});


let lineNumber = 1;
rl.on("line", function (lineData) {
    checkMatchIpAddress(`Line number-${lineNumber}: ${lineData}`);
    lineNumber++;
});


function writeLine(ipAddress, line) {
    const writeStream = fs.createWriteStream(`./%${ipAddress}%_requests.log`, { flags: 'a', encoding: "utf8" }) // Вынести за пределы функции
    writeStream.write(`${line}${EOL}`); 
}

function checkMatchIpAddress(line) {
    arrIpAddressFind.forEach(ipAddress => {

        if (line.indexOf(ipAddress) != -1) {
            console.log(colors.yellow(line.indexOf(ipAddress) + line));
            writeLine(ipAddress, line);
        }
    });
}