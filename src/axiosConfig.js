import axios, {AxiosError} from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_HTTP_ADDRESS,
});

export { AxiosError };

export default instance;
