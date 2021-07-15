import pusher from "../pusher";

export const initSubscriptions = () => {
    const channel = pusher.subscribe('tasks')
    channel.bind('App\\Events\\MessagePosted', function (task) {
        console.log(task);
    });

    pusher.channel('tasks')
        .listen('MessagePosted', function (data) {
            console.log(data)
            console.log('event')
        });
}
