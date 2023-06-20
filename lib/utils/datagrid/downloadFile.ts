// Libraries imports
import saveAs from 'file-saver'; // Should be imported dinamically but it throws an error

export const downloadFile = async ({ data }: any) => {
    fetch('data.json')
        .then(response => {
            response.blob()
                .then(blob => {
                    const fileURL = window.URL.createObjectURL(blob);
                    saveAs(fileURL, 'data.json');
                })
                .catch(error => console.error("Error downloading file: ", error));
        })
        .catch(error => console.error("Error fetching file: ", error));
}
export default downloadFile;