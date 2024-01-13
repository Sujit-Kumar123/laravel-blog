import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'


export default function AddPost() {
  const [title,setTitle]=useState();
  const [userId,SetUserId]=useState()
  const [descriptions,setDescriptions]=useState();
  const [image,setImage]=useState()
  const [isLogIn,setLogIn]=useState(false)
  const navigate=useNavigate();
  //To find user data using useEffect
  useEffect(()=>{
    if(localStorage.getItem("blogToken")){
    const localStorageData=localStorage.getItem("blogToken");
    const storedToken=JSON.parse(localStorageData);
    //console.log(storedToken);
    setLogIn(true);
    const token=storedToken.token;
    const config={
      //_method:"GET",
      headers:{
        Authorization:`Bearer ${token}`
      },
    }
    //console.log(`Bearer ${token}`)
    axios.get(process.env.REACT_APP_API_KEY_URL+"get-user",  config)
    .then((response)=>{
      //console.log(response.data.user.id);
      SetUserId(response.data.user.id)
    })
    .catch((error)=>{
      console.log(error);
    })
  }},[])
  const handleSubmisson= (e)=>{
    const formData=new FormData();
    formData.append("user_id",userId);
    formData.append("title",title);
    formData.append("descriptions",descriptions);
    formData.append("image",image);
    axios.post(process.env.REACT_APP_API_KEY_URL+"add_data",formData,{
    })
    .then((result)=>{
      console.log(result.data)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: result.data.Result,
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.reload(true);
      }, 1500);
    })
    .catch(()=>{
      Swal.fire({ position: 'top-end',
      icon: 'error',
      title: 'Your Blog is not saved',
      showConfirmButton: false,
      timer: 1500
      
    })
    navigate('/login')
  })
    navigate('/')
  }
  return (
    <div className='form-container'>
     {!isLogIn && <p style={{color:"red"}}>Log in required</p> }
  <form onSubmit={()=>handleSubmisson()} method="POST">
    <h2>Add Blog</h2>
    <input type="text" name="title" placeholder='Write title' onChange={(e)=>setTitle(e.target.value)} required></input><br/>
    <textarea type="text" name="descriptions" placeholder='Write description here' style={{height:'100px'}} onChange={(e)=> setDescriptions(e.target.value) } required></textarea><br/>
    <input type="file" name="image" placeholder='Write title' onChange={(e)=> setImage(e.target.files[0]) } required></input><br/>
    <button className='newblog-btn' type='submit' >Submit</button>
  </form>
    </div>
  )
}
