import AllCollectionsList from './AllCollections';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@context/UserProvider';
import { Button } from '@components/UI/button';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import {
  FetchDataTypes,
  PostDataTypes,
  ProductTypes,
} from '@customTypes/interfaces';
import { MarketplaceTypes } from '@customTypes/types';
import { Input } from '@components/UI/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductsTypes extends FetchDataTypes {
  data: null | ProductTypes[];
  rawData: null | {
    [index: string]: unknown;
    totalProducts: number;
  };
}

interface ProductQuantityTypes extends FetchDataTypes {
  quantity: number;
}

interface DeleteAllTypes extends PostDataTypes {}
export default function MyCollections() {
  const [productsQuantity, setProductsQuantity] =
    useState<ProductQuantityTypes>({
      hasError: null,
      isLoading: false,
      quantity: 0,
    });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteAllStatus, setDeleteAllStatus] = useState<DeleteAllTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
  });
  const [collections, setCollections] = useState<ProductsTypes>({
    data: null,
    rawData: null,
    hasError: null,
    isLoading: false,
  });
  const marketplace = 'collection' as MarketplaceTypes;

  const { userData, fetchUserData } = useContext(UserContext);

  const [searchbarValue, setSearchbarValue] = useState('');

  const [page, setPage] = useState(1);
  const allLimit = 8;

  const fetchAllDataQuantity = async () => {
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
  };

  const fetchAllData = async ({ newPage }: { newPage?: number }) => {
    setCollections((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const filtersData = {
      page,
      marketplace,
    } as { [index: string]: unknown };

    filtersData.searchedPhrase = searchbarValue;
    filtersData.authorCreator = userData.data?._id;

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.SEARCH_PRODCOL,
      params: {
        pageSize: allLimit,
        withPagination: true,
        filtersData,
      },
    });
    if (error) {
      errorToast(error);
      return setCollections({
        data: null,
        hasError: error,
        rawData: null,
        isLoading: false,
      });
    }
    setCollections({
      data: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  };

  const searchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchAllData({ newPage: 1 });
    setPage(1);
  };

  const changePageHandler = (newPage: number) => {
    fetchAllData({ newPage: newPage });
    setPage(newPage);
  };

  useEffect(() => {
    fetchAllData({ newPage: 1 });
    fetchAllDataQuantity();
  }, []);

  const deleteAllItemsHandler = async () => {
    setDeleteAllStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_DELETE_ALL,
      body: { userId: userData.data && userData.data._id, marketplace },
    });
    if (error) {
      errorToast(error);
      return setDeleteAllStatus((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }
    fetchUserData();
    setPage(1);
    fetchAllDataQuantity();
    fetchAllData({ newPage: 1 });
    setDeleteDialog(false);
    setDeleteAllStatus({ hasError: null, isLoading: false, isSuccess: true });

    setTimeout(() => {
      setDeleteAllStatus((prevState) => {
        return { ...prevState, isSuccess: false };
      });
    }, 500);
  };

  return (
    <div>
      <section className="flex justify-between flex-wrap items-center mb-4 gap-4">
        <h4 className="order-1 basis-[20%]">My collections</h4>
        <div className="order-3 sm:order-2 w-full sm:w-auto">
          <form
            onSubmit={(e) => searchHandler(e)}
            className="relative mx-auto me-4 w-full basis-full items-center justify-end text-muted-foreground flex"
          >
            <Input
              className="h-full rounded-lg bg-background py-2 pl-3 pr-12 text-sm transition-[width] duration-200 ease-in-out focus-visible:w-full"
              type="text"
              name="search"
              placeholder="Search"
              value={searchbarValue}
              onChange={(e) => setSearchbarValue(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 h-full w-auto min-w-[40px] -translate-y-1/2 transform rounded-e-xl border-0 bg-transparent px-2 text-gray-600 transition"
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="h-6 w-6 font-bold text-muted-foreground" />
            </button>
          </form>
        </div>
        <div className="order-2 sm:order-3 basis-[15%]">
          <DeleteDialog
            openState={deleteDialog}
            openStateHandler={() => setDeleteDialog(false)}
            deleteHandler={deleteAllItemsHandler}
          >
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => setDeleteDialog(true)}
              className={`${
                productsQuantity.quantity <= 0 && 'invisible'
              } order-2 sm:order-3`}
              disabled={
                deleteAllStatus.isLoading || productsQuantity.quantity <= 0
              }
            >
              Delete all
            </Button>
          </DeleteDialog>
        </div>
      </section>
      <section>
        {collections.data && (
          <AllCollectionsList
            limit={allLimit}
            collections={collections.data}
            onPageChange={(newPage: number) => changePageHandler(newPage)}
            page={page}
            totalPages={collections.rawData?.totalProducts}
          />
        )}
      </section>
    </div>
  );
}
