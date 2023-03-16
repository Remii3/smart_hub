import AccountForm from '../components/account/AccountForm';

function RegisterPage() {
  return (
    <div>
      <section>{/* img */}</section>
      <section>
        <AccountForm verificationType="register" />
      </section>
    </div>
  );
}

export default RegisterPage;
