import { SidebarTrigger } from "@/components/ui/sidebar";
import { getFullname, getRole } from "@/utils/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper function to get initials from full name
const getFirstLetters = (fullName) => {
  if (!fullName) return "UN"; // UN for "Unknown Name" if name is empty

  // Split the name by spaces
  const nameParts = fullName.split(" ");

  // Get the first letter of each part and join them
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  // Return first two initials or all if less than two parts
  return initials.length > 2 ? initials.substring(0, 2) : initials;
};

const mapRole = (role) => {
  switch (role) {
    case "Admin":
      return "Admin";
    case "AcademicAffairs":
      return "Phòng Đào tạo";
    case "ProgrammeManager":
      return "Người phụ trách CTĐT";
    case "Teacher":
      return "Giảng viên";
    case "Student":
      return "Sinh viên";
    default:
      return "Không xác định";
  }
}

export default function Header() {
  const name = getFullname();
  const role = mapRole(getRole());
  const firstLetters = getFirstLetters(name);

  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-1 py-2 shadow-sm">
      <div className="flex items-center justify-between mx-auto">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-muted-foreground capitalize">{role}</span>
          </div>
          
          <Avatar className="h-9 w-9 transition-all hover:ring-2 hover:ring-primary">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {firstLetters}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
