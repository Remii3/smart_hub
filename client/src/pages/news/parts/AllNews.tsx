import NewsCard from '@components/cards/NewsCard';
import { NewsType } from '@customTypes/interfaces';

interface PropsTypes {
  updateAllNews: () => void;
  allNews: NewsType[];
}

export default function AllNews({ updateAllNews, allNews }: PropsTypes) {
  return (
    <section className="space-y-4">
      {allNews.length <= 0 && (
        <div className="text-slate-400">No news found!</div>
      )}
      {allNews.length > 0 &&
        allNews.map((item) => (
          <div key={item._id}>
            <NewsCard fetchData={updateAllNews} item={item} withRating />
          </div>
        ))}
    </section>
  );
}
