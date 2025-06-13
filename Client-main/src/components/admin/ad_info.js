import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material/";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdInfo = () => {
  const [adminNo, setAdminNo] = useState(null);
  const [adminNick, setAdminNick] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/manager/manager_check`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        if (response.status === 200 && response.data.message === "success") {
          setAdminNo(response.data.user_no);
          setAdminNick(response.data.user_nick);
          setAdminEmail(response.data.user_email);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("관리자만 접근 가능한 페이지입니다!");
          navigate("/home");
        } else {
          console.log("사용자 확인 중 에러: ", error);
          alert("관리자 확인 중 에러가 발생했습니다. 다시 한번 시도해주세요!");
          navigate("/home");
        }
      }
    };

    checkAdmin();
  }, [navigate, userToken]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      padding="20px"
      margin="20px"
      sx={{
        width: "20vw",
        height: "80vh",
        maxWidth: "180px",
        maxHeight: "300px",
        minWidth: "230px",
        minHeight: "50px",
        borderRadius: "25px",
        backgroundColor: "#2a41bb",
        overflow: "auto",
      }}
    >
      <Grid
        container
        display="flex"
        flexDirection="column"
        sx={{ color: "white" }}
      >
        <Grid item>
          <Typography
            variant="h4"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ marginBottom: "20px", fontWeight: "bold" }}
          >
            관리자 정보
          </Typography>
        </Grid>
        <Grid item sx={{ marginBottom: "20px" }}>
          <Typography> 사용자 번호 : </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{adminNo}</Typography>
        </Grid>
        <Grid item sx={{ marginBottom: "20px" }}>
          <Typography> 사용자 이름 : </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{adminNick}</Typography>
        </Grid>
        <Grid item sx={{ marginBottom: "20px" }}>
          <Typography>사용자 이메일 :</Typography>
          <Typography sx={{ fontWeight: "bold" }}>{adminEmail}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdInfo;
