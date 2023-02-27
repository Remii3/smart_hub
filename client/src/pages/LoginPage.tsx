import AccountForm from '../components/account/AccountForm';

function LoginPage() {
  return (
    <div>
      <section>{/* img */}</section>
      <section>
        <AccountForm verificationType='login' />
      </section>
    </div>
  );
}

export default LoginPage;
