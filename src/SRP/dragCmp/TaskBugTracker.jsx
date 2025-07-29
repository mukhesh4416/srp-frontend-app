import React, { useState } from 'react';
import {
  Mosaic,
  MosaicWindow,
  MosaicZeroState,
  MosaicNode,
  MosaicBranch
} from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import Home from '../Home'; // Assume this exists
import BoxOne from './BoxOne';
import BoxTwo from './BoxTwo';

const ELEMENT_MAP = {
  box1: 'Tracker List',
  box2: 'Tracker View',
};

const MIN_SPLIT_PERCENTAGE = 30;

export default function TaskBugTracker() {
  const [layout, setLayout] = useState({
    direction: 'row',
    first: 'box1',
    second: 'box2',
    splitPercentage: 70,
  });

  const [rowData,setRowData] = useState()

  const enforceMinSplit = (newLayout) => {
    if (newLayout && typeof newLayout === 'object' && 'splitPercentage' in newLayout) {
      const clamped = {
        ...newLayout,
        splitPercentage: Math.max(MIN_SPLIT_PERCENTAGE, Math.min(100 - MIN_SPLIT_PERCENTAGE, newLayout.splitPercentage ?? 50)),
      };
      setLayout(clamped);
    } else {
      setLayout(newLayout);
    }
  };

  return (
    <div style={{ height: '90vh' }} className="p-2">
      <Mosaic
        renderTile={(id, path) => (
          <MosaicWindow path={path} toolbarControls={[]}>
            {ELEMENT_MAP[id] === 'Tracker List' && <BoxOne setRowData={setRowData}/>}
            {ELEMENT_MAP[id] !== 'Tracker List' && <BoxTwo rowData={rowData}/>}
          </MosaicWindow>
        )}
        value={layout}
        onChange={enforceMinSplit}
        zeroStateView={<MosaicZeroState />}
      />
    </div>
  );
}
