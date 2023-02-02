type PropsType = {
  children: React.ReactNode;
};

const Header = ({ children }: PropsType) => {
  return <header>{children}</header>;
};

export default Header;
