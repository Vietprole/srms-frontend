import { useParams } from 'react-router-dom';

const BaoCaoCLO = () => {
  const { lopHocPhanId } = useParams();
  return <div>Báo Cáo CLO Component for Lớp Học Phần ID: {lopHocPhanId}</div>;
};

export default BaoCaoCLO;
