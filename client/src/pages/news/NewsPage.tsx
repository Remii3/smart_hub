import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AllNews from './parts/AllNews';
import LatestNews from './parts/LatestNews';
import TopRated from './parts/TopRated';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import { Skeleton } from '@components/UI/skeleton';
import SearchNews from './parts/SearchNews';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import { FetchDataTypes, NewsType } from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import NewNews from './popup/NewNews';
import { UserRoleTypes } from '@customTypes/types';
import Pagination from '@components/paginations/Pagination';
import { useSearchParams } from 'react-router-dom';

interface NewsTypes extends FetchDataTypes {
  data: null | NewsType[];
}
interface AllNewsTypes extends FetchDataTypes {
  data: null | NewsType[];
  rawData: { totalPages: number | null };
}
export default function NewsPage() {
  const { userData } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || 'all'
  );
  const currentPageSize = 8;

  const [topRatedNews, setTopRatedNews] = useState<NewsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [latestNews, setLatestNews] = useState<NewsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [allNews, setAllNews] = useState<AllNewsTypes>({
    data: null,
    rawData: { totalPages: null },
    hasError: null,
    isLoading: false,
  });

  const fetchTopRated = useCallback(async () => {
    setTopRatedNews((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ALL,
      params: { sortOption: 'top_rated', limit: 5 },
    });

    if (error) {
      errorToast(error);
      return setTopRatedNews((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setTopRatedNews({ data, hasError: null, isLoading: false });
  }, []);

  const fetchLatestNews = useCallback(async () => {
    setLatestNews((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ALL,
      params: {
        sortOption: 'latest',
        limit: 6,
      },
    });
    if (error) {
      errorToast(error);
      return setLatestNews({ data: null, hasError: error, isLoading: false });
    }
    setLatestNews({ data, hasError: null, isLoading: false });
  }, []);
  const fetchAllNews = useCallback(async () => {
    setAllNews((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const filtersData = {
      page: searchParams.get('page'),
      searchedPhrase: searchParams.get('search') === 'all' ? '' : searchQuery,
    };

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_SEARCH,
      params: {
        pageSize: currentPageSize,
        filtersData,
      },
    });
    if (error) {
      errorToast(error);
      return setAllNews((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setAllNews({
      data: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  }, [searchQuery, page]);

  useEffect(() => {
    searchParams.set('search', searchQuery);
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
    fetchAllNews();
  }, [searchQuery, page]);

  useEffect(() => {
    fetchLatestNews();
    fetchTopRated();
  }, []);

  return (
    <section>
      <section className="-mx-4 -mt-6 mb-14 h-[40vh]">
        {latestNews.isLoading && !latestNews.data && (
          <Skeleton className="h-[40vh] w-full" />
        )}
        {latestNews.hasError && <ErrorMessage message={latestNews.hasError} />}
        {latestNews.data && (
          <LatestNews
            updateLatestNews={fetchLatestNews}
            latestNewsData={latestNews.data}
          />
        )}
      </section>
      <section className="relative flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-baseline">
        <main className="flex flex-col gap-4 lg:basis-3/5">
          <div>
            <h3 className="mb-2">Latest</h3>
            <div className="flex items-stretch gap-4">
              <div className="w-full">
                <SearchNews
                  changePage={setPage}
                  changeSearchQUery={setSearchQuery}
                />
              </div>
              {userData.data && userData.data.role !== UserRoleTypes.USER && (
                <div className="inline-block">
                  <NewNews
                    updateAllNews={fetchAllNews}
                    updateLatestNews={fetchLatestNews}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            {allNews.isLoading && !allNews.data && (
              <div className="space-y-4">
                {[...Array(3)].map((el, index) => (
                  <Skeleton
                    key={index}
                    className="flex w-full flex-col justify-between p-3"
                  >
                    <Skeleton className="mb-4 h-5 w-32" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-44" />
                    </div>
                  </Skeleton>
                ))}
              </div>
            )}
            {allNews.hasError && <ErrorMessage message={allNews.hasError} />}
            {allNews.data && (
              <AllNews allNews={allNews.data} updateAllNews={fetchAllNews} />
            )}
            {allNews.data &&
              allNews.data.length > 0 &&
              allNews.rawData.totalPages && (
                <div className="mt-4 flex w-full items-center justify-center">
                  <Pagination
                    currentPage={page}
                    onPageChange={(newPageNumber: number) => {
                      setPage(newPageNumber);
                    }}
                    pageSize={currentPageSize}
                    siblingCount={1}
                    totalCount={allNews.rawData.totalPages}
                  />
                </div>
              )}
          </div>
        </main>
        <aside className="basis-full lg:basis-1/3 lg:sticky top-16">
          <h3 className="mb-2">Trending</h3>
          {topRatedNews.isLoading && !topRatedNews.data && (
            <div className="space-y-4">
              {[...Array(3)].map((el, index) => (
                <Skeleton
                  key={index}
                  className="flex w-full flex-col justify-between p-3"
                >
                  <Skeleton className="mb-4 h-5 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                </Skeleton>
              ))}
            </div>
          )}
          {topRatedNews.hasError && (
            <ErrorMessage message={topRatedNews.hasError} />
          )}
          {topRatedNews.data && (
            <TopRated
              fetchTopRatedData={fetchTopRated}
              newsTopRatedList={topRatedNews.data}
            />
          )}
        </aside>
      </section>
    </section>
  );
}
