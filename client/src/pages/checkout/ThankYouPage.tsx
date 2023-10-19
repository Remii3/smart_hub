import { buttonVariants } from '@components/UI/button';
import MainContainer from '@layout/MainContainer';
import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  return (
    <MainContainer className="flex flex-col items-center justify-center">
      <h3 className="mb-6 pt-8">Thank you!</h3>
      <p className="mb-6">Your order has been submitted.</p>

      <p className="mb-6">Please check your email for further information.</p>
      <div className="pt-3">
        <Link to="/" className={buttonVariants({ variant: 'default' })}>
          Return to main page
        </Link>
      </div>
    </MainContainer>
  );
}
