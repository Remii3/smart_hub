import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


import SuspenseComponent from './components/suspense/SuspenseComponent';
import LoadingComponent from './components/UI/LoadingComponent';

const MainPage = lazy(() => import('./pages/MainPage'));


const App = () => {
  return (
    <>

      <SuspenseComponent fallback={<LoadingComponent />}>
        <Routes>
          <Route path='/' element={<MainPage />} />
        </Routes>
      </SuspenseComponent>

    </>
  );
};

export default App;
