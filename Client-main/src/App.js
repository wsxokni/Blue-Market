import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
//import Header from "./Header"; //공통헤더
import Home from "./pages/FooterNav/home";
import Login from "./pages/User/login";
import First from "./pages/first";
import Chat from "./pages/FooterNav/Chat/chat";
import Favorite from "./pages/FooterNav/MyPage/favorite";
import Search from "./pages/HeaderNav/search";
import Notification from "./pages/FooterNav/MyPage/notification";
import WritePost from "./pages/FooterNav/Post/WritePost";
import Mypage from "./pages/FooterNav/MyPage/mypage";
import Sell from "./pages/FooterNav/MyPage/sell";
import Buy from "./pages/FooterNav/MyPage/buy";
import Report from "./pages/HeaderNav/report";
import ChatRoom from "./pages/FooterNav/Chat/chatRoom";
import PostDetail from "./pages/FooterNav/Post/postDetail";
import NickSetting from "./pages/User/nickSetting";
import EditPost from "./pages/FooterNav/Post/editPost";
import NotFoundPage from "./components/notFoundPage";
import AdHome from "./pages/Admin/ad_home";

//import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  //우클릭 방지
  useEffect(() => {
    document.oncontextmenu = function () {
      return false;
    };
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#3F51B5",
      },
      secondary: {
        main: "#7986CB",
        light: "#E8EAF6",
      },
      error: {
        main: "#ff4747",
      },
      // 추가적으로 필요한 색상 정의
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<First />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/chat" element={<Chat />}></Route>
            <Route path="/favorite" element={<Favorite />}></Route>
            <Route path="/writePost" element={<WritePost />}></Route>
            <Route path="/search" element={<Search />}></Route>
            <Route path="/notification" element={<Notification />}></Route>
            <Route path="/mypage" element={<Mypage />}></Route>
            <Route path="/buy" element={<Buy />}></Route>
            <Route path="/sell" element={<Sell />}></Route>
            <Route path="/post/:post_no" element={<PostDetail />}></Route>
            <Route path="/report/:post_no" element={<Report />}></Route>
            <Route
              path="/chat/chatRoom/:chat_no"
              element={<ChatRoom />}
            ></Route>
            <Route path="/editPost/:post_no" element={<EditPost />}></Route>
            <Route path="/nickSetting" element={<NickSetting />}></Route>
            <Route
              path="/nickReset"
              element={<NickSetting isReset={true} />}
            ></Route>
            <Route path="/404" element={<NotFoundPage />}></Route>
            <Route path="*" element={<Navigate to="/404" replace />} />

            {/*관리자 페이지*/}
            <Route path="/adHome" element={<AdHome />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
