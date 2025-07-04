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
import { addCauHoi, updateCauHoi } from "@/api-new/api-cauhoi";
import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { getBaiKiemTrasByLopHocPhanId } from "@/api-new/api-baikiemtra";
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
import { cn } from "@/lib/utils";

const formSchema = z.object({
  id: z.number(),

  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),

  weight: z.coerce
    .number()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Điểm bài/câu hỏi đánh giá (thang 10) phải là một số",
    })
    .refine((val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 10, {
      message: "Điểm bài/câu hỏi đánh giá (thang 10) phải trong khoảng 0.1 đến 10",
    }),

  scale: z.coerce
    .number()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Điểm tối đa của bài/câu hỏi đánh giá phải là một số",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Điểm tối đa của bài/câu hỏi đánh giá phải lớn hơn 0",
    }),

  examId: z.coerce
    .number({
      message: "Bai Kiem Tra Id must be a number",
    })
    .min(1, {
      message: "Bai Kiem Tra Id must be at least 1 characters.",
    }),
});

export function CauHoiForm({
  cauHoi,
  handleAdd,
  handleEdit,
  setIsDialogOpen,
  maxId,
}) {
  const [searchParams] = useSearchParams();
  const examIdParam = searchParams.get("examId");
  const { lopHocPhanId } = useParams();
  const [comboBoxItems, setComboBoxItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getBaiKiemTrasByLopHocPhanId(lopHocPhanId);
      const mappedComboBoxItems = comboBoxItems.map((khoa) => ({
        label: khoa.type,
        value: khoa.id,
      }));
      setComboBoxItems(mappedComboBoxItems);
    };
    fetchData();
  }, [lopHocPhanId]);
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: cauHoi || {
      id: maxId + 1,
      name: "",
      weight: "",
      scale: "",
      examId: examIdParam ? parseInt(examIdParam) : null,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (cauHoi) {
      // const data = await updateCauHoi(cauHoi.id, values);
      handleEdit(values);
    } else {
      // const data = await addCauHoi(values);
      handleAdd(values);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* {cauHoi && (
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="Câu 1a" {...field} />
              </FormControl>
              <FormDescription>
                Tên của bài/câu hỏi đánh giá không được trùng nhau trong một thành phần đánh giá
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm bài/câu hỏi đánh giá (thang 10)</FormLabel>
              <FormControl>
                <Input placeholder="1.5" {...field} />
              </FormControl>
              <FormDescription>
                Là tỉ lệ điểm trên thang 10 của thành phần đánh giá
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm tối đa của bài/câu hỏi đánh giá</FormLabel>
              <FormControl>
                <Input placeholder="1.5" {...field} />
              </FormControl>
              <FormDescription>Là điểm số tối đa của bài/câu hỏi đánh giá</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="examId"
          render={({ field }) => (
            <FormItem className=" flex flex-col">
              <FormLabel>Chọn Thành phần đánh giá</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!!examIdParam}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Chọn Thành phần đánh giá"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy</CommandEmpty>
                      <CommandGroup>
                        {comboBoxItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("examId", item.value);
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
                Chọn thành phần đánh giá mà bài/câu hỏi đánh giá thuộc về
              </FormDescription>
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
