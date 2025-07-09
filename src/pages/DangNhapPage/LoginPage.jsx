import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm border border-solid border-gray-200 rounded-xl p-6 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">Đăng nhập</h1>
        <LoginForm />
      </div>
    </div>
  )
}
