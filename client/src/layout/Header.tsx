type PropsType = {
  children: React.ReactNode;
};

function Header({ children }: PropsType) {
  return <header>{children}</header>;
}

export default Header;
