import React, { useEffect, useState } from "react";
import PostForm from "../../../components/post/postForm";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/main/header";
import Footer from "../../../components/main/footer";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditPost = () => {
  const { post_no } = useParams();
  const [postData, setPostData] = useState(null);
  const [postImages, setPostImages] = useState([]);
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    // 게시글 데이터 불러오기
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/post/get_post/${post_no}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          },
        );
        setPostData(response.data);
      } catch (error) {
        console.error("게시글 데이터를 불러오는데 실패했습니다.", error);
      }
    };

    // 게시글 이미지 불러오기
    const fetchPostImages = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/post/get_post_img/${post_no}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          },
        );
        const imageUrls = response.data.map((imgObj) => imgObj.post_img); // 이미지 URL만 추출
        setPostImages(imageUrls);
      } catch (error) {
        console.error("게시글 이미지 데이터를 불러오는데 실패했습니다.", error);
      }
    };

    fetchPostData();
    fetchPostImages();
  }, [post_no]);

  const handleSubmit = async (formData) => {
    // console.log("수정 페이지 제출");
    // FormData 확인용 추후 삭제
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/post/post_update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      if (response.data.message === "success") {
        alert("성공적으로 수정되었습니다.");
        navigate("/home");
      } else {
        alert(
          "입력 파일이나 입력란에 오류가 있습니다. 다시 한번 시도해주세요!",
        );
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert("네트워크 오류로 수정에 실패했습니다. 다시 시도해주세요.");
      navigate("/home");
    }
  };

  if (!postData || postImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ paddingTop: 50, paddingBottom: 50 }}>
      <Header />
      <PostForm
        isEdit={true}
        initialData={postData}
        initialImages={postImages}
        onSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
};

export default EditPost;
