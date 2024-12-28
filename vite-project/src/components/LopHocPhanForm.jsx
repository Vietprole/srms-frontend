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
import { addLopHocPhan, updateLopHocPhan } from "@/api/api-lophocphan";
import { getAllHocPhans } from "@/api/api-hocphan";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { getAllHocKys } from "@/api/api-hocky";
import { getAllGiangViens } from "@/api/api-giangvien";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns"

const formSchema = z.object({
  ten: z.string().min(2, {
    message: "Ten must be at least 2 characters.",
  }),
  hocPhanId: z.number({
    required_error: "Please select a HocPhan.",
  }),
  hocKyId: z.number({
    required_error: "Please select a HocKy.",
  }),
  giangVienId: z.number({
    required_error: "Please select a GiangVien.",
  }),
  hanDeXuatCongThucDiem: z.date({
    required_error: "Please select a date.",
  }),
});

export function LopHocPhanForm({ lopHocPhan, handleAdd, handleEdit, setIsDialogOpen }) {
  const [comboBoxHocPhans, setComboBoxHocPhans] = useState([]);
  const [comboBoxHocKys, setComboBoxHocKys] = useState([]);
  const [comboBoxGiangViens, setComboBoxGiangViens] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const comboBoxHocPhans = await getAllHocPhans();
      const mappedComboBoxHocPhans = comboBoxHocPhans.map(hocphan => ({ label: hocphan.ten, value: hocphan.id }));
      setComboBoxHocPhans(mappedComboBoxHocPhans);

      const comboBoxHocKys = await getAllHocKys();
      const mappedComboBoxHocKys = comboBoxHocKys.map(hocky => ({ label: hocky.tenHienThi, value: hocky.id }));
      setComboBoxHocKys(mappedComboBoxHocKys);

      const comboBoxGiangViens = await getAllGiangViens();
      const mappedComboBoxGiangViens = comboBoxGiangViens.map(giangvien => ({ label: giangvien.ten, value: giangvien.id }));
      setComboBoxGiangViens(mappedComboBoxGiangViens);
    };
    fetchData();
  }, []);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: lopHocPhan ? {
      ...lopHocPhan,
      hanDeXuatCongThucDiem: new Date(lopHocPhan.hanDeXuatCongThucDiem)
    } : {
      ten: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (lopHocPhan) {
      const data = await updateLopHocPhan(lopHocPhan.id, values);
      handleEdit(data);
    } else {
      const data = await addLopHocPhan(values);
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
                <Input placeholder="PBL6 21Nh11" {...field} />
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
          name="hocPhanId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn Học Phần</FormLabel>
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
                        ? comboBoxHocPhans.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Select HocPhan..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search item..." />
                    <CommandList>
                      <CommandEmpty>No item found.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxHocPhans.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("hocPhanId", item.value)
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
        <FormField
          control={form.control}
          name="hocKyId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn Học Kỳ</FormLabel>
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
                        ? comboBoxHocKys.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Select HocPhan..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search item..." />
                    <CommandList>
                      <CommandEmpty>No item found.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxHocKys.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("hocKyId", item.value)
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
        <FormField
          control={form.control}
          name="giangVienId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn Giảng Viên</FormLabel>
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
                        ? comboBoxGiangViens.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Select HocPhan..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search item..." />
                    <CommandList>
                      <CommandEmpty>No item found.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxGiangViens.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("giangVienId", item.value)
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
        <FormField
          control={form.control}
          name="hanDeXuatCongThucDiem"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hạn đề xuất công thức điểm</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Chọn ngày hết hạn đề xuất công thức điểm
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
