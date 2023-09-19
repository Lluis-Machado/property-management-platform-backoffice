import { memo, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { DateTime } from 'luxon';
import ScrollView from 'devextreme-react/scroll-view';
import { TokenRes } from '@/lib/types/token';
import { selectedUserId } from '@/lib/atoms/selectedUserId';
import { ApiCallError } from '@/lib/utils/errors';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import './loader.css';

interface Props {
    token: TokenRes;
}

const AuditLog = ({ token }: Props) => {
    const [userId, _] = useAtom(selectedUserId);
    const [auditLog, setAuditLog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        console.log(userId);
        setIsLoading(true);
        fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/audits/audits/${userId}/contact`,
            {
                method: 'GET',
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`,
                },
                cache: 'no-store',
            }
        )
            .then((resp) => {
                if (!resp.ok)
                    throw new ApiCallError(
                        'Something went wrong in getting Audit Log'
                    );
                return resp.json();
            })
            .then((resp) => {
                setAuditLog(resp);
                console.log('Y SALIO BIEN RICO', resp);
            })
            .catch((e) => console.error(e))
            .finally(() => setIsLoading(false));
    }, [userId, token]);

    return (
        <div className='flex h-full w-[50vw] flex-col bg-white'>
            <hr />
            <h1 className='m-4 text-2xl text-secondary-500'>Audit Log</h1>
            <hr />
            {isLoading ? (
                <div className='flex h-full items-center justify-center'>
                    <span className='loader'></span>
                </div>
            ) : (
                <ScrollView showScrollbar='onScroll' height='88vh'>
                    <ul
                        role='feed'
                        className='relative flex flex-col gap-12 py-12 pl-6 before:absolute before:left-6 before:top-0 before:h-full before:-translate-x-1/2 before:border before:border-dashed before:border-slate-200 after:absolute after:bottom-6 after:left-6 after:top-6 after:-translate-x-1/2 after:border after:border-slate-200 lg:pl-0 lg:before:left-[8.5rem] lg:after:left-[8.5rem]'
                    >
                        {auditLog.reverse().map((item: any, index) => {
                            const itemCopy = structuredClone(item);
                            delete itemCopy.LastUpdateAt;
                            delete itemCopy.LastUpdateByUser;
                            delete itemCopy.Version;
                            const cleanArray = Object.keys(itemCopy).map(
                                (fieldName) => ({
                                    fieldName,
                                    ...itemCopy[fieldName],
                                })
                            );
                            console.log('cleanArray: ', cleanArray);
                            const dateTime = DateTime.fromISO(
                                item.LastUpdateAt.item2
                            );
                            return (
                                <li
                                    key={item.LastUpdateAt.item2}
                                    role='article'
                                    className='relative pl-6 before:absolute before:left-0 before:top-2 before:z-10 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-primary-500 before:ring-2 before:ring-white lg:flex lg:gap-12 lg:pl-0 lg:before:left-[8.5rem]'
                                >
                                    <div>
                                        <h4 className='text-lg font-medium leading-7 text-slate-500 lg:block lg:w-28 lg:text-right'>
                                            {dateTime.toLocaleString()}
                                        </h4>
                                        <h4 className='text-sm font-medium leading-7 text-slate-500 lg:block lg:w-28 lg:text-right'>
                                            {dateTime.toFormat('HH:mm:ss')}
                                        </h4>
                                        <h4 className='text-xs font-medium leading-7 text-slate-500 lg:block lg:w-28 lg:text-right'>
                                            {item.LastUpdateByUser.item2}
                                        </h4>
                                    </div>
                                    <div className='flex flex-1 flex-col gap-4'>
                                        <h3 className='text-lg font-medium leading-7 text-primary-500'>
                                            v{auditLog.length - index}
                                        </h3>
                                        <DataGrid
                                            className='mr-4'
                                            dataSource={cleanArray}
                                        >
                                            <Column
                                                dataField='fieldName'
                                                caption='Field name'
                                                alignment='left'
                                            />
                                            <Column
                                                dataField='item1'
                                                caption='Before edit'
                                                alignment='left'
                                            />
                                            <Column
                                                dataField='item2'
                                                caption='After edit'
                                                alignment='left'
                                            />
                                        </DataGrid>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </ScrollView>
            )}
        </div>
    );
};

export default memo(AuditLog);
