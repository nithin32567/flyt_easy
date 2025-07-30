import React from "react";
import flyteasyLogo from "../assets/img/flyteasy-logo.png";
const HeaderWrapper = () => {
  return (
    <div>
      {" "}
      <section className="header-wrapper-div">
        <div className="header-topsection">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <p>Book flights &amp; hotels in seconds</p>
              </div>
              <div className="col-lg-6 col-md-6">
                <ul className="socialmedia-icons">
                  <li>
                    <a href="#" className="fb" target="_blank">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="li" target="_blank">
                      <i className="fab fa-linkedin-in" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="tw" target="_blank">
                      <i className="fa-brands fa-x-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="in" target="_blank">
                      <i className="fab fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="em" target="_blank">
                      <i className="fa-regular fa-envelope" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="header-wrapper">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <a href="#">
                  <img src={flyteasyLogo} alt="Flyteasy" />
                </a>
              </div>
              <div className="col-lg-6 col-md-6">
                <button className="register-btn">register</button>
                <button className="signin-btn">Sign in</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeaderWrapper;
