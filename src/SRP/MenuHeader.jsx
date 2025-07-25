
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function MenuHeader() {

    const navigate = useNavigate()
    const location = useLocation()

    const logOut = ()=>{
        sessionStorage.removeItem("TOKEN")
        sessionStorage.removeItem("USER_DATA")
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg mainNavbar">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#"><div className='logo'>SRP</div></a>
                <div>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className={`nav-link ${location.pathname === "/srp/home" ?'active':''}`} aria-current="page" href="#">Tracker</a>
                            </li>
                            <li className="nav-item">
                                <Link to="/srp/tasks" className={`nav-link ${location.pathname === "/srp/tasks" ?'active':''}`} >Tasks</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/srp/bugs" className={`nav-link ${location.pathname === "/srp/bugs" ?'active':''}`} >Bugs</Link>
                            </li>
                        <li className="nav-item dropdown" key="con">
                                <Link to="#" className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span>Configuration</span>
                                </Link>
                                <ul className="dropdown-menu submenu">
                                    <li>
                                        <Link to="/srp/projects" className={`dropdown-item ${location.pathname === "/srp/projects" ?'active':''}`}>Project</Link>
                                    </li>
                                    <li>
                                        <Link to="/srp/user-registration" className={`dropdown-item ${location.pathname === "/srp/user-registration" ?'active':''}`}>User Registration</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div className='ms-2'>
                            <FontAwesomeIcon title="Logout" className='mx-1 text-light' icon={faRightFromBracket} onClick={logOut}/>
                        </div>
                    </div>
                </div>
                
            </div>
        </nav>
    )
}
        
        