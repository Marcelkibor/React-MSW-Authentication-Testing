import storage from '../../app/localStorage';

const LoginRequest = async (username:string, password:string) => {
let response = {
error: '',
};
if (username.trim().length !== 0 && password.trim().length !== 0) {
    try {
        const result = await fetch('openmrs/ws/rest/v1/session', {
        headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password),
        },
        method: 'GET',
        redirect: 'follow',
        });
        const [headers, body] = await Promise.all([
        result.headers,
        result.json(),
        ]);
        if (body.authenticated) {
            storage.saveInfo(body);
            localStorage.setItem('authenticated', body.authenticated);
            localStorage.setItem('Banner', 'true');
            window.location.href = "/"
        } 
        else {
            response.error = 'Invalid username or password';
        }
} 
    catch (e) {
        response.error = 'Network error';
}
  } 
else {
    response.error = 'Please fill in the form';
  }
  return response.error;
};
export default LoginRequest;
