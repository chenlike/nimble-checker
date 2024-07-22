// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
type NimbleResData = {
    msg: string;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<NimbleResData>,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ msg: "Method not allowed" })
    }

    axios.post("https://mainnet.nimble.technology:443/check_balance", { 
        "address":  req.body.address
    }).then((response) => {
        res.status(200).json(response.data);
    })
}
