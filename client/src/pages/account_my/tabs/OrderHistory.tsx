import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '@context/UserProvider';
import {
  FetchDataTypes,
  OrderTypes,
  PostDataTypes,
} from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import errorToast from '@components/UI/error/errorToast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/UI/table';
import { Input } from '@components/UI/input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import { Button } from '@components/UI/button';
import Pagination from '@components/paginations/Pagination';
import LoadingCircle from '@components/Loaders/LoadingCircle';

interface UserOrdersTypes extends FetchDataTypes {
  data: null | OrderTypes[];
  rawData: null | {
    [index: string]: unknown;
    totalOrders: number;
    currentPage: number;
  };
}

export default function OrderHistory() {
  const [orderState, setOrderState] = useState<UserOrdersTypes>({
    hasError: null,
    isLoading: false,
    data: null,
    rawData: null,
  });
  const [page, setPage] = useState(1);
  const limit = 8;
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [searchbarValue, setSearchbarValue] = useState('');
  const [deleteAllStatus, setDeleteAllStatus] = useState<PostDataTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
  });
  const { userData } = useContext(UserContext);

  const fetchOrders = async (type?: 'query') => {
    const filtersData = {
      page,
    } as any;
    if (type === 'query') {
      filtersData.query = searchbarValue;
    }
    if (!userData.data) return;
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.ORDER_SEARCH,
      params: {
        userId: userData.data._id,
        pageSize: limit,
        filtersData,
        withPagination: true,
      },
    });

    if (error) {
      errorToast(error);
      return setOrderState((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setOrderState({
      data: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  };

  const searchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders('query');
  };

  const deleteAllItemsHandler = async () => {
    setDeleteAllStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.ORDER_DELETE_ALL,
      body: { userId: userData.data?._id },
    });
    if (error) {
      errorToast(error);
      return setDeleteAllStatus((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }

    await fetchOrders();

    setDeleteDialog(false);
    setDeleteAllStatus({ isLoading: false, hasError: null, isSuccess: true });

    setTimeout(() => {
      setDeleteAllStatus({
        isLoading: false,
        hasError: null,
        isSuccess: false,
      });
    }, 500);
  };
  const pageChangeHandler = (newPage: number) => {
    setPage(newPage);
  };
  useEffect(() => {
    fetchOrders();
  }, [page]);
  return (
    <>
      <section className="flex justify-between flex-wrap items-center mb-4 gap-4">
        <h4 className="order-1">My orders</h4>
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
        <div className="order-2 sm:order-3 ">
          <DeleteDialog
            openState={deleteDialog}
            openStateHandler={() => setDeleteDialog(false)}
            deleteHandler={deleteAllItemsHandler}
            loadingCondition={deleteAllStatus.isLoading}
          >
            <Button
              type="button"
              variant={'destructive'}
              onClick={() => setDeleteDialog(true)}
              className={`${
                (!orderState.data || orderState.data.length <= 0) && 'invisible'
              } relative order-2 sm:order-3`}
              disabled={
                deleteAllStatus.isLoading ||
                !orderState.data ||
                orderState.data.length <= 0
              }
            >
              Delete all
            </Button>
          </DeleteDialog>
        </div>
      </section>

      <section className="px-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderState.data &&
              orderState.data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    <Link key={item._id} to={`order/${item._id}`}>
                      {item._id}
                    </Link>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.createdAt.slice(0, 10)}</TableCell>
                  <TableCell className="text-right">
                    {item.orderPrice}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {orderState.data && orderState.data.length <= 0 && (
          <span className="text-sm text-muted-foreground px-1 inline-block pt-1">
            Nothing to show.
          </span>
        )}
      </section>
      {orderState.rawData && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={page}
            onPageChange={(newPage: number) => pageChangeHandler(newPage)}
            pageSize={limit}
            siblingCount={1}
            totalCount={orderState.rawData.totalOrders}
          />
        </div>
      )}
    </>
  );
}
