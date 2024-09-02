import { useEffect, useState } from "react"
import { Button, Input, Table, message } from "antd"
import style from "../styles/Checker.module.css";
import type { TableProps } from 'antd';

import axios from "axios"
const { Column } = Table
const { TextArea } = Input
interface DataType {
    address: string;
    msg: string;
}



export default function Checker() {
    const [address, setAddress] = useState<string>("")
    const [checkList, setCheckList] = useState<DataType[]>([])
    const [loading, setLoading] = useState(false)






    const [captcha, setCaptcha] = useState("")




    function refreshTurnstile() {
        setCaptcha("")
        // 获取 Turnstile 的容器元素
        var turnstileElement = document.querySelector('.cf-turnstile');

        // 清除当前的验证码
        if (turnstileElement) {
            turnstileElement.innerHTML = '';
        }

        // 重新加载 Turnstile 验证码
        var script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.onload = function () {
            turnstile.render(turnstileElement);
        };
        document.head.appendChild(script);
    }






    const openSourceUrl = 'https://github.com/chenlike/nimble-checker'

    async function checkBalance() {

        if (!captcha) {
            message.warning("Please solve the captcha first")
            return
        }

        setLoading(true);
        localStorage.setItem("address", address);

        let addresses = address.split("\n");
        // 过滤空的地址
        const reg = /^\s*$/;
        addresses = addresses.filter((addr) => !reg.test(addr));
        if (addresses.length === 0) {
            message.warning("Please input nimble address first");
            setLoading(false);
            return;
        }

        let reqAddres = addresses.join('\n').trim()

        let results = []
        let theCAPTCHA = captcha
        refreshTurnstile()

        try {
            const res = await axios.post("/api/check?v=1", {
                address: reqAddres,
                captcha: theCAPTCHA
            });
            const data = res.data;

            if (data.msg) {
                message.error("Error:  " + data.msg);
                setLoading(false);
                return;
            }

            results = data;

        } catch (error: any) {
            message.error("Error:  " + error.response.data.msg);

        }

        setCheckList((pre) => [...results]);
        setLoading(false);

    }












    useEffect(() => {
        const addr = localStorage.getItem("address")
        if (addr) {
            setAddress(addr)
        }



        window.cfCallBack = function (value: string) {
            setCaptcha(value)
        }


    }, [])




    return <>
        <div className={style.contianer}>
            <div className={style.title}>Nimble Balance Checker</div>
            <TextArea rows={6} placeholder="your nimble address here" value={address}
                onChange={(e) => setAddress(e.target.value)} />


            <Button onClick={() => checkBalance()} className={style.checker} loading={loading} size="large" type="primary">Check Balance</Button>
            <div style={{
                marginBottom: 20
            }} className="cf-turnstile" data-sitekey="0x4AAAAAAAf26m3RrXqFTX20" data-callback="cfCallBack"></div>

            <Table bordered dataSource={checkList} pagination={false} loading={loading} columns={[
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                    render: (text) => <div>{text}</div>,
                },
                {
                    title: 'Message',
                    dataIndex: 'msg',
                    key: 'msg',
                    render: (text) => <div>{text}</div>,
                },
            ]}  >

            </Table>


            <div style={{
                color: "#FFF",
                marginTop: 10
            }}>Use <Button type="link" href="https://www.nimble.technology/dashboard" target="_blank">Nimble Official Dashboard</Button>  is better! </div>

            <div className={style.footer}>Open Source In <Button type="link" onClick={() => {
                window.open(openSourceUrl)
            }}>Github</Button></div>



        </div>
    </>
}