import Breadcrumb from '@/components/breadcrumb/Breadcrumb'

export default function Layout (props: {
    children: React.ReactNode
    contactForm: React.ReactNode
    contactTabs: React.ReactNode
}) {
    return (
        <>
            <Breadcrumb />
            {props.contactForm}
            {props.contactTabs}
            {props.children}
        </>
    )
}