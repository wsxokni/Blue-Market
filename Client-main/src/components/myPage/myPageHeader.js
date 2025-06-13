import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Grid, Button } from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import "../../css/logo_font.css";
import ChatOutButton from "../chat/chatOutButton";

const MyPageHeader = ({
  title = "파란장터",
  showChatOutButton = false,
  chatNo,
  socket,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar sx={{ p: 0, justifyContent: "space-between" }}>
        <Button
          color="primary"
          aria-label="back"
          onClick={handleBackClick}
          edge="start"
        >
          <ArrowBackIosNewRounded />
        </Button>
        <Grid container justifyContent="center">
          <h1 className="logo_font">{title}</h1>
        </Grid>
        {showChatOutButton && (
          <Button aria-label="out" edge="end">
            <ChatOutButton chatNo={chatNo} socket={socket} />
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MyPageHeader;
