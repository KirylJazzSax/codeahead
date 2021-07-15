import User from "../../services/User";
import {login, register} from "../../services/userService";
import {toast} from "react-toastify";
import * as yup from "yup";
import {Button, Col, Form} from "react-bootstrap";
import {Formik} from "formik";
import React from "react";

export default class LoginComponent extends React.Component {
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
            let res = await login(event.email, event.password);
            this.props.handleUserLogged(res);
            this.setState({requestSend: false});
        } catch (err) {
            toast.error('Login error :(');
            this.setState({requestSend: false});
        }
    }

    render() {
        const schema = yup.object().shape({
            email: yup.string().email().required('Required'),
            password: yup.string().min(1, 'Required').required('Required'),
        });
        return (
            <Col className={'py-2'}>
                <h3 className={'p-2'}>Login</h3>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.handleSubmit}
                    initialValues={{
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
