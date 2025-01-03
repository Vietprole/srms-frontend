import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            trangthai: 0 // 0: Hiển thị form, -1: Sai thông tin, 1: Đăng nhập thành công
        };
    }

    // Hàm xử lý sự thay đổi của input
    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    // Hàm xử lý khi submit form
    handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;

        // Kiểm tra tên đăng nhập và mật khẩu
        if (username === "duytin123" && password === "123456") {
            this.setState({ trangthai: 1 }); // Đăng nhập thành công
        } else {
            this.setState({ trangthai: -1 }); // Sai tên đăng nhập hoặc mật khẩu
        }
    }

    // Render thông báo lỗi khi thông tin đăng nhập sai
    renderErrorMessage = () => (
        <div align="left">
            <h1 style={{ color: 'red' }}>Sai mật khẩu hoặc tên đăng nhập</h1>
        </div>
    );

    // Render form đăng nhập
    renderForm = () => (
        <div>
            <div align="left">
                <h2>Welcome to SRMS</h2>
                <h1>Đăng nhập</h1>
            </div>
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="username">Nhập tên đăng nhập</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Tên đăng nhập"
                    value={this.state.username}
                    onChange={this.handleChange}
                    required
                />
                <label htmlFor="password">Nhập mật khẩu</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Mật khẩu" 
                    value={this.state.password} // lấy mật khẩu và truyền vào state
                    onChange={this.handleChange}
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );

    // Hiển thị kết quả dựa trên trạng thái
    displayCheck() {
        if (this.state.trangthai === 0) {
            return this.renderForm();
        } else if (this.state.trangthai === -1) {
            return this.renderErrorMessage();
        } else {
            return <h1>Đăng nhập thành công!</h1>;
        }
    }

    render() {
        return (
            <div className="container">
                <div className="login-box">
                    {this.displayCheck()}
                </div>
            </div>
        );
    }
}

export default Login;
