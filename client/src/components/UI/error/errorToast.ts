import { toast } from '../use-toast';

export default function errorToast(message: string) {
  toast({
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description: message,
  });
}
