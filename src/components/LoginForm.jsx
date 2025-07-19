import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/api-new/api-taikhoan";
import { saveAccessToken } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  username: z
    .string({
      required_error: "Tên đăng nhập không được để trống",
    })
    .min(1, { message: "Tên đăng nhập không được để trống" }),

  password: z
    .string({
      required_error: "Mật khẩu không được để trống",
    })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export default function LoginForm() {
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await login(values.username, values.password);
    if (response.token) {
      saveAccessToken(response.token);
      navigate("/main"); 
    } else {
      toast({
        variant: "destructive",
        title: "Tên đăng nhập hoặc mật khẩu sai",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </div>
      </form>
    </Form>
  );
}
