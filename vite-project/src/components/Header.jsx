import { SidebarTrigger } from "@/components/ui/sidebar";
import EmailIcon from "@/assets/icons/email-icon.png";  // Đảm bảo đúng đường dẫn
import AvatarIcon from "@/assets/icons/avatar-icon.png";  // Đảm bảo đúng đường dẫn
import SearchIcon from "@/assets/icons/search-icon.png";  // Đảm bảo đúng đường dẫn
import BellIcon from "@/assets/icons/bell-icon.png";  // Đảm bảo đúng đường dẫn
// import "@/utils/storage"
// import { getFullname } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
const styles = `
  .main {
      width: 100%;
      height: 50px;
      align-items: center;
      display: flex;
      flex-direction: column;
      flex-direction: row;

  }
  .main  .topLeft {
    width: 300px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start
}
  .main  .topRight {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .main  .search {
    width: 250px;
    height: 30px;
    display: flex;
    background-color: #fff;
    justify-content: flex-start;
    align-items: center;
    margin-left: 10px;
    border-radius: 10px;
    border: 2px solid black;
  }
  .main  .search img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }
  .main  .search input[type="text"] {
    width: 100%;
    height: 25px;
    border: none;
    border-radius: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .main  .search input[type="text"]:focus {
    outline: none;
  }
  .main  .user {
    width: 300px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .main  .user .icon,
  .main  .user .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: white;
    margin-right: 10px;
    justify-content: space-between;


  }
  .main  .user .icon:hover,
  .main  .user .avatar:hover {
    background-color: #d9f1ff;
  }
  .main  .user .icon img,
  .main  .user .avatar img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .main  .user .infor {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    width: 300px;
    margin-right: 10px;
  }
  .main  .user .infor .name {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }
  .main  .user .infor .role {
    font-size: 14px;
    color: gray;
    margin: 0;
  }
`;
export default function Header() {
  let fullname = "";
  let role = "";
  const token= sessionStorage.getItem('accessToken');
  if (token) {
    // throw new Error('Token not found');
    const decodedToken = jwtDecode(token);  
    fullname = decodedToken.fullname;
    role = decodedToken.role;
  }

  return (
    <div className="main">
      <div className="topLeft">
        <SidebarTrigger />
        <div className="search">
          <img src={SearchIcon} alt="Search" />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
      </div>
      <div className="topRight">
        <div className="user">
          <div className="icon">
            <img src={EmailIcon} alt="Email" />
          </div>
          <div className="icon">
            <img src={BellIcon} alt="Notification" />
          </div>
          <div className="infor">
            <h4 className="name">{fullname}</h4>
            <h5 className="role">{role}</h5>
          </div>
          <div className="avatar">
            <img src={AvatarIcon} alt="Avatar" />
          </div>
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
}
