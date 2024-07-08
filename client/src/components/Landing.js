import React from "react";
import "./Landing.css";
import { Link } from "react-router-dom";
// import { Button } from "flowbite-react";
import LandingPageImage from "../../assets/LandingPageImage.png";

function Landing() {
  return (
    <>
      <div className="landing-page background">
        <div className="landing-page-title">
          <h1>Welcome!</h1>
          <h2>Find Trusted Service Providers or Clients Near You!</h2>
        </div>
        <div className="landing-page-image">
          <img src={LandingPageImage} alt="" />
        </div>
        <div className="get-started-message">
          <p>Get started by logging in</p>
        </div>

        <Link to="/login">
          <div className="get-started">Login</div>
        </Link>

        <div className="dont-have-account">
          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Landing;

