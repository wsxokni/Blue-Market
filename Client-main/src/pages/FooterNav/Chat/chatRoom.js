import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import {
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Clear,
  DeleteRounded,
  InsertPhotoRounded,
  SendRounded,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import ChatRoomCard from "../../../components/chat/chatRoomCard";
import Header from "../../../components/myPage/myPageHeader";
import { Grid } from "@mui/material/";
import "../../../css/chatRoom.css";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ChatRoom() {
  const location = useLocation(); // state 에서 post정보 가져오기
  const post = location.state.post;
  const { chat_no } = useParams(); // URL에서 채팅방 ID 추출
  const [chatNo, setChatNo] = useState("");
  const [socket, setSocket] = useState(null);
  const [myUserToken, setMyUserToken] = useState(
    localStorage.getItem("userToken"),
  );
  const [otherNick, setOtherNick] = useState("");
  const [postNo, setPostNo] = useState("");
  const [postUserNo, setPostUserNo] = useState("");
  const [postUserNick, setPostUserNick] = useState("");
  const [currentMessage, setCurrentMessage] = useState(""); // 현재 입력창에 있는 내용
  const [messageList, setMessageList] = useState([]); // 메시지 보여지게 쌓는 리스트
  const [selectedImages, setSelectedImages] = useState([]); // 이미지 업로드 관련
  const [openImageDialog, setOpenImageDialog] = useState(false); // 이미지 확대 보기 다이얼로그
  const [previewImage, setPreviewImage] = useState(""); // 확대하려는 이미지
  const maxImages = 9; // 최대 이미지 9개 선택 가능
  const fileInputRef = useRef(null);
  const user_no = jwtDecode(myUserToken).no;
  const currentTime = new Date();
  const navigate = useNavigate();

  // 채팅방 정보 구성
  useEffect(() => {
    const initializeChatDetails = async () => {
      setPostNo(post.post_no);
      setPostUserNo(post.post_user_no);
      setPostUserNick(post.user_nick);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/chat/get_chat_details`,
          {
            post_no: post.post_no,
            post_user_no: post.post_user_no,
            post_user_nick: post.user_nick,
          },
          { headers: { Authorization: `Bearer ${myUserToken}` } },
        );
        if (response.data && !chatNo) {
          setChatNo(response.data.chat_no);
          setOtherNick(response.data.user_nick);
        }
      } catch (error) {
        console.log(
          "채팅 통신 오류",
          error.response ? error.response.data : error,
        );
        alert("게시자가 물품을 삭제했습니다!");
        navigate("/home");
      }
    };
    initializeChatDetails();
  }, [post, myUserToken, chatNo]);

  // 채팅방 연결
  useEffect(() => {
    if (chatNo) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/chat/get_chat_history/${chatNo}`,
            { headers: { Authorization: `Bearer ${myUserToken}` } },
          );
          if (response.data) {
            setMessageList(response.data);

            // chat_read 상태 업데이트
            //console.log("읽음 업데이트 요청 시작");

            // chat_read 상태 업데이트
            const updateResponse = await axios.post(
              `${API_BASE_URL}/chat/updateChatRead`,
              { chatNo },
              { headers: { Authorization: `Bearer ${myUserToken}` } },
            );
            //console.log("읽음 업데이트 요청 완료", updateResponse.data); // 응답 확인용
          }
        } catch (error) {
          console.log("채팅 기록 불러오기 오류", error);
        }
      };
      fetchChatHistory();

      const newSocket = io.connect(`${API_BASE_URL}`);
      setSocket(newSocket);

      newSocket.emit("join_room", chatNo, user_no);

      newSocket.on("user_left", (data) => {
        setMessageList((list) => [...list, { ...data, left: true }]);
      });

      // 컴포넌트가 언마운트될 때 방에서만 나가기
      return () => {
        newSocket.off(); // 모든 소켓 이벤트 핸들러 해제
      };
    }
  }, [chatNo, myUserToken, user_no]);

  // 이미지 업로드
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalSelected = selectedImages.length + files.length;

    if (totalSelected > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드 가능합니다.`);
      const remainingSlots = maxImages - selectedImages.length;
      const newImages = files.slice(0, remainingSlots);
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    } else {
      setSelectedImages((prevImages) => [...prevImages, ...files]);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // 파일 선택 창 열기 (ref 사용)
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 업로드 함수
  const uploadImages = async (images) => {
    const formData = new FormData();

    // 이미지 파일을 FormData에 추가
    images.forEach((image) => {
      formData.append("images", image); // 'images'는 서버에서 처리할 키 이름
    });

    // // formData 확인
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value); // key와 value 출력 (이미지 파일을 확인)
    // }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/upload_images`, // 이미지 업로드 엔드포인트
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${myUserToken}`,
          },
        },
      );

      // 서버에서 반환된 이미지 URL 목록 반환
      return response.data.imageUrls;
    } catch (err) {
      console.error("이미지 업로드 중 오류 발생: ", err);
      throw new Error("이미지 업로드 실패");
    }
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (currentMessage.length > 1001) {
      alert("메시지는 1000자 이하만 전송 가능합니다!");
      return;
    }
    if (currentMessage !== "" || selectedImages.length > 0) {
      let imageUrls = [];

      // 선택된 이미지가 있을 경우 이미지를 먼저 업로드
      if (selectedImages.length > 0) {
        try {
          imageUrls = await uploadImages(selectedImages); // 이미지 업로드 후 URL을 받음
        } catch (err) {
          console.error("이미지 업로드 중 오류 발생: ", err);
          return;
        }
      }

      const messageData = {
        chat_no: chatNo,
        message: currentMessage,
        images: imageUrls, // 서버에서 받은 이미지 URL
        userToken: myUserToken,
        user_no_1: postUserNo,
        post_no: postNo,
        author: user_no,
        time: currentTime, // 보낸 시간
      };

      try {
        await socket.emit("send_message", messageData);

        // 이미지를 보낸 후 바로 채팅창에 표시
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
        setSelectedImages([]);
      } catch (err) {
        console.error("통신 연결 오류", err);
        alert("게시자가 물품을 삭제했습니다!");
        navigate("/home");
      }
    }
  };

  // 수신 메시지 처리
  useEffect(() => {
    if (socket) {
      const messageListener = (data) => {
        //console.log("Received Message Data:", data); // 수신된 메시지 데이터를 확인
        setMessageList((list) => [...list, data]);
      };

      const reconnectListener = () => {
        //console.log("Socket reconnected, rejoining room.");
        // 나간 방에 다시 참가
        if (socket.chatNo && socket.user_no) {
          socket.emit("join_room", socket.chatNo, socket.user_no);
        }
      };

      // 메시지 수신
      socket.on("receive_message", messageListener);

      // 소켓 재연결
      socket.on("reconnect", reconnectListener);

      return () => {
        socket.off("receive_message", messageListener);
      };
    }
  }, [socket]);

  // 시간 표시
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 날짜 표시
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("ko-KR", day); // 요일까지 같이 표시
  };

  // 채팅 이미지 크게 보기
  const handleImageClick = (imageSrc) => {
    setPreviewImage(imageSrc);
    setOpenImageDialog(true);
  };

  return (
    <div className="app_center">
      <div className="chat-window">
        <Header
          title={otherNick}
          showChatOutButton={true}
          chatNo={chatNo}
          socket={socket}
        />
        <ChatRoomCard post={post} />
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
              const messageDate = formatDate(messageContent.time); // 현재 메시지 날짜
              const prevMessageDate =
                index > 0 ? formatDate(messageList[index - 1].time) : null; // 이전 메시지 날짜

              // 메시지 하나씩 보이기
              return (
                <div key={index}>
                  {/*메시지를 보낸 날짜가 다르면 상단에 날짜 띄우기*/}
                  {!messageContent.left && prevMessageDate !== messageDate && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      margin={2}
                    >
                      <Typography
                        variant="body2"
                        padding="10px 20px"
                        borderRadius="30px"
                        textAlign="center"
                        sx={{ backgroundColor: "#e8eaf6", color: "#1a237e" }}
                      >
                        {messageDate}
                      </Typography>
                    </Box>
                  )}

                  {/* 시스템 메시지 처리 (상대방 나감)*/}
                  {(messageContent.author === 1 || messageContent.left) && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      margin={2}
                    >
                      <Typography
                        variant="body2"
                        padding="10px 20px"
                        borderRadius="30px"
                        textAlign="center"
                        sx={{ backgroundColor: "#bdbdbd", color: "#1a237e" }}
                      >
                        {messageContent.message} {/* 시스템 메시지 */}
                      </Typography>
                    </Box>
                  )}

                  {/* 일반 메시지 렌더링 */}
                  {!(messageContent.author === 1 || messageContent.left) && (
                    <div
                      className="message"
                      id={user_no === messageContent.author ? "other" : "you"}
                    >
                      <div>
                        <div className="message-content">
                          {/* 메시지가 있을 때만 표시 */}
                          {messageContent.message !== "" && (
                            <p>{messageContent.message}</p>
                          )}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "5px",
                              padding: "5px",
                            }}
                          >
                            {messageContent.images &&
                            Array.isArray(messageContent.images)
                              ? // 이미 배열인 경우 바로 렌더링
                                messageContent.images.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={`image-${idx}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      borderRadius: "10px",
                                    }}
                                    onClick={() => handleImageClick(img)}
                                  />
                                ))
                              : // 문자열인 경우 파싱 시도
                                typeof messageContent.images === "string"
                                ? (() => {
                                    try {
                                      const imagesArray = JSON.parse(
                                        messageContent.images,
                                      ); // JSON 문자열을 배열로 변환
                                      return Array.isArray(imagesArray) &&
                                        imagesArray.length > 0
                                        ? imagesArray.map((img, imgIndex) => (
                                            <img
                                              key={imgIndex}
                                              src={img}
                                              alt={`image-${imgIndex}`}
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "10px",
                                              }}
                                              onClick={() =>
                                                handleImageClick(img)
                                              }
                                            />
                                          ))
                                        : null;
                                    } catch (e) {
                                      console.error("JSON 파싱 오류:", e);
                                      return null;
                                    }
                                  })()
                                : null}
                          </div>
                        </div>
                        <div className="message-meta">
                          <p id="time">{formatTime(messageContent.time)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollToBottom>
        </div>

        {/* 이미지 미리보기 */}
        <div className="chat-footer">
          {selectedImages.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                padding: "8px 0",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {selectedImages.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: -30,
                      right: 0,
                      backgroundColor: "white",
                    }}
                  >
                    <DeleteRounded />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <textarea
              placeholder="내용을 작성해주세요."
              value={currentMessage}
              onChange={(event) => setCurrentMessage(event.target.value)}
              style={{
                borderRight: "0",
                borderColor: "#7986cb",
                padding: "10px",
              }}
            />
          )}

          {/* 입력 및 전송 버튼 */}
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "1px solid",
              color: "#7986cb",
              borderRadius: "5px",
            }}
          >
            <Grid item margin="10px">
              <IconButton onClick={openFileSelector}>
                <InsertPhotoRounded fontSize="large" />
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </IconButton>
            </Grid>
            <Grid item margin="10px">
              <IconButton
                onClick={sendMessage}
                disabled={!currentMessage && selectedImages.length === 0}
              >
                <SendRounded
                  fontSize="large"
                  sx={{
                    color:
                      !currentMessage && selectedImages.length === 0
                        ? ""
                        : "primary.main",
                    "&:hover": {
                      color:
                        !currentMessage && selectedImages.length === 0
                          ? ""
                          : "primary.dark", // hover 시 색상 변경
                    },
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>
        </div>

        {/* 이미지 확대 보기 다이얼로그 */}
        <Dialog
          open={openImageDialog}
          onClose={() => setOpenImageDialog(false)}
        >
          <DialogContent>
            <img
              src={previewImage}
              alt="preview"
              style={{ width: "100%", height: "auto" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImageDialog(false)}>닫기</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ChatRoom;
