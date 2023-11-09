import MainContainer from '@layout/MainContainer';
import BasicCollectionWidget from './BasicCollectionWidget';

export default function CollectionsPage() {

  return (
    <MainContainer>
      <h2>Collections</h2>
      <div>
        <BasicCollectionWidget
          category="fiction"
          title="Fiction"
          subtitle="A long subtitle"
        />
      </div>
    </MainContainer>
  );
}
