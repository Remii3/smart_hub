import EditUserData from '../components/myAccount/EditUserData';
import MyShop from '../components/myAccount/MyShop';

export default function MyAccount() {
  return (
    <div className="relative mb-16 min-h-screen">
      <div>
        <section>
          <div className="mx-auto flex max-w-7xl flex-col justify-center gap-8 px-2 lg:flex-row">
            <MyShop />
            <EditUserData />
          </div>
        </section>
      </div>
    </div>
  );
}
