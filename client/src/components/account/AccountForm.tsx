import { useNavigate } from 'react-router-dom';

type AccountFormType = {
  verificationType: string;
};
function AccountForm({ verificationType }: AccountFormType) {
  const navigate = useNavigate();
  const renavigateHandler = (destination: string) => {
    navigate(`/account/${destination}`);
  };
  return (
    <div>
      <form>
        <div>
          <input type='email' />
          {verificationType === 'register' && <input type='text' />}
          <input type='password' />
        </div>
        <div>
          <button>
            {verificationType === 'register' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </form>
      <div>
        <div />
        <span>or</span>
        <div />
      </div>
      <div>
        <button>Google</button>
      </div>
      {verificationType === 'register' ? (
        <div>
          Already have an account?
          <button onClick={() => renavigateHandler('login')}>Log in</button>
        </div>
      ) : (
        <div>
          Don&apos;t have an account?
          <button onClick={() => renavigateHandler('register')}>Sign up</button>
        </div>
      )}
    </div>
  );
}

export default AccountForm;
