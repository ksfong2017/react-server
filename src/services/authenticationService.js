import axios from 'axios';

import jwt_decode from "jwt-decode";

const LOGIN_API = "http://localhost:5000/api/login"
const LOGIN_CRED_USERNAME = ""
const LOGIN_CRED_PASSWORD = ''
class AuthService {
  async login(username, password) {
    const res1 = await axios.post(LOGIN_API, {
      username: username,
      password: password
    })
      const resData = res1.data;
      if (resData) {
        var jwt = jwt_decode(resData);
        console.log(jwt);
        localStorage.setItem("user", JSON.stringify(resData));
        return resData;
      } else {
        console.log("bad response")
        return resData;
      }
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();