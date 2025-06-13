import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material/";
import AdSidebar from "../../components/admin/sidebar";
import AdInfo from "../../components/admin/ad_info";
import AdMember from "./ad_member";
import AdNotice from "./ad_notice";
import AdReport from "./ad_report";
import AdHomeContent from "./ad_homeContent";
import axios from "axios";

const AdHome = () => {
  const [selectedContent, setSelectedContent] = useState("home");
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const navigate = useNavigate();

  // 사이드바 버튼 클릭시 상태 업데이트
  const handleContentChange = (contentType) => {
    setSelectedContent(contentType);
  };

  return (
    <div
      style={{ backgroundColor: "#e8eaf6", overflow: "auto", height: "100vh" }}
    >
      <Grid
        container
        display="flex"
        flexDirection="row"
        justifyContent="center"
        wrap="nowrap"
      >
        {/* Sidebar에서 버튼 클릭 시 handleContentChange 함수에 상태 전달 */}
        <AdSidebar onContentChange={handleContentChange} />

        {/* 중앙의 변경되는 콘텐츠 영역 */}
        <Grid
          display="flex"
          flexDirection="column"
          alignItems="center"
          item
          xs={8}
          style={{
            marginTop: "20px",
          }}
        >
          {selectedContent === "member" && <AdMember />}
          {selectedContent === "report" && <AdReport />}
          {selectedContent === "notice" && (
            <AdNotice onContentChange={handleContentChange} />
          )}
          {(selectedContent === "home" || selectedContent === "") && (
            <AdHomeContent />
          )}
        </Grid>

        <AdInfo />
      </Grid>
    </div>
  );
};

export default AdHome;
