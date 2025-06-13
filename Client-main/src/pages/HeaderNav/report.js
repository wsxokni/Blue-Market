import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../../components/main/footer";
import Header from "../../components/main/header";
import axios from "axios";
import { Grid } from "@mui/material/";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Report() {
  const location = useLocation(); // state 에서 post정보 가져오기
  const post = JSON.parse(location.state);
  const { post_no } = useParams(); // URL에서 post_no 추출
  const [selectedReason, setSelectedReason] = useState("");
  const [addDetail, setAddDetail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const navigate = useNavigate();

  const reportReasons = [
    {
      title: "거래 금지 물품이에요.",
      details:
        "생명이 있는 동물 / 의약품 / 의료기기 / 현금 융통 /  저작권 침해 물품 / 콘택트렌즈 등 중고 거래가 불가능한 물품을 거래하는 게시물",
    },
    {
      title: "중고거래 게시글이 아니에요.",
      details: "조작을 유도하거나 비방, 저격을 하는 게시물",
    },
    {
      title: "전문판매업자 같아요.",
      details:
        "동일/유사 제품을 단기간에 많이 판매하거나 기타 영리적 목적이 확인되는 게시물",
    },
    {
      title: "거래 중 분쟁이 발생했어요.",
      details:
        "가품, 거래 중 확인하지 못한 하자가 있는 물품, 상대방의 비매너 행위가 있었던 게시물",
    },
    {
      title: "사기인 것 같아요.",
      details: "물건을 받지 못했거나 입금받지 못한 게시물",
    },
    {
      title: "기타 부적절한 행위가 있어요.",
      details:
        "사용하기 힘든 상품, 중복 게시글, 불가능한 것을 요구하는 게시글 등",
    },
  ];

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleReportSubmit = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/report`,
        {
          user_no: post.post_user_no,
          post_no: post_no,
          black_con: selectedReason + "[추가 사유: " + addDetail + "]",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (response.data.message === "success") {
        // console.log(response.data, "신고 완료");
        alert("신고가 완료되었습니다.");
        navigate("/home");
      } else {
        alert("신고를 하는데 오류가 있습니다. 다시 한번 시도해주세요!");
        navigate("/home");
      }
    } catch (error) {
      console.error("전송 중 오류 발생 : ", error);
      alert(
        "서버에 오류가 생겨 신고글 작성에 실패했습니다. 다시 시도해주세요.",
      );
      navigate("/home");
    }
  };
  return (
    <div style={{ padding: "80px 0px" }}>
      <Header />
      <Grid padding="0px 10px">
        <Typography variant="h5" gutterBottom>
          게시글 신고 사유를 선택해주세요.
        </Typography>
        <Typography variant="body1">
          신고하려는 게시물: {post.post_title}
        </Typography>
        <Typography variant="body1">
          신고하려는 게시물 게시자: {post.post_user_nick}
        </Typography>

        <RadioGroup
          value={selectedReason}
          onChange={handleReasonChange}
          sx={{ marginTop: "10px" }}
        >
          {reportReasons.map((reason, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={() => setExpanded(expanded === index ? false : index)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <FormControlLabel
                  value={reason.title}
                  control={<Radio />}
                  label={reason.title}
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{reason.details}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </RadioGroup>

        <TextField
          label="추가적인 신고 사유를 작성해주세요.(선택)"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={addDetail}
          onChange={(e) => setAddDetail(e.target.value)}
          style={{ marginTop: "20px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleReportSubmit}
          style={{ marginTop: "20px" }}
          disabled={!selectedReason}
          fullWidth
        >
          신고하기
        </Button>
      </Grid>
      <Footer />
    </div>
  );
}

export default Report;
