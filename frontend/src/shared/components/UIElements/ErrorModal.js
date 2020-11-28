import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';
import './ErrorModal.css';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header={<h2>An Error Occured!</h2>}
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
      style={{ fontSize: '1.5rem', maxWidth: '60rem' }}
      footerClass="error-modal__footer"
      contentClass="error-modal__content"
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
