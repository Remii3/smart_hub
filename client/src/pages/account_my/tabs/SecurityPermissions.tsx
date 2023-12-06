import { useContext, useState } from 'react';
import { UserContext } from '@context/UserProvider';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { Label } from '@components/UI/label';
import { Switch } from '@components/UI/switch';

type SecurityOptionNames = 'hidePrivateInformation';
interface SecurityOptionType {
  name: SecurityOptionNames;
  labelName: string;
  value: boolean;
}

export default function SecurityPermissions() {
  const { userData, fetchUserData } = useContext(UserContext);
  const initialData = [
    {
      name: 'hidePrivateInformation',
      labelName: 'Hide private information',
      value: userData.data!.securitySettings.hidePrivateInformation || false,
    },
  ] as SecurityOptionType[];

  const [availableSettings, setAvailableSettings] = useState(initialData);

  const changeHandler = async (
    check: boolean,
    selectedOptionName: SecurityOptionNames
  ) => {
    if (!selectedOptionName) return;
    const updatedData = availableSettings.map((item) => {
      if (item.name === selectedOptionName) {
        return { ...item, value: check };
      }
      return item;
    });
    setAvailableSettings(updatedData);
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: {
        _id: userData.data?._id,
        dirtyData: {
          selectedOptionName: check,
        },
      },
    });
    fetchUserData();
  };
  return (
    <div>
      <h4 className="mb-4">Security options</h4>
      <div className="px-1">
        {availableSettings.map((item) => {
          return (
            <div key={item.name} className="flex items-center space-x-2">
              <Label htmlFor={item.name}>{item.labelName}</Label>
              <Switch
                id={item.name}
                name={item.name}
                checked={item.value}
                onCheckedChange={(e) => changeHandler(e, item.name)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
