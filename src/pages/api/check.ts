// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import dotenv from "dotenv"
dotenv.config()


// NIMBLE_CAPTCHA_KEY

async function checkBalance(address: string) {
    try {
        let res = await axios.post("https://mainnet.nimble.technology:443/check_balance", {
            "address": address
        })
        if (res.status == 200) {
            return {
                address: address,
                msg: res.data.msg
            }
        } else {
            return {
                address: address,
                msg: res.data
            }
        }
    } catch (e:any) {
        return {
            address: address,
            msg: JSON.stringify(e.response.data)
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    let captchaKey = process.env.NIMBLE_CAPTCHA_KEY
    if (!captchaKey) {
        res.status(200).json({
            msg: "Please solve the CAPTCHA first"
        });
        return
    }

    if (!req.body.address) {
        res.status(200).json({
            msg: "Please input nimble address first"
        });
        return
    }
    
    if (!req.body.captcha) {
        res.status(400).json({
            msg: "Please solve the CAPTCHA first"
        });
        return
    }

    const cfResponse = await axios.post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        new URLSearchParams({
            secret: captchaKey,
            response: req.body.captcha,
        }).toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    console.log({
        address:req.body.address,
        cf:cfResponse.data,
    })

    if (cfResponse.data.success === false) {
        res.status(200).json({
            msg: "Please retry the CAPTCHA "
        });
        return
    }




    let addresses = req.body.address.split("\n")
    // 过滤空的地址和重复的地址
    const reg = /^\s*$/;
    addresses = addresses.filter((addr: string) => !reg.test(addr));
    addresses = Array.from(new Set(addresses))
    if (addresses.length === 0) {
        res.status(200).json({
            msg: "Please input nimble address first"
        });
        return;
    }


    // 并发请求接口
    let promises:Promise<{ address:string,msg:string }>[] = []
    for (let i = 0; i < addresses.length; i++) {
        promises.push(checkBalance(addresses[i]))
    }

    await Promise.allSettled(promises)

    let results = []

    // 获得所有promise 的结果
    for (let i = 0; i < promises.length; i++) {
        results.push(await promises[i])
    }




    res.status(200).json(results);


}
