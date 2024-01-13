import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState();
  //Pagination for blogs
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = blogs.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(blogs.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);
  //Loading of data
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_KEY_URL+"blog_data")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.log(err));
  }, []);
  const getSearchData = (e) => {
    axios
      .get(process.env.REACT_APP_API_KEY_URL+"search/" + search)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.log(err));
  };
  //console.log(blogs.length);
  //Working of pagination
  function previousPage() {
    if (currentPage !== firstIndex && currentPage >> 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCurrentPage(n) {
    setCurrentPage(n);
  }
  function nextPage() {
    if (currentPage !== lastIndex && currentPage <= nPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  }
  //console.log(apiUrl)
  return (
    <div className="container con">
      <div className="search-container">
        
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={getSearchData}
        ></input>
      </div>
      <div className="posts">
        {!blogs && <p style={{color:"red"}}>No Blog Found</p>}
        {blogs && (
          <div className="post-container">
            {records.map((blog, index) => (
              <Post blog={blog} key={index} />
            ))}
          </div>
        )}
      </div>
      <div className="homePagination">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <Link href="#" className="page-link" onClick={previousPage}>
                Prev
              </Link>
            </li>
            {numbers.map((n, i) => (
              <li
                className={`page-item ${currentPage === n ? "active" : ""}`}
                key={i}
              >
                <Link
                  href="#"
                  className="page-link"
                  onClick={() => changeCurrentPage(n)}
                >
                  {n}
                </Link>
              </li>
            ))}
            <li className="page-item">
              <Link href="#" className="page-link" onClick={nextPage}>
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
export default Home;
