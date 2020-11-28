import React, { useRef, useState, useEffect } from 'react';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const { id, onInputToForm } = props;

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
    onInputToForm(id, file, isValid);
  }, [file, isValid, id, onInputToForm]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      setFile(event.target.files[0]);
      setIsValid(true);
    } else {
      setFile(null);
      setIsValid(false);
    }
  };

  return (
    <div className={props.className} style={props.style}>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="image-upload__preview" onClick={pickImageHandler}>
        {previewUrl && <img src={previewUrl} alt="preview" />}
        {!previewUrl && <p>Please pick your image</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
