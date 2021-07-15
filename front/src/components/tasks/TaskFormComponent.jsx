import React from 'react';
import User from "../../services/User";
import {register} from "../../services/userService";
import {toast} from "react-toastify";
import * as yup from "yup";
import {Button, Col, Form} from "react-bootstrap";
import {Formik} from "formik";
import {addTask, updateTask} from "../../services/taskService";

export default class TaskFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestSend: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {

        this.setState({requestSend: true});

        try {
            let res;
            if (this.props.taskToEdit && this.props.taskToEdit.hasOwnProperty('id')) {
                event.id = this.props.taskToEdit.id;
                this.props.handleEditTask();
                res = await updateTask(event);
                this.props.handleEditTaskAsync(res.data);
            } else {
                res = addTask(event);
                this.props.handleCreateTask();
            }
            this.setState({requestSend: false});
        } catch (err) {
            console.log(err);
            toast.error('Error :(');
            this.setState({requestSend: false});
        }
    }

    render() {
        const schema = yup.object().shape({
            title: yup.string().min(1, 'Required').required(),
            text: yup.string().min(1, 'Required').required(),
            notification_date: yup.string(),
            notification_time: yup.string(),
        });
        return (
            <Col className={'py-2'}>
                <h3 className={'p-2'}>{this.state.taskToEdit ? 'Обновить' : 'Создать'}</h3>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.handleSubmit}
                    initialValues={{
                        title: this.props.taskToEdit ? this.props.taskToEdit.title : '',
                        text: this.props.taskToEdit ? this.props.taskToEdit.text : '',
                        notification_date: this.props.taskToEdit ? this.props.taskToEdit.notification_date : '',
                        notification_time: this.props.taskToEdit ? this.props.taskToEdit.notification_time : '',
                    }}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          handleBlur,
                          values,
                          touched,
                          isValid,
                          errors,
                      }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group controlId="validationTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    isValid={touched.title && !errors.title}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="validationText">
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="text"
                                    value={values.text}
                                    onChange={handleChange}
                                    isValid={touched.text && !errors.text}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="validationDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    disabled={this.props.taskToEdit}
                                    type="date"
                                    name="notification_date"
                                    value={values.notification_date}
                                    onChange={handleChange}
                                    isValid={touched.notification_date && !errors.notification_date}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="validationTime">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    disabled={this.props.taskToEdit}
                                    type="time"
                                    name="notification_time"
                                    value={values.notification_time}
                                    onChange={handleChange}
                                    isValid={touched.notification_time && !errors.notification_time}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Button disabled={this.state.requestSend} type="submit">Submit form</Button>
                        </Form>
                    )}
                </Formik>
            </Col>
        )
    }
}
