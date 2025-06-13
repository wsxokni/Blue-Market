import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Avatar,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  AccountCircle,
  Settings,
  Favorite,
  Receipt,
  LocalMall,
} from "@mui/icons-material";
import LogoutButton from "./logoutButton";
import { indigo } from "@mui/material/colors";
import axios from "axios";
import Logo from "../../images/logo_name.png";
import MenuImg from "../../images/menuImg.png";

const Header = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState({ nickname: "", img: "" });
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  // useEffect(() => {
  //   // userToken이 있을 때만 (프로필, 이름) 표시 아니면 로그인 표시
  //   if (userToken) {
  //     const fetchUserData = async () => {
  //       try {
  //         const response = await axios.get("http://localhost:5001/user", {
  //           headers: {
  //             Authorization: `Bearer ${userToken}`, //Authorizaion 헤더에 토큰 포함
  //           },
  //         });
  //
  //         setUser({
  //           nickname: "response.data.nickname",
  //           img: response.data.img,
  //         });
  //       } catch (err) {
  //         console.error("데이터를 가지고 오는데 실패했습니다.", err);
  //       }
  //     };
  //     fetchUserData();
  //   }
  // }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: indigo[500],
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: 250,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 5,
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Avatar
              src={MenuImg}
              alt="숙명로고"
              sx={{ width: 64, height: 64, marginBottom: 2 }}
            />
            <Typography variant="h6">
              {userToken ? "" : "로그인을 해주세요."}
            </Typography>
            <List sx={{ marginTop: 5 }}>
              <ListItem onClick={() => navigate("/favorite")}>
                <ListItemIcon>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="찜 목록" />
              </ListItem>
              <ListItem onClick={() => navigate("/sell")}>
                <ListItemIcon>
                  <Receipt />
                </ListItemIcon>
                <ListItemText primary="내가 올린 게시글" />
              </ListItem>
              <ListItem onClick={() => navigate("/buy")}>
                <ListItemIcon>
                  <LocalMall />
                </ListItemIcon>
                <ListItemText primary="내가 참여한 게시글" />
              </ListItem>
              {userToken ? (
                <>
                  {" "}
                  <ListItem sx={{ marginTop: "50%" }}>
                    <LogoutButton />
                  </ListItem>
                </>
              ) : (
                <ListItem
                  onClick={() => navigate("/login")}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "50%" }}
                  >
                    로그인
                  </Button>
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
        <img
          src={Logo}
          alt="logo_name"
          style={{ width: "120px", marginLeft: "16px" }}
        />
        <div style={{ marginLeft: "auto" }}>
          <IconButton color="inherit" onClick={() => navigate("/search")}>
            <Search />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
