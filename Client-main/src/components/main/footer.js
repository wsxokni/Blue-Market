import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Badge } from "@mui/material";
import { Home, Add, Chat, Person } from "@mui/icons-material";
import axios from "axios";
import { io } from "socket.io-client"; // 실시간 unread 상태 업데이트를 위한 소켓 가져오기

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0); // unread 상태 추가
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const socket = io(`${API_BASE_URL}`); // 소켓 연결

  useEffect(() => {
    // unread 상태 가져오기
    const fetchUnread = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chat/unread_total`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setUnread(response.data.unread_total);
      } catch (error) {
        console.log("안읽음 메시지 오류:", error);
      }
    };
    fetchUnread();

    // 소켓으로 업데이트 이벤트 수신
    socket.on("update_unread_total", (data) => {
      setUnread(data.unread_total);
    });

    return () => {
      socket.disconnect();
    };
  }, [userToken, socket]);

  const getSelectedIndex = () => {
    switch (location.pathname) {
      case "/home":
        return 0;
      case "/chat":
        return 1;
      case "/WritePost":
        return 2;
      case "/mypage":
        return 3;
      default:
        return 0;
    }
  };

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate("/home");
        break;
      case 1:
        navigate("/chat");
        break;
      case 2:
        navigate("/WritePost");
        break;
      case 3:
        navigate("/mypage");
        break;
      default:
        navigate("/home");
    }
  };

  return (
    <footer>
      <BottomNavigation
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        }}
        value={getSelectedIndex()}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction label="홈" icon={<Home />} />
        <BottomNavigationAction
          label="채팅"
          icon={
            <Badge badgeContent={unread} color="error">
              <Chat />
            </Badge>
          }
        ></BottomNavigationAction>
        <BottomNavigationAction label="글쓰기" icon={<Add />} />
        <BottomNavigationAction label="나의 장터" icon={<Person />} />
      </BottomNavigation>
    </footer>
  );
};

export default Footer;
