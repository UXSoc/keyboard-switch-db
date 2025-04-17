import {useContext, useEffect, useState} from "react";
import {UserContext} from "../UserContext";
import { Navigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

    const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(() => {
      fetch('/api/users/profile', {
        credentials: 'include',
      }).then(response => {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
        });
      });
    }, []);
  
    if (userInfo==="Unauthorized") {
      return <Navigate to="/login" />;
    }

  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: data,
      credentials: 'include', 
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      console.error('Failed to create post:', response);
    }
  }

  if (redirect) {
    return <Navigate to="/posts" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
  );
}
