import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LogoutRounded } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatOutButton = ({ chatNo, socket }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 나가기 버튼 다이얼로그
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOutButton = async () => {
    // 확인용 콘솔
    // console.log("채팅방 나가기 버튼 눌림", chatNo);

    try {
      await axios.post(
        `${API_BASE_URL}/chat/leaveChatRoom`,
        { chat_no: chatNo },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      // 소켓 이벤트 발생
      if (socket) {
        socket.emit("leave_room", { chatNo, userToken });
      }

      navigate("/chat");
    } catch (error) {
      console.log("채팅방 나가는 중 서버 오류 : ", error);
      alert("처리 중에 오류가 발생했습니다. 다시 한번 시도해주세요!");
    } finally {
      setOpen(false); // 다이얼로그 닫기
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>
        <LogoutRounded color="primary" />
      </Button>
      {/* 채팅망 나가기 확인 다이얼로그 */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>정말 나가시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            채팅방을 나가면 모든 데이터가 삭제됩니다. <br /> 나가시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            유지하기
          </Button>
          <Button onClick={handleOutButton} color="secondary" autoFocus>
            나가기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatOutButton;
