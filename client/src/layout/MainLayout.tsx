import Footer from './Footer';
import Header from './Header';

type PropsType = {
  children: React.ReactNode;
};

function MainLayout({ children }: PropsType) {
  return (
    <div id="mainContainer" className=" overflow-hidden bg-gray-100">
      <Header />
      <main className="relative top-16">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
