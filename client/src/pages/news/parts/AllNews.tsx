import NewsCard from '@components/cards/NewsCard';
import { NewsType } from '@customTypes/interfaces';

interface PropsTypes {
  updateTopRated?: () => void;
  updateAllNews: () => void;
  allNews: NewsType[];
}

export default function AllNews({
  updateTopRated,
  updateAllNews,
  allNews,
}: PropsTypes) {
  return (
    <section className="space-y-4">
      {allNews.map((item) => (
        <div key={item._id}>
          <NewsCard
            fetchData={updateAllNews}
            item={item}
            updateTopRated={updateTopRated}
          />
        </div>
      ))}
    </section>
  );
}
