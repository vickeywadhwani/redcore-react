import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import validator from 'validator';
import API from './api';
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: "",
                email: "",
                telephone: "",
                address: "",
                post_code: "",
                city: ""
            },
            userid: "",
            title: "Update",
            errors: {
                name: '',
                email: '',
            },
            formValid: true,
            action: "",
            apiConfig: {
                headers: { 'Authorization': "Bearer " + sessionStorage.getItem('access_token') }
            }
        }
    }
    
    handleInputChange = async event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let { user } = this.state;
        user[name] = value;
        this.setState({ user });
        await this.validateFields();
    }
    validateFields = async event => {
        let errors = this.state.errors;
        errors.name =
            this.state.user.name.length < 5
                ? 'Name must be 5 characters long!'
                : '';
        errors.email =
            !validator.isEmail(this.state.user.email)
            ? 'Email is not valid!'
                : '';
        this.setState({
            errors
        })

        const res = await this.validateForm();
        return res;
    }
    componentDidMount = async event => {
        
        const { action } = this.props.match.params;
        console.log(action);
        this.setState({
            action
        })
        //Get user data from props.location.user
        if (action === "update") {
            const { id } = this.props.match.params;
            this.setState({
                userid: id
            });
            if (this.props.location.hasOwnProperty('user')) {
                this.setState({
                    user: this.props.location.user,
                })
            } else {
                const res = await API.get("users/" + id, this.state.apiConfig);
                this.setState({
                    user: res.data
                })
            }
            
            
        } else {
            //Add new user if id param contains add 
            
            this.setState({
                title: "Add a new user",
            })
        }
        
    }
    handleSubmit = async event => {
        event.preventDefault()
        const formValid = await this.validateFields();
        
        if (formValid) {
            let res = "";
            if (this.state.action === "add") {
                res = await API.post("users/", this.state.user, this.state.apiConfig);
            } else {
                try {
                    await API.put("users/" + this.state.userid, this.state.user, this.state.apiConfig);
                } catch (error) {
                    console.log(error.response);
                }
            }
            console.log(res);
            if (res.status === 204 || res.status === 201)
            this.props.history.push("/users");
           
        }
    }

    //Check validation on form
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
    render() {   
        return (
            <Container>
                <Row className="row">
                    <Col className="text-center mt-4 mb-4">
                        <h1>{this.state.title}</h1>
                    </Col>
                </Row>
                <form onSubmit={this.handleSubmit}>
                    <Row className="row">
                        <Col>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input name="name" value={this.state.user.name} onChange={this.handleInputChange} />
                                {this.state.errors.name.length > 0 &&
                                    <div className="alert alert-warning">{this.state.errors.name}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="telephone">Telephone</Label>
                                <Input name="telephone" value={this.state.user.telephone} onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input name="email" value={this.state.user.email} onChange={this.handleInputChange} />
                                {this.state.errors.email.length > 0 &&
                                    <div className="alert alert-warning">{this.state.errors.email}</div>}
                            </FormGroup>
                        </Col>
                            <Col >
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input name="address" value={this.state.user.address} onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="post_code">Post code</Label>
                                <Input name="post_code" value={this.state.user.post_code} onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="city">City</Label>
                                <Input name="city" value={this.state.user.city} onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup>

                            </FormGroup>
                            <FormGroup className="text-right">
                                <Button color="primary" type="submit">Save</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </form>
            </Container>
        );
    }
}
export default User;