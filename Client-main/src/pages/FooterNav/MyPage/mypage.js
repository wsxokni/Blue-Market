import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import FooterNav from "../../../components/main/footer";
import Header from "../../../components/main/header";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../../../components/main/logoutButton";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Mypage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const userToken = localStorage.getItem("userToken");
  const [userGrade, setUserGrade] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/authinfo`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`, // 헤더에 토큰 추가
            },
          },
        );
        setUserInfo(response.data[0]); // 받아온 사용자 정보 설정
        // console.log(response.data[0]);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [userToken]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.user_grade === 0) {
        setUserGrade("첫눈");
      } else if (userInfo.user_grade === 1) {
        setUserGrade("함박눈");
      } else {
        setUserGrade("만년설");
      }
    }
  }, [userInfo]);

  if (!userInfo) {
    return (
      <div style={{ paddingTop: 50, paddingBottom: 50 }}>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
        <FooterNav />
      </div>
    );
  }

  const sdd_time = moment().diff(moment(userInfo.user_sdd), "days"); // 가입한 날부터 현재까지의 일수 계산

  // 닉네임의 첫 글자 추출
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  // 닉네임 재설정 페이지로 이동
  const handleNicknameReset = () => {
    navigate("/nickReset");
  };

  // 공지사항으로 이동
  const handleNotification = () => {
    navigate("/notification");
  };

  // 탈퇴하기 버튼용 다이얼로그
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteAccount = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/deleteaccount`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      // 탈퇴 처리 후 로그아웃 로직과 동일하게 작동
      localStorage.removeItem("userToken");
      localStorage.removeItem("userNickname");
      localStorage.removeItem("recentSearchItem");
      alert("계정이 성공적으로 탈퇴되었습니다!");
      navigate("/");
    } catch (error) {
      console.log("탈퇴 처리 중 서버 오류 : ", error);
      alert("탈퇴 처리 중 오류가 발생했습니다. 다시 한번 시도해주세요!");
    } finally {
      setOpen(false); // 다이얼로그 닫기
    }
  };

  const handleAdminPage = () => {
    navigate("/adHome");
  };

  return (
    <div style={{ paddingTop: 50, paddingBottom: 50 }}>
      <Header />
      <Container maxWidth="md">
        <Box mt={4} mb={4}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid
                  item
                  xs={12}
                  md={4}
                  display="flex"
                  justifyContent="center"
                >
                  <Avatar
                    alt={userInfo.user_nick}
                    src={userInfo.user_avatar}
                    sx={{ width: 120, height: 120 }}
                  >
                    {!userInfo.user_avatar && getInitial(userInfo.user_nick)}
                  </Avatar>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid
                    display="flex"
                    justifyContent="space-between"
                    paddingBottom="10px"
                  >
                    <Typography variant="h5" display="flex" alignItems="center">
                      {userInfo.user_nick}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleNicknameReset}
                      sx={{ padding: 1 }}
                    >
                      닉네임 재설정
                    </Button>
                  </Grid>
                  <Typography variant="body1" gutterBottom>
                    이메일: {userInfo.user_email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    우리가 함께한 날들: {sdd_time}일
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    나의 등급: {userGrade}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        {/* 공지사항 버튼 */}
        <Box mb={4} onClick={handleNotification}>
          <Card>
            <CardContent>
              <Grid alignItems="center">
                <Typography variant="body1">공지사항</Typography>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        {/* 로그아웃 버튼 */}
        <LogoutButton />

        {/* 탈퇴하기 버튼 */}
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleOpen}
          style={{ marginTop: "30px" }}
        >
          탈퇴하기
        </Button>
        {/* 탈퇴 확인 다이얼로그 */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              계정을 탈퇴하면 복구할 수 없습니다. <br /> 탈퇴하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              유지하기
            </Button>
            <Button onClick={handleDeleteAccount} color="secondary" autoFocus>
              탈퇴하기
            </Button>
          </DialogActions>
        </Dialog>

        {/*사용자 정보 중 관리자만 해당 버튼 나오도록*/}
        {userInfo.user_tp === 0 && (
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={handleAdminPage}
            style={{ marginTop: "80px" }}
          >
            관리자 페이지로 이동
          </Button>
        )}
      </Container>

      <FooterNav />
    </div>
  );
};

export default Mypage;
