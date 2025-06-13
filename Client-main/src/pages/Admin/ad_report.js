import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material/";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdReport = () => {
  const [reports, setReports] = useState([]);
  const [viewedPosts, setViewedPosts] = useState({}); // 게시글 정보를 저장할 객체
  const [selectedReport, setSelectedReport] = useState(null); // 선택된 신고 항목
  const [processReason, setProcessReason] = useState(""); // 신고 처리 사유
  const [status, setStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 5; // 한 페이지에 표시할 신고현황 항목 수
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  // 신고 목록을 가져오는 함수
  const fetchReports = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/manager/report_list`);
      setReports(response.data);
    } catch (error) {
      console.error("신고 목록 조회 에러:", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 신고 목록을 가져옴
  useEffect(() => {
    fetchReports();
  }, []);

  // 각 신고 항목에 대해 게시글 불러오기
  const handleReportPost = async (black_no, post_no) => {
    // 이미 해당 black_no에 대한 게시글이 열려 있으면 닫기
    if (viewedPosts[black_no]) {
      setViewedPosts((prev) => {
        const newViewedPosts = { ...prev };
        delete newViewedPosts[black_no];
        return newViewedPosts;
      });
      return;
    }

    // 해당 black_no의 post_no에 대한 게시글 정보를 서버로부터 가져옴
    try {
      const response = await axios.post(`${API_BASE_URL}/manager/report_post`, {
        post_no: post_no,
      });

      setViewedPosts((prev) => ({
        ...prev,
        [black_no]: response.data,
      }));

      // 상태 설정
      if (response.data.post_status === 0) {
        setStatus("게시");
      } else if (response.data.post_status === 1) {
        setStatus("거래 중");
      } else if (response.data.post_status === 2) {
        setStatus("거래 완료");
      }
    } catch (error) {
      console.error("신고 글 불러오기 에러:", error);
      alert("신고 글을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 신고 처리하기
  const handleReportProcess = async (status) => {
    if (!selectedReport) {
      alert("처리할 신고를 선택하세요.");
      return;
    }

    let confirmMessage = "";
    if (status === 1) {
      confirmMessage = "정말로 '처리할 필요 없음'으로 처리하시겠습니까?";
    } else if (status === 2) {
      confirmMessage = "정말로 경고 처리하시겠습니까?";
    } else {
      confirmMessage = "정말로 탈퇴 처리하시겠습니까?";
    }

    const confirmBlack = window.confirm(confirmMessage);
    if (confirmBlack) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/manager/report_process`,
          {
            status: status, // 1: 특이사항 없음, 2: 경고, 3: 탈퇴
            user_no: selectedReport.Black_user_no,
            black_no: selectedReport.Black_no,
            black_con: processReason.trim() ? processReason : undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        alert("신고 처리가 완료되었습니다.");
        setSelectedReport(null);
        setProcessReason("");

        fetchReports(); // 목록을 새로고침
      } catch (error) {
        console.error("신고 처리 에러:", error);
        alert("신고 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // 페이지에 따른 신고 목록 표시
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 생성
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 페이지 번호 클릭 시 이동
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Grid display="flex" flexDirection="column" justifyContent="center">
        {/* 신고현황 목록 */}
        <TableContainer
          component={Paper}
          sx={{
            width: "100%", // 화면 크기에 따라 자동 조절
            maxWidth: "1100px", // 최대 너비 설정
            minWidth: "500px", // 최소 너비 설정
            margin: "20px auto", // 상하 좌우 가운데 정렬
          }}
        >
          <Table aria-label="신고현황 테이블">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>번호</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>신고회원</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>게시회원</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>신고사유</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>신고날짜</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>글 확인</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>신고처리</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <React.Fragment key={report.Black_no}>
                    <TableRow>
                      <TableCell align="center">{report.Black_no}</TableCell>
                      <TableCell align="center">{report.User_no}</TableCell>
                      <TableCell align="center">
                        {report.Black_user_no}
                      </TableCell>
                      <TableCell align="center">{report.Black_con}</TableCell>
                      <TableCell align="center">
                        {new Date(report.Black_sdd).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleReportPost(report.Black_no, report.Post_no)
                          }
                        >
                          글 보기
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => setSelectedReport(report)}
                        >
                          처리
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* 글 보기가 선택된 경우 해당 글의 내용을 토글 형식으로 표시 */}
                    {viewedPosts[report.Black_no] && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Box
                            sx={{
                              padding: "15px",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography variant="h6">
                              게시글 번호:
                              {viewedPosts[report.Black_no].post_no}
                            </Typography>
                            <Typography variant="h6">상태: {status}</Typography>
                            <Typography variant="subtitle2">
                              제목: {viewedPosts[report.Black_no].post_title}
                            </Typography>
                            <Typography variant="subtitle2">
                              내용: {viewedPosts[report.Black_no].post_comment}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    미처리 내역이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 페이지네이션 */}
        <Box display="flex" justifyContent="center" marginTop="20px">
          {pageNumbers.map((number) => (
            <IconButton
              key={number}
              onClick={() => handlePageChange(number)}
              sx={{
                margin: "0 5px",
                backgroundColor: currentPage === number ? "#3F51B5" : "#e0e0e0",
                color: currentPage === number ? "white" : "black",
              }}
            >
              <Typography>{number}</Typography>
            </IconButton>
          ))}
        </Box>

        {/* 신고 처리 섹션 */}
        {selectedReport && (
          <Box
            sx={{
              width: "100%", // 화면 크기에 따라 자동 조절
              maxWidth: "850px", // 최대 너비 설정
              minWidth: "500px", // 최소 너비 설정
              borderRadius: "25px",
              backgroundColor: "white",
              padding: "20px",
              margin: "20px auto", // 가운데 정렬
            }}
          >
            <Grid marginBottom="10px">
              <Typography variant="h6">
                선택한 신고 번호 : {selectedReport.Black_no}
              </Typography>
              <Typography variant="h6">
                게시글 번호 : {selectedReport.Post_no}
              </Typography>
            </Grid>
            <Typography variant="h6">신고 처리 사유</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={processReason}
              onChange={(e) => setProcessReason(e.target.value)}
              placeholder="처리 사유를 입력해주세요."
              sx={{ marginBottom: "20px" }}
            />
            <Box display="flex" justifyContent="flex-end">
              <Grid container display="flex" justifyContent="flex-end">
                <Grid item sx={{ margin: "20px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReportProcess(1)} // 처리할 필요 없음
                  >
                    특이사항 없음
                  </Button>
                </Grid>
                <Grid item sx={{ margin: "20px" }}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleReportProcess(2)} // 경고 처리
                  >
                    경고
                  </Button>
                </Grid>
                <Grid item sx={{ margin: "20px 0px 20px 20px" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReportProcess(3)} // 탈퇴 처리
                  >
                    탈퇴
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Grid>
    </div>
  );
};

export default AdReport;
