// app/posts/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p>The post you&apos;re looking for doesn&apos;t exist or was deleted.</p>
    </div>
  );
}
