import './RecoverPage.css';
import React from "react";
import {ReactComponent as Logo} from '../components/svg/logo.svg';
import { Link } from "react-router-dom";

// Amplify v6 Auth
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

export default function RecoverPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordAgain, setPasswordAgain] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [formState, setFormState] = React.useState('send_code');

  const onsubmit_send_code = async (event) => {
    event.preventDefault();
    setErrors('');

    resetPassword({ username })
      .then(() => setFormState('confirm_code'))
      .catch((err) => setErrors(err.message));

    return false;
  };

  const onsubmit_confirm_code = async (event) => {
    event.preventDefault();
    setErrors('');

    if (password === passwordAgain) {
      confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword: password
      })
        .then(() => setFormState('success'))
        .catch((err) => setErrors(err.message));
    } else {
      setErrors('Passwords do not match');
    }

    return false;
  };

  const username_onchange = (e) => setUsername(e.target.value);
  const password_onchange = (e) => setPassword(e.target.value);
  const password_again_onchange = (e) => setPasswordAgain(e.target.value);
  const code_onchange = (e) => setCode(e.target.value);

  let el_errors = errors ? <div className='errors'>{errors}</div> : null;

  const send_code = () => (
    <form className='recover_form' onSubmit={onsubmit_send_code}>
      <h2>Recover your Password</h2>
      <div className='fields'>
        <div className='field text_field username'>
          <label>Email</label>
          <input type="text" value={username} onChange={username_onchange} />
        </div>
      </div>
      {el_errors}
      <div className='submit'>
        <button type='submit'>Send Recovery Code</button>
      </div>
    </form>
  );

  const confirm_code = () => (
    <form className='recover_form' onSubmit={onsubmit_confirm_code}>
      <h2>Recover your Password</h2>
      <div className='fields'>
        <div className='field text_field code'>
          <label>Reset Password Code</label>
          <input type="text" value={code} onChange={code_onchange} />
        </div>
        <div className='field text_field password'>
          <label>New Password</label>
          <input type="password" value={password} onChange={password_onchange} />
        </div>
        <div className='field text_field password_again'>
          <label>New Password Again</label>
          <input type="password" value={passwordAgain} onChange={password_again_onchange} />
        </div>
      </div>
      {el_errors}
      <div className='submit'>
        <button type='submit'>Reset Password</button>
      </div>
    </form>
  );

  const success = () => (
    <form>
      <p>Your password has been successfully reset!</p>
      <Link to="/signin" className="proceed">Proceed to Signin</Link>
    </form>
  );

  let form =
    formState === 'send_code'
      ? send_code()
      : formState === 'confirm_code'
      ? confirm_code()
      : success();

  return (
    <article className="recover-article">
      <div className='recover-info'>
        <Logo className='logo' />
      </div>
      <div className='recover-wrapper'>
        {form}
      </div>
    </article>
  );
}