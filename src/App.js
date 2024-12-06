import './App.css';
import { Routes, Route, BrowserRouter, RouterProvider } from 'react-router-dom';

import Navigation from './components/navbar/navigation';
import Dashboard from './pages/dashboard';
import Chat from './pages/chat';
import { Suspense } from 'react';
import router from './router/routes';
import About from './pages/about';

function App() {

  return (
    <div className="App">
      {/* <Suspense fallback={<div>Loading</div>}>
        <RouterProvider router={router} />
      </Suspense> */}
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Chat />}></Route>
          <Route path="/dashboard" element={<Dashboard />}> </Route>
          <Route path="/about" element={<About />}> </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
