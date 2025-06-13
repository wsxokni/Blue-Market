import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material/";
import { WarningAmberRounded } from "@mui/icons-material";

function NotFoundPage() {
  const navigate = useNavigate();

  // 페이지를 찾을 수 없는 경우 홈으로 돌아감
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }} // 전체 화면 높이를 사용
    >
      <WarningAmberRounded color="error" sx={{ fontSize: 100, mb: 3 }} />
      <Typography variant="h4" component="h1" gutterBottom>
        404 NOT FOUND
      </Typography>
      <Typography variant="subtitle1">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </Typography>
    </Grid>
  );
}

export default NotFoundPage;
