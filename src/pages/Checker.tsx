import { useEffect, useState } from "react"
import { Button, Input, Table,message } from "antd"
import style from "../styles/Checker.module.css";
import type { TableProps } from 'antd';

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

    const openSourceUrl = 'https://github.com/chenlike/nimble-checker'

    async function checkBalance() {


        setLoading(true)
        const addresses = address.split("\n")
        if (addresses.length == 0) {
            message.warning("Please input nimble address first")
            setLoading(false)
            return
        }
        const promises = addresses.map(async (addr) => {
            const res = await fetch("/api/check", {
                method: "POST",
                body: JSON.stringify({ address: addr.trim() }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            return { address: addr.trim(), msg: data.msg }
        })
        const results = await Promise.all(promises)
        setCheckList((pre) => [ ...results])
        setLoading(false)
        
        localStorage.setItem("address", address)

    }

    useEffect(() => {

        const addr = localStorage.getItem("address")
        if (addr) {
            setAddress(addr)
        }
    })

    


    return <>
        <div className={style.contianer}>
            <div className={style.title}>Nimble Balance Checker</div>
            <TextArea rows={6} placeholder="your nimble address here" value={address}
                onChange={(e)=>setAddress(e.target.value)} />

            <Button onClick={()=>checkBalance()} className={style.checker} loading={loading} size="large" type="primary">Check Balance</Button>

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
            <div className={style.footer}>Open Source In <Button type="link" onClick={()=>{
                window.open(openSourceUrl)
            }}>Github</Button></div>


        </div>
    </>
}