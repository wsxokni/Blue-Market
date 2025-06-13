import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Grid,
  CardActionArea,
  Box,
} from "@mui/material";
import {
  Favorite,
  Chat,
  SellRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import { indigo } from "@mui/material/colors";
import blurBox from "../../css/blurBox";

const Postcard = ({ post }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleCardClick = () => {
    navigate(`/post/${post.post_no}`);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReport = () => {
    navigate(`/report/${post.post_no}`);
  };

  // 게시글 올린 시점 띄우는 함수
  const postTime = (postTime) => {
    const postDate = new Date(postTime);
    const today = new Date();

    // 게시글을 올린 시점이 오늘인지 판단
    const isToday =
      postDate.getDate() === today.getDate() &&
      postDate.getMonth() === today.getMonth() &&
      postDate.getFullYear() === today.getFullYear();

    // 게시글을 올린 시점이 오늘이면 시:분 표시
    return isToday
      ? postDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : postDate.toLocaleDateString();
  };
  return (
    <Card
      sx={{
        display: "flex",
        height: 160,
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
          sx={{ position: "relative", width: 120, height: 120, margin: "1%" }}
        >
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "100%", borderRadius: 2 }}
            image={post.post_img || "https://via.placeholder.com/140"}
            alt={post.post_title}
          />
          {post.post_status === 2 && (
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
            {postTime(post.post_sdd)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          position: "absolute",
          bottom: 0,
          right: 3,
          padding: 0,
          margin: 0,
        }}
      >
        <IconButton disabled aria-label="찜" sx={{ padding: 0, margin: 0 }}>
          <Favorite sx={{ width: "50%" }} />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {post.post_like_cnt === null ? 0 : post.post_like_cnt}
          </Typography>
        </IconButton>
        <IconButton
          disabled
          aria-label="채팅 수"
          sx={{ padding: 0, margin: 0 }}
        >
          <Chat sx={{ width: "50%" }} />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {post.post_chat_cnt === null ? 0 : post.post_chat_cnt}
          </Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Postcard;
