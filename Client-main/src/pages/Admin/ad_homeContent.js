import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material/";
import AdBanner from "../../components/admin/ad_banner.png";

const AdHomeContent = () => {
  return (
    <div>
      <Grid display="flex" flexDirection="column" alignItems="center">
        <img
          src={AdBanner}
          alt="Admin Banner"
          style={{
            width: "100%", // 화면 크기에 따라 자동 조절
            height: "auto",
            borderRadius: "25px",
            minHeight: "150px", // 최소 높이 설정
            minWidth: "500px", // 최소 너비 설정
            maxWidth: "900px",
          }}
        />
        <Box
          sx={{
            width: "93%",
            height: "400px",
            borderRadius: "25px",
            backgroundColor: "white",
            marginTop: "20px",
            padding: "20px", // 내용 여백
          }}
        >
          <Typography variant="h5" align="center" marginBottom="50px">
            관리자 페이지 사용 방법
          </Typography>
          <Grid container spacing={2}>
            {/* 공지사항 관리 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: "15px", backgroundColor: "#f5f5f5" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    공지사항 관리
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    - 새로운 공지사항을 작성하고 업로드할 수 있습니다.
                    <br />
                    <br />
                    - 등록된 공지사항은 목록에서 확인할 수 있으며, 삭제도
                    가능합니다.
                    <br />
                    <br />- 각 공지사항의 제목을 클릭하면 내용을 확인할 수
                    있습니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 신고 관리 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: "15px", backgroundColor: "#f5f5f5" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    신고 관리
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    - 신고된 게시글과 신고 이유를 확인할 수 있습니다.
                    <br />
                    <br />
                    - 신고된 게시글을 확인하고, 이상 없음, 경고, 탈퇴처리를 할
                    수 있습니다.
                    <br />
                    <br />- 신고 사유를 작성하고, 경고, 탈퇴 여부를 선택하여
                    처리합니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 회원 관리 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: "15px", backgroundColor: "#f5f5f5" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    회원 관리
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    - 전체 회원 목록을 조회하고 검색할 수 있습니다.
                    <br />
                    <br />
                    - 회원의 닉네임, 이메일, 경고 횟수 및 상태를 확인할 수
                    있습니다.
                    <br />
                    <br />- 회원 상태는 활동 중, 자진탈퇴, 강제탈퇴로
                    표시됩니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
};

export default AdHomeContent;
