import { useEffect, useState } from "react";
import { BB84Api } from "@/services/bb84Api";

export default function OverallCircuit({ eve }: { eve: boolean }) {
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCircuit() {
      const result = await BB84Api.getOverallCircuit(eve);
      setImg(result.img_base64);
    }
    fetchCircuit();
  }, [eve]);

  if (!img)
    return (
      <div className="text-muted-foreground">Loading overall circuit...</div>
    );

  return (
    <div className="my-6">
      <h2 className="text-lg font-bold">Overall BB84 Circuit</h2>
      <img
        src={`data:image/png;base64,${img}`}
        alt="Overall BB84 Circuit"
        className="border rounded w-full max-w-5xl mx-auto"
      />
    </div>
  );
}
