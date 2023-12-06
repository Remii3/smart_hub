import MainContainer from '@layout/MainContainer';
import BasicCollectionWidget from './BasicCollectionWidget';

export default function CollectionsPage() {
  return (
    <>
      <div className="relative -mx-4 -mt-6 mb-14 h-[40vh] w-[calc(100%+32px)]">
        <img
          className="aspect-auto h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1512580770426-cbed71c40e94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2107&q=80"
          alt="banner_img"
        />
      </div>
      <BasicCollectionWidget
        category="fiction"
        title="Fiction"
        subtitle="A long subtitle"
      />
    </>
  );
}
