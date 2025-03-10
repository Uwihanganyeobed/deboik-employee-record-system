export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 p-4 rounded-md">
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
} 