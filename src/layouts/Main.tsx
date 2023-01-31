type ChildrenProps = {
  children: React.ReactNode;
};

const Main = ({ children }: ChildrenProps) => {
  return <main>{children}</main>;
};

export default Main;
