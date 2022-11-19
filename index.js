const colors = require("colors/safe");

const begin = process.argv[2];
const end = process.argv[3];

const arraySimple = getArraySimple(begin, end);


if (checkNumber(begin) && checkNumber(end)) {
    start();
}
else {
    console.log(colors.red("Ошибка проверки на число"));
}


function start() {
    if (arraySimple.length > 0) {
        writeConsoleArraySimple(arraySimple);
    } else {
        console.log(colors.red("Простых чисел в диапазоне нет"));
    }
}


function checkNumber(number) {
    if (number === '') { return false; }
    return Number.isInteger(+number);
}


function getArraySimple(begin, end) {
    arr = [];
    if (begin < 2) { begin = 2 }

    for (let i = begin; i <= end; i++) {
        let flag = 1;
        for (let j = 2; (j <= i / 2) && (flag == 1); j = j + 1) {
            if (i % j == 0) {
                flag = 0
            }
        }
        if (flag == 1) {
            arr.push(i);
        }
    }
    return arr;
}

function writeConsoleArraySimple(arr) {
    arr.forEach((item) => {
        colorIndex = 0;
        switch (colorIndex) {
            case 0:
                console.log(colors.green(item));
            case 1:
                console.log(colors.yellow(item));
            case 2:
                console.log(colors.red(item));

            default:
                break;
        }
        colorIndex++;
        if (colorIndex > 2) { colorIndex = 0 }
    })
}
