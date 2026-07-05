// App.jsx
// This is the main file that controls which page to show based on the URL.
// It also adds the Navbar and Footer to every page automatically.
//
// Pages:
//   /               = Home page (About, Projects, Contact)
//   /projects/:id   = Project detail/case study page
//   /admin          = Admin page to manage projects and messages

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';
import './index.css';

// Stop the browser from remembering where you scrolled to.
// This makes sure every page always starts at the top.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// This small component scrolls the page to the top every time
// the user goes to a different page. We use useLayoutEffect so
// the scroll happens before the page is drawn — avoids a flash.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null; // This component shows nothing on the screen
};

// Main App — sets up the router and renders the correct page
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      {/* Show only the matching page based on the URL */}
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/admin"        element={<Admin />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
