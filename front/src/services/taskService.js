import axios from "../axios";
import {getUserToken} from "./userService";

export const addTask = (task) => {
    return axios.post('task',
        task,
        {
            headers: {
                'Authorization': `Bearer ${getUserToken()}`
            }
        }
    )
}

export const deleteTask = (task) => {
    return axios. delete(`task/${task.id}`)
}

export const updateTask = (task) => {
    return axios.patch(`task/${task.id}`, task)
}

export const fetchTasks = () => {
    return axios.get('tasks')
}
