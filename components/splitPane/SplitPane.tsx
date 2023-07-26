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
     * Minimum size of left pane.
     */
    minSizeLeft?: number;
    /**
     * Minimum size of center pane.
     */
    minSizeCenter?: number;
    /**
     * Minimum size of right pane.
     */
    minSizeRight?: number;
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
    /**
     * Left pane preferred size
     */
    leftPanePreferredSize?: number;
    /**
     * Center pane preferred size
     */
    centerPanePreferredSize?: number;
    /**
     * Right pane preferred size
     */
    rightPanePreferredSize?: number;
}

export default function SplitPane(Props: Props) {
    const {
        visible,
        left,
        center,
        right,
        leftPanePreferredSize,
        centerPanePreferredSize,
        rightPanePreferredSize,
        minSizeLeft,
        minSizeCenter,
        minSizeRight,
        ...rest
    } = Props;
    return (
        <div className='h-full'>
            <Allotment
                className={styles.root + ' ' + styles.splitViewContainer}
                {...rest}
            >
                <Allotment.Pane
                    preferredSize={leftPanePreferredSize}
                    minSize={minSizeLeft}
                >
                    {left}
                </Allotment.Pane>
                <Allotment.Pane
                    preferredSize={centerPanePreferredSize}
                    className={styles.centerPane}
                    minSize={minSizeCenter}
                >
                    {center}
                </Allotment.Pane>
                <Allotment.Pane
                    preferredSize={rightPanePreferredSize}
                    minSize={minSizeRight}
                    visible={visible}
                    className={styles.rightPane}
                >
                    {right}
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
