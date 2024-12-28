import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import { addCauHoi, updateCauHoi } from "@/api/api-cauhoi";
import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { getBaiKiemTrasByLopHocPhanId } from "@/api/api-baiKiemTra";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  id: z.number(),

  ten: z.string().min(2, {
    message: "Ten must be at least 2 characters.",
  }),

  trongSo: z.coerce.number()
  .refine((val) => !isNaN(parseFloat(val)), {
    message: "Trong so must be a number",
  })
  .refine((val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 10, {
    message: "Trong so must be between 0.1 and 10",
  }),

  thangDiem: z.coerce.number()
  .refine((val) => !isNaN(parseFloat(val)), {
    message: "Thang diem must be a number",
  })
  .refine((val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 10, {
    message: "Thang diem must be between 0.1 and 10",
  }),

  baiKiemTraId: z.coerce.number(
    {
      message: "Bai Kiem Tra Id must be a number",
    }
  ).min(1, {
    message: "Bai Kiem Tra Id must be at least 1 characters.",
  }),
});

export function CauHoiForm({ cauHoi, handleAdd, handleEdit, setIsDialogOpen, maxId }) {
  const [searchParams] = useSearchParams();
  const baiKiemTraIdParam = searchParams.get("baiKiemTraId");
  const { lopHocPhanId } = useParams();
  const [comboBoxItems, setComboBoxItems] = useState([]);
  console.log("maxId 63", maxId);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
      const mappedComboBoxItems = comboBoxItems.map((khoa) => ({
        label: khoa.loai,
        value: khoa.id,
      }));
      setComboBoxItems(mappedComboBoxItems);
    };
    fetchData();
  }, [lopHocPhanId]);
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: cauHoi ||{
      id: maxId + 1,
      ten: "",
      trongSo: "",
      thangDiem: "",
      baiKiemTraId: baiKiemTraIdParam ? parseInt(baiKiemTraIdParam) : null,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (cauHoi) {
      // const data = await updateCauHoi(cauHoi.id, values);
      console.log("values", values);
      handleEdit(values);
    } else {
      // const data = await addCauHoi(values);
      console.log("values", values);
      handleAdd(values);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {cauHoi && (
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
        )}
        <FormField
          control={form.control}
          name="ten"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Câu 1a" {...field} />
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
          name="trongSo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trọng Số</FormLabel>
              <FormControl>
                <Input placeholder="1.5" {...field} />
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
          name="thangDiem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thang Điểm</FormLabel>
              <FormControl>
                <Input placeholder="1.5" {...field} />
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
          name="baiKiemTraId"
          render={({ field }) => (
            <FormItem className=" flex flex-col">
              <FormLabel>Chọn Bài Kiểm Tra</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!!baiKiemTraIdParam}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Select BaiKiemTra..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search baiKiemTra..." />
                    <CommandList>
                      <CommandEmpty>No baiKiemTra found.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("baiKiemTraId", item.value);
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
                Select the BaiKiemTra this HocPhan belongs to.
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
