import React, { useState, useEffect } from 'react';
import { Col, Container, Image, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callSendPlaylistAPI } from "apis/emailAPICalls";
import EmailInput from "custom-components/form/EmailInput";

function SendEmail() {
  const containerStyle = {
    paddingTop: 50,
    textAlign: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1e1e1e, #3B2951)',
    color: 'white'
  };

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    playlist_created_date: "",
    weather_id: "3",
    playlist_url: ""  // URL에서 전달받은 파라미터 값 저장
  });

  const { sendPlaylistSuccess, errorMessage } = useSelector(state => state.emailReducer);

  useEffect(() => {
    if (sendPlaylistSuccess) {
      navigate('/playlist');
    }
  }, [sendPlaylistSuccess, navigate]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // 현재 날짜를 YYYY-MM-DD 형식으로 포맷팅
    setForm(form => ({
      ...form,
      playlist_created_date: formattedDate
    }));

    // location.state에서 전달된 playlist_url 파라미터 값을 form에 설정
    if (location.state && location.state.playlist_url) {
      setForm(form => ({
        ...form,
        playlist_url: location.state.playlist_url
      }));
    }
  }, [location.state]);

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const onClickSendEmailHandler = (email) => {
    // 이메일 전송 시 form 데이터 전달
    dispatch(callSendPlaylistAPI({ emailData: { ...form, email } }));
  };

  const onClickHandler = () => {
    navigate("/");
  };

  return (
    <>
      <Container style={containerStyle}>
        <img
          src="/cartune-logo-white.png"
          width="70"
          height="70"
          className="align-top mx-5 mb-5"
          alt="logo"
          onClick={onClickHandler}
        />
        <Row className="px-5 justify-content-center">
          <Col className="col-9 mt-5">
            <div
              style={{ "backgroundColor": "white", "borderRadius": "20px" }}
              className="h-[400px] d-flex align-items-center justify-content-center flex-column">
              <Image src="/cartune-logo.png" className="logo-image w-[150px] mb-4" />
              <h2 className="mb-2 text-dark">이메일로 현재 플레이리스트를 전송할게요.</h2>
              <p className="mb-3 fs-6 text-dark">이후 이메일을 입력하시면 같은 플레이리스트를 조회할 수 있습니다.</p>
              <EmailInput
                inputClassName="text-dark"
                inputOnChange={onChangeHandler}
                buttonClassName="text-dark hover:bg-stone-100"
                buttonOnClick={onClickSendEmailHandler}
              />
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SendEmail;
