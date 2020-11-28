import React from 'react';

import UserItem from './UserItem';
import './UserList.css';

const UserList = (props) => {
  if (props.items.length === 0)
    return (
      <div className="center">
        <h1 style={{ color: 'grey' }}>No users found</h1>
      </div>
    );

  return (
    <ul className="user-list">
      {props.items.map((userItem) => (
        <UserItem
          key={userItem.id}
          id={userItem.id}
          image={userItem.image}
          name={userItem.name}
          placeCount={userItem.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
