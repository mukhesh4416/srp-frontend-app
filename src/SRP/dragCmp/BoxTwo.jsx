import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import Chats from '../../Shared/Chats'
import DragAttachment from './DragAttachment';
import DragChat from './DragChat';

function BoxTwo({rowData}) {

  const key = rowData?.type + (rowData?.data?.bugId || rowData?.data?.taskId || '');

  return (
    <div className="">
            <TabView>
                <TabPanel header="View" key={key + '-view'} className='p-0'>
                    
                </TabPanel>
                <TabPanel header="Attachments" key={key + '-attachments'}>
                    <DragAttachment refId={rowData?.type ===  "Bug"?rowData?.data?.bugId:rowData?.data?.taskId}/>
                </TabPanel>
                <TabPanel header="Chat" key={key + '-chat'}>
                    {rowData?.type ===  "Bug" && <DragChat refId={rowData?.data?.bugId}/>}
                    {rowData?.type !==  "Bug" && <DragChat refId={rowData?.data?.taskId}/>}
                </TabPanel>
            </TabView>
      </div>
  )
}

export default BoxTwo