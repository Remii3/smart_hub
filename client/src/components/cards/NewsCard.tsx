import { Dialog, DialogContent } from '@components/UI/dialog';
import { NewsType } from '@customTypes/interfaces';
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import NewsArticle from '@pages/news/popup/NewsArticle';
import { useState } from 'react';

export default function NewsCard({
  textOnly = false,
  withRating = false,
  item,
  fetchData,
  updateTopRated,
}: {
  textOnly?: boolean;
  withRating?: boolean;
  item: NewsType;
  fetchData: () => void;
  updateTopRated?: () => void;
}) {
  const [newsArticleDialogOpened, setNewsArticleDialogOpened] = useState<
    null | string
  >(null);
  return (
    <Dialog
      open={newsArticleDialogOpened == item._id}
      onOpenChange={() => {
        if (updateTopRated) {
          updateTopRated();
        }
        setNewsArticleDialogOpened(null);
      }}
    >
      <button
        type="button"
        onClick={() => setNewsArticleDialogOpened(item._id)}
        aria-label="News article"
        className="flex w-full items-center gap-3 rounded-md border border-slate-200 text-start shadow-sm transition-[box-shadow] duration-200 ease-in-out hover:shadow-md"
      >
        <section
          className={`${
            textOnly ? 'basis-full' : 'ml-3 basis-1/2'
          } space-y-2 px-3 py-3`}
        >
          <strong className="line-clamp-2 text-2xl">{item.title}</strong>
          {item.subtitle && (
            <section className="line-clamp-2 text-base">
              {item.shortDescription}
            </section>
          )}
          {withRating && (
            <div className="space-x-2">
              <div className="inline-flex items-center gap-1 text-slate-400">
                <HandThumbUpIcon className="inline-block h-4" />
                <span className="text-sm">{item.voting.quantity.likes}</span>
              </div>
              <div className="inline-flex items-center gap-1 text-slate-400">
                <HandThumbDownIcon className="inline-block h-4" />
                <span className="text-sm">{item.voting.quantity.dislikes}</span>
              </div>
            </div>
          )}
        </section>
        {!textOnly && (
          <section className="basis-1/2">
            <div className="flex h-48 justify-end">
              {item.img && (
                <img
                  src={item.img.url}
                  className="aspect-square h-full rounded-r-md object-cover object-center"
                  alt="news_img"
                />
              )}
            </div>
          </section>
        )}
      </button>
      <DialogContent className="h-full w-full p-7">
        <NewsArticle
          newsId={item._id}
          updateNewsList={fetchData}
          dialogOpenedHandler={setNewsArticleDialogOpened}
          updateTopRated={updateTopRated}
        />
      </DialogContent>
    </Dialog>
  );
}
