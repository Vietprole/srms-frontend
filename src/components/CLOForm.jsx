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
import { addCLO, updateCLO } from "@/api/api-clo";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  ten: z.string().min(2, {
    message: "Tên CLO phải có ít nhất 2 ký tự.",
  }),
  moTa: z.string().min(2, {
    message: "Mô tả CLO phải có ít nhất 2 ký tự.",
  }),
  lopHocPhanId: z.coerce.number({
    required_error: "Vui lòng chọn lớp học phần",
    invalid_type_error: "Lớp học phần không hợp lệ",
  }),
});

export function CLOForm({ cLO, handleAdd, handleEdit, setIsDialogOpen, lopHocPhanId: propLopHocPhanId }) {
  const { lopHocPhanId: paramLopHocPhanId } = useParams();
  const effectiveLopHocPhanId = propLopHocPhanId || paramLopHocPhanId;

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: cLO || {
      ten: "",
      moTa: "",
      lopHocPhanId: effectiveLopHocPhanId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
      if (cLO) {
        const data = await updateCLO(cLO.id, values);
        handleEdit(data);
      } else {
        const data = await addCLO(values);
        handleAdd(data);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error submitting CLO:", error);
      // You might want to show an error message to the user here
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* {cLO && (
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
                <Input placeholder="CLO 1" {...field} />
              </FormControl>
              <FormDescription>
                Tên hiển thị của CLO, nên tránh đặt trùng tên
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moTa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô Tả</FormLabel>
              <FormControl>
                <Input placeholder="Hiểu được khái niệm cơ bản" {...field} />
              </FormControl>
              <FormDescription>
                Thông tin mô tả chi tiết CLO
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" {...form.register("lopHocPhanId")} />
        <Button type="submit">Lưu</Button>
      </form>
    </Form>
  );
}
