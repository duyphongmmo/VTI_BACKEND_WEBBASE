import {
  FILE_TYPE,
  IMPORT_ACTION,
  IMPORT_CONST,
} from '@constant/import.constant';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ImportRequestDto } from '@core/dto/import/request/import.request.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { ImportResultDto } from '@core/dto/import/response/import.result.dto';
import { ACTIONS } from '@utils/common';
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
import * as Papa from 'papaparse';
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
export abstract class ImportFileDataAbstract {
  protected readonly actionColIndex = 1;

  protected readonly fieldsMap = new NewMap([]);

  protected constructor(protected readonly i18n: I18nRequestScopeService) {}

  protected abstract saveImportDataDto(
    dataDto: any[],
    logs: ImportResultDto[],
    error: number,
    total: number,
    userId?: number,
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
    sheetName?: string,
  ): Promise<ResponsePayload<ImportResponseDto | any>> {
    const { buffer, fileName, mimeType, userId } = request;
    const SHEET_NAME = sheetName
      ? sheetName
      : IMPORT_CONST.SHEET.DATA_SHEET_NAME;
    if (
      mimeType != FILE_TYPE.XLSX.MIME_TYPE &&
      mimeType != FILE_TYPE.CSV.MIME_TYPE
    )
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(await this.i18n.translate('error.IMPORT_INVALID_FILE_TYPE'))
        .build();
    let dataRows: Row[] | string[][];
    let offset = IMPORT_CONST.COL_OFFSET.DEFAULT;
    // if file type is XLSX then read file using exceljs
    if (mimeType == FILE_TYPE.XLSX.MIME_TYPE) {
      try {
        const workbook = new Workbook();
        // workbook = await workbook.xlsx.load(Buffer.from(buffer));
        const worksheet = workbook.getWorksheet(SHEET_NAME);
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
      offset = IMPORT_CONST.COL_OFFSET.CSV;
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
      if (cells.length === 0) continue;
      const rowDto = {};
      rowDto['i'] = j;
      const before = logs.length;

      if (cells.length <= requiredFieldNum) {
        const length = cells.length;
        for (let i = 0; i <= requiredFieldNum - length; i++) cells.push('');
      }

      for (let i = 1; i < cells.length; i++) {
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
          userId,
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

    if (cellValidation?.REGEX_MAIL) {
      if (cellValue) {
        if (!String(cellValue).toLowerCase().match(cellValidation.REGEX_MAIL))
          logs.push(
            await this.i18n.translate('validation.PROPERTY_MUST_BE_AN_EMAIL', {
              args: { property: colName },
            }),
          );
      }
    }

    if (cellValidation?.REGEX_PHONE) {
      if (cellValue) {
        if (!String(cellValue).toLowerCase().match(cellValidation.REGEX_PHONE))
          logs.push(
            await this.i18n.translate(
              'validation.PROPERTY_MUST_BE_A_VALID_PHONE_NUMBER',
            ),
          );
      }
    }

    if (cellValue && cellValue.length > cellValidation.MAX_LENGTH) {
      logs.push(
        stringFormat(
          await this.i18n.translate(`error.IMPORT_MAX_LENGTH`, {
            args: {
              colname: colName,
              maxlength: cellValidation.MAX_LENGTH,
            },
          }),
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
        !toStringTrimLowerCase(await this.fieldsMap.get(i).COL_NAME)
          .split(',')
          .includes(toStringTrimLowerCase(headerRowValues[i]))
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
    if (!action || action.length <= 0) {
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_FIELD_REQUIRED'),
          await this.i18n.translate('file-header.ACTION'),
        ),
      );
    } else if (
      !ACTIONS.map((a) => a.toLowerCase()).includes(action.toLowerCase())
    )
      logs.push(
        stringFormat(
          await this.i18n.translate('error.IMPORT_FIELD_INCORRECT'),
          await this.i18n.translate('file-header.ACTION'),
        ),
      );
    return logs;
  }

  // TODO
  protected async writeLog(logContent: string): Promise<string> {
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
    const duplicateCodeOrNameMsg = await this.i18n.translate(
      'error.CODE_OR_NAME_IS_EXISTED',
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
    const purchaseOrderCodeNotExist = await this.i18n.translate(
      'error.PURCHASE_ORDER_CODE_NOT_EXIST',
    );
    const qcCriterialCodeNotNull = await this.i18n.translate(
      'error.QC_CRITERIAL_CODE_NOT_NULL',
    );
    const qcCriterialCodeNotFound = await this.i18n.translate(
      'error.QC_CRITERIAL_CODE_NOT_FOUND',
    );
    const purchaseOrderCodeIsExist = await this.i18n.translate(
      'error.PURCHASE_ORDER_CODE_IS_EXIST',
    );
    const companyCodeNotExist = await this.i18n.translate(
      'error.COMPANY_CODE_NOT_EXIST',
    );
    const vendorCodeNotExist = await this.i18n.translate(
      'error.VENDOR_CODE_NOT_EXIST',
    );
    const manufacturingOrderCodeNotExist = await this.i18n.translate(
      'error.MANUFACTURING_ORDER_CODE_NOT_EXIST',
    );
    const itemCodeNotExist = await this.i18n.translate(
      'error.ITEM_CODE_NOT_EXIST',
    );
    const warehousecodeNotExist = await this.i18n.translate(
      'error.WAREHOUSE_CODE_NOT_EXIST',
    );
    const quantityMustBeGreaterThanZero = await this.i18n.translate(
      'error.QUANTITY_MUST_BE_GREATER_THAN_ZERO',
    );
    const sameItemCodeInPurchaseOrder = await this.i18n.translate(
      'error.SAME_ITEM_CODE_IN_PURCHASE_ORDER',
    );
    const purchaseOrderAtMustAfterDeadlineAt = await this.i18n.translate(
      'error.PURCHASE_ORDER_AT_MUST_AFTER_DEADLINE_AT',
    );
    const purchaseOrderCodeDuplicate = await this.i18n.translate(
      'error.PURCHASE_ORDER_CODE_DUPLICATE_IN_DATA_IMPORT',
    );
    const purchaseOrderWasConfirmed = await this.i18n.translate(
      'error.PURCHASE_ORDER_WAS_CONFIRMED',
    );
    const saleOrderCodeNotExist = await this.i18n.translate(
      'error.SALE_ORDER_CODE_NOT_EXIST',
    );
    const saleOrderCodeIsExist = await this.i18n.translate(
      'error.SALE_ORDER_CODE_IS_EXIST',
    );
    const customerCodeNotExist = await this.i18n.translate(
      'error.CUSTOMER_CODE_NOT_EXIST',
    );
    const boqCodeNotExist = await this.i18n.translate(
      'error.BOQ_CODE_NOT_EXIST',
    );
    const saleOrderAtMustBeGreaterThanDeadlineAt = await this.i18n.translate(
      'error.SALE_ORDER_AT_MUST_BE_GREATER_THAN_DEADLINE_AT',
    );
    const saleOrderWasConfirmed = await this.i18n.translate(
      'error.SALE_ORDER_WAS_CONFIRMED',
    );
    const sameItemCodeInSaleOrder = await this.i18n.translate(
      'error.SAME_ITEM_CODE_IN_SALE_ORDER',
    );
    const saleOrderCodeDuplicate = await this.i18n.translate(
      'error.SALE_ORDER_CODE_DUPLICATE_IN_DATA_IMPORT',
    );
    const itemCodeIsNotInBoqDetail = await this.i18n.translate(
      'error.ITEM_CODE_IS_NOT_IN_BOQ_DETAIL',
    );
    const quantityItemGreaterThanQuantityBoq = await this.i18n.translate(
      'error.QUANTITY_ITEM_GREATER_THAN_QUANTITY_BOQ',
    );
    const actionValueIsIncorrect = await this.i18n.translate(
      'error.ACTION_VALUE_IS_INCORRECT',
    );
    return {
      invalidCompanyMsg: invalidCompanyMsg,
      duplicateCodeOrNameMsg: duplicateCodeOrNameMsg,
      codeNotExistMsg: codeNotExistMsg,
      successMsg: successMsg,
      unsuccessMsg: unsuccessMsg,
      addText: addText.toLowerCase(),
      updateText: updateText.toLowerCase(),
      noText: noText,
      doneText: doneText,
      purchaseOrderCodeNotExist: purchaseOrderCodeNotExist,
      qcCriterialCodeNotNull: qcCriterialCodeNotNull,
      qcCriterialCodeNotFound: qcCriterialCodeNotFound,
      purchaseOrderCodeIsExist: purchaseOrderCodeIsExist,
      companyCodeNotExist: companyCodeNotExist,
      vendorCodeNotExist: vendorCodeNotExist,
      manufacturingOrderCodeNotExist: manufacturingOrderCodeNotExist,
      itemCodeNotExist: itemCodeNotExist,
      warehousecodeNotExist: warehousecodeNotExist,
      quantityMustBeGreaterThanZero: quantityMustBeGreaterThanZero,
      sameItemCodeInPurchaseOrder: sameItemCodeInPurchaseOrder,
      purchaseOrderAtMustAfterDeadlineAt: purchaseOrderAtMustAfterDeadlineAt,
      purchaseOrderCodeDuplicate: purchaseOrderCodeDuplicate,
      purchaseOrderWasConfirmed: purchaseOrderWasConfirmed,
      saleOrderCodeNotExist: saleOrderCodeNotExist,
      saleOrderCodeIsExist: saleOrderCodeIsExist,
      customerCodeNotExist: customerCodeNotExist,
      boqCodeNotExist: boqCodeNotExist,
      saleOrderAtMustBeGreaterThanDeadlineAt:
        saleOrderAtMustBeGreaterThanDeadlineAt,
      saleOrderWasConfirmed: saleOrderWasConfirmed,
      sameItemCodeInSaleOrder: sameItemCodeInSaleOrder,
      saleOrderCodeDuplicate: saleOrderCodeDuplicate,
      itemCodeIsNotInBoqDetail: itemCodeIsNotInBoqDetail,
      quantityItemGreaterThanQuantityBoq: quantityItemGreaterThanQuantityBoq,
      duplicateCodeMsg,
      actionValueIsIncorrect,
    };
  }
}
