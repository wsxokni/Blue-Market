import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, CircularProgress, Typography } from "@mui/material";
import Footer from "../../../components/main/footer";
import Header from "../../../components/myPage/myPageHeader";
import Postcard from "../../../components/post/postcard";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Favorite = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  // 사용자 좋아요 정보 가져오기
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/mypage/get_like_list`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("찜 정보를 가져오는데 실패했습니다.", err);
        /* 나중에 주석 지우기 setLoading(true);*/
      }
    };
    fetchLikedPosts();
  }, []);

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "30vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div>
      <Header title="찜목록" />
      {posts.length === 0 ? (
        <Typography variant="h5" align="center" mt="30vh">
          찜한 게시물이 없습니다.
        </Typography>
      ) : (
        <Container style={{ paddingTop: "5%", paddingBottom: "20%" }}>
          <Grid container spacing={2}>
            {posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Postcard post={post} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <Footer />
    </div>
  );
};

export default Favorite;
