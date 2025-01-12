import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import WatchlistPage from "./pages/WatchlistPage";
import VideoPage from "./pages/VideoPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import { UserProvider } from "./context/UserContext";


const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="" element={<IndexPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/video/:id" element={<VideoPage />} />  
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
