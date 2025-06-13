import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import PostFooter from "../../../components/post/postFooter";
import PostHeader from "../../../components/post/postHeader";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import moment from "moment"; // 시간 계산
import "moment/locale/ko"; // 한국어 기준
import "slick-carousel/slick/slick.css"; // 이미지 여러개 일 때 슬라이드
import "slick-carousel/slick/slick-theme.css";
import blurImg from "../../../css/blurImg";
import {
  AllInbox,
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
  People,
} from "@mui/icons-material";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PostDetail = () => {
  const { post_no } = useParams();
  const [post, setPost] = useState(null);
  const [grade, setGrade] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글 정보 가져오기
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/post/get_post/${post_no}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        const postData = response.data[0];
        setPost(postData);

        // 등급 설정
        if (postData.user_grade === 0) {
          setGrade("첫눈");
        } else if (postData.user_grade === 1) {
          setGrade("함박눈");
        } else {
          setGrade("만년설");
        }
        // 초기 설정
      } catch (err) {
        console.log("데이터를 가져오는데 실패하였습니다.");
        navigate("/home");
      }
    };
    fetchPostData();
  }, [post_no]);

  // 게시글 이미지 가져오기
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/post/get_post_img/${post_no}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        const postImageData = response.data;
        setPostImages(postImageData);
        //console.log(postImages);
      } catch (err) {
        console.log("데이터를 가져오는데 실패하였습니다.", err);
      }
    };
    fetchImageData();
  }, [post_no]);

  if (!post) return <div>Loading...</div>; //없으면 로딩임

  // 이미지 슬라이더 화살표 커스텀
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <ArrowBackIosRounded
        sx={{
          position: "absolute",
          left: "-35px",
          top: "50%",
          zIndex: 1,
          fontSize: "30px",
          cursor: "pointer",
          color: "gray",
        }}
        onClick={onClick}
      />
    );
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <ArrowForwardIosRounded
        sx={{
          position: "absolute",
          right: "-35px",
          zIndex: 1,
          top: "50%",
          fontSize: "30px",
          cursor: "pointer",
          color: "gray",
        }}
        onClick={onClick}
      />
    );
  };

  // 이미지 슬라이더 세팅
  const slider_setting = {
    dots: postImages.length > 0,
    infinite: postImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    objectFit: "cover",
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // 업로드 시간 계산 (현재시간으로부터 ~)
  const uploadedTime = moment(post.post_sdd).local("ko").fromNow();

  // 닉네임의 첫 글자 추출
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <div style={{ paddingBottom: "13vh" }}>
      <PostHeader post={post} />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            width: "83%",
            maxWidth: "400px",
            maxHeight: "400px",
            margin: "10px auto",
            overflow: "show",
          }}
        >
          {/* 이미지 슬라이더 */}
          <Box>
            <Slider {...slider_setting}>
              {postImages.map((image, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    maxHeight: "400px",
                    maxWidth: "400px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={image.post_img}
                    alt={`Post image ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "400px",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </Slider>
          </Box>
          {post.post_status === 2 && (
            <Box sx={blurImg}>
              <Typography variant="h6" component="div" sx={{ color: "white" }}>
                거래완료
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* 사용자 정보 => 사용자 개인 프로필 볼 수 있도록 나중에 설정하기*/}
        <Box
          backgroundColor="white"
          border="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Avatar src={post.user_img} alt={post.user_nick}>
            {!post.user_avatar && getInitial(post.user_nick)}
          </Avatar>
          <Box sx={{ backgroundColor: "white", ml: 3 }}>
            <Typography variant="subtitle1" color="black">
              {post.user_nick}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {grade}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {/* 게시글 정보 띄우기 */}
      <Box sx={{ padding: "0px 25px 25px 25px" }}>
        {/* 게시글  유형 */}
        {post.post_type === 0 ? (
          <Typography variant="body1" color="secondary">
            #팔아요
          </Typography>
        ) : (
          <Typography variant="body1" color="secondary">
            #구해요
          </Typography>
        )}

        <Grid
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginBottom="15px"
        >
          {/* 게시글 거래 상태 */}
          {post.post_status === 1 && (
            <Typography
              variant="h6"
              borderRadius="15px"
              color="white"
              padding="1vh"
              marginRight="10px"
              sx={{ backgroundColor: "#7986CB" }}
            >
              거래중
            </Typography>
          )}
          {post.post_status === 2 && (
            <Typography
              variant="h6"
              borderRadius="15px"
              color="white"
              padding="1vh"
              margin="1vh"
              sx={{ backgroundColor: "indigo" }}
            >
              거래완료
            </Typography>
          )}
          {/* 게시글 제목 */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {post.post_title}
          </Typography>
        </Grid>
        {/* 게시글 내용 */}
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            overflowWrap: "break-word",
            wordBreak: "break-word",
            whiteSpace: "pre-line", // 줄바꿈 유지
          }}
        >
          {post.post_comment}
        </Typography>

        {/* 게시글 업로드 시간 */}
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {uploadedTime}
        </Typography>

        {/* 거래 방식 */}
        <Typography sx={{ margin: "20px 0px 5px 0px" }} fontWeight="bold">
          선호하는 거래방식
        </Typography>
        <Box display="flex">
          {(post.post_way === 0 || post.post_way === 2) && (
            <Box
              sx={{
                marginRight: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                borderRadius: "15px",
                color: "primary.main",
                border: "2px solid #7986CB",
                width: "112px",
                height: "112px",
                justifyContent: "center",
              }}
            >
              <People sx={{ fontSize: 40, marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                대면 거래
              </Typography>
            </Box>
          )}
          {(post.post_way === 1 || post.post_way === 2) && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                borderRadius: "15px",
                color: "primary.main",
                border: "2px solid #7986CB",
                width: "112px",
                height: "112px",
                justifyContent: "center",
              }}
            >
              <AllInbox sx={{ fontSize: 40, marginBottom: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                사물함 거래
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <div>
        <PostFooter post={post} />
      </div>
    </div>
  );
};

export default PostDetail;
