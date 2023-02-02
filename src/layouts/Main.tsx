type ChildrenProps = {
  children: React.ReactNode;
};

const Main = ({ children }: ChildrenProps) => {
  return <main className='z-20'>{children}</main>;
};

export default Main;
