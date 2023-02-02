type PropsType = {
  children: React.ReactNode;
};

const Main = ({ children }: PropsType) => {
  return <main>{children}</main>;
};

export default Main;
