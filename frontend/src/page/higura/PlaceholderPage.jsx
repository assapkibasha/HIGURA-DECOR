export default function PlaceholderPage({ title }) {
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold text-gray-900">{title}</div>
      <div className="rounded-xl bg-white border border-gray-200 p-6">
        <div className="text-sm text-gray-500">Coming soon</div>
      </div>
    </div>
  );
}
