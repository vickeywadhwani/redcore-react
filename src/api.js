import axios from 'axios';

export default axios.create({
    baseURL: `http://localhost:50514/api/`
});