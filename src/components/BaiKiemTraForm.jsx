import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import vi from "date-fns/locale/vi";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    id: z.number(),
    type: z.string().min(2, {
      message: "Type must be at least 2 characters.",
    }),
    weight: z.coerce
      .number()
      .refine((val) => !isNaN(parseFloat(val)), {
        message: "Trong so must be a number",
      })
      .refine((val) => parseFloat(val) > 0 && parseFloat(val) <= 1, {
        message: "Trọng số phải lớn hơn 0 và nhỏ hơn hoặc bằng 1",
      }),
    scoreEntryStartDate: z.date({
      required_error: "Please select a date.",
    }),
    scoreEntryDeadline: z.date({
      required_error: "Please select a date.",
    }),
    scoreCorrectionDeadline: z.date({
      required_error: "Please select a date.",
    }),
  })
  .refine(
    (data) => {
      return data.scoreEntryDeadline > data.scoreEntryStartDate;
    },
    {
      message: "Hạn nhập điểm phải sau ngày mở nhập điểm",
      path: ["scoreEntryDeadline"],
    }
  )
  .refine(
    (data) => {
      return data.scoreCorrectionDeadline > data.scoreEntryDeadline;
    },
    {
      message: "Hạn đính chính phải sau hạn nhập điểm",
      path: ["scoreCorrectionDeadline"],
    }
  );

export function BaiKiemTraForm({
  baiKiemTra,
  handleAdd,
  handleEdit,
  setIsDialogOpen,
  maxId,
}) {
  const { classId } = useParams();
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: baiKiemTra
      ? {
          ...baiKiemTra,
          scoreEntryStartDate: new Date(baiKiemTra.scoreEntryStartDate),
          scoreEntryDeadline: new Date(baiKiemTra.scoreEntryDeadline),
          scoreCorrectionDeadline: new Date(baiKiemTra.scoreCorrectionDeadline),
        }
      : {
          id: maxId + 1,
          type: "",
          weight: "",
          classId: classId,
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại</FormLabel>
              <FormControl>
                <Input placeholder="Giữa Kỳ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trọng Số</FormLabel>
              <FormControl>
                <Input placeholder="0.3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scoreEntryStartDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                        format(field.value, "dd/MM/yyyy")
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
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scoreEntryDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                        format(field.value, "dd/MM/yyyy")
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
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scoreCorrectionDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                        format(field.value, "dd/MM/yyyy")
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
                    locale={vi}
                  />
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
