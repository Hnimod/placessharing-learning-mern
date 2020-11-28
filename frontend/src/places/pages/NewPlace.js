import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/fetch-hooks';
import { useForm } from '../../shared/hooks/form-hooks';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './NewPlace.css';

const NewPlace = (props) => {
  const [isLoading, hasError, sendRequest, clearError] = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formState, formDispatch] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('description', formState.inputs.description.value);
    formData.append('address', formState.inputs.address.value);
    formData.append('image', formState.inputs.image.value);
    formData.append('creator', auth.userId);

    const request = {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: formData,
    };
    const response = await sendRequest(
      `${process.env.REACT_APP_BACKEND_API}/places`,
      request
    );

    if (response.status === 'success') {
      history.push('/');
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={hasError} onClear={clearError} />
      <form
        className="center"
        style={{ width: '100%' }}
        onSubmit={submitHandler}
      >
        <Card style={{ width: '90vw', maxWidth: '60rem', fontSize: '1.5rem' }}>
          <ImageUpload
            className="place-image-upload"
            id="image"
            onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
          />
          <Input
            id="title"
            type="text"
            label="Title"
            onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
            minLength={6}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
            require
          />
          <Input
            id="address"
            type="text"
            label="Address"
            onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
            require
          />
          <Button
            type="submit"
            disabled={!formState.isFormValid}
            style={{ margin: '2rem' }}
          >
            ADD PLACE
          </Button>
        </Card>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
