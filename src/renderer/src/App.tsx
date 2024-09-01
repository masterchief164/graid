import { ReactElement } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';
import { HashRouter as BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorPage from './components/ErrorPage/ErrorPage';
import PermanentDrawer from './components/PermanentDrawer/PermanentDrawer';
import { LoadingPage } from './components/LoadingPage/LoadingPage';
import { Provider } from 'react-redux';
import store from './store';
import Settings from './components/Settings/Settings';

function App(): ReactElement {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <>
      <div className="home">
        <BrowserRouter>
          <Provider store={store}>
            <PermanentDrawer>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login/google" element={<LoadingPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </PermanentDrawer>
          </Provider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
