import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addTaiKhoan, updateTaiKhoan } from "@/api-new/api-taikhoan";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { getAllChucVus } from "@/api-new/api-chucvu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có tối thiểu 2 ký tự",
  }),
  username: z
    .string()
    .min(5, { message: "Tên đăng nhập phải có tối thiểu 5 ký tự" })
    .max(100, { message: "Tên đăng nhập không được vượt quá 100 ký tự" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Tên đăng nhập chỉ cho phép chứa ký tự chữ cái, số và dấu gạch dưới",
    }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Mật khẩu phải có ít nhất 1 ký tự viết hoa",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt !@#$%^&*",
    })
    .regex(/^\S*$/, {
      message: "Mật khẩu không được chứa khoảng trắng",
    }),
  roleId: z.number({
    invalid_type_error: "Vui lòng chọn chức vụ",
    required_error: "Vui lòng chọn chức vụ",
  }),
});

export function TaiKhoanForm({
  taiKhoan,
  handleAdd,
  handleEdit,
  setIsDialogOpen,
}) {
  const [searchParams] = useSearchParams();
  const roleIdParam = searchParams.get("roleId");
  const [comboBoxItems, setComboBoxItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getAllChucVus();
      const mappedComboBoxItems = comboBoxItems.map((chucVu) => ({
        label: chucVu.displayName,
        value: chucVu.id, // Change from Id to id to match API response
      }));
      setComboBoxItems(mappedComboBoxItems);
    };
    fetchData();
  }, []);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: taiKhoan || {
      username: "",
      password: "",
      name: "",
      roleId: roleIdParam ? parseInt(roleIdParam) : null,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (taiKhoan) {
      const data = await updateTaiKhoan(taiKhoan.id, values);
      handleEdit(data);
    } else {
      const data = await addTaiKhoan(values);
      handleAdd(data);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn An" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="your_name123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="PW@12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn Chức vụ</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Chọn Chức vụ..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("roleId", item.value);
                            }}
                          >
                            {item.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                item.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </Form>
  );
}
