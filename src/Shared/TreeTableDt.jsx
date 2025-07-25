import React, { useEffect, useState } from 'react'
import { Column } from 'primereact/column';
import { TreeTable } from 'primereact/treetable';

function TreeTableDt() {
 const [nodes, setNodes] = useState([]);
    const columns = [
        { field: 'name', header: 'Unique No.', expander: true },
        { field: 'size', header: 'Type' },
        { field: 'type', header: 'Size' },
        { field: 'status', header: 'Status' }
    ];

    useEffect(() => {

    }, []);

    return (
        <div className="card">
            <TreeTable value={nodes} tableStyle={{ minWidth: '50rem' }}>
                {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} expander={col.expander} />
                ))}
            </TreeTable>
        </div>
    );
}

export default TreeTableDt