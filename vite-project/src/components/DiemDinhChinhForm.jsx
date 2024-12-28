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
import { addDiemDinhChinh, updateDiemDinhChinh } from "@/api/api-diemdinhchinh";
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
import { ChevronsUpDown } from "lucide-react";

export function DiemDinhChinhForm({ diemDinhChinh, handleAdd, handleEdit, setIsDialogOpen }) {
  const formSchema = z.object({
    diemMoi: z.coerce.number()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Điểm mới phải là một số",
    })
    .refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= diemDinhChinh.thangDiem, {
      message: `Điểm mới phải nằm trong khoảng từ 0 đến ` + diemDinhChinh.thangDiem,
    }),
  });

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: diemDinhChinh || {
      diemMoi: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (diemDinhChinh) {
      const data = await updateDiemDinhChinh(diemDinhChinh.id, values);
      handleEdit(data);
    } else {
      const data = await addDiemDinhChinh(values);
      handleAdd(data);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>Trọng số: {diemDinhChinh.trongSo}</div>
        <div>Thang điểm: {diemDinhChinh.thangDiem}</div>
        <FormField
          control={form.control}
          name="diemMoi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm Mới</FormLabel>
              <FormControl>
                <Input placeholder="9.25" {...field} />
              </FormControl>
              <FormDescription>
                Nhập điểm mới
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
