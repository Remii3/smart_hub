import NewsCard from '@components/cards/NewsCard';
import { NewsType } from '@customTypes/interfaces';

interface PropsTypes {
  fetchTopRatedData: () => void;
  newsTopRatedList: NewsType[];
}

export default function TopRated({
  fetchTopRatedData,
  newsTopRatedList,
}: PropsTypes) {
  return (
    <section className="space-y-4">
      {newsTopRatedList.map((item) => (
        <div key={item._id}>
          <NewsCard
            fetchData={fetchTopRatedData}
            item={item}
            textOnly
            withRating
          />
        </div>
      ))}
    </section>
  );
}
