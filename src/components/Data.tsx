import { Button } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface argu {
  thumbnail: string;
  title: string;
  type: "video" | "playlist";
  timestamp: string;
  access_model: string | null;
  description: string;
  index: number;
  id: string;
}
function Data(argu: argu) {
  const [thumb, setThumb] = useState("");
  const formattedDate = new Date(
    parseInt(argu.timestamp) * 1000
  ).toLocaleString(); // Convert timestamp to Date
  useEffect(() => {
    axios
      .get(`https://gateway.irys.xyz/${argu.thumbnail}`, { maxRedirects: 4 })
      .then((data) => {
        setThumb(data.data);
      });
  }, [argu.thumbnail]);
  return (
    <>
      <tr key={argu.id}>
        <td className="border px-4 py-2">
          {argu.thumbnail && (
            <img src={thumb} alt={argu.title} className="w-16 h-16" />
          )}
        </td>
        <td className="border px-4 py-2">{argu.title}</td>
        <td className="border px-4 py-2">{argu.type}</td>
        <td className="border px-4 py-2">{argu.access_model}</td>
        <td className="border px-4 py-2">{argu.description}</td>
        <td className="border px-4 py-2">{formattedDate}</td>
        <td className="border px-4 py-2">
          <Button color="primary">View</Button>
        </td>
      </tr>
    </>
  );
}

export default Data;
