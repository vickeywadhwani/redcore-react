import React, { Component } from 'react';
import { Row, Col, Container, FormGroup, Input, Label, Button } from 'reactstrap';
import validator from 'validator';
import queryString from 'query-string';
import auth from "./auth";
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                username: '',
                password: '',
                grant_type: 'password'
            },
            errors: {
                username: '',
                password: ''
            },
            formValid: true
        }
        //console.log(sessionStorage.getItem('access_token'));
        if (auth.isAuthenticated()) {
            this.props.history.push("/users");
        }
    }
    
    handleInputChange = async event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let { login } = this.state;
        login[name] = value;
        this.setState({ login });
         await this.validateFields();
    }
    validateFields = async event => {
        let errors = this.state.errors;
        errors.username =
            !validator.isEmail(this.state.login.username)
                ? 'Invlaid username'
                : '';
        errors.password =
            this.state.login.password.length < 8
                ? 'Invlid password'
                : '';
        
        this.setState({
            errors
        })
        const res = await this.validateForm();
        return res;
    }
    validateForm() {
        let errors = this.state.errors;
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        this.setState({
            formValid: valid
        })
        return valid;
    }
    handleSubmit = async event => {
        event.preventDefault()
        const formValid = await this.validateFields();        
        if (formValid) {
            auth.login(queryString.stringify(this.state.login), () => {
                this.props.history.push("/users");
            });
        }
    }
    render() {
        
        return (
            <Container>
                <Row>
                    <Col className="text-center mt-4 mb-4">
                        <h1>Login to use basic crud application</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input name="username" value={this.state.login.username} onChange={this.handleInputChange} />
                                {this.state.errors.username.length > 0 &&
                                    <div className="alert alert-warning">{this.state.errors.username}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" value={this.state.login.password} onChange={this.handleInputChange} />
                                {this.state.errors.password.length > 0 &&
                                    <div className="alert alert-warning">{this.state.errors.password}</div>}
                            </FormGroup>
                            <FormGroup className="text-right">
                                <Button color="primary" type="submit">Login</Button>
                            </FormGroup>
                        </form>
                    </Col>
                    
                </Row>
            </Container>
            
        );
    }
}
export default HomePage;
