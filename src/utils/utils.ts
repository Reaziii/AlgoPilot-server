
import FileSaver from 'file-saver'
export const addDateAndTime = (dateString: string, timeString: string): Date => {
    const dateObject: Date = new Date(dateString);
    const timeArray: number[] = timeString.split(':').map(Number);
    const timeObject: Date = new Date(dateObject);
    timeObject.setHours(timeArray[0], timeArray[1]);

    return timeObject
}

export function formatDate(inputDate: string, inputTime: string): string {
    const dateTimeString = `${inputDate} ${inputTime}`;
    const dateTime = new Date(dateTimeString);

    const options: Intl.DateTimeFormatOptions = {
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


export function convertMinutesToHoursAndMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const hoursText = `${hours} hr`;
    const minutesText = ` ${remainingMinutes} mins`;

    return hoursText + minutesText;
}

export const get_current_time = (): Date => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
}


export const trankedString = (str: string, len: number) => {
    let ol = str.length;
    let ret: string = str.substring(0, len);
    if (ret.length < ol) {
        ret += "...";
    }
    return ret;
}

export function timeAgo(submissionTime: Date): string {
    const now: Date = new Date();
    const millisecondsAgo: number = now.getTime() - submissionTime.getTime();
    const secondsAgo: number = millisecondsAgo / 1000;
    const minutesAgo: number = secondsAgo / 60;
    const hoursAgo: number = minutesAgo / 60;
    const daysAgo: number = hoursAgo / 24;
    const weeksAgo: number = daysAgo / 7;

    if (weeksAgo > 1) {
        return `${Math.floor(weeksAgo)}w ago`;
    } else if (daysAgo > 1) {
        return `${Math.floor(daysAgo)}d ago`;
    } else if (hoursAgo > 1) {
        return `${Math.floor(hoursAgo)}h ago`;
    } else if (minutesAgo > 1) {
        return `${Math.floor(minutesAgo)}m ago`;
    } else {
        return `a minute ago`;
    }
}

export const create_downloadable_link = (file: string, filetype: string, filename: string) => {
    let blob = new Blob([file], { type: "text/" + filetype });
    FileSaver.saveAs(blob, filename)
}

