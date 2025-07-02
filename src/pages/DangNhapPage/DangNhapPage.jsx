import { useState } from 'react';
import { loginApi } from '../../api/api-accounts';
import { useNavigate } from 'react-router-dom';
import '@/utils/storage'
import { saveAccessToken } from '@/utils/storage';
import { useToast } from "@/hooks/use-toast";
import LogoIcon from "@/assets/logos/logo-dut.png";
import BackGround from "@/assets/icons/education.png";
import SecurityIcons from "@/assets/icons/learning.png"
import UserLoginIcons from "@/assets/icons/userlogin.png"
import PassLogin from "@/assets/icons/passlogin.png"

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const { toast } = useToast();
    const handleLogin = async () => {
        if (!username || !password) {
            toast({
                variant: "destructive",
                title: "Vui lòng nhập đầy đủ thông tin",
            });
            return;
        }
        try {
          const response = await loginApi(username, password);
              console.log(">>Check login:", response);
              console.log(">>Respone.token:", response.token);
              if (response.token) {
                console.log(">>Respone.token:", response.token);
                saveAccessToken(response.token);
                navigate('/main');
              } else {
                toast({
                    variant: "destructive",
                    title: "Tên đăng nhập hoặc mật khẩu sai",
                });
              }
            } catch (error) {
              console.error("Login error: ", error);
              toast({
                  variant: "destructive",
                  title: "Có lỗi xảy ra",
                  description: "Vui lòng thử lại!",
              });
            }
    };
    const btnMicro = {
      backgroundColor: '#848484',
    };
    const buttonHoverStyles = {
      backgroundColor: '#066DBE',
    };

    const handleMouseEnter = (event) => {
      event.target.style.backgroundColor = buttonHoverStyles.backgroundColor;
    };

    const handleMouseLeave = (event) => {
      event.target.style.backgroundColor = styles.btnSubmit.backgroundColor;
    };
    const handleMouseMicroEnter = (event) => {
      event.target.style.backgroundColor = btnMicro.backgroundColor;
    };
    const handleMouseMicroLeave = (event) => {
      event.target.style.backgroundColor = styles.btnLoginWithMicrosoft.backgroundColor;
    };
    

    // CSS dưới dạng Object
    const styles = {
        container: {
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            backgroundSize: 'cover',
            flexDirection: 'column',
        },
        header: {
          width: '100%',
          height: '10vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#488FD2',
        },
        title: {
          height: '100%',
          width: '70vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        logo:
        {
          width: '50px',
          height: '50px',
          marginLeft: '20px',
        },
        title1: {
          height: '100%',
          width: '100%',                  // Chiều rộng đầy đủ
          marginLeft: '20px',
          display: 'flex',
          justifyContent: 'flex-start',   // Căn ngang sang trái
          alignItems: 'center',           // Căn dọc ở giữa
          flexDirection: 'column',        // Sắp xếp các label theo chiều dọc
          padding: '5px',                   // Loại bỏ khoảng cách không cần thiết
        },
        label1: {
          fontSize: '1.2rem',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'left',              // Căn text về trái
          width: '100%',                  // Đảm bảo text chiếm toàn bộ chiều rộng container
          margin: '0',                    // Loại bỏ khoảng cách không cần thiết
        },
        label2: {
          fontWeight: '700',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'left',              // Căn text về trái
          width: '100%',                  // Đảm bảo text chiếm toàn bộ chiều rộng container
          margin: '0',                    // Loại bỏ khoảng cách không cần thiết
        },
        body: 
        {
          width: '100%',
          height: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        bodyform:
        {
          width: '70%',
          height: '75%',
          display: 'flex',
          flexDirection: 'row',
        },
        img :
        {
          width: '100%',
          height: '95%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        },
        image:
        {
          width: '100%',
          height: '70%',
          "user-select": 'none',
          "pointer-events": 'none',
        },
        frm:
        {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '20px',
          borderRadius: '10px',
          padding: '20px',
          
        },
        frmTitle:
        {
          width: '100%',
          height: '15%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',

        },
        imgLock:
        {
          margin: '11px 20px 0px 0px',
          width: '100px',
          height: '100px',
          "border-radius": '10px',
          alignItems: 'center',
          "user-select": 'none',
          "pointer-events": 'none',
        },

        lb:
        {
          color: '#626666',
          fontSize: '1.7rem',
          fontWeight: '400',
        },
        lb1:
        {
          "font-family": 'Roboto, sans-serif',
          color: '#48A8EC',
          fontSize: '1rem',
          fontWeight: '700',
          "letter-spacing": '1px',
        },
        frmTt:
        {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        frmLogin:
        {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        lb2:
        {
          color: '#2196F3',
          fontSize: '1.3rem',
          fontWeight: '500',
          marginBottom: '5px',
        },
        ip:
        {
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '5px',
          width: '100%',
          height: '50px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
        ipLg:
        {
          width: '100%',
          "outline": 'none',
          height: '100%',
          "border-radius": '5px',
          "padding-left": '10px',
          
        },
        imgLogin:
        {
          width: '40px',
          height: '40px',
          "user-select": 'none',
          "pointer-events": 'none',
          
          
        },
        ipPw:
        {
          width: '100%',
          height: '100%',
          "border-radius": '5px',
          "padding-left": '10px',
          "outline": 'none',
          "-webkit-text-security": 'disc',    
        },
        btnSubmit:
        {
          width: '100%',
          height: '50px',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1.2rem',
          fontWeight: '500',
          "letter-spacing": '1px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        },
        btnLoginWithMicrosoft:
        {
          marginTop: '10px',
          width: '100%',
          height: '50px',
          fontFamily: 'Roboto, sans-serif',
          fontSize: '1.2rem',
          fontWeight: '500',
          "letter-spacing": '1px',
          backgroundColor: '#494949',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
              <div style={styles.title}>
                <div style={styles.logo}>
                  <img src={LogoIcon} alt="Avatar" />
                </div>
                
                <div style={styles.title1}>
                  <label style={styles.label1}>ĐẠI HỌC ĐÀ NẴNG</label>
                  <label style={styles.label2}>TRƯỜNG ĐẠI HỌC BÁCH KHOA</label>
                </div>
              </div>
            </div>
            <div style={styles.body}>
              <div style={styles.bodyform}>
                <div style={styles.img}>
                  <img src={BackGround} alt="Avatar" style={styles.image}/>
                </div>
                <div style={styles.frm}>
                  <div style={styles.frmTitle}>
                     <div style={styles.imgLock}>
                        <img src={SecurityIcons} alt="Avatar" style={styles.image}/>
                      </div>
                      
                      <div style={styles.frmTt}>
                          <h1 style={styles.lb}>ĐĂNG NHẬP HỆ THỐNG SRMS</h1>
                          <h2 style={styles.lb1}>Quản lý cấp trường</h2>
                      </div>
                  </div>
                    <div style={styles.frmLogin}>
                      <h2 style={styles.lb2}>TÀI KHOẢN CỦA BẠN</h2>
                      <div style={styles.ip}>
                        <input type="text" placeholder="Tên đăng nhập" style={styles.ipLg} onChange={(e) => setUsername(e.target.value)} />
                        <img src={UserLoginIcons} alt="Avatar" style={styles.imgLogin}/>
                        
                      </div>
                      <div style={styles.ip}>
          
                        <input type="password" placeholder="Mật khẩu" style={styles.ipPw} onChange={(e) => setPassword(e.target.value)} />
                        <img src={PassLogin} alt="Avatar" style={styles.imgLogin}/>
                      </div>
                      <button style={styles.btnSubmit} onClick={handleLogin} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Đăng nhập</button>
                      <button style={styles.btnLoginWithMicrosoft} onMouseEnter={handleMouseMicroEnter} onMouseLeave={handleMouseMicroLeave}>Đăng nhập với tài khoản Microsoft</button>
                    </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default LoginPage;
