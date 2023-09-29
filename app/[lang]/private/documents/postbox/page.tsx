import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import PostBoxPage from '@/components/pages/documents/postbox/PostBoxPage';
import { v4 as uuidv4 } from 'uuid';

// Función para generar una fecha aleatoria dentro de un rango de años
function randomDate(startYear: number, endYear: number) {
    const startTimestamp = new Date(`${startYear}-01-01`).getTime();
    const endTimestamp = new Date(`${endYear}-12-31`).getTime();
    const randomTimestamp =
        startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}

const Postbox = () => {
    // Generar 100 registros aleatorios
    const documentData = [];
    const documentNames = [
        'Contrato de Compraventa',
        'Factura de Compra',
        'Informe de Inspección de la Caja',
        'Declaración de Impuesto sobre Ventas',
        'Informe de Depreciación de la Caja',
        'Recibo de Pago de Impuestos',
        'Informe Anual de Hacienda',
        'Certificado de Propiedad de la Caja',
        'Informe de Evaluación de Valor',
        'Informe de Inventario de la Caja',
        'Declaración de Impuesto de Sociedades',
        'Factura de Reparación de la Caja',
        'Informe de Auditoría Financiera',
        'Solicitud de Exención de Impuestos',
        'Informe de Depósito en el Banco',
        'Informe de Estado Financiero',
        'Informe de Registro de Activos Fijos',
        'Certificado de Cumplimiento Fiscal',
        'Declaración de Impuesto a la Renta',
        'Recibo de Pago de Aranceles',
    ];
    const archiveNames = [
        'Villa DiCaprio',
        'Villa Pitt',
        'Villa Clooney',
        'Villa Roberts',
        'Villa Streep',
        'Villa Buzz',
        'Villa Depp',
        'Villa Cruise',
        'Villa Peter El Panadero',
        'Villa Maritimo',
        'Villa Palma',
        'Baumhaus',
        'C. Coronel Picornell, 7',
        'Villa Fierroman',
        'Villa Lawrence',
        'Villa Eastwood',
        'Villa Bullock',
        'Villa Jackson',
        'Villa Winnie Da P.',
        'Villa Jolie',
        'Villa McConaughey',
    ];

    for (let i = 0; i < 169; i++) {
        const documentName =
            documentNames[Math.floor(Math.random() * documentNames.length)];
        const archiveName =
            archiveNames[Math.floor(Math.random() * archiveNames.length)];
        const contentLength = Math.floor(Math.random() * 1000000); // Cantidad de bytes aleatoria
        const createdAt = randomDate(2022, 2023); // Fecha aleatoria entre 2000 y 2023
        const status = Math.floor(Math.random() * 6); // Estado aleatorio entre 0 y 5
        const id = uuidv4(); // Generar un UUID único

        const document = {
            id,
            documentName,
            archiveName,
            contentLength,
            createdAt,
            status,
        };

        documentData.push(document);
    }

    return (
        <>
            <Breadcrumb />
            <PostBoxPage dataSource={documentData} />
        </>
    );
};

export default Postbox;
