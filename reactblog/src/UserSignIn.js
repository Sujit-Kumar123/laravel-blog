import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function UserSignIn() {
  const regex = /^[a-z 0-9 A-Z .\- _]+@[a-z]+\.[a-z]{2,3}$/;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const navigate = useNavigate();

  const userLogIn = (e) => {
    e.preventDefault();
    if (validateData(email, password)) {
      const jsonData = {
        email: email,
        password: password,
      };
      axios
        .post(process.env.REACT_APP_API_KEY_URL + "login", jsonData)
        .then((response) => {
          //console.log(response.data);
          let data = { email: email, token: response.data.token };
          localStorage.setItem("blogToken", JSON.stringify(data));
          //navigate("/addPost");
          navigate("/");

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Registration success",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 1500);
        })
        .catch((error) => {
          //console.log(error);
          navigate("/login");
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Your login deny",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };
  function validateData(email, password) {
    if (!email) {
      setEmailError("Email field should not empty.");
      return false;
    } else if (regex.test(email) === false) {
      setEmailError("This is not a valid Email.");
      return false;
    } else if (!password) {
      setPasswordError("Password field should not empty.");
      return false;
    } else if (password.length < 4) {
      setPasswordError("Password length should be gather then 4.");
      return false;
    } else if (password.length >= 16) {
      setPasswordError("Password length should be less then 16.");
      return false;
    } else {
      return true;
    }
  }
  //User login
  //console.log(email, password);
  return (
    <div className="regContainer">
      <div className="row">
        <div
          className=" col-7 registrationBackground"
          style={{
            backgroundImage: `url(${
              process.env.PUBLIC_URL + "./image/RegistrationBack.png"
            })`,
          }}
        >
          <div className="registrationLogo">
            <div className="registrationLogoHome">
              <Link to="/">
                <p>
                  <img
                    src={process.env.PUBLIC_URL + "./Rectangle 6home.png"}
                    alt=""
                  ></img>
                  <img
                    src={process.env.PUBLIC_URL + "./Rectangle 6home.png"}
                    alt=""
                  ></img>
                  <img
                    src={process.env.PUBLIC_URL + "./Rectangle 6home.png"}
                    alt=""
                  ></img>
                  <img
                    src={process.env.PUBLIC_URL + "./Rectangle 6home.png"}
                    alt=""
                  ></img>
                </p>
              </Link>
            </div>
            <img
              src={process.env.PUBLIC_URL + "./image/NoFaceMaskNoEntry.png"}
              alt=""
            ></img>
          </div>
        </div>
        <div className="col-5 registration" style={{ background: "white" }}>
          <h3>
            Welcome to Blog App{" "}
            <img
              src={process.env.PUBLIC_URL + "./image/@cherrrryThumb.png"}
              alt=""
            ></img>{" "}
          </h3>
          <h6>Please sign up - into your account and start the adventure</h6>
          <div>
            <img
              src={process.env.PUBLIC_URL + "./image/VectorQuestionCircle.png"}
              alt=""
            ></img>
            <img
              src={process.env.PUBLIC_URL + "./image/VectorQuestionCurve.png"}
              alt=""
            ></img>
            <img
              src={process.env.PUBLIC_URL + "./image/VectorQuestionDot.png"}
              alt=""
            ></img>
            <p>Admin:admin@demo.com|admin</p>
            <p>Client: client@demo.com|client</p>
          </div>
          <form onSubmit={userLogIn} method="POST">
            {/*<h2></h2> */}
            <span>
              <label>Email</label>
              <br></br>
              <input
                type="text"
                name="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <br />
              <span style={{ color: "red", fontSize: "12px" }}>
                {emailError}
                <br></br>
              </span>
              <label>
                <p>
                  Password{" "}
                  <Link className="forgetPassword"> Forgot password?</Link>
                </p>
              </label>

              <br></br>
              <input
                type="password"
                name="password"
                placeholder="****"
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
              <br />
              <span style={{ color: "red", fontSize: "12px" }}>
                {passwordError}
                <br></br>
              </span>
            </span>
            <p>
              <input type="checkbox" className="remindMe"></input>
              <label>Remember Me</label>
            </p>
            <button className="newblog-btn">Submit</button>
          </form>
          <br></br>

          <p className="logInFooter">
            New on our platform?{" "}
            <Link to="/registration">Create an account</Link>
          </p>

          <p className="logInFooter">
            <hr></hr>
            <p className="registerOr">or</p>
          </p>
          <br></br>
          <p className="logInFooter">
            <Link>
              {" "}
              <img
                src={process.env.PUBLIC_URL + "./image/Rectangle 9Facebook.png"}
                alt=""
              ></img>
              <img
                className="facebook"
                src={process.env.PUBLIC_URL + "./image/VectorFacebook.png"}
                alt=""
              ></img>
            </Link>
            <Link>
              <img
                src={process.env.PUBLIC_URL + "./image/Rectangle 10Twitter.png"}
                alt=""
              ></img>
              <img
                className="twitter"
                src={process.env.PUBLIC_URL + "./image/VectorTwitter.png"}
                alt=""
              ></img>
            </Link>
            <Link>
              <img
                src={process.env.PUBLIC_URL + "./image/Rectangle 11Email.png"}
                alt=""
              ></img>
              <img
                className="email"
                src={process.env.PUBLIC_URL + "./image/VectorEmail.png"}
                alt=""
              ></img>
              <img
                className="emailArrow"
                src={process.env.PUBLIC_URL + "./image/VectorEmailArrow.png"}
                alt=""
              ></img>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default UserSignIn;
