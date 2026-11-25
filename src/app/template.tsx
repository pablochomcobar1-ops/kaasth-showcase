import { Curtain } from '@/components/shell/Curtain';

/** Re-mounts on every navigation, so the curtain plays per page change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Curtain />
      {children}
    </>
  );
}
