import Layout from "./Layout";

export default function MainPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1 className="text-4xl font-bold text-blue-600">Trang chủ</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Chào mừng đến với hệ thống quản lý điểm sinh viên
        </h2>
        <h2 className="text-xl text-gray-600">
          Vui lòng chọn một trong những chức năng bên trái
        </h2>
      </div>
    </Layout>
  );
}
