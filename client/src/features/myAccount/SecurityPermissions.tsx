import axios from 'axios';
import { useContext, useState, ChangeEvent } from 'react';
import { UserContext } from '@context/UserProvider';
import { usePostAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';

export default function SecurityPermissions() {
  const { userData } = useContext(UserContext);
  const [availableSettings, setAvailableSettings] = useState({
    options: [
      {
        name: 'hide_private_information',
        labelName: 'Hide private information',
        value: userData?.security_settings.hide_private_information,
      },
    ],
  });

  const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const index = availableSettings.options.findIndex(
      (item) => item.name === e.target.name
    );
    const currentItem = {
      name: e.target.name,
      labelName: availableSettings.options[index].labelName,
      value: e.target.checked,
    };
    setAvailableSettings((prevState) => {
      return {
        ...prevState,
        options: [
          ...prevState.options.slice(0, index),
          currentItem,
          ...prevState.options.slice(index + 1, prevState.options.length),
        ],
      };
    });

    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: {
        userEmail: userData?.email,
        fieldKey: currentItem.name,
        fieldValue: currentItem.value,
      },
    });
  };
  return (
    <div>
      {availableSettings.options.map((item) => {
        return (
          <label key={item.name}>
            {item.labelName}
            <input
              type="checkbox"
              name={item.name}
              checked={item.value}
              onChange={(e) => changeHandler(e)}
              className="ml-1"
            />
          </label>
        );
      })}
    </div>
  );
}
