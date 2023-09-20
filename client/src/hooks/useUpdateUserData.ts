import { ChangeEvent } from 'react';
import { AuthorTypes } from '@customTypes/interfaces';
import { UserRoleType } from '@customTypes/types';

export enum UpdateNewDataType {
  Username = 'username',
  Email = 'email',
  Role = 'role',
  Pseudonim = 'pseudonim',
  ShortDescription = 'short_description',
  Quote = 'quote',
}

interface UserNewDataEditTypes {
  newValue: string | UserRoleType;
  user: AuthorTypes;
  updatedField: UpdateNewDataType;
}

export function useEditUserData({
  newValue,
  user,
  updatedField,
}: UserNewDataEditTypes) {
  const userCopy = user;
  switch (updatedField) {
    case UpdateNewDataType.Email: {
      userCopy[updatedField] = newValue;
      return userCopy;
    }
    case UpdateNewDataType.Username:
      userCopy[updatedField] = newValue;
      return user;
    case UpdateNewDataType.Role: {
      userCopy[updatedField] = newValue;
      return userCopy;
    }
    case UpdateNewDataType.Pseudonim:
      userCopy.author_info[updatedField] = newValue;
      return userCopy;
    case UpdateNewDataType.ShortDescription:
      userCopy.author_info[updatedField] = newValue;
      return userCopy;
    default:
      return user;
  }
}
