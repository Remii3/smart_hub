type PropsType = {
  children: React.ReactNode;
};

function Main({ children }: PropsType) {
  return <main>{children}</main>;
}

export default Main;
