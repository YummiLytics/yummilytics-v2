import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default function handler(req: NextRequest, res: NextApiResponse) {
  console.log(req);  
  res.status(200).json({req: req.headers});
}
