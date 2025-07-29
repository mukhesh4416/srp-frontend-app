import React, { useState } from 'react';
import './LoginPage.css';
import { useDispatch } from 'react-redux';
import { showToastMessage } from '../Stores/Slices/srpSlice';
import { SRP_URL } from '../global';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ userName: '', password: '' });
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const userLogin = async() => {
    try{
      let data = {
        userName:form.userName,
        password:form.password
      }
      const result = await axios.post( SRP_URL  + `srp/loginUser`,data);
        if(result.data){
            sessionStorage.setItem("USER_DATA",JSON.stringify(result.data))
            sessionStorage.setItem("TOKEN",true)
            navigate('/srp/home');
        }else{
          window['TOKEN'] = false
          dispatch(showToastMessage({type:'danger',msg:'Invalid Credentials',content:`User Name or Password Incorrect`}))
        }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <div className="login-container">
      <div className="row justify-content-center w-100">
        <div className="col-lg-4 col-md-6 col-sm-8 col-12">
          <form className="login-card">
            <div className='logo'>SRP</div>
            <p>Please login to your account</p>
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              value={form.userName}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="login-footer">
              <button type="button" className='mb-2' onClick={userLogin}>Login</button>
              <span style={{color:'#666'}}>Don't have an account?</span> <a href="#">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
