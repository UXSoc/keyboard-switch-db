import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username;
  useEffect(() => {
    fetch('http://localhost:4000/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <h1>Posts List</h1>
        {username && (
            <>
            <Link to="/post/create">Create New Post</Link>
          </>
        )}
      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <Link to={`/post/${post._id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
