import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog';

interface PropsTypes {
  openState: boolean;
  openStateHandler: (state: any) => void;
  deleteHandler: () => void;
  targetId?: string;
  children: React.ReactNode;
  loadingCondition?: boolean;
}

export default function ({
  openState,
  loadingCondition,
  openStateHandler,
  deleteHandler,
  targetId,
  children,
}: PropsTypes) {
  return (
    <Dialog
      open={openState}
      onOpenChange={() => openStateHandler(targetId ? null : false)}
    >
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Deleting this will permamently remove the item from the database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant={'destructive'}
            onClick={() => deleteHandler()}
            className="rounded-xl relative"
          >
            {loadingCondition && <LoadingCircle type="destructive" />}
            <span className={`${loadingCondition && 'invisible'}`}>Delete</span>
          </Button>
          <Button
            variant={'outline'}
            type="button"
            className="rounded-xl"
            onClick={() => openStateHandler(targetId ? null : false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
