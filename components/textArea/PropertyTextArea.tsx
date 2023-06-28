import { Button } from "pg-components"

const PropertyTextArea = () => {
    return (
        <>
            <textarea className="w-full h-3/4 border border-slate-200">Save your notes</textarea>
            <div className='flex justify-end py-4'>
                <div className='flex flex-row justify-between gap-2'>
                    <Button
                        elevated
                        style='outline'
                        type='submit'
                        text='Save'
                    />
                </div>
            </div>
        </>
    )
}

export default PropertyTextArea