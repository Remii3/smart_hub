type PropsType = {
  children: React.ReactNode;
};

function Main({ children }: PropsType): JSX.Element {
  return <main>{children}</main>;
}

export default Main;
