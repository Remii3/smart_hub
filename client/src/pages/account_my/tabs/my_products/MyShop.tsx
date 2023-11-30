import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '@context/UserProvider';
import MyProducts from './MyProducts';
import { Button } from '@components/UI/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/UI/dialog';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useToast } from '@components/UI/use-toast';
import errorToast from '@components/UI/error/errorToast';

export default function MyShop() {
  const [productsQuantity, setProductsQuantity] = useState<null | number>(null);
  const { userData, fetchUserData } = useContext(UserContext);
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState(false);
  if (!userData.data) return <p>Please log in</p>;

  const fetchData = useCallback(async () => {
    if (!userData.data) return;
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_QUANTITY,
      params: { authorId: userData.data._id },
    });
    if (error) {
      return errorToast(error);
    }
    setProductsQuantity(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const deleteAllItemsHandler = async () => {
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_DELETE_ALL,
      body: { userId: userData.data && userData.data._id },
    });
    if (error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
    fetchUserData();
    setDeleteDialog(false);
  };
  return (
    <div className="relative px-3">
      {productsQuantity && productsQuantity > 0 && (
        <Dialog open={deleteDialog} onOpenChange={() => setDeleteDialog(false)}>
          <Button
            type="button"
            className="absolute right-3 top-0"
            variant={'destructive'}
            onClick={() => setDeleteDialog(true)}
          >
            Delete all
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                Deleting this will permamently remove the item from the
                database.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => deleteAllItemsHandler()}
                variant={'destructive'}
              >
                Delete
              </Button>
              <DialogTrigger asChild>
                <Button variant={'outline'} type="button">
                  Cancel
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <h4 className="mb-4">My products</h4>
      <div className="space-y-4">
        <section className="px-2">
          <h5 className="mb-2">All:</h5>
          <div>
            <MyProducts tag="all" limit={8} />
          </div>
        </section>
      </div>
    </div>
  );
}
