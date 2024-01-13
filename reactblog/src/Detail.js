import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CommentOnPost from "./CommentOnPost";
import Button from 'react-bootstrap/Button';


export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const navigate = useNavigate();
  const [localUserId, setLocalUserId] = useState();
  const [owner, setOwner]=useState()
  const getUserId = () => {
    if (localStorage.getItem("blogToken")) {
      const localStorageData = localStorage.getItem("blogToken");
      const storedToken = JSON.parse(localStorageData);
      //console.log(storedToken);
      const token = storedToken.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .get(process.env.REACT_APP_API_KEY_URL+"get-user", config)
        .then((response) => {
          setLocalUserId(response.data.user.id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getUserId();
    axios
      .get(process.env.REACT_APP_API_KEY_URL+"blog_data_id/" + id)
      .then((res) => {setPost(res.data)
                      setOwner(res.data[0].user_id)})
      .catch((err) => console.log(err));
  }, [id]);

  const deletePost = async (d) => {
    if (localUserId === post[0].user_id) {
      try {
        await axios.delete(process.env.REACT_APP_API_KEY_URL+"delete/"+ d);
        //console.log(res.data)
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Blog has been deleted Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
      }
      navigate("/");
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Your have not authorize to delete",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }; 
  return (
    <div className="detail-post-container">
      {post.map((po, ind) => (
        <div key={ind} className="title-description">
          <h2>{po.title}</h2>

          <img
            className="detail-image"
            src={process.env.REACT_APP_API_KEY_GET_IMAGE+ po.image}
            alt=""
          />
          <br></br>
          <div className="detail-blog-content">
            <p>{po.descriptions}</p>
          {/* <p>Blog User Id{po.user_id}</p>
            <p>Blog Id{po.id}</p>
            <p>Log in user id {localUserId}</p>*/ } 
          </div>
          <CommentOnPost blog_id={id} owner={owner} />
        </div>
      ))}
      
   {localUserId===owner &&    <p className="detail-btn-p">
        <Button variant="danger" onClick={() => deletePost(id)}>DELETE</Button>
        <Button variant="success"><Link to={`/update/${id}`} >Update</Link></Button>
        
      </p>}
    </div>
  );
}
