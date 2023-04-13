import { Dispatch } from 'react';
import { AccountTabsTypes } from '../../types/types';

type PropsTypes = {
  tabName: AccountTabsTypes;
  tabText: string;
  currentTab: string;
  setCurrentTab: Dispatch<React.SetStateAction<AccountTabsTypes>>;
};

function AccountTab({
  tabName,
  tabText,
  currentTab,
  setCurrentTab,
}: PropsTypes) {
  const changeTabHandler = () => {
    setCurrentTab(tabName);
  };

  return (
    <button
      className={`${
        currentTab === tabName
          ? 'bg-primary text-white'
          : 'bg-white text-primary'
      }  whitespace-nowrap rounded-md p-3 text-lg shadow transition-[filter] duration-200 ease-out hover:brightness-90 active:brightness-75`}
      type="button"
      onClick={changeTabHandler}
    >
      {tabText}
    </button>
  );
}

export default AccountTab;
