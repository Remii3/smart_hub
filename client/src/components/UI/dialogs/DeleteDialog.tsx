import { TrashIcon } from '@radix-ui/react-icons';
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
  openStateHandler: (state: boolean) => void;
  deleteHandler: () => void;
}

export default function ({
  openState,
  openStateHandler,
  deleteHandler,
}: PropsTypes) {
  return (
    <Dialog open={openState} onOpenChange={() => openStateHandler(false)}>
      <Button
        onClick={() => openStateHandler(true)}
        variant={'destructive'}
        type="button"
      >
        Delete
        <TrashIcon className="h-6 w-6" />
      </Button>
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
          >
            Delete
          </Button>
          <Button variant={'ghost'} type="button">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
