import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material/";
import {
  PersonSearchRounded,
  ErrorRounded,
  CampaignRounded,
  ExitToAppRounded,
} from "@mui/icons-material";
import { indigo } from "@mui/material/colors";
import { IconButton } from "@mui/material";
import Logout from "../../components/main/logoutButton";
import LogoName from "../../images/logo_name.png";
import { useNavigate } from "react-router-dom";

const AdSidebar = ({ onContentChange }) => {
  const navigate = useNavigate();
  const handelParanMarketClick = () => {
    navigate("/home");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      padding="20px"
      margin="20px"
      sx={{
        width: "15%",
        height: "90vh",
        maxWidth: "200px",
        maxHeight: "100vh",
        minWidth: "150px",
        minHeight: "650px",
        borderRadius: "25px",
        backgroundColor: "#2a41bb",
        overflow: "auto", // 내용이 넘칠 경우 스크롤 가능
      }}
    >
      <Grid
        sx={{
          width: "100%",
          marginBottom: "80px",
        }}
      >
        <img
          src={LogoName}
          alt="Logo"
          onClick={() => onContentChange("home")}
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
        />
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item margin="10px">
          <IconButton
            onClick={() => onContentChange("member")}
            sx={{ color: "white" }}
          >
            <PersonSearchRounded sx={{ marginRight: "30px" }} />
            <Typography variant="h6">회원조회</Typography>
          </IconButton>
        </Grid>
        <Grid item margin="10px">
          <IconButton
            onClick={() => onContentChange("report")}
            sx={{ color: "white" }}
          >
            <ErrorRounded sx={{ marginRight: "30px" }} />
            <Typography variant="h6">신고현황</Typography>
          </IconButton>
        </Grid>
        <Grid item margin="10px">
          <IconButton
            onClick={() => onContentChange("notice")}
            sx={{ color: "white" }}
          >
            <CampaignRounded sx={{ marginRight: "30px" }} />
            <Typography variant="h6">공지사항</Typography>
          </IconButton>
        </Grid>
        <Grid item margin="10px">
          <IconButton onClick={handelParanMarketClick} sx={{ color: "white" }}>
            <ExitToAppRounded sx={{ marginRight: "30px" }} />
            <Typography variant="h6">파란장터</Typography>
          </IconButton>
        </Grid>

        <Grid item mt="10vh">
          <Logout />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdSidebar;
