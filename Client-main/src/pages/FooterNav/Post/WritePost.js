import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/main/footer";
import Header from "../../../components/main/header";
import axios from "axios";
import PostForm from "../../../components/post/postForm";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WritePost = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");

  //서버로 입력 내용 보내기
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/post/post_write`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Authorization 헤더에 토큰 포함
          },
        },
      );
      if (response.data.message === "success") {
        alert("성공적으로 등록되었습니다.");
        navigate("/home");
      } else {
        alert(
          "입력 파일이나 입력란에 오류가 있습니다. 다시 한번 시도해주세요!",
        );
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
      alert("네트워크 오류로 등록에 실패하였습니다. 다시 시도해주세요.");
      navigate("/home");
    }
  };

  return (
    <div style={{ paddingTop: 50, paddingBottom: 50 }}>
      <Header />
      <PostForm isEdit={false} onSubmit={handleSubmit} />;
      <Footer />
    </div>
  );
};

export default WritePost;
