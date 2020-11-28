import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/fetch-hooks';
import { useForm } from '../../shared/hooks/form-hooks';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UpdatePlace = (props) => {
  const [isLoading, hasError, sendRequest, clearError] = useHttpClient();
  const placeId = useParams().placeId;
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [loadedPlace, setLoadedPlace] = useState();
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
    },
    false
  );
  useEffect(() => {
    const fetchPlace = async () => {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API}/places/${placeId}`
      );

      const newFormState = {
        inputs: {
          title: {
            value: response.place.title,
            isValid: true,
          },
          description: {
            value: response.place.description,
            isValid: true,
          },
          address: {
            value: response.place.address,
            isValid: true,
          },
        },
        isFormValid: true,
      };
      formDispatch({ type: 'SET_DATA', formState: newFormState });
      setLoadedPlace(response.place);
    };

    fetchPlace();
  }, [sendRequest, placeId, formDispatch]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (formState.isFormValid) {
      const updatePlace = {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
      };
      const request = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(updatePlace),
      };

      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API}/places/${placeId}`,
        request
      );

      if (response.status === 'success') {
        history.push(`/${loadedPlace.creator}/places`);
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={hasError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedPlace && (
        <form
          className="center"
          style={{ width: '100%' }}
          onSubmit={submitHandler}
        >
          <Card
            style={{ width: '90vw', maxWidth: '60rem', fontSize: '1.5rem' }}
          >
            <Input
              id="title"
              type="text"
              label="Title"
              initValue={loadedPlace.title}
              initValid={true}
              onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
              minLength={6}
            />
            <Input
              id="description"
              element="textarea"
              label="Description"
              initValue={loadedPlace.description}
              initValid={true}
              onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
              require
            />
            <Input
              id="address"
              type="text"
              label="Address"
              initValue={loadedPlace.address}
              initValid={true}
              onInputToForm={formDispatch({ type: 'INPUT_CHANGE' })}
              require
            />
            <Button
              type="submit"
              style={{ margin: '2rem' }}
              disabled={!formState.isFormValid}
            >
              EDIT PLACE
            </Button>
          </Card>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
