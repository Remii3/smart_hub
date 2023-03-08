import Nav from './Nav';

function Header() {
  return (
    <header className='fixed top-0 left-0 z-30 w-full'>
      <div className='navBackground bg-pageBackground absolute top-0 left-0 z-20 h-full w-full opacity-0 transition-all duration-200 ease-out' />

      <Nav />
    </header>
  );
}

export default Header;
