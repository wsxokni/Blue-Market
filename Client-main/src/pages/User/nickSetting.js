import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControl,
  Grid,
  Box,
  Typography,
  Container,
  FormHelperText,
} from "@mui/material/";
import styled from "styled-components";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FormHelperTexts = styled(FormHelperText)`
  width: 100%;
  padding-left: 16px;
  font-weight: 700 !important;
  color: #ff4747 !important;
`;

const Boxs = styled(Box)`
  padding-bottom: 40px !important;
`;

const NickSetting = ({ isReset }) => {
  // isReset을 통해 닉네임 재설정 여부 결정
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const navigate = useNavigate();
  const nicknameRegex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/;

  // 닉네임 변화 감지
  useEffect(() => {
    setNicknameChecked(false);
    setNicknameError("");
  }, [nickname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname) {
      setNicknameError("내용을 작성해주세요.");
      return false;
    }
    if (nickname.length < 2 || nickname.length > 11) {
      setNicknameError("2자 ~ 10자의 닉네임을 사용해주세요.");
      setNicknameChecked(false);
      return false;
    }

    // 유효성 체크
    if (!nicknameRegex.test(nickname)) {
      setNicknameError(
        "올바른 닉네임 형식이 아닙니다. 공백이 존재하면 안됩니다.",
      );
      setNicknameChecked(false);
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("사용자 정보가 존재하지 않습니다. 로그인을 다시 진행해주세요.");
      navigate("/login");
      return;
    }

    try {
      //회원가입 중 닉네임 설정 vs 닉네임 재설정 구분
      // console.log("유저토큰", token);
      const apiEndpoint = isReset
        ? `${API_BASE_URL}/auth/nick_update` // 닉네임 업데이트 api
        : `${API_BASE_URL}/auth/nick_check`; // 첫 닉네임 설정 api

      const response = await axios.post(
        apiEndpoint,
        { nickname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.message === "success") {
        setNicknameError("");
        setNicknameChecked(true); // 중복 확인 완료

        if (isReset) {
          // 닉네임 업데이트 성공 메시지
          alert("닉네임이 성공적으로 변경되었습니다!");
          navigate("/mypage");
        } else {
          // 회원가입 성공 메시지
          const userNick = response.data.nickname;
          alert(
            userNick + "님 가입을 축하드립니다! 로그인을 한번 더 진행해주세요!",
          );
          navigate("/login");
        }
      } else if (response.data.message === "already_exist_nick") {
        setNicknameError("중복된 닉네임입니다. 다른 닉네임을 사용해주세요.");
        setNicknameChecked(false);
      }
    } catch (error) {
      setNicknameError("닉네임 검사 및 설정 중 오류 발생: " + error.message);
      setNicknameChecked(false);
    }
  };

  // 초기 닉네임 세팅 시 뒤로가면 토큰 삭제
  useEffect(() => {
    const handlePopState = () => {
      if (!isReset) {
        localStorage.removeItem("userToken");
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isReset]);

  return (
    <div className="screen">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            minHeight: "85vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
          <Typography component="h1" variant="h5">
            {isReset ? "닉네임 재설정" : "닉네임 설정"}
          </Typography>
          <Boxs
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormControl component="fieldset" variant="standard">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nickname"
                    name="nickname"
                    label="닉네임"
                    error={nicknameError !== ""}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                size="large"
              >
                {isReset ? "닉네임 변경하기" : "파란장터 시작하기"}
              </Button>
            </FormControl>
            <FormHelperTexts>{nicknameError}</FormHelperTexts>
          </Boxs>
        </Box>
      </Container>
    </div>
  );
};

export default NickSetting;
