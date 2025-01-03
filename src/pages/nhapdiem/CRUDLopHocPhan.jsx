import { useParams } from 'react-router-dom';

const CRUDLopHocPhan = () => {
  const { lopHocPhanId } = useParams();
  return <div>Công Thức Điểm Component for Lớp Học Phần ID: {lopHocPhanId}</div>;
};

export default CRUDLopHocPhan;
