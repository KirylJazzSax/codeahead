export default class Task {
    constructor(
        title,
        text,
        notification_date,
        notification_time
    ) {
        this.title = title;
        this.text = text;
        this.notification_date = notification_date;
        this.notification_time = notification_time;
    }
}
