import React, { useState, useContext } from 'react';

import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/fetch-hooks';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, hasError, sendRequest, clearError] = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const openDeleteConfirmHandler = () => setShowDeleteConfirm(true);
  const closeDeleteConfirmHandler = () => setShowDeleteConfirm(false);

  const deletePlaceItem = async () => {
    setShowDeleteConfirm(false);
    const response = await sendRequest(
      `${process.env.REACT_APP_BACKEND_API}/places/${props.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    if (!response) {
      props.onDelete(props.id);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={hasError} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        headerClass="place-item__modal-header"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-footer"
        header={<h2>{props.address}</h2>}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinate} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeleteConfirm}
        onCancel={closeDeleteConfirmHandler}
        header={<h2>Are you sure?</h2>}
        footer={
          <React.Fragment>
            <Button inverse onClick={closeDeleteConfirmHandler}>
              CANCEL
            </Button>
            <Button danger onClick={deletePlaceItem}>
              DELETE
            </Button>
          </React.Fragment>
        }
        headerClass="place-item__modal-header"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-footer"
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          cannot be undone thereafter
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creator && (
              <React.Fragment>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={openDeleteConfirmHandler}>
                  DELETE
                </Button>
              </React.Fragment>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
