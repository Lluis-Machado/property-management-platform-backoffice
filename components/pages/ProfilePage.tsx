'use client'

import { useState } from 'react'

import { Button, Input, Checkbox } from 'pg-components';
import { Formik, Form } from 'formik';

import GroupItem from '@/components/layoutComponent/GroupItem';
import ChangePwPopup from '@/components/popups/ChangePwPopup';

const ProfilePage = () => {
  const [isPopupVisible, setisPopupVisible] = useState(false);

  return (
    <>
      <ChangePwPopup
        isVisible={isPopupVisible}
        onClose={() => setisPopupVisible(false)}
      />
      <div className="min-w-max relative h-auto">
        <Formik
          initialValues={{
            given_name: 'test',
            family_name: 'user',
            email: 'testuser@plattesgroup.net',
            nickname: 'jhonny sins',
            newUser: true,
            newProperty: true,
            pendingInvoices: true
          }}
          validationSchema={undefined}
          onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        >
          <Form className='flex flex-col gap-4 m-5'>
            <GroupItem caption='Account Info' cols={2} >

              <Input
                name='given_name'
                label="First Name"
              />

              <Input
                name='family_name'
                label="Last Name"
              />

              <Input
                name='email'
                label="Email"
                readOnly
              />

              <Input
                name='nickname'
                label="Nickname"
              />

            </GroupItem>

            <GroupItem caption='Password' cols={4} >

              <Button
                type='button'
                text={'Change password'}
                style='outline'
                onClick={() => setisPopupVisible(true)}
              />

            </GroupItem>

            <GroupItem caption='Notifications' cols={3} >

              <Checkbox
                name='newUser'
                text={'New user'}
              />

              <Checkbox
                name='newProperty'
                text={'New property'}
              />

              <Checkbox
                name='pendingInvoices'
                text={'Pending invoices'}
              />

            </GroupItem>

            <div className="flex justify-end mt-4">
              <div className='w-60'>
                <Button
                  type='submit'
                  text={'Update profile'}
                />
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  )
}

export default ProfilePage