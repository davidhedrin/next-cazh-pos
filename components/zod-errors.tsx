export function ZodErrors({ err }: { err?: string[] }) {
  if (!err || err.length === 0) return null;
  return (
    <>
      {err.map((e, idx) => (
        <div key={idx} className="text-red-500 text-sm italic">
          {e}
        </div>
      ))}
    </>
  );
}