import Main from "../layouts/Main";
import Header from "../layouts/Header";

const MainPage = () => {
  return (
    <div>
      <Header />
      <Main>
        <div className="h-[200vh]">
          <h1>Hello World!</h1>
        </div>
      </Main>
    </div>
  );
};

export default MainPage;
