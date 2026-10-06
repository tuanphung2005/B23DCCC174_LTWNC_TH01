import type { ComponentType } from "react";

export interface WithLoadingProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  total?: number;
}

export function withLoading<P extends object>(Wrapped: ComponentType<P>) {
  return function WithLoading({ loading, error, onRetry, total, ...rest }: WithLoadingProps & P) {
    if (loading) {
      return (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-white p-4">
              <div className="h-4 w-2/5 bg-slate-200" />
              <div className="mt-2 h-3 w-3/5 bg-slate-100" />
            </div>
          ))}
          <p className="text-center text-sm text-slate-500">Đang tải danh sách mẫu…</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">Lỗi: {error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          )}
        </div>
      );
    }
    if (total === 0) {
      return (
        <div className="bg-white p-8 text-center text-slate-500">
          Chưa có bài tập nào. Hãy thêm bài tập đầu tiên ở form bên trên.
        </div>
      );
    }
    return <Wrapped {...(rest as P)} />;
  };
}
