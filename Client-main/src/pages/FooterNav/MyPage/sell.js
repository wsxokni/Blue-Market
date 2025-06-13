import React, { useState, useEffect } from "react";
import { Container, Grid, Button, ButtonGroup } from "@mui/material";
import axios from "axios";
import Footer from "../../../components/main/footer";
import Header from "../../../components/myPage/myPageHeader";
import Postcard from "../../../components/post/postcard";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Sell = () => {
  const [allPosts, setAllPosts] = useState([]); // 모든 데이터를 저장할 상태
  const [posts, setPosts] = useState([]); // 필터링된 데이터를 저장할 상태
  const [filter, setFilter] = useState("all"); // 상태 카테고리
  const userToken = localStorage.getItem("userToken"); // useState 불필요

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/mypage/get_user_post`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        setAllPosts(response.data);
        setPosts(response.data);
      } catch (error) {
        console.log("데이터 송신중 오류 발생", error);
      }
    };
    fetchPosts();
  }, [userToken]);

  // 필터 상태 변경 반영하기
  useEffect(() => {
    if (filter === "all") {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter((post) => {
        if (filter === "sell") {
          return post.post_type === 0;
        } else if (filter === "buy") {
          return post.post_type === 1;
        }
        return false; // 필터 조건 외의 경우 false 반환
      });
      setPosts(filteredPosts);
    }
  }, [filter, allPosts]); // allPosts가 변경될 때마다 필터링 수행

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <Header title="내가 올린 게시글" />
      <ButtonGroup fullWidth sx={{ mt: 1 }}>
        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("all")}
        >
          전체
        </Button>
        <Button
          variant={filter === "sell" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("sell")}
        >
          팔아요
        </Button>
        <Button
          variant={filter === "buy" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("buy")}
        >
          구해요
        </Button>
      </ButtonGroup>

      <Container style={{ paddingTop: "5%", paddingBottom: "20%" }}>
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Postcard post={post} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default Sell;
