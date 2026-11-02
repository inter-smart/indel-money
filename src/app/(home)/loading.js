import LoadingCircleSpinner from "@/components/common/LoadingCircleSpinner";

// The home page streams in after the layout shell. Without a tall fallback the
// footer paints right under the header and then jumps thousands of px down when
// the content arrives (large CLS). The spacer keeps the footer below the fold.
export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 z-9999">
        <LoadingCircleSpinner />
      </div>
      <div className="min-h-screen" aria-hidden="true" />
    </>
  );
}
