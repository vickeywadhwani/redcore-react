import API from './api';

class Auth {
    constructor() {
        
        this.isauthenticated = false;
        this.config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
    }

    login(loginCredentials,cb) {
        API.post("token", loginCredentials, this.config)
            .then((res) => {
                
                if (res.data.hasOwnProperty('access_token')) {
                    sessionStorage.setItem('access_token', res.data.access_token);
                    this.isauthenticated = true;
                    cb();
                }
                
            })
            .catch((err) => {

            })  
    }
    logout(cb) {
        sessionStorage.removeItem('access_token');
        this.isauthenticated = false;
        cb();
    }

    isAuthenticated() {
        
        if (sessionStorage.getItem('access_token') !== null) {
            this.isauthenticated = true;
            
        } 
        
        return this.isauthenticated;
         
    }
    
}
export default new Auth();