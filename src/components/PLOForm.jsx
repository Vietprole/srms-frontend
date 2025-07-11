import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
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
import { addPLO, updatePLO } from "@/api/api-plo";
import { getAllNganhs } from "@/api/api-nganh";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const formSchema = z.object({
  ten: z.string().min(2, {
    message: "Ten must be at least 2 characters.",
  }),
  moTa: z.string().min(2, {
    message: "MoTa must be at least 2 characters.",
  }),
  nganhId: z.number({
    required_error: "Please select a Nganh.",
  }),
});

export function PLOForm({ pLO, handleAdd, handleEdit, setIsDialogOpen }) {
  const [searchParams] = useSearchParams();
  const nganhIdParam = searchParams.get("nganhId");
  const [comboBoxItems, setComboBoxItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const comboBoxItems = await getAllNganhs();
      const mappedComboBoxItems = comboBoxItems.map(nganh => ({ label: nganh.ten, value: nganh.id }));
      setComboBoxItems(mappedComboBoxItems);
    };
    fetchData();
  }, []);
  
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: pLO || {
      ten: "",
      moTa:"",
      nganhId: nganhIdParam ? parseInt(nganhIdParam) : null,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (pLO) {
      const data = await updatePLO(pLO.id, values);
      handleEdit(data);
    } else {
      const data = await addPLO(values);
      handleAdd(data);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ten"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder="PLO 1" {...field} />
              </FormControl>
              <FormDescription>
                Đây là mục nhập tên PLO
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
                <Input placeholder="Nắm vững lý thuyết" {...field} />
              </FormControl>
              <FormDescription>
                Mô tả chi tiết của PLO
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nganhId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Chọn CTĐT</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? comboBoxItems.find(
                            (item) => item.value === field.value
                          )?.label
                        : "Chọn CTĐT..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {comboBoxItems.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("nganhId", item.value)
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
                Chọn CTĐT mà PLO thuộc về
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
