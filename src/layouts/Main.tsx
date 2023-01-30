import Footer from "./Footer";
import Nav from "./Nav";

type ChildrenProps = {
  children: React.ReactNode;
};

const Main = ({ children }: ChildrenProps) => {
  return (
    <div className="relative z-10 bg-white">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Main;
