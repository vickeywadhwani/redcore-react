import React, { Component } from 'react';
import { Table, Button, Container, Row, Col } from 'reactstrap';
import API from './api';
import { Link } from 'react-router-dom';
import auth from "./auth";
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
class Users extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            apiConfig: {
                headers: { 'Authorization': "Bearer " + sessionStorage.getItem('access_token') }
            },
            loading:true
        }
        
        this.logout = this.logout.bind(this);
    }
    
    componentDidMount = async event => { 
        // Promise is resolved and value is inside of the res const.
        try {
            const res = await API.get("users", this.state.apiConfig);
            const users = res.data;
            this.setState({ users });
            this.setState({ loading: false });
        } catch (error) {
            
        }
        
    }
    remove = async userid => {
        if (window.confirm("Are you sure?")) {
            try {
                await API.delete( "users/" + userid);
                this.setState({
                    users: this.state.users.filter((user) => userid !== user.userid)
                });
            } catch (error) {
                //console.log(error.response);
                alert(error.response.statusText);
            }
        }        
       
    }
    logout() {
       
        auth.logout(() => {
            this.props.history.push("/");
        });
    }
    render() {
        let users = this.state.users.map((user) => {
            return (
                <tr key={user.userid}>
                    <td>{user.userid}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telephone}</td>
                    <td>{user.address}, {user.post_code}, {user.city}</td>
                    <td>
                        <Link to={
                            {
                                pathname: "/user/update/" + user.userid,
                                user
                            }
                        }>
                            <Button color="success" size="sm" className="mr-2">Edit</Button>
                        </Link>
                        <Button color="danger" size="sm" onClick={() => this.remove(user.userid)}>Delete</Button>
                    </td>
                </tr>
            );

        })
        return (
            <Container>
                <Row className="mt-4 mb-4">     
                    <Col className="text-center">
                        <h1>Users</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Telephone</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="6" align="center">
                                        <div className='sweet-loading'>
                                            <ClipLoader
                                                sizeUnit={"px"}
                                                size={50}
                                                color={'#123abc'}
                                                loading={this.state.loading}
                                            />
                                        </div> 
                                    </td>
                                </tr>
                                {users}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col className="col-md-12 text-right mt-4">
                        
                        <Link to="/user/add">
                            <Button color="primary">Add user</Button>
                        </Link>
                        
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default Users;