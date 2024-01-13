import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Post({ blog }) {
  const navigate=useNavigate()
  const handleNavigate=()=>{
    navigate(`/read/${blog.id}`)
  }
  return (
    <Link to={`/read/${blog.id}`} className="post-link">
      <div className="blog">
        <img
          className="blog-image"
          src={process.env.REACT_APP_API_KEY_GET_IMAGE+ blog.image}
          alt=""
        />
        <div className="blog-title">
        
          <h2>{blog.title}</h2>
          <p>{blog.descriptions}</p>
          <button onClick={handleNavigate} >VIEW MORE</button>
          <br></br>
        </div>
      </div>
    </Link>
  );
}
export default Post;
