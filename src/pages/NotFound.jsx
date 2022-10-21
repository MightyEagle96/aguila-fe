import React from "react";
import errorPage from "./../images/404.png";
export default function NotFound() {
  return (
    <div>
      <div className="container">
        <img src={errorPage} alt="" className="img-fluid" />
      </div>
    </div>
  );
}
