import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import "../css/LoginScreen.css";

const First = () => {
  const navigate = useNavigate(); // navigate 함수 초기화

  // 회원가입 페이지로 이동
  const handleSignupClick = () => {
    navigate("/register");
  };

  // 로그인 페이지로 이동
  const handleLoginClick = () => {
    navigate("/login");
  };

  // //로고 클릭시 홈페이지로 이동
  // const handleLogoClick = () => {
  //   navigate("/home");
  // };

  // 페이지가 마운트될 때 실행
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      navigate("/", { replace: true }); // 뒤로 가기를 누르면 홈 페이지로 리디렉션
    };

    // 브라우저 히스토리 상태 변경 시 이벤트 핸들러 등록
    window.addEventListener("popstate", handlePopState);

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="login-screen">
      <header className="header">
        {/* Your back arrow and menu icon will go here, you can use svg or icons from a library */}
      </header>
      <main className="main-content">
        <div className="logo-container">
          <img src="../logo.png" alt="Logo" />
          <p>물결처럼 흐르는 파란 장터</p>
        </div>
        <div className="form-container">
          <button className="login-button" onClick={handleLoginClick}>
            시작하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default First;
