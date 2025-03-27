import axios from 'axios';

const axiosClient = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
});

axiosClient.defaults.withCredentials = true;

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    axiosClient.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export default axiosClient;
