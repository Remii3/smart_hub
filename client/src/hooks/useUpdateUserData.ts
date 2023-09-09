import axios from 'axios';
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

interface UseUserNewDataTypes {
  userEmail: string;
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  updatedField: UpdateNewDataType;
}

interface UserNewDataEditTypes {
  newValue: string | UserRoleType;
  user: AuthorTypes;
  updatedField: UpdateNewDataType;
}

export async function useUploadUserData({
  userEmail,
  e,
  updatedField,
}: UseUserNewDataTypes) {
  try {
    switch (updatedField) {
      case UpdateNewDataType.Email: {
        await axios.post('/user/newData', {
          userEmail,
          fieldKey: updatedField,
          newValue: e.target.value,
        });
        break;
      }
      case UpdateNewDataType.Username:
        await axios.post('/user/newData', {
          userEmail,
          fieldKey: updatedField,
          newValue: e.target.value,
        });
        break;
      case UpdateNewDataType.Role:
        await axios.post('/user/newData', {
          userEmail,
          fieldKey: updatedField,
          newValue: e.target.value,
        });
        break;
      case UpdateNewDataType.Pseudonim:
        await axios.post('/user/newData', {
          userEmail,
          fieldKey: `author_info.${updatedField}`,
          newValue: e.target.value,
        });
        break;
      case UpdateNewDataType.ShortDescription:
        await axios.post('/user/newData', {
          userEmail,
          fieldKey: `author_info.${updatedField}`,
          newValue: e.target.value,
        });
        break;
      default:
        break;
    }

    const response = await axios.get('/admin/users');

    return { updatedUserData: response.data, error: null };
  } catch (err: unknown) {
    return { updatedUserData: null, error: err.response.data };
  }
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
