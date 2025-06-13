import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  CardActionArea,
  Box,
  Button,
  Grid,
} from "@mui/material";
import {
  Favorite,
  Chat,
  MoreVert,
  GppMaybeRounded,
  SellRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import { indigo } from "@mui/material/colors";
import blurBox from "../../css/blurBox";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatRoomcard = () => {
  const location = useLocation();
  const { post, chatNo } = location.state;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [checkUser, setCheckUser] = useState(false);
  const [postOwner, setPostOwner] = useState("");
  const [statusEnd, setStatusEnd] = useState(false);

  useEffect(() => {
    setPostOwner(post.post_user_no);

    const verifyUser = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/verify_user`,
          { post_user_no: post.post_user_no },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        if (response.data.verified) {
          setCheckUser(true);
        } else {
          setCheckUser(false);
        }
      } catch (error) {
        console.error("통신 오류 사용자 인증 실패", error);
        setCheckUser(false);
      }
    };
    verifyUser();
  }, [post, userToken]);

  // 거래완료 버튼
  const handleCompleteTransaction = async () => {
    const confirmDelete = window.confirm("거래 완료 처리를 하시겠습니까?");
    if (!confirmDelete) {
      return;
    }
    const post_no = post.post_no;

    //사용자 확인 후 거래완료 처리
    try {
      const response = await axios.post(
        `${API_BASE_URL}/post/post_update_finish`,
        { post_no: post_no, chat_no: chatNo },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (response.data.message === "success") {
        // console.log("거래완료 처리했습니다.");
        alert("거래 완료 처리 되었습니다!");
        navigate("/home");
      } else {
        console.error("게시물 상태 변경 실패", response.data);
        alert("거래완료 처리 중 오류가 발생했습니다. 다시 한번 시도해주세요!");
        navigate("/home");
      }
    } catch (err) {
      console.error("게시글 상태 변경 중 통신 오류", err);
      alert("거래완료 처리 중 오류가 발생했습니다. 다시 한번 시도해주세요!");
      navigate("/home");
    }

    setStatusEnd(true);
    // console.log("거래 완료 처리");
  };

  // 경찰청 사기 조회 사이트
  const handleCheckCheat = () => {
    window.location.href =
      "https://www.police.go.kr/www/security/cyber/cyber04.jsp"; // 경찰청 사기조회 사이트
  };

  const handleCardClick = () => {
    navigate(`/post/${post.post_no}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        height: 140,
        position: "relative",
        margin: "2px",
        "&:hover": {
          backgroundColor: indigo[50],
        },
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{ display: "flex", width: "90%" }}
      >
        <Box
          sx={{
            position: "relative",
            width: 120,
            height: 120,
            margin: "3%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: 2,
            }}
            image={post.post_img || "https://via.placeholder.com/140"}
            alt={post.post_title}
          />
          {(statusEnd || post.post_status === 2) && (
            <Box sx={blurBox}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                거래완료
              </Typography>
            </Box>
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, overflow: "hidden", pr: 3 }}>
          {post.post_type === 0 ? (
            <Grid container>
              <SellRounded
                variant="button"
                color="primary"
                sx={{ marginRight: 1 }}
              />
              <Typography variant="button" color="primary">
                팔아요
              </Typography>
            </Grid>
          ) : (
            <Grid container>
              <ShoppingCartRounded
                variant="button"
                color="primary"
                sx={{ marginRight: 1 }}
              />
              <Typography variant="button" color="primary">
                구해요
              </Typography>
            </Grid>
          )}
          <Typography variant="subtitle1" component="div">
            {post.post_title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {post.post_price}원
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {new Date(post.post_sdd).toLocaleDateString()}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          pr: 1,
          pt: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCheckCheat}
          sx={{ mt: 1, width: "110px", height: "50px" }}
        >
          <GppMaybeRounded sx={{ mr: 1 }} />
          <Typography variant="body2">사기조회</Typography>
        </Button>
        {checkUser && (
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleCompleteTransaction}
            sx={{ mt: 1, width: "130px", height: "50px" }}
            disabled={post.post_status === 2}
          >
            거래 완료
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ChatRoomcard;
