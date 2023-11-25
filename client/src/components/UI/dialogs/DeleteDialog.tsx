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
  openStateHandler: (state: any) => void;
  deleteHandler: () => void;
  disableCondition?: boolean;
  onlyIcon?: boolean;
  targetId?: string;
}

export default function ({
  openState,
  openStateHandler,
  deleteHandler,
  disableCondition = false,
  onlyIcon = false,
  targetId,
}: PropsTypes) {
  return (
    <Dialog
      open={openState}
      onOpenChange={() => openStateHandler(targetId ? null : false)}
    >
      <Button
        onClick={() => openStateHandler(targetId ? targetId : true)}
        variant={'ghost'}
        disabled={disableCondition}
        type="button"
        className="text-red-400 hover:text-red-400"
      >
        {!onlyIcon && <span>Delete</span>}
        <TrashIcon className="h-5 w-5" />
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
          <Button
            variant={'outline'}
            type="button"
            onClick={() => openStateHandler(targetId ? null : false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
