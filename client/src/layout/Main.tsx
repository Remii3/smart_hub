type PropsType = {
  children: React.ReactNode;
};

function Main({ children }: PropsType) {
  return <main id="mainContainer">{children}</main>;
}

export default Main;
