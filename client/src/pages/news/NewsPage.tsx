import { useCallback, useContext, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@components/UI/dialog';
import MainContainer from '@layout/MainContainer';
import { NewsTypes } from '@customTypes/interfaces';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { UserContext } from '@context/UserProvider';
import NewsArticle from './NewsArticle';
import errorToast from '@components/UI/error/errorToast';
import NewNews from './NewNews';
import { UserRoleTypes } from '@customTypes/types';

export default function NewsPage() {
  const [newsArticleDialogOpened, setNewsArticleDialogOpened] = useState<
    null | string
  >(null);

  const [newsList, setNewsList] = useState<NewsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const { userData } = useContext(UserContext);

  const fetchData = useCallback(async () => {
    setNewsList((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ALL,
    });
    if (error) {
      errorToast(error);
      return setNewsList((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setNewsList({ data, hasError: null, isLoading: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <MainContainer>
      <div>
        <span>News</span>
        {userData.data && userData.data.role !== UserRoleTypes.USER && (
          <NewNews updateNewsList={fetchData} />
        )}
      </div>
      <div className="flex flex-col gap-4">
        {newsList.data ? (
          newsList.data.map((item) => (
            <div key={item._id} className="p-3">
              <Dialog
                open={newsArticleDialogOpened == item._id}
                onOpenChange={() => setNewsArticleDialogOpened(null)}
              >
                <button
                  type="button"
                  onClick={() => setNewsArticleDialogOpened(item._id)}
                  aria-label="Show news article"
                  className="rounded-md border border-slate-400 p-3 text-start shadow-sm"
                >
                  {item.img && (
                    <div className="flex max-h-[200px]">
                      <img
                        src={item.img.url}
                        className="aspect-auto w-full object-cover object-center"
                        alt="news_img"
                      />
                    </div>
                  )}
                  <h6>{item.title}</h6>
                  {item.subtitle && (
                    <section className="pt-3">{item.subtitle}</section>
                  )}
                </button>
                <DialogContent className="h-full w-full overflow-y-auto sm:max-h-[80%]">
                  <NewsArticle
                    newsId={item._id}
                    updateNewsList={fetchData}
                    dialogOpenedHandler={setNewsArticleDialogOpened}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : (
          <h4>No news</h4>
        )}
      </div>
    </MainContainer>
  );
}
