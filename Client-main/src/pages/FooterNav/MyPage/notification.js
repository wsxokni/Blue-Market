import React, { useEffect, useState } from "react";
import Header from "../../../components/myPage/myPageHeader";
import Footer from "../../../components/main/footer";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Notification = () => {
  const [expanded, setExpanded] = useState(false);
  const [notices, setNotices] = useState([]); // 공지사항 리스트

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

  const handleContent = (index) => {
    setExpanded(expanded === index ? false : index);
  };

  const sortedNotices = notices.sort((a, b) => b.id - a.id);

  return (
    <div>
      <Header title="공지사항" />
      <Container mt={4} mb={4} sx={{ marginTop: "20px" }}>
        {sortedNotices.map((notice, index) => (
          <Accordion
            key={notice.id}
            expanded={expanded === index}
            onChange={() => handleContent(index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={(event) => {
                event.stopPropagation();
                handleContent(index);
              }}
            >
              <Grid
                display="flex"
                justifyContent="space-between"
                alignItems="baseline"
                flexDirection="column"
              >
                <Typography>{`${notices.length - index}.   ${notice.Notice_title}`}</Typography>
                <Typography variant="caption" gutterBottom>
                  {new Date(notice.Notice_sdd).toLocaleDateString()}
                </Typography>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {notice.Notice_con}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
      <Footer />
    </div>
  );
};

export default Notification;
