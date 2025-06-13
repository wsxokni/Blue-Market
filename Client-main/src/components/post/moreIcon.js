import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, MenuItem, IconButton, Grid } from "@mui/material";
import { MoreVertRounded } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MoreIcon = ({ post }) => {
  const { post_no } = useParams(); //현재 페이지 URL에서 post_no 파라미터 추출
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [postOwner, setPostOwner] = useState("");
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [changeStatus, setChangeStatus] = useState("");
  const [checkUser, setCheckUser] = useState(false);
  // 게시글 상태 확인
  useEffect(() => {
    setChangeStatus(post.post_status === 0 ? 1 : 0);
    setPostOwner(post.post_user_no);

    const verifyUser = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/verify_user`,
          { post_user_no: post.post_user_no },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );

        if (response.data.verified) {
          setCheckUser(true);
        } else {
          setCheckUser(false);
        }
      } catch (error) {
        console.error("통신 오류 사용자 인증 실패", error);
        setCheckUser(false);
      }
    };
    verifyUser();
  }, [post, userToken]);
  // console.log(checkUser);

  const handleMenuClick = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 본인 제외 - 신고기능
  // console.log(post);
  const report_post = {
    post_title: post.post_title,
    post_user_nick: post.user_nick,
    post_user_no: post.post_user_no,
  };
  const handleReport = () => {
    navigate(`/report/${post_no}`, {
      state: JSON.stringify(report_post),
    });
  };

  // 본인 - 수정기능
  const handleEdit = () => {
    navigate(`/editPost/${post_no}`);
  };

  // 본인 - 삭제기능(테스트 완)
  const handleDelete = async () => {
    const confirmDelete = window.confirm("게시물을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }

    //사용자 확인 후 삭제 로직
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/post/post_delete/${post_no}`,
      );

      if (response.data.message === "success") {
        // console.log("게시물 삭제 완료");
        alert("게시글 삭제를 완료했습니다!");
        navigate("/home");
      } else {
        // console.error("게시물 삭제 실패", response.data);
      }
    } catch (err) {
      console.error("게시글 삭제 중 통신 오류", err);
    }
  };

  // 본인 - 끌올기능
  const handleUpdate = async () => {
    const confirmUpdate = window.confirm(
      "끌올 하시겠습니까? \n하루에 한번만 가능합니다!",
    );
    // console.log("post", post.post_no);
    const post_no = post.post_no;
    if (confirmUpdate) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/post/post_bump/${post_no}`,
        );

        if (response.data.message === "success") {
          // console.log("게시물 끌올 완료");
          alert("성공적으로 끌올되었습니다!");
          navigate("/home");
        } else {
          console.error("끌올이 실패되었습니다.", response.data);
          alert("오늘 더이상 끌올을 할 수 없습니다!");
        }
      } catch (err) {
        console.error("끌올 중 오류 발생", err);
      }
    }
  };

  // 본인 : 거래 상태 변경 (거래 <-> 거래 중)
  const handleStatus = async () => {
    const confirmStatus = window.confirm("상태를 변경하시겠습니까?");
    if (!confirmStatus) {
      return;
    }

    //사용자 확인 후 거래 상태 변경하기
    try {
      // console.log("상태변경", post_no, changeStatus);
      const response = await axios.post(
        `${API_BASE_URL}/post/post_update_status_no/`,
        { post_no, post_status: changeStatus },
      );

      if (response.data.message === "success") {
        // console.log("상태변경 완료!");
        alert("상태 변경이 완료되었습니다!");
        window.location.reload();
      } else {
        console.error("게시물 상태 변경 실패", response.data);
      }
    } catch (err) {
      console.error("게시글 상태 변경 중 통신 오류", err);
    }
  };

  return (
    <Grid>
      <IconButton
        aria-label="더보기"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleMenuClick}
        color="inherit"
      >
        <MoreVertRounded />
      </IconButton>
      <Menu
        id="long-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {checkUser ? (
          [
            <MenuItem
              onClick={handleEdit}
              key="edit"
              sx={{
                "&:hover": {
                  backgroundColor: indigo[50],
                },
              }}
            >
              수정하기
            </MenuItem>,
            <MenuItem
              onClick={handleDelete}
              key="delete"
              sx={{
                "&:hover": {
                  backgroundColor: indigo[50],
                },
              }}
            >
              삭제하기
            </MenuItem>,
            <MenuItem
              onClick={handleUpdate}
              key="update"
              sx={{
                "&:hover": {
                  backgroundColor: indigo[50],
                },
              }}
            >
              끌올
            </MenuItem>,
            <MenuItem
              onClick={handleStatus}
              key="status"
              sx={{
                "&:hover": {
                  backgroundColor: indigo[50],
                },
              }}
            >
              {changeStatus === 1 ? "거래 중" : "거래"}
            </MenuItem>,
          ]
        ) : (
          <MenuItem
            onClick={handleReport}
            key="report"
            sx={{
              "&:hover": {
                backgroundColor: indigo[50],
              },
            }}
          >
            신고하기
          </MenuItem>
        )}
      </Menu>
    </Grid>
  );
};
export default MoreIcon;
