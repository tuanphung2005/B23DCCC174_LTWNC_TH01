# Student Deadline Tracker

Ứng dụng quản lý deadline bài tập cá nhân cho sinh viên: theo dõi bài tập sắp đến hạn, đánh dấu hoàn thành, lọc theo trạng thái.

## Chạy

```bash
bun install
bun dev      # dev (hot reload)
bun start    # production
```

Mở URL server in ra console, danh sách mẫu được tải từ `GET /api/assignments`.

## Công nghệ

- React 19 + Tailwind CSS 4
- Redux Toolkit + TypeScript (feature-based, typed hooks, `createAsyncThunk`)
- TypeScript nâng cao: generic, utility types (`Pick`/`Partial`/`Readonly`), type guard
- Design pattern: custom hook nâng cao (`useDeadlines`) + Compound Component (`AssignmentCard`) + HOC (`withLoading`)
