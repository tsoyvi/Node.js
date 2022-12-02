/*
Для этого превратите её в консольное приложение, по аналогии с разобранным примером, и добавьте
следующие функции:
1. Возможность передавать путь к директории в программу. Это актуально, когда вы не хотите
покидать текущую директорию, но надо просмотреть файл, находящийся в другом месте.
2. В директории переходить во вложенные каталоги.
3. Во время чтения файлов искать в них заданную строку или паттерн.
*/

const { EOL } = require("os");

const colors = require("colors/safe");

const readline = require("readline");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const inquirer = require("inquirer");

let dirName = '';

/*
Ввод пользователем строки
*/
async function inputString(question = '') {
    return inquirer
        .prompt([{
            name: "answer",
            type: "input",
            message: question,
        }])
}

/*
    выбор пользователем
*/
async function selector(choices) {
    return inquirer.prompt({
        name: "fileName",
        type: "list",
        message: "Выберите файл или папку",
        choices,
    });
}


async function createList(inDir) {
    const list = [];
    for (const item of inDir) {
        list.push(item)
    }
    list.push('..')
    return list
}


async function readFindInFile(fileName) {
    // const result = await fsp.readFile(fileName, 'utf-8').then(console.log);

    const result = await inputString('Что будем искать?');
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(fileName)),
    });
    rl.on("line", function (lineData) {
        checkMatchLine(lineData, result.answer);
    }).on("close", function () {
        console.log('Конец файла');
        process.exit(1);
    })
}


function checkMatchLine(line, search) {
    if (line.indexOf(search) != -1 && search!='') {
        console.log(colors.yellow(line));
    } else {
        console.log(colors.white(line))
    }
}


async function checkingForFolder({ fileName }) {
    if (fileName === '..') {
        dirName = path.dirname(dirName)
    }
    else {
        const scr = await fsp.stat(path.join(dirName, fileName))
        if (!scr.isFile()) {
            dirName += `\\${fileName}`;
        }
        else {
            result = await readFindInFile(path.join(dirName, fileName));
            // return result;
        }
    }
    result = await readDir();
    return false;
}

async function readDir() {
    console.log(colors.yellow(dirName));

    result = await fsp.readdir(path.join(dirName));
    result = await createList(result);
    result = await selector(result);
    result = await checkingForFolder(result);
}

async function inputPath() {
    path_string = await inputString('Видите путь ->');
    try {
        if (fs.lstatSync(path_string.answer).isDirectory()) {
            dirName = path_string.answer;
        }
    } catch (err) {

        dirName = path.resolve();
        console.log(colors.red('Директория не существует. Установлен путь по умолчанию'));
    }
    readDir();
}



inputPath();
