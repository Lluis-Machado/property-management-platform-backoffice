// Local imports
import Layout, { LayoutColsAmount } from "./Layout";

interface Props {
    caption?: string;
    children: JSX.Element | JSX.Element[];
    cols?: LayoutColsAmount;
}

export const GroupItem = ({ caption, children, cols = 2 }: Props): JSX.Element => (
    <>
        {
            caption && <div className='mb-3'>
                <h3 className='text-primary-500 font-bold text-xl'>{caption}</h3>
                <hr className='border-primary-500/50' />
            </div>
        }
        <Layout cols={cols}>
            {children}
        </Layout>
    </>
)

export default GroupItem;