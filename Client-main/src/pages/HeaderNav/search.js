import React, { useEffect, useState } from "react";
import {
  Input,
  Grid,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/main/footer";
import Postcard from "../../components/post/postcard";
import { ArrowBackIosNewRounded, Cancel } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";
import axios from "axios";
import { useInView } from "react-intersection-observer"; // 무한스크롤

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");
  const [isSearched, setIsSearched] = useState(false);
  const [recentSearchItem, setRecentSearchItem] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true); // 검색 기록 있는지 확인
  const { ref, inView } = useInView({ threshold: 0.5 }); //임계값 설정 무한 스크롤
  const [page, setPage] = useState(1); // 페이지네이션을 위한 상태

  const fetchSearchResults = async (keyword, page, type, append = false) => {
    try {
      let sendType = null;
      if (type === "sell") {
        sendType = 0;
      } else if (type === "buy") {
        sendType = 1;
      }
      // console.log("in fetch log", type);
      const response = await axios.post(`${API_BASE_URL}/post/search_post`, {
        keyword: keyword,
        page: page,
        type: sendType,
      });
      // console.log("send data", keyword, page, sendType);
      // console.log("Fetching search result:", page);
      // console.log("response data : ", response.data.results);

      // 서버 응답에서 results 배열이 있는지 확인하고, 없다면 빈 배열로 처리
      const newResults = response.data.results || [];
      if (newResults.length === 0) {
        setHasMore(false); // 데이터가 더이상 없으면 false
      } else {
        setSearchResults((prevPosts) => {
          const combinedResults = append
            ? [...prevPosts, ...newResults]
            : newResults;
          const uniquePosts = new Map(); // 중복 아이디 제거용.
          combinedResults.forEach((post) => {
            if (!uniquePosts.has(post.post_no)) {
              uniquePosts.set(post.post_no, post);
            }
          });
          return Array.from(uniquePosts.values());
        });
        setPage(page + 1); // 데이터 더 불러오기
      }
    } catch (err) {
      console.log("통신 에러.", err);
      setSearchResults([]);
    }
  };
  // console.log(searchResults);
  // 전체 / 구매 / 판매 필터 선택
  const handleFilterChange = (newType) => {
    setType(newType);
    setPage(1);
    setIsSearched(true); // 검색 상태를 재설정
    setHasMore(true);
    setSearchResults([]); // 검색 결과를 초기화 (이전 데이터 삭제용)
    // 새 필터로 검색 결과를 다시 불러오는 로직 추가
    fetchSearchResults(keyword, 1, newType, false);
  };

  // 무한스크롤
  useEffect(() => {
    if (isSearched && inView && hasMore) {
      fetchSearchResults(keyword, page, type, true);
    }
  }, [inView, page, hasMore, keyword, type, isSearched]);

  // 로컬 스토리지에 저장된 최근 검색기록 가져오기
  useEffect(() => {
    const recentSearch = JSON.parse(localStorage.getItem("recentSearchItem"));
    if (recentSearch) {
      setRecentSearchItem(recentSearch);
    }
  }, []);

  // 상단바 뒤로가기 클릭
  const handleBackClick = () => {
    navigate(-1);
  };

  // 검색바 내 검색어 감지
  const handleSearch = (e) => {
    setKeyword(e.target.value);
    if (e.target.value === "") {
      setIsSearched(false);
    }
  };

  // 엔터 눌렸을 때 검색 가능
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // 검색 버튼 눌렀을 때
  const handleSubmit = () => {
    // 검색 내용이 빈 문자열 / 공백만 있는 경우에는 검색 안됨
    if (typeof keyword === "string" && keyword.trim() !== "") {
      setIsSearched(true);
      setPage(1);
      setType("all");
      setSearchResults([]);
      setHasMore(true);
      updateRecentSearch(keyword.trim());
      fetchSearchResults(keyword.trim(), 1, type, false);
    } else {
      setIsSearched(false); // 검색창이 ""이면 결과창에 아무것도 띄우지 않기
      setKeyword("");
      alert("검색어를 입력해주세요.");
      return;
    }
  };

  // 최근 검색어 5개 저장하기
  const updateRecentSearch = (searchTerm) => {
    const updatedSearchItem = [
      searchTerm,
      ...recentSearchItem.filter((item) => item !== searchTerm),
    ].slice(0, 5);
    setRecentSearchItem(updatedSearchItem);
    localStorage.setItem("recentSearchItem", JSON.stringify(updatedSearchItem));
  };

  // 최근 검색어 누르면 검색 가능
  const handleRecentSearchClick = (searchTerm) => {
    setKeyword(searchTerm);
    setPage(1);
    setIsSearched(true);
    setHasMore(true);
    setSearchResults([]); // 검색 결과를 초기화 (이전 데이터 삭제용)
    fetchSearchResults(searchTerm, 1, type, false);
  };

  // 최근 검색어 삭제시에는 맞는거 빼고 다 저장
  const handleDelRecentSearchClick = (e, delTerm) => {
    e.stopPropagation(); // 상위컴포넌트에게 전달 금지
    const updatedSearchItem = recentSearchItem.filter(
      (item) => item !== delTerm,
    );
    setRecentSearchItem(updatedSearchItem);
    localStorage.setItem("recentSearchItem", JSON.stringify(updatedSearchItem));
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: 10 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, mb: 2 }}
        >
          <IconButton
            color="secondary"
            aria-label="back"
            onClick={handleBackClick}
            sx={{ paddingRight: 2 }}
          >
            <ArrowBackIosNewRounded />
          </IconButton>
          <Box
            display="flex"
            alignItems="center"
            maxWidth="800px"
            justifyContent="center"
            sx={{ flexGrow: 1, margin: "0 auto" }}
          >
            <Input
              variant="outlined"
              type="text"
              value={keyword}
              onChange={handleSearch}
              onKeyDown={handleKeyDown} // 엔터키 가능
              placeholder="검색어를 입력해주세요."
              color="primary"
              size="medium"
              sx={{
                width: "60%",
                height: 45,
                border: "1px solid #7986CB",
                borderRadius: "4px",
                p: 1,
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              size="large"
              sx={{ ml: 3 }}
            >
              검색
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 2, mb: 2 }}
        >
          {recentSearchItem.length > 0 && !isSearched && (
            <Box width="500px" sx={{ mt: 2, mb: 2 }}>
              <Grid display="flex" flexDirection="column">
                {recentSearchItem.map((term, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      border: "1px solid #7986CB",
                      borderRadius: "4px",
                      p: 1,
                      mb: 1,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: indigo[50],
                      },
                    }}
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <Typography variant="body2">{term}</Typography>
                    <IconButton
                      onClick={(e) => handleDelRecentSearchClick(e, term)}
                    >
                      <Cancel
                        sx={{
                          color: "#7986CB",
                        }}
                      />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
              <Typography color="primary" variant="body1" sx={{ mt: 2, mb: 2 }}>
                최근검색어 5개까지만 나타납니다.
              </Typography>
            </Box>
          )}
        </Box>
        {isSearched && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            max-width="500px"
            sx={{ mt: 2, mb: 2 }}
          >
            <Button
              variant={type === "all" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("all")}
              sx={{ mr: 1 }}
            >
              전체
            </Button>
            <Button
              variant={type === "sell" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("sell")}
              sx={{ mr: 1 }}
            >
              판매글
            </Button>
            <Button
              variant={type === "buy" ? "contained" : "outlined"}
              onClick={() => handleFilterChange("buy")}
              sx={{ mr: 1 }}
            >
              구매글
            </Button>
          </Box>
        )}
        <Box>
          {isSearched && (
            <Grid container spacing={2}>
              {searchResults.map((post) => (
                <Grid item key={post.post_no} xs={12} sm={6} md={4}>
                  <Postcard post={post} />
                </Grid>
              ))}
            </Grid>
          )}
          {isSearched && searchResults.length === 0 && (
            <Typography variant="h6" sx={{ textAlign: "center", m: 10 }}>
              검색 결과 없음
            </Typography>
          )}
        </Box>
        {<div ref={ref} style={{ height: 20 }} />}
      </div>

      <Footer />
    </div>
  );
};

export default Search;
