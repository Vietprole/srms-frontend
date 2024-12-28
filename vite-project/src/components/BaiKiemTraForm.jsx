import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";
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
// import { addBaiKiemTra, updateBaiKiemTra } from "@/api/api-baikiemtra";
// import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  id: z.number(),
  loai: z.string().min(2, {
    message: "Loai must be at least 2 characters.",
  }),
  trongSo: z.coerce.number()
  .refine((val) => !isNaN(parseFloat(val)), {
    message: "Trong so must be a number",
  })
  .refine((val) => parseFloat(val) > 0 && parseFloat(val) < 1, {
    message: "Trong so must be between 0 and 1",
  }),
  ngayMoNhapDiem: z.date({
    required_error: "Please select a date.",
  }),
  hanNhapDiem: z.date({
    required_error: "Please select a date.",
  }),
  hanDinhChinh: z.date({
    required_error: "Please select a date.",
  }),
}).refine((data) => {
  return data.hanNhapDiem > data.ngayMoNhapDiem;
}, {
  message: "Hạn nhập điểm phải sau ngày mở nhập điểm",
  path: ["hanNhapDiem"],
}).refine((data) => {
  return data.hanDinhChinh > data.hanNhapDiem;
}, {
  message: "Hạn đính chính phải sau hạn nhập điểm",
  path: ["hanDinhChinh"],
});

export function BaiKiemTraForm({ baiKiemTra, handleAdd, handleEdit, setIsDialogOpen, maxId }) {
  const { lopHocPhanId } = useParams();
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: baiKiemTra ? {
      ...baiKiemTra,
      ngayMoNhapDiem: new Date(baiKiemTra.ngayMoNhapDiem),
      hanNhapDiem: new Date(baiKiemTra.hanNhapDiem),
      hanDinhChinh: new Date(baiKiemTra.hanDinhChinh),
    } : {
      id: maxId + 1,
      loai: "",
      trongSo: "",
      lopHocPhanId: lopHocPhanId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (baiKiemTra) {
      // const data = await updateBaiKiemTra(baiKiemTra.id, values);
      handleEdit(values);
    } else {
      // const data = await addBaiKiemTra(values);
      handleAdd(values);
      setIsDialogOpen(false);
    }
  }

  const setEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59);
    return newDate;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="loai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại</FormLabel>
              <FormControl>
                <Input placeholder="Giữa Kỳ" {...field} />
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
            <FormItem className="!mt-2">
              <FormLabel>Trọng Số</FormLabel>
              <FormControl>
                <Input placeholder="0.3" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="trongSoDeXuat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trọng Số Đề Xuất</FormLabel>
              <FormControl>
                <Input placeholder="0.3" {...field} />
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
          name="ngayMoNhapDiem"
          render={({ field }) => (
            <FormItem className="!mt-2 flex flex-col">
              <FormLabel>Ngày Mở Nhập Điểm</FormLabel>
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
                Chọn ngày mở nhập điểm
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hanNhapDiem"
          render={({ field }) => (
            <FormItem className="!mt-2 flex flex-col">
              <FormLabel>Hạn Nhập Điểm</FormLabel>
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
                    // onSelect={field.onChange}
                    onSelect={(date) => field.onChange(setEndOfDay(date))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Chọn hạn nhập điểm
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hanDinhChinh"
          render={({ field }) => (
            <FormItem className="!mt-2 flex flex-col">
              <FormLabel>Hạn Đính Chính</FormLabel>
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
                    // onSelect={field.onChange}
                    onSelect={(date) => field.onChange(setEndOfDay(date))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Chọn hạn đính chính điểm
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
