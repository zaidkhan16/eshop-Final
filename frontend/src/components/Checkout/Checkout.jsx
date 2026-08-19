import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { HiOutlineSparkles, HiOutlineLocationMarker, HiOutlineMap } from "react-icons/hi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [analyzingPin, setAnalyzingPin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (
      !address1 ||
      !zipCode ||
      !country ||
      !state ||
      !city
    ) {
      toast.error("Please fill in your complete shipping address (Country, State, City & Address)!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        state,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * (item.discountPrice || item.originalPrice),
    0
  );

  // shipping cost calculation
  const shipping = subTotalPrice > 0 ? (subTotalPrice > 500 ? 0 : subTotalPrice * 0.05) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    try {
      const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      
      if (res.data.couponCode !== null) {
        const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for items in your cart");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * (item.discountPrice || item.originalPrice),
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
          toast.success("Coupon code applied successfully!");
        }
      } else {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
    }
  };

  const discountPercentage = couponCodeData ? discountPrice : 0;

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  // Auto Pin Code & Zip Code Analyzer
  const handleZipCodeChange = async (val) => {
    setZipCode(val);
    const cleanPin = val ? val.toString().trim() : "";
    if (cleanPin.length < 5) return;

    setAnalyzingPin(true);

    try {
      // 1. India 6-digit PIN code lookup
      if (/^\d{6}$/.test(cleanPin)) {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.data && res.data[0]?.Status === "Success" && res.data[0].PostOffice?.length) {
          const po = res.data[0].PostOffice[0];
          const detectedState = po.State;
          const detectedCity = po.District || po.Block || po.Name;
          
          setCountry("IN");
          const statesList = State.getStatesOfCountry("IN");
          const matchedSt = statesList.find(
            (s) => s.name.toLowerCase() === detectedState.toLowerCase()
          );
          if (matchedSt) {
            setState(matchedSt.isoCode);
            setCity(detectedCity);
            toast.success(`PIN Code Analyzed: ${detectedCity}, ${detectedState} (India)`);
          }
        }
      } 
      // 2. Global / US Zip Code lookup
      else if (/^\d{5}$/.test(cleanPin)) {
        const cCode = country || "US";
        const res = await axios.get(`https://api.zippopotam.us/${cCode.toLowerCase()}/${cleanPin}`);
        if (res.data && res.data.places && res.data.places[0]) {
          const place = res.data.places[0];
          const placeName = place["place name"];
          const stateName = place["state"];
          const stateAbbr = place["state abbreviation"];
          
          const statesList = State.getStatesOfCountry(cCode);
          const matchedSt = statesList.find(
            (s) => s.name.toLowerCase() === stateName.toLowerCase() || s.isoCode === stateAbbr
          );
          if (matchedSt) {
            setState(matchedSt.isoCode);
          }
          setCity(placeName);
          toast.success(`Zip Code Analyzed: ${placeName}, ${stateName}`);
        }
      }
    } catch (err) {
      console.log("Pincode lookup error:", err);
    } finally {
      setAnalyzingPin(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-6 sm:py-10 bg-slate-50/60 min-h-screen">
      <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 grid grid-cols-1 1000px:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Shipping Form */}
        <div className="1000px:col-span-8">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            state={state}
            setState={setState}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            handleZipCodeChange={handleZipCodeChange}
            analyzingPin={analyzingPin}
          />
        </div>

        {/* Right Column: Order Summary */}
        <div className="1000px:col-span-4">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
            paymentSubmit={paymentSubmit}
          />
        </div>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  handleZipCodeChange,
  analyzingPin,
}) => {
  const availableStates = country ? State.getStatesOfCountry(country) : [];
  const availableCities = (country && state) ? City.getCitiesOfState(country, state) : [];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step 1 of 2</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">Shipping Address</h2>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <HiOutlineLocationMarker size={22} />
        </div>
      </div>

      <form className="space-y-4 sm:space-y-5">
        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              readOnly
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              readOnly
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Phone & Pin Code Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone Number</label>
            <input
              type="number"
              value={user && user.phoneNumber}
              readOnly
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Pincode / Zip Code</label>
              {analyzingPin && (
                <span className="text-[10px] text-indigo-600 font-bold animate-pulse flex items-center gap-1">
                  <HiOutlineSparkles className="w-3 h-3" /> Auto-analyzing...
                </span>
              )}
            </div>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              placeholder="e.g. 110001 or 90210"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>

        {/* Country, State & City Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Country Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Country</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setState("");
                setCity("");
              }}
            >
              <option value="">Select Country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">State / Province</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
              disabled={!country}
            >
              <option value="">Select State</option>
              {availableStates.map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown or Text Fallback */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">City</label>
            {availableCities.length > 0 ? (
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Select City</option>
                {availableCities.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            )}
          </div>
        </div>

        {/* Street Address Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Address Line 1 (Street / House)</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="House No, Building, Street Name"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Address Line 2 (Landmark / Area)</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Near Landmark, Sector, Area"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>
      </form>

      {/* Saved Addresses Selector */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <button
          type="button"
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
          onClick={() => setUserInfo(!userInfo)}
        >
          <HiOutlineBuildingOffice size={18} />
          <span>{userInfo ? "Hide Saved Addresses" : "Choose from Saved Addresses"}</span>
        </button>

        {userInfo && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user && user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setAddress1(item.address1 || "");
                    setAddress2(item.address2 || "");
                    setZipCode(item.zipCode || "");
                    setCountry(item.country || "IN");
                    setCity(item.city || "");
                    toast.info(`Loaded address: ${item.addressType || "Saved"}`);
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/80 hover:border-indigo-200 cursor-pointer transition-all flex items-start gap-3"
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{item.addressType || "Saved Address"}</span>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {item.address1}, {item.address2 && `${item.address2}, `}{item.city}, {item.country} ({item.zipCode})
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 font-medium">No saved addresses found in profile.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
  paymentSubmit,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
      <h3 className="text-lg font-black text-slate-900 tracking-tight pb-4 border-b border-slate-100 mb-5">
        Order Summary
      </h3>

      <div className="space-y-3.5 text-sm">
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>Subtotal:</span>
          <span className="font-bold text-slate-900">${subTotalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>Shipping Fee:</span>
          <span className="font-bold text-slate-900">
            {shipping === 0 ? <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span> : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {discountPercentage > 0 && (
          <div className="flex justify-between items-center text-emerald-600 font-bold">
            <span>Discount:</span>
            <span>-${discountPercentage.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
          <span className="text-base font-extrabold text-slate-900">Total Amount:</span>
          <span className="text-2xl font-black text-indigo-600 tracking-tight">${totalPrice}</span>
        </div>
      </div>

      {/* Coupon Form */}
      <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Promo / Coupon Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase"
            placeholder="Enter promo code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-md transition-all shrink-0"
          >
            Apply
          </button>
        </div>
      </form>

      {/* Proceed CTA */}
      <button
        onClick={paymentSubmit}
        className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <span>Proceed to Payment</span>
      </button>
    </div>
  );
};

export default Checkout;
