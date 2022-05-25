import React from 'react';
import Popup from 'reactjs-popup';
import logo from './logo_white.png';
import profilePic from './profile_pic.jpg'


const Hero = ({handleLogout, handleEmailUpdate, handlePasswordUpdate, setEmail, email, emailError, password, setPassword, passwordError}) => {
    return (
        <section className='hero'>
            <div className="topNav">
              <img src={logo} width="200" align="left"/>
                <a> Calendar </a>
                <a> SCRUM </a>
                <Popup trigger={<a> Profile </a>} modal nested>
                  {close => (
                    <div className="modal">
                      <div>
                        <button className="close" onClick={close}>
                          &times;
                        </button>
                      </div>
                      <div className="header">
                        Profile
                      </div>
                      <div>
                        <img src={profilePic} width="200px" class="center"/>
                      </div>
                      <div>
                        <div width="50%">
                          <label className="content">
                            E-mail
                          </label>
                          <input type="text" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)}/>
                          <p className='errorMsg'>
                            {emailError}
                          </p>
                          <button className="profileButtons" onClick={handleEmailUpdate}>
                            Update email
                          </button>
                        </div>
                        <div>
                          <label className="content">
                            Password
                          </label>
                          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                          <p className='errorMsg'>
                            {passwordError}
                          </p>
                          <button className="profileButtons" onClick={handlePasswordUpdate}>
                            Update password
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Popup>
                <a onClick={handleLogout}>
                  Logout
                </a>
            </div>
        </section>
    );
}

export default Hero;
