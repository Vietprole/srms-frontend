import EditSinhVienLopHocPhan from "@/components/EditSinhVienLopHocPhanForm";
import { useState } from "react";

export default function TestPage() 
{
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div>
      <button
        className="openModalBtn"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Open
      </button>
      {modalOpen && <EditSinhVienLopHocPhan setOpenModal={setModalOpen} lophocphanId={2}/>}
    </div>
  );
}
