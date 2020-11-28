import { useReducer, useCallback } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: { value: action.value, isValid: action.isValid },
        },
      };
    case 'SET_DATA':
      return {
        inputs: action.formState.inputs,
        isFormValid: action.formState.isFormValid,
      };
    case 'CHECK_FORM_VALID':
      let valid = true;
      for (const inputId in state.inputs) {
        valid = valid && state.inputs[inputId].isValid;
      }
      return {
        ...state,
        isFormValid: valid,
      };
    default:
      return state;
  }
};

export const useForm = (initInputs, initIsFormValid) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initInputs,
    isFormValid: initIsFormValid,
  });

  const inputChangeHandler = useCallback((id, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', id, value, isValid });
    dispatch({ type: 'CHECK_FORM_VALID' });
  }, []);

  const setFormData = useCallback((formState) => {
    dispatch({ type: 'SET_DATA', formState });
  }, []);

  const formDispatch = useCallback(
    (action) => {
      switch (action.type) {
        case 'INPUT_CHANGE':
          return inputChangeHandler;
        case 'SET_DATA':
          return setFormData(action.formState);
        default:
          return new Error('Unhandled action');
      }
    },
    [inputChangeHandler, setFormData]
  );

  return [formState, formDispatch];
};
