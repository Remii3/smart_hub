const Nav = () => {
  return (
    <nav className='sticky top-0 right-0 w-full py-3'>
      <div className='absolute top-0 left-0 w-full h-full bg-red-200 opacity-20' />
      <ul className='text-white flex flex-row'>
        <li className='px-2'>Nav1</li>
        <li className='px-2'>Nav2</li>
        <li className='px-2'>Nav3</li>
      </ul>
    </nav>
  );
};

export default Nav;
