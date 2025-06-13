import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/main/footer";
import Header from "../../components/main/header";
import { Container, Button, Box, ButtonGroup } from "@mui/material";
import { indigo } from "@mui/material/colors";
import axios from "axios";
import { useInView } from "react-intersection-observer"; // 무한스크롤
import PostCard from "../../components/post/postcard";
import { Grid } from "@mui/material/";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글 상태 추가
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // 상태 카테고리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const { ref, inView } = useInView();

  const fetchPosts = async (page, append = false) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/post/post_list/${page}`,
      );
      if (response.data.length === 0) {
        setHasMore(false); // 데이터가 더이상 없으면 false
      } else {
        const newPosts = append ? [...posts, ...response.data] : response.data;
        setPosts(newPosts);
        applyFilter(newPosts, filter);
      }
    } catch (err) {
      console.error("Error fetching posts", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryPosts = async (cate) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/post/post_cate_list/${cate}`,
      );
      setPosts(response.data);
      applyFilter(response.data, filter); // 카테고리 변경 시 필터 적용
      setHasMore(false);
    } catch (err) {
      console.error("데이터를 불러오는데 오류가 발생했습니다.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setHasMore(true);

    if (selectedCategory === "전체") {
      fetchPosts(0);
    } else {
      fetchCategoryPosts(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "전체" && inView && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [inView, hasMore, selectedCategory, isLoading]);

  const loadMorePosts = async () => {
    const nextPage = page + 1;
    await fetchPosts(nextPage, true);
    setPage(nextPage);
  };

  const categories = [
    "전체",
    "의류",
    "도서",
    "전자제품",
    "화장품",
    "생필품",
    "기프티콘",
    "대리예매",
    "계정대여",
    "기타",
  ];

  const handleCategoryClick = (cate) => {
    setSelectedCategory(cate);
    setFilter("all")
    setPage(0);
    setHasMore(true)
  };

  // 필터링된 게시글 적용 함수
  const applyFilter = (allPosts, currentFilter) => {
    if (currentFilter === "all") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter((post) => {
        if (currentFilter === "sell") {
          return post.post_type === 0;
        } else if (currentFilter === "buy") {
          return post.post_type === 1;
        }
        return false;
      });
      setFilteredPosts(filtered);
    }
  };

  useEffect(() => {
    applyFilter(posts, filter);
  }, [filter, posts]); // 필터 상태 변경 시 필터링 적용

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div style={{ paddingTop: 50 }}>
      <Header />
      <Container style={{ paddingTop: "1%", paddingBottom: "20%" }}>
        <Container
          style={{
            overflow: "auto",
            whiteSpace: "nowrap",
            padding: 1,
            marginTop: 10,
          }}
        >
          {categories.map((cate) => (
            <Button
              key={cate}
              variant={selectedCategory === cate ? "contained" : "outlined"}
              onClick={() => handleCategoryClick(cate)}
              sx={{
                mx: 0.5,
                my: 1,
                backgroundColor: selectedCategory === cate ? indigo[500] : null,
              }}
            >
              {cate}
            </Button>
          ))}
        </Container>

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

        <div>
          <Grid container spacing={2}>
            {filteredPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={post.post_no}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        </div>
        {selectedCategory === "전체" && (
          <div ref={ref} style={{ height: 20 }} />
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
