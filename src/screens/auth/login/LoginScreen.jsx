//::================================>>Core library<<================================::
import { useState } from "react";
//::================================================================================::

//::================================>>Third party<<=================================::
import { message } from "antd";
//::================================================================================::

//::===============================>>Custom library<<===============================::
import image from "../../../assets/images/Login.png";
import "./LoginScreen.scss";
import { saveToken } from "../../../utils/help/help";
import authRequest from "../../../services/authRequest";
//::================================================================================::
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //::==>> handle login function
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const data = await authRequest("auth/signIn", {
        email,
        password,
      });
      //::==>> save data to localstorage
      saveToken(data.accessToken, data.refreshToken, data.user.roleId);
      //::==>> redirect back
      window.location.href = "/";
    } catch (error) {
      message.error(error.response.data.message);
    }
  };
  return (
    <div className="wrapper">
      <div className="container">
        <div className="image-container">
          <img src={image} alt="Person with laptop" />
        </div>
        <div className="form-container">
          <h2>Sign In</h2>
          <p>Unlock your world.</p>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="Enter you password"
                required
              />
            </div>
            <button type="submit" className="sign-in-btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
