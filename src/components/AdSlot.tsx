/** Reserved AdSense slot (empty until ads are wired). */
export function AdSlot({ className = '' }: { className?: string }) {
  return (
    <div
      className={`ad-slot${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      data-ad-slot="reserved"
    />
  );
}
