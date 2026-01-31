import './ConfirmationPage.css';
import React from "react";
import { useParams } from 'react-router-dom';
import { ReactComponent as Logo } from '../components/svg/logo.svg';

import { resendSignUpCode, confirmSignUp } from 'aws-amplify/auth';


export default function ConfirmationPage() {
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);

  const params = useParams();

  const resend_code = async () => {
    setErrors('');
    try {
      await resendSignUpCode({ username: email });
      setCodeSent(true);
    } catch (err) {
      console.log(err);
      setErrors(err.message);
    }
  };

  const onsubmit = async (event) => {
    event.preventDefault();
    setErrors('');

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });

      window.location.href = "/";
    } catch (error) {
      setErrors(error.message);
    }

    return false;
  };

  React.useEffect(() => {
    if (params.email) {
      setEmail(params.email);
    }
  }, []);

  return (
    <article className="confirm-article">
      <div className='recover-info'>
        <Logo className='logo' />
      </div>
      <div className='recover-wrapper'>
        <form
          className='confirm_form'
          onSubmit={onsubmit}
        >
          <h2>Confirm your Email</h2>
          <div className='fields'>
            <div className='field text_field email'>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='field text_field code'>
              <label>Confirmation Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          {errors && <div className='errors'>{errors}</div>}

          <div className='submit'>
            <button type='submit'>Confirm Email</button>
          </div>
        </form>
      </div>

      {codeSent
        ? <div className="sent-message">A new activation code has been sent to your email</div>
        : <button className="resend" onClick={resend_code}>Resend Activation Code</button>
      }
    </article>
  );
}