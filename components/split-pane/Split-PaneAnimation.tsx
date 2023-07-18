'use client';

import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import styles from './style/splitPane.module.css';

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
    onReset?: () => void;
    /**
     * Callback that is fired whenever the user changes the visibility of a pane by snapping. Note that this will only be called if the new value is different from the current visible prop on the Pane.
     */
    onVisibleChange?: () => void;
    /**
     * 	Whether this pane should be visible.
     */
    visible?: boolean;
    /**
     * Component left panel
     */
    left?: React.ReactElement;
    /**
     * Component center panel
     */
    center?: React.ReactElement;
    /**
     * Component right panel
     */
    right?: React.ReactElement;
}

export default function SplitPaneAnimation(Props: Props) {
    const { proportionalLayout = false, visible, left, center, right } = Props;
    return (
        <div className='h-full w-full'>
            <Allotment
                className={styles.root + ' ' + styles.splitViewContainer}
                proportionalLayout={proportionalLayout}
                {...Props}
            >
                <Allotment.Pane minSize={100}>{left}</Allotment.Pane>
                <Allotment.Pane className={styles.centerPane}>
                    {center}
                </Allotment.Pane>
                <Allotment.Pane
                    minSize={300}
                    visible={visible}
                    className={styles.rightPane}
                >
                    {right}
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
