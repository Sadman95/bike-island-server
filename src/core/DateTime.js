const {
    format,
    getHours,
    getMinutes,
    intlFormatDistance,
    isToday,
    isYesterday,
    formatDistanceStrict
} = require("date-fns");

/** My custom Date time
 * @class
 * */
class DateTime {

    /**
    * @constructor
     * @param {Date} timeStamp
    * */
    constructor(timeStamp) {
        this.timeStamp = timeStamp;
    }

    formatHoursMinuteLocal() {
        return `${
            this.isDayToday()
                ? this.getFormatedDistance()
                : `${
                    getHours(new Date(this.timeStamp)) > 12
                        ? getHours(new Date(this.timeStamp)) - 12
                        : getHours(new Date(this.timeStamp))
                }:${
                    getMinutes(new Date(this.timeStamp)) < 10
                        ? "0" + getMinutes(new Date(this.timeStamp))
                        : getMinutes(new Date(this.timeStamp))
                } ${
                    getHours(new Date(this.timeStamp)) >= 12 &&
                    getHours(new Date(this.timeStamp)) < 24 &&
                    getMinutes(new Date(this.timeStamp)) >= 0
                        ? "pm"
                        : "am"
                }`
        }`;
    }

    getFormatedDistance() {
        return intlFormatDistance(new Date(this.timeStamp), new Date());
    }

    isDayToday() {
        return isToday(new Date(this.timeStamp));
    }

    isDayYesterday() {
        return isYesterday(new Date(this.timeStamp));
    }

    formatDate() {
        if (this.isDayToday()) {
            return "Today";
        }
        if (this.isDayYesterday()) {
            return "Yesterday";
        }
        return format(new Date(this.timeStamp), "dd/MM/yyyy");
    }

    formatDistanceStrict() {
        return formatDistanceStrict(
            new Date(Date.now()),
            new Date(this.timeStamp)
        )
    }


}

module.exports = DateTime
