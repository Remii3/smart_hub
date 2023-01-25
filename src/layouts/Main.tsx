import Footer from './Footer';
import Header from './Header';

type ChildrenProps = {
  children: React.ReactNode;
};

const Main = ({ children }: ChildrenProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Main;
