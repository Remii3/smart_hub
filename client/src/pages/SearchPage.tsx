import AdvancedFilter from '../components/search/AdvancedFilter';

const DUMMY_RESPONSE_ARRAY = [
  { id: 1, name: 'asd' },
  { id: 1, name: 'asd' },
];
export default function SearchPage() {
  return (
    <div className="">
      <div className="flex justify-between">
        <p>Results: 28</p>
        <div>Sort</div>
      </div>
      <div>
        <section>
          <AdvancedFilter />
        </section>
        <section>
          {DUMMY_RESPONSE_ARRAY.map((item) => (
            <div key={item.id}>Hello</div>
          ))}
        </section>
      </div>
    </div>
  );
}
