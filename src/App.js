import { Routes, Route } from "react-router-dom";

import HomeScreen from "./components/homescreen";
import ChatPage from "./pages/chatpage";
import HelpPage from "./pages/helppage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Bookmarks from"./pages/bookmarks";

function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomeScreen />} />

      {/* Chat page */}
      <Route path="/chat" element={<ChatPage />} />

      {/* How DeepShiva Helps page */}
      <Route path="/help" element={<HelpPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
    </Routes>
  );
}

export default App;
