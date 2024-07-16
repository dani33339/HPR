import React, { useEffect } from "react";
import "./Portifolio.css";

//imported assets
import icon1 from "./assets/meta.png";
import icon2 from "./assets/best-price.png";
import image from "./assets/girdimage.png";

import Aos from "aos";
import "aos/dist/aos.css";

const Portifolio = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="portifolio section container">
      <div className="secContainer grid">
        <div className="leftContent">
          <div className="secHeading" data-aos="fade-up">
            <h3>Why Should You Choose Us</h3>
            <p>
              We have extensive knowledge and experience in the travel industry.{" "}
              <br />
              Our algorithm helps you find the best deals and destinations.{" "}
              <br />
              Unique deals that you can't find anywhere else.
            </p>
          </div>

          <div className="grid">
            <div className="singlePortifolio flex" data-aos="fade-up">
              <div className="iconDiv">
                <img src={icon1} alt="Icon Image" />
              </div>
              <div className="infor">
                <h4>Meta Search of Meta Searches</h4>
                <p>
                  Compare prices for the best deals.
                  Select your preferred meta search provider and 
                  order from your preferred OTA.
                  Our algorithm finds the best prices without limitations
                  of geo-blocking and cookie prices.
                </p>
              </div>
            </div>
            <div className="singlePortifolio flex" data-aos="fade-up">
              <div className="iconDiv">
                <img src={icon2} alt="Icon Image" />
              </div>
              <div className="infor">
                <h4>Our Algorithm Finds the Best Prices</h4>
                <p>
                  Our algorithm ensures the best prices are found without
                  restrictions like geo-blocking or cookie-based pricing. We
                  offer a diverse range of destinations to cater to different
                  interests and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rightContent" data-aos="fade-up">
          <img src={image} alt="Image" />
        </div>
      </div>
    </div>
  );
};

export default Portifolio;
