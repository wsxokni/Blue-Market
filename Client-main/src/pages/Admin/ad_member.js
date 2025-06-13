import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from "@mui/material/";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdMember = () => {
  const [members, setMembers] = useState([]); // 회원 리스트
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 15; // 한 페이지에 표시할 회원 수

  // 회원 목록을 가져오는 함수
  const fetchMembers = async (page = 1) => {
    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await axios.post(`${API_BASE_URL}/manager/user_list`, {
        offset: offset,
        page: page,
      });
      setMembers(response.data);
    } catch (error) {
      console.error("회원 목록 조회 에러:", error);
    }
  };

  // 검색된 회원 목록을 가져오는 함수
  const searchMembers = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/manager/user_list`, {
        keyword: searchTerm,
      });
      setMembers(response.data);
      setCurrentPage(1); // 검색 결과를 표시할 때 페이지를 1로 설정
    } catch (error) {
      console.error("회원 검색 에러:", error);
    }
  };

  // 페이지 변경 시 호출
  useEffect(() => {
    // 검색어가 없을 경우에만 회원 목록 가져오기
    if (!searchTerm.trim()) {
      fetchMembers(currentPage);
    }
  }, [currentPage]);

  // 페이지 번호 생성
  const totalPages = Math.ceil(members.length / itemsPerPage);
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
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={{
            width: "100%", // 화면 크기에 따라 자동 조절
            maxWidth: "1100px", // 최대 너비 설정
            minWidth: "700px", // 최소 너비 설정
            borderRadius: "25px",
            backgroundColor: "white",
            padding: "20px",
            //margin: "20px auto", // 가운데 정렬
          }}
        >
          <Grid display="flex" justifyContent="center">
            <TextField
              variant="outlined"
              placeholder="닉네임 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "500px" }}
            />
            <Button
              variant="contained"
              onClick={searchMembers}
              sx={{
                marginLeft: "10px",
                backgroundColor: "#3F51B5",
                color: "white",
              }}
            >
              검색
            </Button>
          </Grid>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            width: "100%", // 화면 크기에 따라 자동 조절
            maxWidth: "900px", // 최대 너비 설정
            minWidth: "500px", // 최소 너비 설정
            margin: "20px auto", // 상하 좌우 가운데 정렬
          }}
        >
          <Table aria-label="회원 목록 테이블">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>번호</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>닉네임</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>이메일</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>가입일</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>경고횟수</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>상태</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.length > 0 ? (
                members.map((member, index) => (
                  <TableRow key={member.User_no}>
                    <TableCell align="center">{member.User_no}</TableCell>
                    <TableCell align="center">{member.User_nick}</TableCell>
                    <TableCell align="center">{member.User_email}</TableCell>
                    <TableCell align="center">
                      {new Date(member.User_sdd).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {member.User_tp === 0 ? "관리자" : member.User_black}
                    </TableCell>
                    <TableCell align="center">
                      {member.User_status === 0
                        ? "활동 중"
                        : member.User_status === 1
                          ? "자진탈퇴"
                          : "강제탈퇴"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    회원 정보가 없습니다.
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
      </Grid>
    </div>
  );
};

export default AdMember;
