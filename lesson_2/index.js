/*
Напишите программу, которая будет принимать на вход несколько аргументов: дату и время в
формате «час-день-месяц-год». Задача программы — создавать для каждого аргумента
таймер с обратным отсчётом: посекундный вывод в терминал состояния таймеров (сколько
осталось). По истечении какого-либо таймера, вместо сообщения о том, сколько осталось,
требуется показать сообщение о завершении его работы. Важно, чтобы работа программы
основывалась на событиях.
*/


const colors = require("colors/safe");
const EventEmitter = require('events');


class Handler {
    static counter = null;
    static interval = null;

    static createTimer(timer) {
        this.counter = timer;
    }

    static timeLeftToString(timeLeft) {
        const seconds = timeLeft / 1000;
        const sec = Math.floor((seconds) % 60);
        const min = Math.floor((seconds / 60) % 60);
        const hour = Math.floor((seconds / (3600)) % 24);
        const day = Math.floor(seconds / (3600 * 24));
        return `осталось ${day} дней и ${hour} часа ${min} минут ${sec} секунд`;
    }

    static handler() {

        const timeLeft = this.counter.counterInSec() - Date.now();

        if (timeLeft > 0) {
            console.log(this.timeLeftToString(timeLeft));
        } else {
            console.log(this.counter, "Время вышло");
            clearInterval(this.interval);
        }
    }
}


class TimeDate {
    constructor(timeString) {
        const [hour, day, month, year] = timeString.split('-');
        const date = new Date(year, month - 1, day, hour);
        this.counterSeconds = date.getTime();
    }
    counterInSec() {
        return this.counterSeconds;
    }
}


/**** */

class MyEmitter extends EventEmitter { };
const emitter = new MyEmitter();

emitter.on('timer', Handler.handler.bind(Handler));

Handler.interval = setInterval(() => { emitter.emit('timer') }, 1000);

const args = process.argv[2];

Handler.createTimer(new TimeDate(args));

// час-день-месяц-год
