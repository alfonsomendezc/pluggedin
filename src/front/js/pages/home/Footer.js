import React from 'react';
import './home.css';
import Logo from "../../../img/Logo.png";
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>

      <div class='social-media'>
        <p style={{color:"white"}} className="pt-2">© Plugged In. This website is for practice and educational purposes. All content displayed is used under fair use or with proper attribution to respective owners. If you believe content infringes your rights, please contact us."</p>
        <div class='social-media-wrap'>
          <div class='footer-logo'>
              <img src={Logo} alt="Plugged-In" className="navbar-logo" />
          </div>
          <small class='website-rights'>Alfonso Mendez Caraballo © 2023 // With the help of RAWG.API © 2023</small>
          <div class='social-icons'>
            
            <a
              href='https://www.linkedin.com/in/alfonsomendezc/' style={{ fontSize: '25px' }}
            >
              <i class='fab fa-linkedin' />
            </a>
            <a href='https://github.com/alfonsomendezc' style={{ fontSize: '25px' }}>
          <i className='fab fa-github' />
        </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;