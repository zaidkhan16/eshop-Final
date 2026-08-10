import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h5
          className={`text-[35px] leading-[1.2] 700px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Welcome to eShop: <br /> Your Ultimate Destination for Perfect
          Products at one Stop
        </h5>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          At eShop, we're committed to providing you with a seamless online
          shopping experience. Whether you're in search of the latest gadgets,
          fashion essentials, home decor, or anything in between, we've got you
          covered. With a wide range of branded products, we bring you the best
          of quality and style right to your fingertips.
          <br />
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
