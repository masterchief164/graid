import { ReactElement } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './components/ErrorPage/ErrorPage';
import PermanentDrawer from './components/PermanentDrawer/PermanentDrawer';

function App(): ReactElement {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <>
      <div className="home">
        <BrowserRouter>
          <PermanentDrawer>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </PermanentDrawer>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
