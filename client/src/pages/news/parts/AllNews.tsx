import NewsCard from '@components/cards/NewsCard';
import { NewsType } from '@customTypes/interfaces';

interface PropsTypes {
  updateAllNews: () => void;
  allNews: NewsType[];
}

export default function AllNews({ updateAllNews, allNews }: PropsTypes) {
  return (
    <section className="space-y-4">
      {allNews.map((item) => (
        <div key={item._id}>
          <NewsCard fetchData={updateAllNews} item={item} />
        </div>
      ))}
    </section>
  );
}
