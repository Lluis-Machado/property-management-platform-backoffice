// Libraries imports
import saveAs from 'file-saver'; // Should be imported dinamically but it throws an error

interface TableProperties {
    /**
     * The name of the table.
     */
    name: string;
    /**
     * The display name of the table.
     */
    displayName?: string;
    /**
     * Top left cell of the table.
     */
    ref?: string;
    /**
     * Show headers at top of table.
     */
    headerRow?: boolean;
    /**
     * Show totals at bottom of table.
     */
    totalsRow?: boolean,
    /**
     * Extra style properties.
     * 
     * Check: https://github.com/exceljs/exceljs#table-style-properties.
     * Check: https://github.com/exceljs/exceljs#table-style-themes.
     */
    style?: StyleProperties;
    /**
     * Columns definitions.
     */
    columns: Column[];
    /**
     * Rows of data.
     */
    // rows?: any;
};

interface StyleProperties {
    /**
     * The colour theme of the table.
     */
    theme?: string;
    /**
     * Highlight the first column (bold).
     */
    showFirstColumn?: boolean;
    /**
     * Highlight the last column (bold).
     */
    showLastColumn?: boolean;
    /**
     * Alternate rows shown with background colour.
     */
    showRowStripes?: boolean;
    /**
     * Alternate columns shown with background colour
     */
    showColumnStripes?: boolean;
};

interface TableColumnProperties {
    /**
     * The name of the column, also used in the header.
     */
    name: string;
    /**
     * Switches the filter control in the header.
     */
    filterButton?: boolean;
    /**
     * Label to describe the totals row (first column).
     */
    totalsRowLabel?: string;
    /**
     * Name of the totals function.
     */
    totalsRowFunction?: totalFunctions;
    /**
     * Optional formula for custom functions.
     */
    totalsRowFormula?: any;
};

type totalFunctions = 'none' | 'average' | 'countNums' | 'count' | 'max' | 'min' | 'stdDev' | 'var' | 'sum' | 'custom';

export interface Column extends TableColumnProperties {
    /**
     * Key of the field to relate the column to its corresponding row values.
     */
    dataField: string;
    /**
     * Type of data that has the column.
     */
    type?: 'boolean' | 'date' | 'currency' | 'percentage';
};

export interface ExportExcelProps {
    /**
     * Data source from which the excel will be build.
     */
    dataSource: any[];
    fileProperties: {
        fileName: string;
        sheetName: string;
    };
    tableProperties: TableProperties;
};

export const exportExcel = async ({ dataSource, fileProperties, tableProperties }: ExportExcelProps) => {
    const { Workbook } = await import('exceljs');

    const workbook: any = new Workbook();
    const worksheet = workbook.addWorksheet(fileProperties.sheetName);

    /**
     * For adding the table to the excel.
     * 
     * https://github.com/exceljs/exceljs#tables
     */
    const addTable = () => {
        /**
         * Method to insert the row values in the proper order so it coincides qith the columns order.
         * 
         * @returns Rows of data.
         */
        const getRows = () => (
            dataSource.map(element => (
                columns.reduce((row: any[], column) => {
                    row.push(element[column.dataField] ?? '');
                    return row;
                }, [])
            ))
        );

        const { columns, ref, ...rest } = tableProperties;
        worksheet.addTable({
            ...rest,
            columns,
            ref: ref ?? 'A1',
            rows: getRows(),
        });
    };

    /**
     * Function that adjust all columns width to fit its content and adds a bit of padding.
     */
    const columnsAutoWidth = () => {
        for (const column of worksheet.columns) {
            const lengths = column.values.map((v: any) => v.toString().length);
            const maxLength = Math.max(...lengths.filter((e: any) => !isNaN(e))) + 5;
            column.width = maxLength;
        };
    };

    /**
     * Function that customize the datagrid appearance.
     * 
     * https://github.com/exceljs/exceljs#styles
     */
    const customizeAppearance = () => {

        /**
         * Function for setting the proper format to the cell.
         * 
         * @param cell 
         * @param cellColumnNumber 
         */
        const customizeNumFmt = (cell: any, cellColumnNumber: number) => {
            const col = tableProperties.columns[cellColumnNumber - 1];

            if (col.type == 'boolean') {
                cell.value = cell._value.model.value;
            } else if (col.type == 'currency') {
                cell.numFmt = '#,##0.00 [$€-1];[Red]-#,##0.00 [$€-1]';
            } else if (col.type == 'date') {
                cell.numFmt = 'DD/MM/YYYY';
            } else if (col.type == 'percentage') {
                cell.numFmt = '0.00%';
            }
        };

        worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
            row.eachCell((cell: any, colNumber: any) => {
                // numFmt
                customizeNumFmt(cell, colNumber);

                // font
                cell.font = {
                    name: 'Bahnschrift Condensed',
                    color: { argb: 'fbfbfd' },
                };

                // alignment

                // border
                const borderStyle = { style: 'thin', color: { argb: 'fbfbfd' } };
                cell.border = {
                    top: borderStyle,
                    left: borderStyle,
                    bottom: borderStyle,
                    right: borderStyle
                };

                //fill
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: rowNumber == 1
                            ? 'b99f6c'
                            : '274158'
                    },
                };

            });
        });
    };

    addTable();
    columnsAutoWidth();
    customizeAppearance();

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        fileProperties.fileName + '.xlsx'
    );
};

export default exportExcel;