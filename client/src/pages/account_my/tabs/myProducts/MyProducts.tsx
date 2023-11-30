import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '@context/UserProvider';
import { Button } from '@components/UI/button';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import { FetchDataTypes, PostDataTypes } from '@customTypes/interfaces';
import { MarketplaceTypes } from '@customTypes/types';
import AllProducts from './AllProducts';

interface ProductQuantityTypes extends FetchDataTypes {
  quantity: null | number;
}

interface DeleteAllTypes extends PostDataTypes {}

export default function MyProducts() {
  const [productsQuantity, setProductsQuantity] =
    useState<ProductQuantityTypes>({
      hasError: null,
      isLoading: false,
      quantity: null,
    });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteAllStatus, setDeleteAllStatus] = useState<DeleteAllTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
  });
  const marketplace = 'shop' as MarketplaceTypes;
  const { userData, fetchUserData } = useContext(UserContext);

  const fetchData = useCallback(async () => {
    if (!userData.data) return;
    setProductsQuantity((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_QUANTITY,
      params: { authorId: userData.data._id, marketplace },
    });

    if (error) {
      errorToast(error);
      return setProductsQuantity((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }

    setProductsQuantity({ hasError: null, isLoading: false, quantity: data });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const deleteAllItemsHandler = async () => {
    setDeleteAllStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_DELETE_ALL,
      body: { userId: userData.data && userData.data._id },
    });
    if (error) {
      errorToast(error);
      return setDeleteAllStatus((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }
    fetchUserData();
    setDeleteDialog(false);
    setDeleteAllStatus({ hasError: null, isLoading: false, isSuccess: true });
    setTimeout(() => {
      setDeleteAllStatus((prevState) => {
        return { ...prevState, isSuccess: false };
      });
    }, 500);
  };

  return (
    <div className="relative px-3">
      {!deleteAllStatus.isLoading &&
        !!productsQuantity.quantity &&
        productsQuantity.quantity > 0 && (
          <DeleteDialog
            openState={deleteDialog}
            openStateHandler={() => setDeleteDialog(false)}
            deleteHandler={deleteAllItemsHandler}
          >
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => setDeleteDialog(true)}
            >
              Delete all
            </Button>
          </DeleteDialog>
        )}
      <h4 className="mb-4">My products</h4>
      <div className="space-y-4">
        <section className="px-2">
          <h5 className="mb-2">All:</h5>
          <div>
            <AllProducts limit={8} />
          </div>
        </section>
      </div>
    </div>
  );
}
