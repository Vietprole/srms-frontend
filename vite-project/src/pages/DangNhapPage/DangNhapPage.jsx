import { useState } from 'react';
import { loginApi } from '../../api/api-taikhoan';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import '@/utils/storage'
import { saveAccessToken } from '@/utils/storage';
import { useToast } from "@/hooks/use-toast";

// import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const [isShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate(); // Use the hook here
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
                // const decodedToken = jwtDecode(response.token);
                // const userRole = decodedToken.role;
                
                // console.log('User Role:', userRole);
                // navigate('/main'); // Use navigate here
                navigate('/khoa'); // Use navigate here
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
    const buttonStyles = {
      backgroundColor: '#3D8BC3',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
  };
    const buttonHoverStyles = {
      backgroundColor: '#8CCAF6',
    };

    const handleMouseEnter = (event) => {
      event.target.style.backgroundColor = buttonHoverStyles.backgroundColor;
    };

    const handleMouseLeave = (event) => {
      event.target.style.backgroundColor = buttonStyles.backgroundColor;
    };



    // CSS dưới dạng Object
    const styles = {
        container: {
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: `url('https://i.imghippo.com/files/lQZ8w1729321525.png')`,
            backgroundSize: 'cover',
            margin: 0,
        },
        loginBox: {
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '10px',
            width: '350px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
        },
        headerPrimary: {
            fontSize: '25px',
            color: '#004a7c',
            marginBottom: '10px',
        },
        headerSecondary: {
            fontWeight: 'bold',
            fontSize: '30px',
            color: '#004a7c',
            margin: '20px auto',
            textAlign: 'center',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            fontWeight: '500',
            marginBottom: '5px',
            textAlign: 'left',
        },
        input: {

            marginBottom: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontSize: '1rem',
        },
        // button: {
        //     backgroundColor: '#48A8EC',
        //     color: 'white',
        //     border: 'none',
        //     padding: '10px',
        //     borderRadius: '5px',
        //     fontSize: '1rem',
        //     cursor: 'pointer',
        //     transition: 'background-color 0.3s ease',
        //     '&:hover': {
        //       backgroundColor: '#8CCAF6', // Màu nền khi hover
        //     }
        // },
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <div style={{ textAlign: 'left' }}>
                    <h2 style={styles.headerSecondary}>Welcome to SRMS</h2>
                    <h1 style={styles.headerPrimary}>Đăng nhập hệ thống</h1>
                </div>
                <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <label style={styles.label} htmlFor="username">Nhập tên đăng nhập</label>
                    <input
                        style={styles.input}
                        type="text"
                        id="username"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label style={styles.label} htmlFor="password">Nhập mật khẩu</label>
                    <input
                        style={styles.input}
                        type="password"
                        id="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                    style={buttonStyles} 
                    type="button" 
                    onClick={handleLogin}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    >Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
