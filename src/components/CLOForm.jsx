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
    message: "Ten must be at least 2 characters.",
  }),
  moTa: z.string().min(2, {
    message: "MoTa must be at least 2 characters.",
  }),
  lopHocPhanId: z.coerce.number(
    {
      message: "Lop Hoc Phan Id must be a number",
    }
  ).min(1, {
    message: "Lop Hoc Phan Id must be at least 1 characters.",
  }),
});

export function CLOForm({ cLO, handleAdd, handleEdit, setIsDialogOpen }) {
  const { lopHocPhanId } = useParams();
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: cLO || {
      ten: "",
      moTa:"",
      lopHocPhanId: lopHocPhanId,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (cLO) {
      const data = await updateCLO(cLO.id, values);
      handleEdit(data);
    } else {
      const data = await addCLO(values);
      handleAdd(data);
      setIsDialogOpen(false);
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
        {/* <FormField
          control={form.control}
          name="lopHocPhanId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lớp Học Phần Id</FormLabel>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
