import React, { useState, useContext, useEffect } from 'react';
import { useForm } from '../../shared/hooks/form-hooks';
import { useHttpClient } from '../../shared/hooks/fetch-hooks';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const initLoginForm = {
  emailLogin: {
    value: '',
    isValid: false,
  },
  passwordLogin: {
    value: '',
    isValid: false,
  },
};
const initSignupForm = {
  nameSignup: {
    value: '',
    isValid: false,
  },
  emailSignup: {
    value: '',
    isValid: false,
  },
  passwordSignup: {
    value: '',
    isValid: false,
  },
  imageSignup: {
    value: null,
    isValid: false,
  },
};

const Auth = (props) => {
  const auth = useContext(AuthContext);

  const [isLoading, hasError, sendRequest, clearError] = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [resetLogin, setResetLogin] = useState('');
  const [resetSignup, setResetSignup] = useState('');

  const [loginFormState, loginFormDispatch] = useForm(initLoginForm, false);
  const [signupFormState, signupFormDispatch] = useForm(initSignupForm, false);

  useEffect(() => {
    if (!isLoginMode) {
      signupFormDispatch({
        type: 'SET_DATA',
        formState: { inputs: initSignupForm, isFormValid: false },
      });
      setResetLogin('');
      setResetSignup('reset');
    } else {
      loginFormDispatch({
        type: 'SET_DATA',
        formState: { inputs: initLoginForm, isFormValid: false },
      });
      setResetLogin('reset');
      setResetSignup('');
    }
  }, [isLoginMode, signupFormDispatch, loginFormDispatch]);

  const toggleLoginMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const loginSubmitHandler = async (event) => {
    event.preventDefault();

    const loginData = {
      email: loginFormState.inputs.emailLogin.value,
      password: loginFormState.inputs.passwordLogin.value,
    };

    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    };

    const response = await sendRequest(
      `${process.env.REACT_APP_BACKEND_API}/users/login`,
      request
    );

    if (response && response.status === 'success') {
      auth.login(response.data.user.id, response.token);
    }
  };

  const signupSubmitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', signupFormState.inputs.nameSignup.value);
    formData.append('email', signupFormState.inputs.emailSignup.value);
    formData.append('password', signupFormState.inputs.passwordSignup.value);
    formData.append('image', signupFormState.inputs.imageSignup.value);
    const request = {
      method: 'POST',
      headers: {},
      body: formData,
    };

    const response = await sendRequest(
      `${process.env.REACT_APP_BACKEND_API}/users/signup`,
      request
    );

    if (response && response.status === 'success') {
      auth.login(response.data.user.id, response.token);
    }
  };

  const loginForm = (
    <form
      id="login"
      className="center"
      style={{ width: '100%' }}
      onSubmit={loginSubmitHandler}
    >
      <Card style={{ width: '90vw', maxWidth: '40rem', fontSize: '1.5rem' }}>
        <Input
          id="emailLogin"
          type="text"
          label="Email"
          reset={resetLogin}
          onInputToForm={loginFormDispatch({ type: 'INPUT_CHANGE' })}
          require
        />
        <Input
          id="passwordLogin"
          type="password"
          label="Password"
          reset={resetLogin}
          onInputToForm={loginFormDispatch({ type: 'INPUT_CHANGE' })}
          require
        />
        <Button
          type="submit"
          disabled={!loginFormState.isFormValid}
          style={{ margin: '2rem' }}
        >
          LOGIN
        </Button>
      </Card>
    </form>
  );

  const signupForm = (
    <form
      id="signup"
      className="center"
      style={{ width: '100%' }}
      onSubmit={signupSubmitHandler}
    >
      <Card style={{ width: '90vw', maxWidth: '40rem', fontSize: '1.5rem' }}>
        <Input
          id="nameSignup"
          type="text"
          label="Name"
          reset={resetSignup}
          onInputToForm={signupFormDispatch({ type: 'INPUT_CHANGE' })}
          require
        />
        <Input
          id="emailSignup"
          type="email"
          label="Email"
          reset={resetSignup}
          onInputToForm={signupFormDispatch({ type: 'INPUT_CHANGE' })}
          isEmail
        />
        <Input
          id="passwordSignup"
          type="password"
          label="Password"
          reset={resetSignup}
          onInputToForm={signupFormDispatch({ type: 'INPUT_CHANGE' })}
          minLength={6}
        />
        <ImageUpload
          id="imageSignup"
          className="signup-upload"
          onInputToForm={signupFormDispatch({ type: 'INPUT_CHANGE' })}
        />
        <Button
          type="submit"
          disabled={!signupFormState.isFormValid}
          style={{ margin: '2rem' }}
        >
          SIGNUP
        </Button>
      </Card>
    </form>
  );

  return (
    <React.Fragment>
      <ErrorModal error={hasError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {isLoginMode ? loginForm : signupForm}
      <div className="center" style={{ width: '100%', marginTop: '2rem' }}>
        <Card style={{ width: '90vw', maxWidth: '40rem', fontSize: '1.5rem' }}>
          <Button inverse style={{ margin: '2rem' }} onClick={toggleLoginMode}>
            SWITCH TO {!isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Auth;
