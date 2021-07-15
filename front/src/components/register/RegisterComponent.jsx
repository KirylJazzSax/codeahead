import React from "react";
import {Form, Button, Col} from "react-bootstrap";
import {Formik} from "formik";
import User from "../../services/User";
import {register} from "../../services/userService";
import * as yup from 'yup';
import {toast} from "react-toastify";


export default class RegisterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestSend: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(event) {
        const user = new User(
            event.name,
            event.email,
            event.password,
        );

        this.setState({requestSend: true});

        try {
            let res = await register(user);
            this.props.handleUserRegistered(res);
            this.setState({requestSend: false});
        } catch (err) {
            console.log(err);
            toast.error('Registration error :(');
            this.setState({requestSend: false});
        }
    }

    render() {
        const schema = yup.object().shape({
            name: yup.string().min(1, 'Required').required(),
            email: yup.string().email().required('Required'),
            password: yup.string().min(1, 'Required').required('Required'),
        });
        return (
            <Col className={'py-2'}>
                <h3 className={'p-2'}>Register</h3>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.handleSubmit}
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
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
                            <Form.Group controlId="validationName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    isValid={touched.name && !errors.name}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="validationEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isValid={touched.email && !errors.email}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="validationPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isValid={touched.password && !errors.password}
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
