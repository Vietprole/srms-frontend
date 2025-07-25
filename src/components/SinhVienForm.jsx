import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
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
import { ChevronsUpDown } from "lucide-react";
import { addSinhVien, updateSinhVien } from "@/api/api-sinhvien";
import { getAllFaculties } from "@/api/api-faculties";
import { getAllNganhs } from "@/api/api-nganh";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  ten: z.string().min(2, {
    message: "Ten must be at least 2 characters.",
  }),
  khoaId: z.number({
    required_error: "Please select a Khoa.",
  }),
  nganhId: z.number({
    required_error: "Please select a Khoa.",
  }),
  namNhapHoc: z.coerce.number(
    {
      message: "Nam Bat Dau must be a number",
    }
  ).min(4, {
    message: "Nam bat dau must be at least 4 characters.",
  })
  .refine((val) => val >= 2000 && val <= 2099, {
    message: "Năm Bắt Đầu must be between 2000 and 2099",
  }),
});

export function SinhVienForm({ sinhVien, handleAdd, handleEdit, setIsDialogOpen }) {
  const [comboBoxKhoaItems, setComboBoxKhoaItems] = useState([]);
  const [comboBoxNganhItems, setComboBoxNganhItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxKhoaItems = await getAllFaculties();
      const mappedComboBoxKhoaItems = comboBoxKhoaItems.map(khoa => ({ label: khoa.ten, value: khoa.id }));
      setComboBoxKhoaItems(mappedComboBoxKhoaItems);
      const comboBoxNganhItems = await getAllNganhs();
      const mappedComboBoxNganhItems = comboBoxNganhItems.map(nganh => ({ label: nganh.ten, value: nganh.id }));
      setComboBoxNganhItems(mappedComboBoxNganhItems);
    };
    fetchData();
  }, []);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: sinhVien || {
      ten: "",
      // khoaId: "",
      namNhapHoc: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (sinhVien) {
      const data = await updateSinhVien(sinhVien.id, values);
      handleEdit(data);
    } else {
      const data = await addSinhVien(values);
      handleAdd(data);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* {sinhVien && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input {...field} readOnly/>
                </FormControl>
                <FormDescription>
                  This is your unique identifier.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}
        <FormField
          control={form.control}
          name="ten"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormDescription>
                Tên hiển thị của sinh viên
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="khoaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khoa Id</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="khoaId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn Khoa</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={sinhVien}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxKhoaItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Chọn Khoa..."}
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
                        {comboBoxKhoaItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("khoaId", item.value)
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
                Khoa của sinh viên
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nganhId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn CTĐT</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={sinhVien}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxNganhItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Select Nganh..."}
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
                        {comboBoxNganhItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("nganhId", item.value)
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
                CTĐT sinh viên nhập học
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="namNhapHoc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Năm Nhập Học</FormLabel>
              <FormControl>
                <Input placeholder="2024" {...field} disabled={sinhVien}/>
              </FormControl>
              <FormDescription>
                Năm sinh viên nhập học
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
