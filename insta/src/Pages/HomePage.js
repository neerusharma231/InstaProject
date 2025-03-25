import React, { useState,useEffect,useContext  } from "react";
import "../css/home.css";
import { AuthContext } from "../AuthContext/AuthContext"
import story from "../story.json";
import Post from "../Post/Post"
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import Sidebar from "../Component/Sidebar";
import RightSide from "../Component/RightSide";
import { useNavigate } from "react-router-dom"; 
const HomePage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [scrollIndex, setScrollIndex] = useState(0);
  const storys = story.story;
  const navigate = useNavigate();
  const itemWidth = 76; // Adjust if necessary
 const [currentIndex, setCurrentIndex] = useState(0);
 const { userId } = useContext(AuthContext);
 useEffect(() => {
  if (!userId) {
      console.log("User not logged in. Redirecting...");
      navigate("/login");
  }
}, [userId, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 2); // Only two images
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);
  // Calculate max scroll index based on the number of items and container width
  const maxIndex = Math.max(0, storys.length - Math.floor(630 / itemWidth));
  const scrollLeft = () => {
    setScrollIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const scrollRight = () => {
    setScrollIndex(prevIndex => Math.min(prevIndex + 1, maxIndex));
  };


  return (
    <>
    <div className="mainpage">
    <Sidebar />
  
  {/* <div className="main_topcs"> */}
    <div className="middleHomeSide">
      <div className="midsec-posts">
      <div className="storyBlock">
        <button className="carouselControl prev" onClick={scrollLeft}>
        <GrPrevious />
        </button>
        <div className="storyContainer" style={{ transform: `translateX(-${scrollIndex * itemWidth}px)` }}>
          {storys?.map((item, index) => (
            <div key={index} className="storyParticular">
              <div className="imageDiv">
                <img className="statusImg" src={item.img} alt={item.name} />
              </div>
              <div className="profileName">{item.name}</div>
            </div>
          ))}
        </div>
        <button className="carouselControl next" onClick={scrollRight}>
        <GrNext />
        </button>
      </div>

      {/* POST SECTION */}
      <div className="postSection">
        <Post imageUrl={imageUrl}/>
        {/* <Post /> */}
      </div>
      </div>
    </div>
    <div className="rightSide">
        <RightSide />
      </div>
      </div>
    </>
  );
};

export default HomePage;
