import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import flyteasyLogo from "../assets/img/flyteasy-logo.png";
import LogoutButton from "./LogoutButton";

const HeaderWrapper = () => {
  const [isFixed, setIsFixed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsFixed(true);
        document.body.classList.add('f-nav');
      } else {
        setIsFixed(false);
        document.body.classList.remove('f-nav');
      }
    };

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        console.log('=== HEADER HEIGHT CALCULATION ===');
        console.log('Header height:', height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
        window.dispatchEvent(new CustomEvent('headerHeightChanged', { 
          detail: { height } 
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateHeaderHeight);
    
    // Initial height calculation
    updateHeaderHeight();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateHeaderHeight);
      document.body.classList.remove('f-nav');
    };
  }, []); // Remove isFixed dependency to prevent infinite loop

  return (
    <div ref={headerRef}>
      <section className="header-wrapper-div">
        {!isFixed && (
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
        )}
        <div className="container">
          <div className="header-wrapper">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                  <Link  to='/'>
                  <img src={flyteasyLogo} alt="Flyteasy" />
                </Link>
              </div>
              <div className="col-lg-6 col-md-6">
                {isAuthenticated ? (
                  <LogoutButton />
                ) : (
                  <>
                    <Link to='/login'>
                      <button className="register-btn">Register</button>
                    </Link>
                    <Link to='/login'>
                      <button className="signin-btn">Sign in</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeaderWrapper;
