
// const API_URL = 'http://localhost:3000/user/v1';
const API_URL = "https://6jg8vt57-3000.inc1.devtunnels.ms/user/v1"

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/api_login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.data[1]);
        return data;
    }
    alert(data.message);
    return null;
};

export const register = async (username, email, password, firebaseUid) => {
    const response = await fetch(`${API_URL}/api_register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, firebaseUid })
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    }
    alert(data.message);
    return null;
};

export const signupWithGoogles = async(idToken)=>{
    const response = await fetch(`${API_URL}/api_googleSignup`,{
        method : 'POST',
        headers :  { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
    })
    const data = await response.json()
    if(response.ok){
        return data
    }
    alert("Sign Up With Google Failed")
    return null
}

export const changePassword = async (password) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api_change_password`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'auth': token
        },
        body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (response.ok) {
        alert('Password changed successfully!');
        return data;
    }
    alert(data.message);
    return null;
};

export const verifyUserEmail = async (idToken) => {
  const response = await fetch(`${API_URL}/api_verify_email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body : JSON.stringify({idToken})
  });
  const data = await response.json();
  return response.ok ? data : null;
};
