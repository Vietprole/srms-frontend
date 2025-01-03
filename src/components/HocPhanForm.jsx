import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { addHocPhan, updateHocPhan } from "@/api/api-hocphan";
import { getAllKhoas } from "@/api/api-khoa";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const formSchema = z.object({
  ten: z.string().min(2, {
    message: "Ten must be at least 2 characters.",
  }),
  soTinChi: z.coerce
    .number({
      message: "So Tin Chi must be a number",
    })
    .min(1, {
      message: "So Tin Chi must be at least 1.",
    }),
  laCotLoi: z.boolean(),
  khoaId: z.number({
    required_error: "Please select a Khoa.",
  }),
});

export function HocPhanForm({
  hocphan,
  handleAdd,
  handleEdit,
  setIsDialogOpen,
}) {
  const [searchParams] = useSearchParams();
  const khoaIdParam = searchParams.get("khoaId");
  const [comboBoxItems, setComboBoxItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getAllKhoas();
      const mappedComboBoxItems = comboBoxItems.map((khoa) => ({
        label: khoa.ten,
        value: khoa.id,
      }));
      setComboBoxItems(mappedComboBoxItems);
    };
    fetchData();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: hocphan || {
      ten: "",
      soTinChi: "",
      laCotLoi: false,
      khoaId: khoaIdParam ? parseInt(khoaIdParam) : null,
    },
  });

  async function onSubmit(values) {
    if (hocphan) {
      const data = await updateHocPhan(hocphan.id, values);
      handleEdit(data);
    } else {
      const data = await addHocPhan(values);
      handleAdd(data);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {hocphan && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormDescription>
                  This is your unique identifier.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex space-x-1">
          <FormField
            control={form.control}
            name="ten"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="CNTT" {...field} />
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
            name="soTinChi"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Số Tín Chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="2" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="laCotLoi"
          render={({ field }) => (
            <FormItem className=" flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Là Cốt Lõi</FormLabel>
                <FormDescription>
                  Học phần này có phải là cốt lõi không?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="khoaId"
          render={({ field }) => (
            <FormItem className=" flex flex-col">
              <FormLabel>Chọn Khoa</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!!hocphan}
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Select Khoa..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search khoa..." />
                    <CommandList>
                      <CommandEmpty>No khoa found.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("khoaId", item.value);
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
                Select the Khoa this HocPhan belongs to.
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
