import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import "./Components.css";
import flower from "../assets/rose.png";
import worker from "../assets/worker.png";
import rope from "../assets/rope.png";
import hand from "../assets/hand.png";

function Landing() {
  return (
    <div className="page">
      {/* <img src={hand} className="hand"/> */}
      <Card className=" card max-w-xl">
        <div>
          <h1 className="title text-white">Welcome to</h1>
          <h5 className=" head  text-4xl font-serif font-bold tracking-tight text-white ">
            Kazi-Konnect
          </h5>
        </div>
        <div>
          <p className="font-normal text-white">
            Find trusted service providers or clients near you.
          </p>
          <img src={flower} className="flower ml-20" />
        </div>
        <Button gradientDuoTone="purpleToBlue">
          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Login
            <svg
              className="-mr-1 ml-2 h-4 w-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </Link>
        </Button>
        <p className="text-white text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-purple-700 underline"
          >
            Signup
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Landing;
