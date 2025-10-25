import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return <div className="flex justify-center">
    <div className="text-center mt-16 flex justify-center items-center flex-col gap-4">
      <Spinner size="lg" />
      <div>Loading...</div>
    </div>
  </div>
}