import { useContext, useState, ChangeEvent } from 'react';
import { UserContext } from '@context/UserProvider';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { Label } from '@components/UI/label';
import { Switch } from '@components/UI/switch';

type SecurityOptionsKeys = 'HIDE_PRIVEATE_INFO';
type Test = {
  key: 'HIDE_PRIVEATE_INFO';
  name: 'hide_private_information';
  labelName: 'Hide private information';
  value: boolean;
};

type SortOptionObjectType = [string, Test];
type SortOptionObjectTypeTest = { key: string; value: Test };

export default function SecurityPermissions() {
  const { userData } = useContext(UserContext);
  const [availableSettings, setAvailableSettings] = useState<
    Record<SecurityOptionsKeys, Test>
  >({
    HIDE_PRIVEATE_INFO: {
      key: 'HIDE_PRIVEATE_INFO',
      name: 'hide_private_information',
      labelName: 'Hide private information',
      value: userData?.security_settings.hide_private_information || false,
    },
  });

  const securityOptionsArray: SortOptionObjectTypeTest[] = Object.entries(
    availableSettings
  ).map(([key, value]: SortOptionObjectType) => ({
    key,
    value,
  }));

  const changeHandler = async (check: boolean, itemData: Test) => {
    const itemTest = securityOptionsArray.find(
      (item) => item.value.name === itemData.name
    );
    if (itemTest) {
      setAvailableSettings((prevState) => {
        return {
          ...prevState,
          [itemData.key]: { ...prevState[itemTest.value.key], value: check },
        };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_UPDATE,
        body: {
          userEmail: userData?.email,
          fieldKey: itemTest?.value.name,
          fieldValue: check,
        },
      });
    }
  };
  return (
    <div>
      {securityOptionsArray.map((item) => {
        return (
          <div key={item.key} className="flex items-center space-x-2">
            <Label htmlFor={item.key}>{item.value.labelName}</Label>
            <Switch
              id={item.key}
              name={item.key}
              checked={item.value.value}
              onCheckedChange={(e) =>
                changeHandler(e, {
                  key: item.value.key,
                  name: item.value.name,
                  labelName: item.value.labelName,
                  value: item.value.value,
                })
              }
            />
          </div>
        );
      })}
    </div>
  );
}
