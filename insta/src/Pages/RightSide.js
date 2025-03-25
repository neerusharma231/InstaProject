import React from "react";
import "../Style/RightSide.css";
import { useEffect,useState } from "react";
const RightSide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 2); // Only two images
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="rightSideHome">
        <div className="topProfileRight">
          <div className="leftRightProfile">
            <div className="imageDivRightSide">
              <img
                className="imageRightSideProfile"
                src="https://media-cdn.socastsrm.com/wordpress/wp-content/blogs.dir/2684/files/2021/12/nikki-budzinski-21.jpeg"
                alt="img1"
              />
            </div>
            <div className="userNameBlock">
              <div className="userNameRightSide">__nikki_Budzinski</div>
              <div className="userFullName">Nikki Budzinski</div>
            </div>
          </div>
          <div className="switchBtn">Switch</div>
        </div>
        <div className="bottomRightSide">
          <div className="suggestedBlock">
            <div className="suggestedForYou"> Suggested For You </div>
            <div className="seeAll">See All</div>
          </div>
          <div className="followBlockRightSide">
          <div className="topProfileRightBottom">
              <div className="leftRightProfile">
                <div className="imageDivRightSide">
                  <img
                    className="imageRightSideProfile"
                    src="https://media-cdn.socastsrm.com/wordpress/wp-content/blogs.dir/2684/files/2021/12/nikki-budzinski-21.jpeg"
                    alt="img2" />
                </div>
                <div className="userNameBlock">
                  <div className="userNameRightSide">__nikki_Budzinski</div>
                  <div className="userFullName">New to Instagram</div>
                </div>
              </div>
              <div className="switchBtn">Follow</div>
            </div>
          </div>
          <div className="topProfileRightBottom">
              <div className="leftRightProfile">
                <div className="imageDivRightSide">
                  <img
                    className="imageRightSideProfile"
                    src="https://media-cdn.socastsrm.com/wordpress/wp-content/blogs.dir/2684/files/2021/12/nikki-budzinski-21.jpeg"
                    alt="img3"/>
                </div>
                <div className="userNameBlock">
                  <div className="userNameRightSide">__nikki_Budzinski</div>
                  <div className="userFullName">New to Instagram</div>
                </div>
              </div>
              <div className="switchBtn">Follow</div>
            </div>
            <div className="topProfileRightBottom">
              <div className="leftRightProfile">
                <div className="imageDivRightSide">
                  <img
                    className="imageRightSideProfile"
                    src="https://media-cdn.socastsrm.com/wordpress/wp-content/blogs.dir/2684/files/2021/12/nikki-budzinski-21.jpeg"
                    alt="img4"/>
                </div>
                <div className="userNameBlock">
                  <div className="userNameRightSide">__nikki_Budzinski</div>
                  <div className="userFullName">New to Instagram</div>
                </div>
              </div>
              <div className="switchBtn">Follow</div>
            </div>
            <div className="topProfileRightBottom">
              <div className="leftRightProfile">
                <div className="imageDivRightSide">
                  <img
                    className="imageRightSideProfile"
                    src="https://media-cdn.socastsrm.com/wordpress/wp-content/blogs.dir/2684/files/2021/12/nikki-budzinski-21.jpeg"
                    alt="img90" />
                </div>
                <div className="userNameBlock">
                  <div className="userNameRightSide">__nikki_Budzinski</div>
                  <div className="userFullName">New to Instagram</div>
                </div>
              </div>
              <div className="switchBtn">Follow</div>
            </div>
          
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        <div className="carousel-item">
          <img src="https://static01.nyt.com/images/2024/09/16/multimedia/16dc-senate-blackwomen-01-qptw/16dc-senate-blackwomen-01-qptw-superJumbo.jpg?quality=75&auto=webp" alt="Banner 1" />
        </div>
        <div className="carousel-item">
          <img src="https://static01.nyt.com/images/2024/09/15/multimedia/15election-live-trump-afterward-klgj/15election-live-trump-afterward-klgj-jumbo.jpg?quality=75&auto=webp" alt="Banner 2" />
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
