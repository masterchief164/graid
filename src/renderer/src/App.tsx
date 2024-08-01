import { ReactElement } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';
import { HashRouter as BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './components/ErrorPage/ErrorPage';
import PermanentDrawer from './components/PermanentDrawer/PermanentDrawer';
import { LoadingPage } from './components/LoadingPage/LoadingPage';

function App(): ReactElement {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <>
      <div className="home">
        <BrowserRouter>
          <PermanentDrawer>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login/google" element={<LoadingPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </PermanentDrawer>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
