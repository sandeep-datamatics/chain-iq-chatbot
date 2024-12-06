import moment from "moment";

export const formatTimestamp = (timestamp: string | number | Date | moment.Moment): string => {
    return moment(timestamp).fromNow();
};