import React, { useReducer, useEffect } from 'react';
import validator from 'validator';

import './Input.css';

const inputReducer = (state, action) => {
  let valid;
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
      };
    case 'RESET':
      return {
        ...state,
        value: '',
        isValid: false,
        isTouched: false,
        errorText: '',
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    case 'REQUIRE':
      valid = !validator.isEmpty(action.val);
      return {
        ...state,
        isValid: valid,
        errorText: !valid ? 'Cannot be empty' : '',
      };
    case 'MIN_LENGTH':
      valid = action.val.length >= action.minLength;
      return {
        ...state,
        isValid: valid,
        errorText: !valid ? `At least ${action.minLength} characters` : '',
      };
    case 'EMAIL':
      valid = validator.isEmail(action.val);
      return {
        ...state,
        isValid: valid,
        errorText: !valid ? `Please enter an email` : '',
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initValue || '',
    isValid: props.initValid || false,
    isTouched: props.isTouched || false,
    errorText: '',
  });
  const { id, onInputToForm, reset } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    if (onInputToForm) {
      onInputToForm(id, value, isValid);
    }
  }, [onInputToForm, id, value, isValid]);

  useEffect(() => {
    if (reset === 'reset') {
      dispatch({ type: 'RESET' });
    }
  }, [reset]);
  const inputChangeHandler = (event) => {
    dispatch({ type: 'CHANGE', val: event.target.value });
    if (props.require) {
      dispatch({
        type: 'REQUIRE',
        val: event.target.value,
      });
    }
    if (props.minLength) {
      dispatch({
        type: 'MIN_LENGTH',
        val: event.target.value,
        minLength: props.minLength,
      });
    }
    if (props.isEmail) {
      dispatch({
        type: 'EMAIL',
        val: event.target.value,
      });
    }
  };

  const touchHandler = (event) => {
    dispatch({ type: 'TOUCH' });
    inputChangeHandler(event);
  };

  const element =
    props.element === 'textarea' ? (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        value={inputState.value}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
      />
    ) : (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={inputChangeHandler}
        onBlur={touchHandler}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p>{inputState.errorText}</p>
      )}
    </div>
  );
};

export default Input;
