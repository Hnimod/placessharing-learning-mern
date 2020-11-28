import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/fetch-hooks';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';

const UserPlaces = (props) => {
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [isLoading, hasError, sendRequest, clearError] = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API}/places/user/${userId}`
      );
      if (response && response.status === 'success') {
        setLoadedPlaces(response.data.places);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={hasError} onClear={clearError} />
      {loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
