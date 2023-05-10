import EditUserData from '../components/accountTabs/EditUserData';
import MainLayout from '../layout/MainLayout';
import MyShop from '../components/accountTabs/MyShop';

function MyAccount() {
  return (
    <MainLayout>
      <div className="relative min-h-screen">
        <div>
          <section>
            <div className="mx-auto flex max-w-7xl flex-col justify-between px-4 lg:flex-row">
              <MyShop />
              <EditUserData />
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default MyAccount;
