import EditUserData from '../components/accountTabs/EditUserData';
import MainLayout from '../layout/MainLayout';
import MyShop from '../components/accountTabs/MyShop';

function MyAccount() {
  return (
    <MainLayout>
      <div className="relative min-h-screen">
        <div>
          <section>
            <div className="mt-2">
              <EditUserData />
              <MyShop />
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default MyAccount;
