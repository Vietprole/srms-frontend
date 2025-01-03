import { useParams } from 'react-router-dom';

const TongKetCLO = () => {
  const { lopHocPhanId } = useParams();
  return <div>Tổng Kết CLO Component for Lớp Học Phần ID: {lopHocPhanId}</div>;
};

export default TongKetCLO;
