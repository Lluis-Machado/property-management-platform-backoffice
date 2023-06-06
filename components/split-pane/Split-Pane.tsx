"use client"

import { Allotment } from "allotment";
import "allotment/dist/style.css";

interface Props {
  /**
  * An array of initial sizes of the panes.
  */
  defaultSizes?: number[];
  /**
  * Maximum size of any pane.
  */
  maxSize?: number;
  /**
  * Minimum size of any pane.
  */
  minSize?: number;
  /**
  * Resize each view proportionally when resizing container. Default set to true.
  */
  proportionalLayout?: boolean;
  /**
  * Whether to render a separator between panes. Default set to true.
  */
  separator?: boolean;
  /**
  * Enable snap to zero for all panes. Default set to false.
  */
  snap?: boolean;
  /**
  * Direction to split. If true then the panes will be stacked vertically, otherwise they will be stacked horizontally.
  */
  vertical?: boolean;
  /**
  * Callback that is fired whenever the user double clicks a sash
  */
  onReset?:() => void;
  /**
  * Callback that is fired whenever the user changes the visibility of a pane by snapping. Note that this will only be called if the new value is different from the current visible prop on the Pane.
  */
  onVisibleChange?:() => void;
}

export default function Splitpane({
  defaultSizes = [200, 600, 300],
  minSize = 100,
  maxSize = 1200,
  proportionalLayout = true,
  separator = true,
  snap = false,
  vertical = false,
  onReset = undefined,
  onVisibleChange = undefined, }: Props) {
  return (
    <div className="w-full h-full">
      <h1>TESTING SPLIT PANE</h1>
      <Allotment
        defaultSizes={defaultSizes}
        minSize={minSize}
        maxSize={maxSize}
        proportionalLayout={proportionalLayout}
        separator={separator}
        snap={snap}
        vertical={vertical}
        onReset={onReset}
        onVisibleChange={onVisibleChange}
      >
        <Allotment.Pane minSize={200} >Casas</Allotment.Pane>
        <Allotment.Pane minSize={400}>Data Grid</Allotment.Pane>
        <Allotment.Pane minSize={300}>Data Preview </Allotment.Pane>
      </Allotment>
    </div>
  )
};