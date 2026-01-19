import './SigninPage.css';
import React from "react";
import { ReactComponent as Logo } from '../components/svg/logo.svg';
import { Link } from "react-router-dom";

import { signIn } from 'aws-amplify/auth';

export default function SigninPage() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState('');

  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');

    try {
      const result = await signIn({
        username: email,
        password: password
      });

      console.log("signin result", result);

      // If MFA or other steps are required
      if (result.nextStep?.signInStep !== "DONE") {
        console.log("Next step:", result.nextStep);
        // You can handle MFA here if needed
        return;
      }

      // User is fully signed in
      const accessToken = result.tokens?.accessToken?.toString();
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }

      window.location.href = "/";

    } catch (error) {
      console.log("Sign-in error:", error);

      if (error.code === 'UserNotConfirmedException') {
        window.location.href = "/confirm";
        return;
      }

      setErrors(error.message || "Sign-in failed");
    }

    return false;
  };

  return (
    <article className="signin-article">
      <div className='signin-info'>
        <Logo className='logo' />
      </div>
      <div className='signin-wrapper'>
        <form 
          className='signin_form'
          onSubmit={onsubmit}
        >
          <h2>Sign into your Cruddur account</h2>
          <div className='fields'>
            <div className='field text_field username'>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='field text_field password'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errors && <div className='errors'>{errors}</div>}

          <div className='submit'>
            <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
            <button type='submit'>Sign In</button>
          </div>
        </form>

        <div className="dont-have-an-account">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    </article>
  );
}