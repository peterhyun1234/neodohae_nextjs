// /pages/auth/error.tsx
import { useRouter } from "next/router";

export default function Error() {
  const {
    query: { error },
  } = useRouter();

  return <div>An error occurred: {error}</div>;
}
