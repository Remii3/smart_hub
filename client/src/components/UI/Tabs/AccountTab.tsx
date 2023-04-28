import { Dispatch } from 'react';

type PropsTypes = {
  tabName: string;
  tabText: string;
  currentTab: string;
  setCurrentTab: Dispatch<React.SetStateAction<string>>;
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
          ? 'border-blue-600  text-blue-600   dark:border-blue-500 dark:text-blue-500'
          : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'
      } group inline-flex rounded-t-lg border-b-2 p-4 transition duration-200 ease-out`}
      type="button"
      onClick={changeTabHandler}
    >
      {tabText}
    </button>
  );
}

export default AccountTab;
