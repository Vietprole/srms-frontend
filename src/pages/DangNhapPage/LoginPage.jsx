import LoginForm from "@/components/LoginForm";
import LogoDUT from "../../assets/logos/logo-dut.png";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-row bg-blue-600 text-white gap-2 p-2 items-center justify-center">
        <div>
          <img src={LogoDUT} alt="Logo DUT" className="w-12 h-12" />
        </div>
        <div>
          <div className="text-l">ĐẠI HỌC ĐÀ NẴNG</div>
          <div className="text-l font-bold">TRƯỜNG ĐẠI HỌC BÁCH KHOA</div>
        </div>
        <div className="ml-auto text-xl font-bold">Hệ thống quản lý điểm sinh viên</div>
      </header>
      <div className="flex flex-grow w-full items-center justify-center p-6 md:p-10 bg-[url(campus.png)] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>
        <div className="w-full max-w-sm border border-solid border-gray-200 rounded-xl p-6 shadow-sm bg-white z-10">
          <h1 className="text-2xl font-bold text-center mb-4">Đăng nhập</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
