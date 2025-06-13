import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  ImageList,
  IconButton,
  ButtonGroup,
  Grid,
} from "@mui/material";
import {
  PhotoCamera,
  Delete,
  AllInbox,
  People,
  SellRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import { indigo } from "@mui/material/colors";

const PostForm = ({
  initialData = {}, // 초기 데이터 (수정 모드일 때 주입)
  initialImages,
  onSubmit, // 제출 시 처리할 함수
  isEdit = false, // 수정 모드 여부
}) => {
  const [title, setTitle] = useState(initialData[0]?.post_title || "");
  const [type, setType] = useState(initialData[0]?.post_type ?? "");
  const [wayPeople, setWayPeople] = useState(
    initialData[0]?.post_way === 0 || initialData[0]?.post_way === 2 ? "0" : "",
  );
  const [wayLocker, setWayLocker] = useState(
    initialData[0]?.post_way === 1 || initialData[0]?.post_way === 2 ? "1" : "",
  );
  const [price, setPrice] = useState(initialData[0]?.post_price || "");
  const [comment, setComment] = useState(initialData[0]?.post_comment || "");
  const [files, setFiles] = useState([]); // 새로 업로드한 파일들
  const [existingImages, setExistingImages] = useState(initialImages || []); // 기존 이미지들
  const [count, setCount] = useState(initialImages?.length || 0);
  const [category, setCategory] = useState(initialData[0]?.post_cate || "");
  const [errors, setErrors] = useState({});
  const [deletedImages, setDeletedImages] = useState([]);

  // 수정 모드에서 기존 이미지를 미리보기에 추가
  useEffect(() => {
    if (isEdit && initialImages) {
      setExistingImages(
        initialImages.map((imgUrl) => ({
          preview: imgUrl, // 이미지는 URL 형태로 미리보기 표시
          file: null, // 기존 이미지는 파일 정보가 필요 없음
        })),
      );
    }
  }, [isEdit, initialImages]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files); // 새로 선택된 파일 목록
    const existingFileData = files.map(
      (file) => file.file?.name + file.file?.size,
    ); // 이미 업로드된 파일의 데이터 (이름+사이즈)

    // 중복된 파일 필터링
    const filteredNewFiles = newFiles.filter((newFile) => {
      const newFileData = newFile.name + newFile.size;
      return !existingFileData.includes(newFileData); // 중복된 파일이 있으면 제외
    });

    if (filteredNewFiles.length > 0) {
      if (files.length + filteredNewFiles.length > 10) {
        alert("최대 10개까지만 업로드 가능합니다.");
        return;
      }

      const mappedFiles = filteredNewFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setFiles((prev) => [...prev, ...mappedFiles]);
      setCount((prev) => prev + mappedFiles.length);
    } else {
      alert("중복된 파일은 업로드되지 않습니다.");
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (imageToRemove, isExisting) => {
    if (isExisting) {
      setExistingImages((prevImages) => {
        const updatedImages = prevImages.filter(
          (image) => image.preview !== imageToRemove.preview, // 이미지의 URL을 기준으로 삭제
        );
        setDeletedImages((prevDeleted) => [
          ...prevDeleted,
          imageToRemove.preview,
        ]);
        return updatedImages;
      });
    } else {
      setFiles((prevFiles) => {
        const filteredFiles = prevFiles.filter(
          (file) => file.preview !== imageToRemove.preview, // 파일의 미리보기 URL을 기준으로 삭제
        );
        URL.revokeObjectURL(imageToRemove.preview); // 메모리 해제
        return filteredFiles;
      });
    }
  };

  // 이미지 상태가 변경될 때마다 이미지 개수 업데이트
  useEffect(() => {
    setCount(existingImages.length + files.length);
  }, [existingImages, files]); // existingImages와 files가 변경될 때 실행

  // 거래 방식
  const calculateWay = () => {
    let way;
    if (wayPeople === "0" && wayLocker === "1") {
      way = 2;
    } else if (wayLocker === "1") {
      way = 1;
    } else if (wayPeople === "0") {
      way = 0;
    } else {
      way = null;
    }
    return way;
  };

  const handleWayPeopleClick = () => {
    setWayPeople((prev) => (prev === "0" ? "" : "0"));
  };

  const handleWayLockerClick = () => {
    setWayLocker((prev) => (prev === "1" ? "" : "1"));
  };

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const way = calculateWay();
    let isValid = true;

    // 사진이 1개 이상 있는지 확인
    if (existingImages.length + files.length < 1) {
      alert("사진을 최소 1개 이상 업로드해주세요.");
      return; // 제출을 중단
    }

    // 유효성 검사
    const newErrors = {};
    if (count < 1) {
    }
    if (!title || title.length < 2 || title.length > 15) {
      newErrors.title = "제목은 2자 이상 15자 이하로 적어주세요.";
      isValid = false;
    }
    if (!price || !/^[0-9]*$/.test(price)) {
      newErrors.price = "가격을 입력하고 숫자만 입력해주세요.";
      isValid = false;
    }
    if (type === null || type === undefined) {
      newErrors.type = "거래 유형을 선택해주세요.";
      isValid = false;
    }
    if (!wayPeople && !wayLocker) {
      newErrors.way = "거래 방식을 선택해주세요.";
      isValid = false;
    }
    if (!category) {
      newErrors.category = "카테고리를 선택해주세요.";
      isValid = false;
    }
    if (!comment || comment.length < 10) {
      newErrors.comment = "내용은 10자 이상 작성해주세요.";
      isValid = false;
    } else if (comment.length > 2000) {
      newErrors.comment = "내용은 2000자 이하로 작성해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    formData.append("title", title);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("comment", comment);
    formData.append("category", category);
    formData.append("way", way);

    // 수정 모드일 경우에만 post_no 추가
    if (isEdit && initialData[0]?.post_no) {
      formData.append("post_no", initialData[0].post_no);
    }

    // 새로 업로드된 파일 추가
    files.forEach((file) => formData.append("files", file.file));

    // 기존 이미지 유지 여부 처리 (기존 이미지의 url이 필요하면 사용)
    formData.append(
      "existingImages",
      JSON.stringify(existingImages.map((img) => img.url)),
    );

    // 삭제된 이미지 URL 리스트 전송
    if (deletedImages.length > 0) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Box sx={{ p: 2 }}>
          <Typography fontWeight="bold">사진</Typography>
          <div style={{ display: "flex", overflowX: "auto", padding: "8px 0" }}>
            <Button
              variant="contained"
              component="label"
              color="secondary"
              sx={{
                minWidth: 100,
                height: 100,
                marginRight: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: indigo[500] },
              }}
            >
              <Grid display="flex" flexDirection="column">
                <PhotoCamera sx={{ ml: 1 }} />
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {count} / 10
                </Typography>
              </Grid>
            </Button>
            <ImageList
              cols={10}
              rowHeight={100}
              sx={{ width: "100%", height: 100 }}
            >
              {existingImages.map((img, index) => (
                <Box
                  key={img.preview}
                  sx={{
                    width: 100,
                    height: 100,
                    position: "relative",
                    marginRight: 2,
                  }}
                >
                  <img
                    src={img.preview}
                    alt={`existing-preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(img, true)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "gray",
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              {files.map((file, index) => (
                <Box
                  key={file.preview}
                  sx={{
                    width: 100,
                    height: 100,
                    position: "relative",
                    marginRight: 2,
                  }}
                >
                  <img
                    src={file.preview}
                    alt={`upload-preview-${index}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {file.file && (
                    <IconButton
                      onClick={() => handleRemoveImage(file)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "gray",
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}
            </ImageList>
          </div>
          {errors.files && (
            <Typography color="error" variant="caption" sx={{ ml: 1.5 }}>
              {errors.files}
            </Typography>
          )}

          <Typography fontWeight="bold">제목</Typography>
          <TextField
            fullWidth
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}
          />

          {/* 거래 유형 */}
          <Box>
            <Typography sx={{ marginBottom: 1 }} fontWeight="bold">
              유형
            </Typography>
            <ButtonGroup fullWidth>
              <Button
                variant={type === 0 ? "contained" : "outlined"}
                onClick={() => handleTypeChange(0)}
              >
                <SellRounded sx={{ marginRight: 1 }} />
                판매하기
              </Button>
              <Button
                variant={type === 1 ? "contained" : "outlined"}
                onClick={() => handleTypeChange(1)}
              >
                <ShoppingCartRounded sx={{ marginRight: 1 }} />
                구매하기
              </Button>
            </ButtonGroup>
            {errors.type && (
              <Typography
                color="error"
                variant="caption"
                sx={{ marginLeft: 1.5 }}
              >
                {errors.type}
              </Typography>
            )}
          </Box>

          {/* 거래 방식 */}
          <Typography sx={{ margin: 1, marginLeft: 0 }} fontWeight="bold">
            거래방식
          </Typography>
          <Box display="flex">
            <Box sx={{ marginRight: 2 }}>
              <Button
                variant={wayPeople ? "contained" : "outlined"}
                onClick={handleWayPeopleClick}
              >
                <People sx={{ marginRight: 1 }} />
                대면 거래
              </Button>
            </Box>
            <Box>
              <Button
                variant={wayLocker ? "contained" : "outlined"}
                onClick={handleWayLockerClick}
              >
                <AllInbox sx={{ marginRight: 1 }} />
                사물함 거래
              </Button>
            </Box>
          </Box>
          {errors.way && (
            <Typography
              color="error"
              variant="caption"
              sx={{ marginLeft: 1.5 }}
            >
              {errors.way}
            </Typography>
          )}

          {/* 카테고리 선택 */}
          <Typography sx={{ margin: 1, marginLeft: 0 }} fontWeight="bold">
            물품유형
          </Typography>
          <Grid container spacing={1}>
            {[
              "의류",
              "도서",
              "전자제품",
              "화장품",
              "생필품",
              "기프티콘",
              "대리예매",
              "계정대여",
              "기타",
            ].map((categoryItem, index) => (
              <Grid item xs={4} key={index}>
                <Button
                  fullWidth
                  variant={category === categoryItem ? "contained" : "outlined"}
                  onClick={() => setCategory(categoryItem)}
                  color="primary"
                >
                  {categoryItem}
                </Button>
              </Grid>
            ))}
          </Grid>
          {errors.category && (
            <Typography
              color="error"
              variant="caption"
              sx={{ marginLeft: 1.5 }}
            >
              {errors.category}
            </Typography>
          )}

          <TextField
            fullWidth
            label="가격"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            error={!!errors.price}
            helperText={errors.price}
          />

          <Typography fontWeight="bold">설명</Typography>
          <TextField
            fullWidth
            label="자세한 설명을 적어주세요."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={5}
            margin="normal"
            error={!!errors.comment}
            helperText={errors.comment}
          />

          <Button
            fullWidth
            color="secondary"
            variant="contained"
            type="submit"
            size="large"
            sx={{ mt: 2, "&:hover": { backgroundColor: indigo[500] } }}
          >
            {isEdit ? "수정 완료" : "작성 완료"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default PostForm;
