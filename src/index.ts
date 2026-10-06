import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/*": index,

    "/api/assignments": {
      async GET() {
        const iso = (offsetDays: number) => {
          const d = new Date();
          d.setDate(d.getDate() + offsetDays);
          return d.toISOString().slice(0, 10);
        };
        return Response.json({
          data: [
            { id: "seed-1", subject: "Toán cao cấp", title: "Bài tập chương 3: giới hạn và đạo hàm", dueDate: iso(2), priority: "high", completed: false },
            { id: "seed-2", subject: "Vật lý đại cương", title: "Báo cáo thí nghiệm đo điện trở", dueDate: iso(-1), priority: "medium", completed: false },
            { id: "seed-3", subject: "Cơ sở dữ liệu", title: "Thiết kế ERD quản lý thư viện", dueDate: iso(5), priority: "medium", completed: false },
            { id: "seed-4", subject: "Tiếng Anh", title: "Viết essay 500 từ", dueDate: iso(-3), priority: "low", completed: true },
            { id: "seed-5", subject: "Nhập môn lập trình", title: "Bài lab mảng và chuỗi", dueDate: iso(0), priority: "high", completed: false },
          ],
        });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
