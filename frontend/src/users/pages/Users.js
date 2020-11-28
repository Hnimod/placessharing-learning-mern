import React, { useState, useEffect } from 'react';

import { useHttpClient } from '../../shared/hooks/fetch-hooks';
import UserList from '../components/UserList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
  const [isLoading, hasError, sendRequest, clearError] = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_API}/users`
      );
      if (response && response.status === 'success') {
        setLoadedUsers(response.data.users);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={hasError} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <UserList items={loadedUsers} />
    </React.Fragment>
  );
};

export default Users;
