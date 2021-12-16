import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, createContext, useContext } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(false);

  const fetchProfile = async () => {
    try {
      // get access token
      const accessToken = await getAccessTokenSilently();

      // fetch profile in backend
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/v1/patient/profile`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = await response.json();

      // set user profile
      if (response.status === 200 && data?.userProfile) {
        setProfile(data.userProfile);

        // error because of forbidden resource access ? (incomplete profile)
      } else if (response.status === 403) {
        // if forbidden has redirect, redirect to given page. (Should always be /completeProfile)
        if (data.redirectUrl) {
          navigate(data.redirectUrl);
        } else {
          console.log(data);
        }
      } else {
        // how did we get here
        throw new Error("User profile not found | Unknown error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // dont let users use our app without completing their profile
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  return (
    <UserContext.Provider
      value={{ profile, loadingProfile: !profile, fetchProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
