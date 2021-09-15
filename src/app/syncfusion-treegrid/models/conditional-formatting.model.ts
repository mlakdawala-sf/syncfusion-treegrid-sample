export class FormattingStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  backgroundColor?: string;
  textColor?: string;

  constructor(data?: Partial<FormattingStyle>) {
    this.bold = data?.bold || false;
    this.italic = data?.italic || false;
    this.underline = data?.underline || false;
    this.backgroundColor = data?.backgroundColor;
    this.textColor = data?.textColor || DEFAULT_CF_TEXT_COLOR;
  }

  isDefault() {
    if (
      !this.bold &&
      !this.italic &&
      !this.underline &&
      !this.backgroundColor &&
      this.textColor === DEFAULT_CF_TEXT_COLOR
    ) {
      return true;
    }
    return false;
  }
}

export class CustomCriteriaBase {
  value: unknown;
  condition: string;
  start: number;
  end: number;
  constructor(data?: Partial<CustomCriteriaBase>) {
    this.value = data?.value || '';
    this.condition = data?.condition || '';
    this.start = data?.start || 0;
    this.end = data?.end || 1;
  }
}

export class Conditions {
  columnType?: string;
  id: string;
  rule: CustomCriteriaBase[];
  viewType: VIEW_TYPE;
  groupId?: string;

  constructor(data?: Partial<Conditions>) {
    this.columnType = data?.columnType;
    this.id = data?.id || '';
    this.rule = data?.rule || [];
    this.viewType = data?.viewType || VIEW_TYPE.CUSTOM;
    this.groupId = data?.groupId;
  }
}

export class BoardMetaSetting {
  conditionalFormatting: FormattingRule[];
}

export class FormattingRule {
  conditions: Conditions;
  style: FormattingStyle;
  appliedColumns: string[];
  active: boolean;
  timestamp: Date;
  constructor(data?: Partial<FormattingRule>) {
    this.conditions = data?.conditions || new Conditions();
    this.style = data?.style || new FormattingStyle();
    this.appliedColumns = data?.appliedColumns || [];
    this.active = data?.active || true;
    this.timestamp = data?.timestamp || new Date();
  }
}

export class FormattingRange {
  field: string;
  columnType: string;
  headerText: string;
  active: boolean;

  constructor(data?: Partial<FormattingRange>) {
    this.field = data?.field || '';
    this.columnType = data?.columnType || '';
    this.headerText = data?.headerText || '';
    this.active = data?.active || true;
  }
}

export const DEFAULT_CF_BACKGROUND_COLOR = '#f2f2f2';
export const DEFAULT_CF_TEXT_COLOR = '#686868';
export const DATE_FORMAT = 'DD-MMM,YYYY';

export class FormatData {
  type: FormatEntity;
  id: string;
  format: Format;
}

export const enum FormatEntity {
  Column = 1,
}

export class Format {
  bold: Emphasis;
  italic: Emphasis;
  underlined: Emphasis;
  fgColor: Color;
  bgColor: Color;
}

export class Emphasis {
  value: boolean;
  modified: Date;
}

export class Color {
  value: string;
  modified: Date;
}

export enum ColumnTypesEnum {
  currency = 'currency',
  date = 'date',
  datetime = 'datetime',
  dropdown = 'dropdown',
  number = 'number',
  people = 'people',
  percentage = 'percentage',
  priority = 'priority',
  status = 'status',
  text = 'text',
  timeline = 'timeline',
  checkbox = 'checkbox',
  dependency = 'dependency',
  formula = 'formula',
  lastUpdated = 'lastUpdated',
  tag = 'tag',
}

export const CFColumnTypes = {
  CHECKBOX: ColumnTypesEnum.checkbox,
  CURRENCY: ColumnTypesEnum.currency,
  DATE: ColumnTypesEnum.date,
  DATETIME: ColumnTypesEnum.datetime,
  DEPENDENCY: ColumnTypesEnum.dependency,
  DROPDOWN: ColumnTypesEnum.dropdown,
  NUMBER: ColumnTypesEnum.number,
  PEOPLE: ColumnTypesEnum.people,
  PERCENTAGE: ColumnTypesEnum.percentage,
  PRIORITY: ColumnTypesEnum.priority,
  STATUS: ColumnTypesEnum.status,
  TEXT: ColumnTypesEnum.text,
  TIMELINE: ColumnTypesEnum.timeline,
};

export enum CUSTOM_DROPDOWN_CRITERIA {
  CONTAINS = 'contains',
  EQUALS = 'is equal to',
  NOT_EQUALS = 'is not equal to',
  GREATER_THAN = 'is greater than',
  LESS_THAN = 'is less than',
  BETWEEN = 'is between',
  IS_IN_LAST = 'is in the last(days)',
  IS_IN_NEXT = 'is in the next(days)',
  IS_TODAY = 'is today',
  IS_IN_PAST = 'is in the past',
  IS_IN_FUTURE = 'is in the future',
  IS_BLANK = 'is blank',
  NOT_BLANK = 'is not blank',
  START_ON = 'starts on',
  START_AFTER = 'starts after',
  START_BEFORE = 'start before',
  END_ON = 'end on',
  END_AFTER = 'end after',
  END_BEFORE = 'end before',
}

export enum CHECKBOX_CRITERIA {
  CHECKED = 'Checked',
  UNCHECKED = 'Unchecked',
}

export enum VIEW_TYPE {
  SELECT_FORM_LIST = 1,
  CUSTOM,
}

export enum FORMATTING_STYLE_ENUM {
  NONE = 0,
  BOLD,
  ITALIC,
  UNDERLINE,
  BG_COLOR,
  TEXT_COLOR,
}

export enum CUSTOM_VIEW_TYPE_ENUM {
  TEXT,
  NUMBER,
  DATE,
  CHECKBOX,
  TIMELINE,
}

export enum DATE_COMPARE_TYPE {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}
