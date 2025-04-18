import { notFound } from "next/navigation";

export default function Page() {
  const data = null;

  if (!data) {
    notFound(); // renders not-found.tsx
  }

  return <></>;
}
