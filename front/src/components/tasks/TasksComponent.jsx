import {deleteTask, fetchTasks, updateTask} from "../../services/taskService";
import React from "react";
import pusher from '../../pusher';
import {Button, Table, Col, Modal} from "react-bootstrap";
import moment from "moment";
import TaskFormComponent from "./TaskFormComponent";
import {toast} from "react-toastify";
import {isLogged, taskSeen} from "../../services/userService";

export default class TasksComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            showTaskModal: false,
            taskToEdit: null,
            disabledTaskIds: [],
        }
        this.closeModal = this.closeModal.bind(this);
    }

    initPusherSubscriptions() {
        const channel = pusher.subscribe('tasks')
        channel.bind('App\\Events\\TaskCompletedEvent',  (task) => {
            this.replaceTaskAndNotify(task, `Task ${task.id} completed`);
        }).bind('App\\Events\\TaskCreatedEvent', (task) => {
            this.pushTaskAndNotify(task);
        }).bind('App\\Events\\TaskDeleteEvent', (task) => {
            this.removeTaskFromStateAndNotify(task);
        }).bind('App\\Events\\TaskUpdateEvent', (task) => {
            this.replaceTaskAndNotify(task, `Task ${task.id} updated`);
        });
    }

    componentDidMount() {
        this.initPusherSubscriptions();
        fetchTasks().then(res => {
            this.setState({
                tasks: res.data
            })
        })
    }

    notificationTime(task) {
        return moment(task.notification_date + ' ' + task.notification_time).format('lll')
    }

    closeModal() {
        this.setState({showTaskModal: false})
    }


    pushTaskAndNotify(task) {
        let tasks = [...this.state.tasks];
        if (!tasks.find(t => t.id === task.id)) {
            this.setState({tasks: [...tasks, task]});
            toast.success(`${this.notificationTime(task)} - ${task.title} - ${task.user.name}`);
        }
    }

    replaceTaskAndNotify(task, message) {
        let tasks = [...this.state.tasks]
        let ind = tasks.findIndex(t => t.id === task.id);
        if (ind !== -1) {
            if (isLogged()) {
                taskSeen(task);
            }
            tasks.splice(ind, 1, task);
            this.setState({tasks: tasks});
            toast.success(message);
        }
    }

    removeTaskFromStateAndNotify(task) {
        let tasks = [...this.state.tasks]
        let ind = tasks.findIndex(t => t.id === task.id);
        if (ind !== -1) {
            tasks.splice(ind, 1)
            this.setState({tasks: tasks})
            toast.success('Deleted');
        }
    }

    async deleteTask(task) {
        try {
            let res = await deleteTask(task);
        } catch (err) {
            console.log(err);
            toast.error('Delete error');
        }
    }

    removeFromDisabledIds(taskId) {
        let ids = [...this.state.disabledTaskIds];
        let i = ids.findIndex(id => taskId === id);
        if (i !== -1) {
            ids.splice(i, 1);
            this.setState({disabledTaskIds: ids});
        }
    }
    handleEditTask() {
        this.closeModal();
    }

    handleEditTaskAsync(task) {
        this.removeFromDisabledIds(task.id);
    }

    handleCreateTask() {
        this.closeModal();
    }

    notLoggedToast() {
        toast.dark('For edit or create please login')
    }

    render() {
        const tasks = this.state.tasks
        const list = tasks.map(task =>
            <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.text}</td>
                <td>{this.notificationTime(task)}</td>
                <td>{task.user.name}</td>
                <td>{task.completed == 1 ? 'Yes' : 'No'}</td>
                <td>
                    <Button disabled={task.completed == 1 || this.state.disabledTaskIds.find(r => r === task.id)} variant="info" className={'mr-1'} onClick={() => {
                        this.setState({taskToEdit: task});
                        this.setState({disabledTaskIds: [...this.state.disabledTaskIds, task.id]});
                        this.setState({showTaskModal: true});
                    }}>Edit</Button>
                    <Button disabled={task.completed == 1 || this.state.disabledTaskIds.find(r => r === task.id)} variant="danger" onClick={() => {
                        this.setState({disabledTaskIds: [...this.state.disabledTaskIds, task.id]});
                        this.deleteTask(task);
                    }}>Delete</Button>
                </td>
            </tr>
        )
        return (
            <Col>
                <Button variant="primary" className={'mb-2'} onClick={() => {
                    if (!isLogged()) {
                        this.notLoggedToast();
                        return;
                    }
                    this.setState({showTaskModal: true})
                }}>Create</Button>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Text</th>
                        <th>Notification time</th>
                        <th>User name</th>
                        <th>Completed</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list}
                    </tbody>
                </Table>
                <Modal show={this.state.showTaskModal} onHide={() => {
                    this.removeFromDisabledIds(
                        this.state.disabledTaskIds[this.state.disabledTaskIds.length - 1]
                    );
                    this.closeModal();
                }}>
                    <TaskFormComponent
                        taskToEdit={this.state.taskToEdit}
                        handleCreateTask={() => this.handleCreateTask()}
                        handleEditTaskAsync={(task) => this.handleEditTaskAsync(task)}
                        handleEditTask={() => this.handleEditTask()}
                    />
                </Modal>
            </Col>

        )
    }
}
