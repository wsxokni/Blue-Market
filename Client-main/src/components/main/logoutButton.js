import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { indigo } from "@mui/material/colors";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleLogout = (e) => {
    e.stopPropagation(); // 이벤트 전파 중지
    localStorage.removeItem("userToken");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("recentSearchItem");
    navigate("/");
    setOpen(false); //로그아웃 후 대화 상자 닫기
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
    "&:hover": {
      backgroundColor: indigo[700],
    },
  }));

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} fullWidth>
        로그아웃
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-alert"
        aria-describedby="logout"
      >
        <DialogContent>
          <DialogContentText id="logout">
            로그아웃하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <ColorButton onClick={handleLogout} color="primary" autoFocus>
            로그아웃
          </ColorButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutButton;
