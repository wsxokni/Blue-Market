import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CardActionArea,
  Box,
  Badge,
} from "@mui/material";
import { indigo } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; // socket.io 추가

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatCard = ({ chat }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState("");
  const post_no = chat.post_no;
  const [unread, setUnread] = useState(0);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/post/get_post/${post_no}`,
          { headers: { Authorization: `Bearer ${userToken}` } },
        );
        const postData = response.data[0];
        setPost(postData);
      } catch (err) {
        console.log("데이터를 가져오는데 실패하였습니다.");
      }
    };
    fetchPostData();
  }, [post_no]);

  //console.log("각 채팅방 카드 별 포스트 정보", post);

  useEffect(() => {
    const chatNo = chat.chat_no;
    const fetchUnread = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chat/unread`, {
          params: {
            chat_no: chatNo,
          },
          headers: { Authorization: `Bearer ${userToken}` },
        });

        //console.log(response.data.unread_count);
        setUnread(response.data.unread_count);
      } catch (error) {
        console.log("안읽음 뱃지 처리 오류", error);
      }
    };
    // console.log(unread);

    // 소켓 연결 및 이벤트 처리
    const socket = io(`${API_BASE_URL}`);
    socket.emit("join_room", chat.chat_no); // 현재 채팅방에 참가

    socket.on("update_unread", (data) => {
      if (data.chat_no === chat.chat_no) {
        fetchUnread(); // 동일한 채팅방인 경우에만 업데이트
      }
    });

    fetchUnread();

    return () => {
      socket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 해제
    };
  }, [chat.chat_no]);

  const handleCardClick = () => {
    navigate(`chatRoom/${chat.chat_no}`, {
      state: { post, chatNo: chat.chat_no },
    }); // 각 채팅방으로 이동하기
  };

  // 채팅을 보낸 시점 띄우는 함수
  const chatTime = (chatTime) => {
    const chatDate = new Date(chatTime);
    const today = new Date();

    // 채팅을 보낸 시점이 오늘인지 판단
    const isToday =
      chatDate.getDate() === today.getDate() &&
      chatDate.getMonth() === today.getMonth() &&
      chatDate.getFullYear() === today.getFullYear();

    // 채팅을 보낸 시점이 오늘이면 시:분 표시
    return isToday
      ? chatDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : chatDate.toLocaleDateString();
  };

  return (
    <Card
      sx={{
        display: "flex",
        height: 140,
        maxWidth: "1000px",
        position: "relative",
        "&:hover": {
          backgroundColor: indigo[50],
        },
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{ display: "flex", width: "100%" }}
      >
        <Box
          sx={{ position: "relative", width: 120, height: 120, margin: "3%" }}
        >
          <CardMedia
            component="img"
            sx={{ width: "120px", height: "120px", borderRadius: 2 }}
            image={chat.post_img || "https://via.placeholder.com/140"}
            alt={chat.post_title}
          />
        </Box>
        <CardContent
          sx={{ flexGrow: 1, overflow: "hidden", pr: 3, maxWidth: "65%" }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            height="100%"
          >
            <Grid item container flexDirection="column">
              <Typography variant="h6" component="div">
                {chat.post_title}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {chatTime(chat.chat_time)}
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                maxWidth="100%"
              >
                {chat.chat_content}
              </Typography>
              <Typography variant="subtitle2" component="div" noWrap>
                {chat.chat_sender_nick}
              </Typography>
            </Grid>
            <Badge
              badgeContent={unread}
              color="error"
              sx={{ position: "absolute", top: 10, right: 10 }}
            />
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ChatCard;
