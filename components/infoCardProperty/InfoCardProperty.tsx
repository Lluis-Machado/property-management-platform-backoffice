// react imports

// local imports

const InfoCardProperty = () => {
    return (
        <div className="flex justify-center align-middle">
            <div className="block rounded-lg p-6 shadow-lg shadow-secondary-200 w-1/2">
                <h5
                    className="mb-2 text-xl font-medium leading-tight text-secondary-500">
                    Villa Paguera
                </h5>
                <p className="mb-4 text-base text-secondary-500">
                    Some quick example text to build on the
                </p>
                <div className="flex items-start gap-40">
                    <table className="text-m my-3">
                        <tbody><tr>
                            <td className="p-2 text-secondary-500 font-semibold">Type</td>
                            <td className="p-2">Apartment</td>
                        </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">Cadastral Reference</td>
                                <td className="p-2">5456sad324das56f45as</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">Main Contact</td>
                                <td className="p-2">Sr. Schaller</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="text-m my-3">
                        <tbody>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">AdsressLine 1</td>
                                <td className="p-2">....</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">AdsressLine 2</td>
                                <td className="p-2">....</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">City</td>
                                <td className="p-2">Palma</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">Region</td>
                                <td className="p-2">Baleric Islands</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">Postcode</td>
                                <td className="p-2">07010</td>
                            </tr>
                            <tr>
                                <td className="p-2 text-secondary-500 font-semibold">Country</td>
                                <td className="p-2">España</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p>Notes:</p>
            </div>

        </div>
    )
}

export default InfoCardProperty