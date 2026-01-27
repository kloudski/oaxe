'use client';

interface JsonViewProps {
  data: unknown;
  title?: string;
}

export function JsonView({ data, title }: JsonViewProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-sm font-medium text-zinc-400 mb-2">{title}</h3>
      )}
      <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-[500px] overflow-y-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
