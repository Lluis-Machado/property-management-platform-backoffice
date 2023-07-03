// Local imports
import Layout, { LayoutColsAmount } from "./Layout";

interface Props {
    caption?: string;
    children: React.ReactNode;
    cols?: LayoutColsAmount;
}

export const GroupItem = ({ caption, children, cols = 2 }: Props): React.ReactElement => (
    <>
        {
            caption && <div className='mb-5'>
                <h3 className='text-secondary-500 font-bold text-xl'>{caption}</h3>
                <hr className='border-secondary-500/50' />
            </div>
        }
        <Layout cols={cols}>
            {children}
        </Layout>
    </>
)

export default GroupItem;