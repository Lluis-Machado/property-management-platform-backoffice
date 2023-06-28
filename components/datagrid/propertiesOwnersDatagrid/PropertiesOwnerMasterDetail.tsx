//local imports

interface Props {
    data: any;
};


const PropertiesOwnerMasterDetail = ({ data }: Props): React.ReactElement => {
  

    return (
        <>
            <div>CIF / NIF : {data.data.nif}</div>
            <div>Email: {data.data.email}</div>
        </>
           

    )
}

export default PropertiesOwnerMasterDetail