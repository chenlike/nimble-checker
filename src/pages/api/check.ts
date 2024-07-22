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

    axios.post("https://mainnet.nimble.technology:443/check_balance", { 
        "address":  req.body.address
    }).then((response) => {
        res.status(200).json(response.data);
    }).catch((error) => {
    
        res.status(200).json({
            msg:JSON.stringify(error.response.data)
        });

    });
}
