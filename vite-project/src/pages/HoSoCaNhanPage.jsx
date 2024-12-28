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
import Layout from "@/pages/Layout";
import { getFullname, getRole } from "@/utils/storage";
import { changePassword } from "@/api/api-taikhoan";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  oldPassword: z.string()
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

  newPassword: z.string()
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
  
  confirmPassword: z.string()
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
}).refine(data => data.newPassword === data.confirmPassword, () => ({
  path: ['confirmPassword'],
  message: 'Mật khẩu xác nhận không khớp',
})).refine(data => data.newPassword !== data.oldPassword, () => ({
  path: ['newPassword'],
  message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
}));

export default function HoSoCaNhanPage() {
  const {toast} = useToast();
  const fullName = getFullname();
  const role = getRole();
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const changePasswordDTO = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }
    try {
      await changePassword(changePasswordDTO);
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message,
        variant: "destructive",
      })
      return;
    }
    toast({
      title: "Thành công",
      description: "Đổi mật khẩu thành công",
      variant: "success",
    })
  }

  return (
    <Layout>
      <h1 className="text-xl">Hồ sơ cá nhân</h1>
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="ten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input {...field} value={fullName} disabled={true}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="chucVu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chức vụ</FormLabel>
                  <FormControl>
                    <Input {...field} value={role} disabled={true}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu cũ</FormLabel>
                  <FormControl>
                    <Input placeholder="Old@123" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input placeholder="New@123" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm@123" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Đổi mật khẩu</Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
