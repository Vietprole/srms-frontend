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
import { addTaiKhoan, updateTaiKhoan } from "@/api/api-taiKhoan";
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
import { getAllChucVus } from "@/api/api-chucvu";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const formSchema = z.object({
  ten: z.string().min(2, {
    message: "ten must be at least 2 characters.",
  }),
  username: z.string()
  .min(5, { message: "Username phải có tối thiểu 2 ký tự" })
  .max(100, { message: "Username không được vượt quá 100 ký tự" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username chỉ cho phép chứa ký tự chữ cái, số và dấu gạch dưới",
  }),
  password: z.string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .regex(/^(?=.*[A-Z])/, { 
      message: "Mật khẩu phải có ít nhất 1 ký tự viết hoa" 
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt !@#$%^&*"
    })
    .regex(/^\S*$/, {
      message: "Mật khẩu không được chứa khoảng trắng"
    }),
  chucVuId: z.number({
    invalid_type_error: "Vui lòng chọn chức vụ",
    required_error: "Vui lòng chọn chức vụ",
  }),
});

export function TaiKhoanForm({ taiKhoan, handleAdd, handleEdit, setIsDialogOpen }) {
  const [searchParams] = useSearchParams();
  const chucVuIdParam = searchParams.get("chucVuId");
  const [comboBoxItems, setComboBoxItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getAllChucVus();
      const mappedComboBoxItems = comboBoxItems.map((chucVu) => ({
        label: chucVu.tenChucVu,
        value: chucVu.id,  // Change from Id to id to match API response
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
      ten: "",
      chucVuId: chucVuIdParam ? parseInt(chucVuIdParam) : null,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (taiKhoan) {
      console.log("taiKhoan, values", taiKhoan, values);
      const data = await updateTaiKhoan(taiKhoan.id, values);
      handleEdit(data);
    } else {
      const data = await addTaiKhoan(values);
      console.log(values);
      handleAdd(data);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ten"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="CNTT" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your_name123" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="PW@12345" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chucVuId"
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
                              form.setValue("chucVuId", item.value);
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
              <FormDescription>
                This is the item that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
