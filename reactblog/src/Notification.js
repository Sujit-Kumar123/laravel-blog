import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

//import { useNavigate } from 'react-router-dom';

const Notification = ({sho}) => {
  const [notification, setNotification] = useState([]);
  //const navigate = useNavigate();
  const [localUserId, setLocalUserId] = useState(0);
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
        .get(process.env.REACT_APP_API_KEY_URL + "get-user", config)
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
      .get(
        process.env.REACT_APP_API_KEY_URL +
          "get_all_blog_notification/" +
          localUserId
      )
      .then((res) => {
        setNotification(res.data);
      })
      .catch((error) => {
        console.log(error)});  
  }, [localUserId]);
  //console.log(localUserId)
  //console.log(notification)
  const markedAsRead = (notify_id) => {
    const jsonData = {
      id: notify_id,
    };
    axios
      .post(process.env.REACT_APP_API_KEY_URL + "notify_notification", jsonData)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const markedAsReadAll=()=>{
    axios.post(process.env.REACT_APP_API_KEY_URL+"markedAsReadAll/"+localUserId)
    .then((res)=>{
      console.log(res.data)
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  return (
    <>
      
      <p className="notificationCount">
        {notification.length !== 0 && localUserId !== 0
          ? notification.length
          : 0}
      </p>
      
    {notification.length !==0 && sho && <div className="flex flex-col dropDownFieldNotification" >
        {notification.map((notify, i) => (
          <Link key={i} to={notify.data.blog_url_with_id} onClick={() => markedAsRead(notify.id)}>
            <div className="blogNotification">
            <p >{notify.data.name}</p>
            </div>
          </Link>
        ))}
        
      <p className="markedAsRead"><Button onClick={markedAsReadAll}>Marked  as read</Button></p>  
      </div>
}
    </>
  );
};

export default Notification;
