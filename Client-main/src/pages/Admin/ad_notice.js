import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material/";
import {
  CheckCircleRounded,
  EditNoteRounded,
  DeleteRounded,
} from "@mui/icons-material";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdNotice = () => {
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState([]); // 공지사항 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState(null); // 내용 표시를 위한 상태
  const itemsPerPage = 5; // 한 페이지에 표시할 공지사항 수
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  // 공지사항 목록을 가져오는 함수
  const fetchNotices = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/manager/notice_list`);
      setNotices(response.data);
    } catch (error) {
      console.error("공지사항 목록 조회 에러:", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 공지사항 목록을 가져옴
  useEffect(() => {
    fetchNotices();
  }, []);

  const handleWriteNotice = () => {
    setOpen(!open);
  };

  const handleUploadNotice = async () => {
    // 제목과 내용이 비어있을 때 에러
    setTitleError(!title.trim());
    setContentError(!content.trim());

    if (!title.trim() || !content.trim()) {
      return; // 제목 또는 내용이 비어있을 경우 함수 종료
    }

    const confirmUpload = window.confirm(
      "작성하신 내용은 되돌릴 수 없습니다. 업로드 하시겠습니까?",
    );
    if (confirmUpload) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/manager/notice_write`,
          {
            title: title,
            con: content,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        alert("공지사항이 성공적으로 등록되었습니다.");
        setTitle("");
        setContent("");
        setTitleError(false);
        setContentError(false);
        setOpen(!open);

        // 공지사항 목록을 다시 가져옴
        fetchNotices();
      } catch (error) {
        console.error("공지사항 업로드 에러: ", error);
        alert("공지사항 등록 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteNotice = async (notice_no) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await axios.post(`${API_BASE_URL}/manager/notice_delete`, {
          notice_no: notice_no,
        });
        alert("공지사항이 성공적으로 삭제되었습니다.");

        // 공지사항 목록을 다시 가져옴
        fetchNotices();
      } catch (error) {
        console.error("공지사항 삭제 에러: ", error);
        alert("공지사항 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 페이지에 따른 공지사항 목록 표시
  const sortedNotices = [...notices].sort((a, b) => b.notice_no - a.notice_no); // notice_no를 기준으로 내림차순 정렬
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = sortedNotices.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 생성
  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 페이지 번호 클릭 시 이동
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 제목 클릭 시 내용 토글
  const toggleContent = (notice_no) => {
    setExpandedNotice(expandedNotice === notice_no ? null : notice_no);
  };

  return (
    <div>
      <Grid display="flex" flexDirection="column" justifyContent="center">
        <Grid>
          <IconButton
            variant="contained"
            onClick={handleWriteNotice}
            sx={{
              borderRadius: "25px",
              backgroundColor: "#3F51B5",
              color: "white",
              marginBottom: "20px",
              "&:hover": {
                backgroundColor: "#3F51B5", // 호버 시에도 배경색 유지
              },
              "&:active": {
                backgroundColor: "#3F51B5", // 클릭 시에도 배경색 유지
              },
            }}
          >
            <EditNoteRounded />
            <Typography>공지사항 작성</Typography>
          </IconButton>
        </Grid>
        <Grid
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ flexWrap: "wrap" }}
        >
          {open && (
            <Box
              sx={{
                width: "100%", // 화면 크기에 따라 자동 조절
                maxWidth: "1100px", // 최대 너비 설정
                minWidth: "700px", // 최소 너비 설정
                borderRadius: "25px",
                backgroundColor: "white",
                padding: "20px",
                margin: "20px auto", // 가운데 정렬
              }}
            >
              <Grid margin="20px">
                <Typography>제목</Typography>
                <TextField
                  style={{ width: "100%" }}
                  value={title}
                  variant="outlined"
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError(false);
                  }}
                  placeholder="제목을 작성해주세요."
                  error={titleError}
                  helperText={titleError ? "제목을 입력해주세요." : ""}
                  sx={{ marginBottom: "20px" }}
                />
                <Typography>내용</Typography>
                <TextField
                  style={{ width: "100%", height: "150px" }}
                  variant="outlined"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setContentError(false);
                  }}
                  multiline
                  rows={6}
                  sx={{ marginBottom: "20px" }}
                  placeholder="내용을 작성해주세요."
                  error={contentError}
                  helperText={contentError ? "내용을 입력해주세요." : ""}
                />
                <Grid>
                  <IconButton
                    variant="contained"
                    onClick={handleUploadNotice}
                    sx={{
                      borderRadius: "25px",
                      backgroundColor: "#3F51B5",
                      color: "white",
                      marginTop: "20px",
                      "&:hover": {
                        backgroundColor: "#3F51B5", // 호버 시에도 배경색 유지
                      },
                      "&:active": {
                        backgroundColor: "#3F51B5", // 클릭 시에도 배경색 유지
                      },
                    }}
                  >
                    <CheckCircleRounded />
                    <Typography>업로드</Typography>
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* 공지사항 목록 */}
          <TableContainer
            component={Paper}
            sx={{
              width: "100%", // 화면 크기에 따라 자동 조절
              maxWidth: "1100px", // 최대 너비 설정
              minWidth: "700px", // 최소 너비 설정
              margin: "20px auto", // 상하 좌우 가운데 정렬
            }}
          >
            <Table aria-label="공지사항 테이블">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <strong>번호</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>제목</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>작성일</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>삭제</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentNotices.length > 0 ? (
                  currentNotices.map((notice, index) => (
                    <React.Fragment key={notice.Notice_no}>
                      <TableRow>
                        <TableCell align="center">{notice.Notice_no}</TableCell>
                        <TableCell
                          align="center"
                          sx={{ cursor: "pointer" }}
                          onClick={() => toggleContent(notice.Notice_no)}
                        >
                          {notice.Notice_title}
                        </TableCell>
                        <TableCell align="center">
                          {new Date(notice.Notice_sdd).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleDeleteNotice(notice.Notice_no)}
                          >
                            <DeleteRounded color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {/* 제목을 클릭하면 내용이 토글 */}
                      {expandedNotice === notice.Notice_no && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            sx={{ backgroundColor: "#f9f9f9" }}
                          >
                            <Typography
                              sx={{
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                whiteSpace: "pre-line",
                              }}
                            >
                              {notice.Notice_con}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      등록된 공지사항이 없습니다.
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
                  margin: "0 5px 15px 15px",
                  backgroundColor:
                    currentPage === number ? "#3F51B5" : "#e0e0e0",
                  color: currentPage === number ? "white" : "black",
                }}
              >
                <Typography>{number}</Typography>
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdNotice;
