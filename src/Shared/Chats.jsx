import React, { useEffect, useRef, useState } from 'react'
import { SRP_URL, WEBSOKET_URL } from '../global';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faReply } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from 'primereact/dialog';

function Chats({refId,chatVisible,setChatVisible}){

    const userData = JSON.parse(sessionStorage.getItem("USER_DATA"))
    const [chatList,setChatList] = useState([]);
    const [chatMsg,setChatMsg] = useState("");
    const bottomRef = useRef(null);
    const ws = useRef(null);

    const sendMessage  = ()=>{
       let data = {
        uId:userData.uId,
        refId:refId,
        message:chatMsg,
        createdId:userData.uId,
      }
        axios.post(SRP_URL+`srp/saveChatMessage`,data).then(()=>{
            setChatMsg("")
            if (ws.current && ws.current.readyState === WebSocket.OPEN && chatMsg.trim() !== '') {
                ws.current.send("msg Send");
            }
        }).catch((error)=>{});
    }

    const getAllChatData = async()=>{
        const res = await axios.get(SRP_URL + `srp/getChatList?refId=${refId}`)
        if(res.data)
        setChatList(res.data)
    }

    const chatFooter = ()=>{
        return <div className="p-2 chatFooter">
            <InputTextarea className='form-feild w-100'  rows={1} placeholder="Enter Message..!" value={chatMsg} onChange={(e)=>{setChatMsg(e.target.value)}}/>
            <div className='chatSend' onClick={sendMessage}>
                <FontAwesomeIcon title="Submit" className='mx-1' icon={faPaperPlane} />
            </div>
        </div>
    }
    

    useEffect(()=>{

        ws.current = new WebSocket(WEBSOKET_URL + "ws/chat");

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({
                type: 'subscribe',
                refId: refId,
                userId: userData.uId
            }));
        };

        ws.current.onmessage = (event) => {
            getAllChatData()
        };

        ws.current.onclose = () => {
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    },[chatVisible])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatList]);


  return (
    <div>
        <Dialog header={"Chats"} visible={chatVisible} onHide={()=>{ setChatVisible(false)}} draggable={false} 
          style={{ width: '35vw', height:'80vh'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={chatFooter}>
              <div className='' style={{overflow:'inherit'}}>
            <div  className="chatBoxBody mb-2">
                {
                    chatList.map((e)=>{
                        if(userData.uId === e.uId){
                            return <div className='text-end d-flex mt-2'>
                                <div className='w-50'></div>
                                <div className='w-50 chatMsgBox'>
                                    <div>{e.message}</div>
                                    <div className='f-s-10 text-end'>{e.createdDate}</div>
                                </div>
                            </div>
                        }else{
                            return <div className='text-start d-flex'>
                                <div className='w-50 chatMsgBox mt-2'>
                                    <div className='msgedBy'>{e.createdBy}</div>
                                    <div className='mt-1'>{e.message}</div>
                                    <div className='f-s-10 text-end'>{e.createdDate}</div>
                                </div>
                                <div className='w-50'></div>
                            </div>
                        }
                    })
                }
                <div ref={bottomRef} />
            </div>
    </div>
    </Dialog>
    </div>

  )
}

export default Chats