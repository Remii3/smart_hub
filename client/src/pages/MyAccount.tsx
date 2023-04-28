import { useState } from 'react';
import AccountTab from '../components/UI/Tabs/AccountTab';
import EditUserData from '../components/accountTabs/EditUserData';
import MainLayout from '../layout/MainLayout';
import MyShop from '../components/accountTabs/MyShop';

function MyAccount() {
  const [currentTab, setCurrentTab] = useState('personalInfo');

  const tabsList = [
    { tabName: 'personalInfo', tabText: 'Personal Info' },
    { tabName: 'myShop', tabText: 'My Shop' },
    { tabName: 'history', tabText: 'History' },
  ];
  return (
    <MainLayout>
      <div className="relative h-screen w-full bg-gray-100">
        <section className="flex min-h-screen w-full flex-col rounded-md bg-white p-10 sm:flex-row">
          <div className="relative border-b border-gray-200 pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-10">
            <ul className="flex flex-row flex-wrap gap-5 sm:flex-col">
              {tabsList.map((tab, id) => (
                <AccountTab
                  // eslint-disable-next-line react/no-array-index-key
                  key={id}
                  tabName={tab.tabName}
                  tabText={tab.tabText}
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                />
              ))}
            </ul>
          </div>
          <div className="relative pt-5 sm:pl-10 sm:pt-0">
            <h3 className="pb-5">My account</h3>
            {currentTab === 'personalInfo' && <EditUserData />}
            {currentTab === 'myShop' && <MyShop />}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default MyAccount;
