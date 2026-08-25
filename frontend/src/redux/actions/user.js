import axios from "axios";
import { server } from "../../server";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({
        type: "LoadUserFail",
        payload: "No active user session",
      });
      return;
    }

    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token,
      },
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    localStorage.removeItem("token");
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    const sellerToken = localStorage.getItem("seller_token");
    if (!sellerToken) {
      dispatch({
        type: "LoadSellerFail",
        payload: "No active seller session",
      });
      return;
    }

    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${sellerToken}`,
        "x-seller-token": sellerToken,
      },
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    localStorage.removeItem("seller_token");
    dispatch({
      type: "LoadSellerFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "User address updated succesfully!",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "User deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
