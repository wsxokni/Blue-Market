const blurImg = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 검은색 오버레이
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(3px)", // 이미지 흐리게
};

export default blurImg;
