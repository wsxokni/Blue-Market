import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Grid, Snackbar } from "@mui/material";
import {
  HomeRounded,
  IosShareRounded,
  ArrowBackIosNewRounded,
} from "@mui/icons-material";
import MoreIcon from "./moreIcon";
import axios from "axios";

const PostHeader = ({ post }) => {
  //console.log("header recived: ", post);
  const userToken = useState(localStorage.getItem("userToken"));
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href) // 현재 페이지 URL을 복사
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // 딴데 선택하면 스낵바 안닫힘
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="back"
                onClick={handleBackClick}
              >
                <ArrowBackIosNewRounded />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="home"
                onClick={handleHomeClick}
              >
                <HomeRounded />
              </IconButton>
            </Grid>
            <Grid item sx={{ display: "flex" }}>
              <IconButton
                color="inherit"
                aria-label="share"
                onClick={handleShareClick}
              >
                <IosShareRounded />
              </IconButton>
              <MoreIcon post={post} />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500} // 자동닫힘처리
        onClose={handleSnackbarClose}
        message="링크가 클립보드에 복사되었습니다!"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ padding: 7 }}
      />
    </>
  );
};

export default PostHeader;
