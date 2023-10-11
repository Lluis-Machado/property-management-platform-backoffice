'use client';
import { useState } from 'react';
import Form, {
    GroupItem,
    Item,
    RequiredRule,
    StringLengthRule,
} from 'devextreme-react/form';
import { Button } from 'pg-components';
import 'devextreme-react/switch';

import ChangePwPopup from '@/components/popups/ChangePwPopup';

const ProfilePage = () => {
    const [isPopupVisible, setisPopupVisible] = useState(false);

    return (
        <>
            <ChangePwPopup
                isVisible={isPopupVisible}
                onClose={() => setisPopupVisible(false)}
            />
            <Form
                formData={{
                    given_name: 'test',
                    family_name: 'user',
                    email: 'testuser@plattesgroup.net',
                    nickname: 'jhonny sins',
                    newUser: true,
                    newProperty: true,
                    pendingInvoices: true,
                }}
                labelMode={'floating'}
            >
                {/* Main Information */}
                <GroupItem colCount={5} caption='Account Info'>
                    <Item
                        dataField='given_name'
                        label={{ text: 'First name' }}
                    />
                    <Item dataField='family_name' label={{ text: 'Last name' }}>
                        <RequiredRule />
                        <StringLengthRule
                            min={3}
                            message='Last name have at least 2 letters'
                        />
                    </Item>
                    <Item dataField='nickname' label={{ text: 'Nickname' }}>
                        <RequiredRule />
                    </Item>
                    <Item
                        dataField='email'
                        label={{ text: 'Email' }}
                        editorOptions={{ readOnly: true }}
                    />
                </GroupItem>
                <GroupItem colCount={2}>
                    <GroupItem colCount={1} caption='Password'>
                        <Button
                            type='button'
                            text={'Change password'}
                            style='outline'
                            onClick={() => setisPopupVisible(true)}
                        />
                    </GroupItem>
                    <GroupItem colCount={3} caption='Notifications'>
                        <Item
                            dataField='newUser'
                            label={{ text: 'New user' }}
                            editorType='dxSwitch'
                            editorOptions={{
                                width: 100,
                                switchedOnText: 'ON',
                                switchedOffText: 'OFF',
                            }}
                        />
                        <Item
                            dataField='newProperty'
                            label={{ text: 'New property' }}
                            editorType='dxSwitch'
                            editorOptions={{
                                width: 100,
                                switchedOnText: 'ON',
                                switchedOffText: 'OFF',
                            }}
                        />
                        <Item
                            dataField='pendingInvoices'
                            label={{ text: 'Pending invoices' }}
                            editorType='dxSwitch'
                            editorOptions={{
                                width: 100,
                                switchedOnText: 'ON',
                                switchedOffText: 'OFF',
                            }}
                        />
                    </GroupItem>
                </GroupItem>
            </Form>
            <div className='mt-4 flex justify-end'>
                <div className='w-60'>
                    <Button type='submit' text={'Update profile'} />
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
