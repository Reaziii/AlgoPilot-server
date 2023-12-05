"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_downloadable_link = exports.timeAgo = exports.trankedString = exports.get_current_time = exports.convertMinutesToHoursAndMinutes = exports.formatDate = exports.addDateAndTime = void 0;
const file_saver_1 = __importDefault(require("file-saver"));
const addDateAndTime = (dateString, timeString) => {
    const dateObject = new Date(dateString);
    const timeArray = timeString.split(':').map(Number);
    const timeObject = new Date(dateObject);
    timeObject.setHours(timeArray[0], timeArray[1]);
    return timeObject;
};
exports.addDateAndTime = addDateAndTime;
function formatDate(inputDate, inputTime) {
    const dateTimeString = `${inputDate} ${inputTime}`;
    const dateTime = new Date(dateTimeString);
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateTime);
    return formattedDate;
}
exports.formatDate = formatDate;
function convertMinutesToHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hoursText = `${hours} hr`;
    const minutesText = ` ${remainingMinutes} mins`;
    return hoursText + minutesText;
}
exports.convertMinutesToHoursAndMinutes = convertMinutesToHoursAndMinutes;
const get_current_time = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
};
exports.get_current_time = get_current_time;
const trankedString = (str, len) => {
    let ol = str.length;
    let ret = str.substring(0, len);
    if (ret.length < ol) {
        ret += "...";
    }
    return ret;
};
exports.trankedString = trankedString;
function timeAgo(submissionTime) {
    const now = new Date();
    const millisecondsAgo = now.getTime() - submissionTime.getTime();
    const secondsAgo = millisecondsAgo / 1000;
    const minutesAgo = secondsAgo / 60;
    const hoursAgo = minutesAgo / 60;
    const daysAgo = hoursAgo / 24;
    const weeksAgo = daysAgo / 7;
    if (weeksAgo > 1) {
        return `${Math.floor(weeksAgo)}w ago`;
    }
    else if (daysAgo > 1) {
        return `${Math.floor(daysAgo)}d ago`;
    }
    else if (hoursAgo > 1) {
        return `${Math.floor(hoursAgo)}h ago`;
    }
    else if (minutesAgo > 1) {
        return `${Math.floor(minutesAgo)}m ago`;
    }
    else {
        return `a minute ago`;
    }
}
exports.timeAgo = timeAgo;
const create_downloadable_link = (file, filetype, filename) => {
    let blob = new Blob([file], { type: "text/" + filetype });
    file_saver_1.default.saveAs(blob, filename);
};
exports.create_downloadable_link = create_downloadable_link;
