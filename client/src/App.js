import './App.css';
import Post from "./Post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserContextProvider} from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostDetailPage from "./pages/PostDetailPage";
import EditPost from "./pages/EditPost";
import SwitchesPage from "./pages/SwitchesPage";
import SwitchDetailPage from "./pages/SwitchDetailPage";
import EditSwitch from './pages/EditSwitch';
import CreateSwitch from './pages/CreateSwitch';
import PostsPage from './pages/PostsPage';
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/post/edit/:id" element={<EditPost />} />
          <Route path="/switches" element={<SwitchesPage />} />
          <Route path="/switches/create" element={<CreateSwitch />} />
          <Route path="/switches/:id" element={<SwitchDetailPage />} />
          <Route path="/switches/edit/:id" element={<EditSwitch />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}
export default App;
