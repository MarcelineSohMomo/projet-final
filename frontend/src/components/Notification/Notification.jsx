import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api";
import { getToken, getUser } from "../../util";

const Notification = ({clickedMemberId}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const isconnected =  localStorage.getItem("isconnected");
  const token = getToken();
  const userID = getUser()._id;
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      id: userID
    },
  }


  useEffect(() => {
    if (!isconnected) return Navigate('/signin');

    const fetchUsersAndNotifications = async () => {
      try {
        const response = await api.getUsersAndNotification(header);
        console.log("data  ", response.data);
        const totalUnreadCount = response.data.reduce(
          (count, user) => count + user.unreadCount,
          0
        );
        setUnreadCount(totalUnreadCount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsersAndNotifications();
  }, [clickedMemberId]);

  console.log("scroll  ", unreadCount);
  return <Fragment>
      {unreadCount}
  </Fragment> ;
};

export default Notification;
