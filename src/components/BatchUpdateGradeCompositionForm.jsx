import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import vi from "date-fns/locale/vi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BatchUpdateExamDeadlines,
  getDistinctExamTypesByClassIds,
} from "@/api/api-exams";
import { toast } from "sonner";

// Define schema for each exam type's dates
const examDateSchema = z
  .object({
    type: z.string(),
    examId: z.number(),
    scoreEntryStartDate: z.date({
      required_error: "Vui lòng chọn ngày bắt đầu.",
    }),
    scoreEntryDeadline: z.date({
      required_error: "Vui lòng chọn hạn nhập điểm.",
    }),
    scoreCorrectionDeadline: z.date({
      required_error: "Vui lòng chọn hạn đính chính.",
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

// Form schema for the collection of exam configs
const formSchema = z.object({
  examConfigs: z.array(examDateSchema),
});

// Helper function to set end of day for deadline dates
const setEndOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59);
  return newDate;
};

const setStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0);
  return newDate;
};

// const exams = [
//   {
//     id: 1,
//     type: "Giữa kỳ",
//     scoreEntryStartDate: new Date(),
//     scoreEntryDeadline: new Date(),
//     scoreCorrectionDeadline: new Date(),
//   },
//   {
//     id: 2,
//     type: "Cuối kỳ",
//     scoreEntryStartDate: new Date(),
//     scoreEntryDeadline: new Date(),
//     scoreCorrectionDeadline: new Date(),
//   },
// ]

export function BatchUpdateGradeCompositionForm({
  // exams, // Array of exam items, each with unique type
  // handleUpdate,
  setIsDialogOpen,
  classIds,
}) {
  const [exams, setExams] = useState([]);
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const exams = await getDistinctExamTypesByClassIds(classIds);
        setExams(exams);
        console.log("Fetched exams:", exams);
      } catch (error) {
        console.error("Error fetching exam types:", error);
      }
    };
    fetchExams();
  }, [classIds]);

  // Prepare default form values
  const defaultValues = {
    examConfigs: exams.map((exam) => ({
      type: exam.type,
      examId: exam.id,
      scoreEntryStartDate: exam.scoreEntryStartDate
        ? new Date(exam.scoreEntryStartDate)
        : (() => {
            const date = new Date();
            return setStartOfDay(date);
          })(),
      scoreEntryDeadline: exam.scoreEntryDeadline
        ? new Date(exam.scoreEntryDeadline)
        : (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return setEndOfDay(date);
          })(),
      scoreCorrectionDeadline: exam.scoreCorrectionDeadline
        ? new Date(exam.scoreCorrectionDeadline)
        : (() => {
            const date = new Date();
            date.setDate(date.getDate() + 2);
            return setEndOfDay(date);
          })(),
    })),
  };

  // Define your form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form values if exams change
  useEffect(() => {
    // if (exams && exams.length > 0) {
    const updatedValues = {
      examConfigs: exams.map((exam) => ({
        type: exam.type,
        examId: exam.id,
        scoreEntryStartDate: exam.scoreEntryStartDate
          ? new Date(exam.scoreEntryStartDate)
          : (() => {
              const date = new Date();
              return setStartOfDay(date);
            })(),
        scoreEntryDeadline: exam.scoreEntryDeadline
          ? new Date(exam.scoreEntryDeadline)
          : (() => {
              const date = new Date();
              date.setDate(date.getDate() + 1);
              return setEndOfDay(date);
            })(),
        scoreCorrectionDeadline: exam.scoreCorrectionDeadline
          ? new Date(exam.scoreCorrectionDeadline)
          : (() => {
              const date = new Date();
              date.setDate(date.getDate() + 2);
              return setEndOfDay(date);
            })(),
      })),
    };
    form.reset(updatedValues);
    // }
  }, [exams, form]);

  const handleUpdate = async (updatedExams) => {
    // Simulate an API call to update the exams
    console.log("Updating exams:", updatedExams);
    const batchUpdateExamDeadlinesRequest = {
      classIds: classIds,
      updateExamDeadlines: updatedExams.map((e) => ({
        type: e.type,
        scoreEntryStartDate: e.scoreEntryStartDate,
        scoreEntryDeadline: e.scoreEntryDeadline,
        scoreCorrectionDeadline: e.scoreCorrectionDeadline,
      })),
    };
    console.log("Batch update request:", batchUpdateExamDeadlinesRequest);
    try {
      await BatchUpdateExamDeadlines(batchUpdateExamDeadlinesRequest);
      toast.success("Cập nhật hạn nhập điểm thành công!");
    } catch (error) {
      console.error("Error updating exam deadlines:", error);
      toast.error("Lỗi khi cập nhật hạn nhập điểm");
    }
  };

  // Submit handler
  async function onSubmit(values) {
    try {
      // Transform form data to update each exam with its own config
      const updatedExams = exams.map((exam) => {
        // Find corresponding config for this exam
        const config = values.examConfigs.find((cfg) => cfg.type === exam.type);

        return {
          ...exam,
          scoreEntryStartDate: config.scoreEntryStartDate,
          scoreEntryDeadline: config.scoreEntryDeadline,
          scoreCorrectionDeadline: config.scoreCorrectionDeadline,
        };
      });

      await handleUpdate(updatedExams);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating exam dates:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col max-h-[90vh]"
      >
        <h2 className="text-lg font-semibold mb-4">Cập Nhật Hạn Nhập Điểm</h2>
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {!form.watch("examConfigs") ||
          form.watch("examConfigs").length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] border border-dashed rounded-lg p-6">
              <div className="text-muted-foreground text-center">
                <p className="mb-2">
                  Không có thành phần đánh giá nào được tìm thấy
                </p>
                <p className="text-sm">
                  Vui lòng chọn lớp học phần để hiển thị các thành phần đánh giá
                </p>
              </div>
            </div>
          ) : (
            form.watch("examConfigs")?.map((config, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Loại bài kiểm tra: {config.type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`examConfigs.${index}.scoreEntryStartDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày Mở Nhập Điểm</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                      name={`examConfigs.${index}.scoreEntryDeadline`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hạn Nhập Điểm</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) =>
                                  field.onChange(setEndOfDay(date))
                                }
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
                      name={`examConfigs.${index}.scoreCorrectionDeadline`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hạn Đính Chính</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) =>
                                  field.onChange(setEndOfDay(date))
                                }
                                initialFocus
                                locale={vi}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Show any validation errors for this config group
                {(form.formState.errors.examConfigs?.[index]
                  ?.scoreEntryStartDate ||
                  form.formState.errors.examConfigs?.[index]
                    ?.scoreEntryDeadline ||
                  form.formState.errors.examConfigs?.[index]
                    ?.scoreCorrectionDeadline) && (
                  <div className="mt-2 text-destructive text-sm">
                    {form.formState.errors.examConfigs?.[index]
                      ?.scoreEntryStartDate?.message ||
                      form.formState.errors.examConfigs?.[index]
                        ?.scoreEntryDeadline?.message ||
                      form.formState.errors.examConfigs?.[index]
                        ?.scoreCorrectionDeadline?.message}
                  </div>
                )} */}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">Cập Nhật</Button>
        </div>
      </form>
    </Form>
  );
}
