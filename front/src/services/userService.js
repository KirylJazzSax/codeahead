import axios from "../axios";

export const fetchUser = () => {
    return axios.get('user');
}

export const getUserData = () => {
    return window.userData;
}

export const register = user => {
    return axios.post('signup', {
        name: user.name,
        email: user.email,
        password: user.password,
    });
}

export const login = (email, password) => {
    return axios.post('login', {
        email, password
    });
}

export const isLogged = () => {
    return window.userData && window.userData.token;
}

export const saveUserData = (res) => {
    window.userData = res.data;
}

export const getUserToken = () => {
    return window.userData ? window.userData.token : null;
}

export const taskSeen = (task) => {
    return axios.post('task-seen',
        {
            task_id: task.id,
        },
        {
            headers: {
                'Authorization': `Bearer ${getUserToken()}`
            }
        }
    )
}
