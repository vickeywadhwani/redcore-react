import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import HomePage from './homepage';
import Users from './users';
import User from './user';
import { ProtectedRoute } from "./protectedroute";
import auth from "./auth";
class App extends Component {
    render() {
        let button = "";
        if (auth.isAuthenticated()) {
            button = <Row>
                <Col className="text-right mt-4 mb-4">
                    <Button color="primary" onClick={this.logout}>Logout</Button>
                </Col>
            </Row>
        } 
        return (
            <div className="App container">
                {button}
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <ProtectedRoute exact path="/users" component={Users} />
                    <ProtectedRoute exact path="/user/:action/:id" component={User} />
                    <ProtectedRoute exact path="/user/:action" component={User} />
                    <Route path="*" component={() => "404 NOT FOUND"} />
                </Switch>
            </div>
        );
    }
}
export default App;