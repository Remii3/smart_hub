import EditUserData from '../components/accountTabs/EditUserData';
import MyShop from '../components/accountTabs/MyShop';

export default function MyAccount() {
  return (
    <div className="relative mb-16 min-h-screen">
      <div>
        <section>
          <div className="mx-auto flex flex-col justify-center gap-8 px-4 lg:flex-row">
            <MyShop />
            <EditUserData />
          </div>
        </section>
      </div>
    </div>
  );
}
