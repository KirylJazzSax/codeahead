import React from "react";
import {Container, Modal, Nav, Row} from "react-bootstrap";
import {getUserData, isLogged, saveUserData} from '../../services/userService'
import RegisterComponent from "../register/RegisterComponent";
import TasksComponent from "../tasks/TasksComponent";
import {ToastContainer, toast} from "react-toastify";
import LoginComponent from "../login/LoginComponent";


function LoginNav(props) {
    return (
        <Nav
            className="justify-content-center mb-3"
            onSelect={(selectedKey) => props.onClick(selectedKey)}
        >
            <Nav.Item>
                <Nav.Link eventKey="register">Register</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="login">Link</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

function GreetingsNav(props) {
    return (
        <Nav
            className="justify-content-center mb-3"
        >
            <Nav.Item>
                <Nav.Link disabled>Hi {props.name}</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

export default class LayoutComponent extends React.Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.closeRegisterModal = this.closeRegisterModal.bind(this);
        this.state = {
            showRegisterModal: false,
            showLoginModal: false,
            isLogged: false,
            userData: null,
            userName: ''
        };
    }

    openModal(type) {
        if (type === 'register') {
            this.setState({showRegisterModal: true, showLoginModal: false})
        }
        if (type === 'login') {
            this.setState({showRegisterModal: false, showLoginModal: true})
        }
    }

    handleUserRegistered(res) {
        saveUserData(res);
        this.closeRegisterModal();
        this.setState({isLogged: isLogged()});
        toast.success('Thank you for registration');
        this.setState({userName: getUserData().name});

    }

    handleUserLogged(res) {
        saveUserData(res);
        this.closeLoginModal();
        this.setState({isLogged: isLogged()});
        toast.success('You logged in');
        this.setState({userName: getUserData().name});
    }

    closeRegisterModal() {
        this.setState({showRegisterModal: false});
    }

    closeLoginModal() {
        this.setState({showLoginModal: false});
    }

    componentDidMount() {
        if (isLogged()) {
            this.setState({userName: getUserData().name})
            this.setState({isLogged: isLogged()});
        }
    }

    render() {
        const isLogged = this.state.isLogged;
        const name = this.state.userName;
        let nav;
        if (isLogged) {
            nav = <GreetingsNav name={name} />;
        } else {
            nav = <LoginNav onClick={this.openModal} />;
        }
        return (
            <Container fluid className={'px-5'}>
                {nav}
                <Row>
                    <TasksComponent />
                </Row>
                <Modal show={this.state.showRegisterModal} onHide={this.closeRegisterModal}>
                    <RegisterComponent handleUserRegistered={(res) => {
                        this.handleUserRegistered(res)
                    }} />
                </Modal>
                <Modal show={this.state.showLoginModal} onHide={this.closeLoginModal}>
                    <LoginComponent handleUserLogged={(res) => {
                        this.handleUserLogged(res)
                    }} />
                </Modal>
                <ToastContainer />
            </Container>
        )
    }
}
