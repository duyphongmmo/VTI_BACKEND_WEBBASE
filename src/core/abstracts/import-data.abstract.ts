import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { ImportResultDto } from '@core/dto/import/response/import.result.dto';
import {
  dateFormat,
  stringFormat,
  toStringTrim,
  toStringTrimLowerCase,
} from '@utils/object.util';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { Buffer } from 'buffer';
import { CellValue, Row, Workbook } from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

export class NewMap extends Map {
  constructor(agg: any[]) {
    super();
    agg.forEach((i, index) => {
      this.set(agg[index][0], agg[index][1]);
    });
  }

  groupSet = (key: any[], value: any[]): this => {
    key.forEach((i, index) => {
      this.set(key[index], value[index]);
    });
    return this;
  };
}
export abstract class ImportDataAbstract {
  protected readonly actionColIndex = 1;

  protected readonly fieldsMap = new NewMap([
    [this.actionColIndex, IMPORT_CONST.ACTION_HEADER],
  ]);

  protected constructor(protected readonly i18n: I18nRequestScopeService) {}

  protected abstract saveImportDataDto(
    dataDto: any[],
    logs: ImportResultDto[],
    error: number,
    total: number,
  ): Promise<ImportResponseDto>;

  /**
   * Import utility function
   * @param request Import request dto
   * @param requiredFieldNum Number of required fields
   * @protected
   */
  protected async importUtil(
    request: ImportRequestDto,
    requiredFieldNum: number,
  ): Promise<ResponsePayload<ImportResponseDto | any>> {
    const { buffer, mimeType } = request;
    if (
      mimeType != FILE_TYPE.XLSX.MIME_TYPE &&
      mimeType != FILE_TYPE.CSV.MIME_TYPE
    )
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(await this.i18n.translate('error.IMPORT_INVALID_FILE_TYPE'))
        .build();
    let dataRows: Row[] | string[][];
    // if file type is XLSX then read file using exceljs
    if (mimeType == FILE_TYPE.XLSX.MIME_TYPE) {
      try {
        const workbook = new Workbook();
        // workbook = await workbook.xlsx.load(Buffer.from(buffer));
        const worksheet = workbook.getWorksheet(
          IMPORT_CONST.SHEET.DATA_SHEET_NAME,
        );
        // return an error message if the imported file's template is invalid
        if (!worksheet)
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(
              await this.i18n.translate('validation.IMPORT_INVALID_TEMPLATE'),
            )
            .build();
        const headerRow = worksheet.getRow(
          IMPORT_CONST.SHEET.HEADER_ROW,
        ).values;

        const validateHeaderMsg = await this.validateHeader(
          headerRow,
          requiredFieldNum,
        );

        // return an error message if the imported file's headers are invalid
        if (validateHeaderMsg != null) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(validateHeaderMsg)
            .build();
        }
        dataRows = worksheet.getRows(
          IMPORT_CONST.SHEET.HEADER_ROW + 1,
          worksheet.rowCount - 1,
        );
      } finally {
        // DONE
      }
      // if file type is CSV then read file using PapaParse
    } else if (mimeType == FILE_TYPE.CSV.MIME_TYPE) {
      let headerValues;

      const content = Buffer.from(buffer).toString(
        IMPORT_CONST.DEFAULT_ENCODING.TEXT as unknown as BufferEncoding,
      );

      Papa.parse(content, {
        step: function (row, parser) {
          headerValues = row.data;
          parser.abort();
        },
      });

      const validateHeaderMsg = await this.validateHeader(
        headerValues,
        requiredFieldNum,
        IMPORT_CONST.COL_OFFSET.CSV,
      );

      // return an error message if the imported file's headers are invalid
      if (validateHeaderMsg != null)
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(validateHeaderMsg)
          .build();

      dataRows = Papa.parse(content).data;
    }
    // validate row and Row to Dto
    const rowError = [];
    const rowDtoSuccess = [];
    const logRows = [];
    for (let j = 0; j < dataRows.length; j++) {
      const logRow = {
        id: j,
        row: j,
      } as ImportResultDto;
      const logs = [];
      const row = dataRows[j];
      const cells = this.getCells(row, mimeType);
      const validateActionLog = await this.validateAction(cells);
      if (validateActionLog.length > 0) {
        logs.push(...validateActionLog);
        logRow.log = logs;
        logRow.action = await this.i18n.translate(
          `file-header.${IMPORT_ACTION.NO}`,
        );
        logRows.push(logRow);
        continue;
      }
      const rowDto = {};
      rowDto['i'] = j;
      rowDto['action'] = toStringTrim(
        cells[this.actionColIndex - IMPORT_CONST.COL_OFFSET.DEFAULT],
      );
      logRow.action = rowDto['action'];
      const before = logs.length;

      const standardLength = this.getCells(dataRows[0], mimeType).length;
      if (cells.length < standardLength)
        for (let i = 0; i < standardLength - cells.length; i++) cells.push('');

      for (let i = 2; i < cells.length; i++) {
        let cell = cells[i];
        await this.validateRequiredField(
          logs,
          await this.i18n.translate(
            `file-header.${
              this.fieldsMap.get(i + IMPORT_CONST.COL_OFFSET.DEFAULT)
                .DB_COL_NAME
            }`,
          ),
          cell,
          this.fieldsMap.get(i + IMPORT_CONST.COL_OFFSET.DEFAULT),
        );

        if (
          !cell &&
          this.fieldsMap.get(i + IMPORT_CONST.COL_OFFSET.DEFAULT)?.ALLOW_NULL
        )
          cell = '';
        rowDto[
          this.fieldsMap.get(i + IMPORT_CONST.COL_OFFSET.DEFAULT).DB_COL_NAME
        ] = cell;
      }
      if (logs.length - before > 0) {
        rowError.push(rowDto);
        logRow.log = logs;
        logRows.push(logRow);
      } else {
        rowDtoSuccess.push(rowDto);
      }
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(
        await this.saveImportDataDto(
          rowDtoSuccess,
          logRows,
          rowError.length,
          rowError.length + rowDtoSuccess.length,
        ),
      )
      .build();
  }

  public getCells(row, mimeType: string): string[] {
    if (mimeType == FILE_TYPE.CSV.MIME_TYPE) {
      return row;
    } else if (mimeType == FILE_TYPE.XLSX.MIME_TYPE) {
      return row.values.map((v) => (v.text ? v.text : v));
    }
  }

  /**
   * Validate required fields
   * @param logs Processing logs
   * @param colName Column name
   * @param cellValue Cell's value
   * @param maxLength Field's max length
   * @protected
   */
  protected async validateRequiredField(
    logs: string[],
    colName: string,
    cellValue: string,
    cellValidation: any,
  ) {
    if ((!cellValue || cellValue.length <= 0) && !cellValidation.ALLOW_NULL) {
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_FIELD_REQUIRED'),
          colName,
        ),
      );
    }
    if (cellValidation?.REGEX) {
      if (!cellValue?.toString().match(cellValidation.REGEX))
        logs.push(
          await this.i18n.translate(
            'validation.PROPERTY_MUST_CONTAIN_ONLY_LETTERS_AND_NUMBER',
            {
              args: { property: colName },
            },
          ),
        );
    }
    if (cellValue && cellValue.length > cellValidation.MAX_LENGTH) {
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_MAX_LENGTH_EXCEED'),
          colName,
          cellValidation.MAX_LENGTH,
        ),
      );
    }
  }

  /**
   * Validate max length of field
   * @param logs Processing logs
   * @param colName Column name
   * @param cellValue Cell's value
   * @param maxLength Field's max length
   * @protected
   */
  protected async validateMaxLength(
    logs: string[],
    colName: string,
    cellValue: string,
    maxLength: number,
  ) {
    if (cellValue && cellValue.length > maxLength)
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_MAX_LENGTH_EXCEED'),
          colName,
          maxLength,
        ),
      );
  }

  /**
   * Validate headers of imported file
   * @param headerRowValues Header row's values
   * @param requiredFieldNum Number of required fields
   * @param colOffset Column offset
   * @protected
   */
  protected async validateHeader(
    headerRowValues: string[] | CellValue[] | any,
    requiredFieldNum: number,
    colOffset = IMPORT_CONST.COL_OFFSET.DEFAULT,
  ): Promise<string> {
    const fieldMapSize = this.fieldsMap.size;
    const headerValuesCount = headerRowValues.length;

    if (!headerRowValues || headerRowValues.length <= 0) {
      return await this.i18n.translate('error.IMPORT_INVALID_TEMPLATE');
    }
    // check if total header values is invalid:
    // - Less than number of required fields
    // - Greater than total available fields
    if (
      headerValuesCount <
        IMPORT_CONST.SHEET.HEADER_ROW_COUNT + requiredFieldNum + colOffset ||
      headerValuesCount >
        IMPORT_CONST.SHEET.HEADER_ROW_COUNT + fieldMapSize + colOffset
    ) {
      return await this.i18n.translate('error.IMPORT_INVALID_TEMPLATE');
    }
    // iterate every value of header to validate with value in the field map
    for (let i = 1; i < headerValuesCount; i++) {
      if (
        toStringTrimLowerCase(headerRowValues[i]) !=
        toStringTrimLowerCase(await this.fieldsMap.get(i + colOffset).COL_NAME)
      ) {
        return await this.i18n.translate('error.IMPORT_INVALID_HEADER');
      }
    }
    return null;
  }

  /**
   * Validate action of row
   * @param rowValues Row's values
   * @param colOffset Column offset
   * @protected Validation logs
   */
  protected async validateAction(
    rowValues: string[] | CellValue[] | { [key: string]: CellValue },
    colOffset = IMPORT_CONST.COL_OFFSET.DEFAULT,
  ): Promise<string[]> {
    const logs = [];
    const action = toStringTrim(rowValues[this.actionColIndex - colOffset]);
    const actions = await Promise.all(
      IMPORT_CONST.ACTIONS.map(
        async (action) => await this.i18n.translate(`file-header.${action}`),
      ),
    );
    if (!action || action.length <= 0) {
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_FIELD_REQUIRED'),
          IMPORT_CONST.ACTION_HEADER.COL_NAME,
        ),
      );
    } else if (
      !actions
        .map((a: string) => a.toLowerCase())
        .includes(action.toLowerCase())
    )
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_FIELD_INCORRECT'),
          IMPORT_CONST.ACTION_HEADER.COL_NAME,
        ),
      );
    return logs;
  }

  // TODO
  protected async writeLog(): Promise<string> {
    const dateNow = new Date().toString();
    const fileName = stringFormat(
      IMPORT_CONST.LOG_FILE_NAME,
      dateFormat(dateNow),
      uuidv4(),
    );
    return fileName;
  }

  protected async getMessage(): Promise<any> {
    const invalidCompanyMsg = await this.i18n.translate(
      'error.COMPANY_NOT_FOUND',
    );
    const duplicateCodeMsg = await this.i18n.translate('error.CODE_IS_EXISTED');
    const codeNotExistMsg = await this.i18n.translate('error.CODE_NOT_EXIST');
    const successMsg = await this.i18n.translate('statusMessage.SUCCESS');
    const unsuccessMsg = await this.i18n.translate('error.UNSUCCESS');
    const addText = await this.i18n.translate(
      `file-header.${IMPORT_ACTION.ADD}`,
    );
    const updateText = await this.i18n.translate(
      `file-header.${IMPORT_ACTION.UPDATE}`,
    );
    const noText = await this.i18n.translate(`file-header.${IMPORT_ACTION.NO}`);
    const doneText = await this.i18n.translate(
      `file-header.${IMPORT_ACTION.DONE}`,
    );
    return {
      invalidCompanyMsg: invalidCompanyMsg,
      duplicateCodeMsg,
      codeNotExistMsg: codeNotExistMsg,
      successMsg: successMsg,
      unsuccessMsg: unsuccessMsg,
      addText: addText.toLowerCase(),
      updateText: updateText.toLowerCase(),
      noText: noText,
      doneText: doneText,
    };
  }
}
