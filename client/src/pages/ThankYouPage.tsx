import { buttonVariants } from '@components/UI/button';
import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="pb-6 pt-8">Thank you!</h3>
      <p className="py-3">Your order has been submitted.</p>

      <p className="py-3">Please check your email for further information.</p>
      <Link to="/" className={buttonVariants({ variant: 'default' })}>
        Return to main page
      </Link>
    </div>
  );
}
