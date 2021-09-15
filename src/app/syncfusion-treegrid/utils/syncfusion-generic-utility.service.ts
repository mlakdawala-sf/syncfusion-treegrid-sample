import {
  EventEmitter,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import {
  FormatData,
  FormattingRule,
  FormattingStyle,
} from '../models/conditional-formatting.model';
import { GenericTask } from '../models/generic-task.model';
import { ConditionalFormattingService } from '../services/conditional-formatting.service';

export const DEFAULT_CF_BACKGROUND_COLOR = '#f2f2f2';
export const DEFAULT_CF_TEXT_COLOR = '#686868';
export const DATE_FORMAT = 'DD-MMM,YYYY';

export const COLUMN_HEADER_TEXT_LENGTH = 20;

export const GROUP_PREFIX = 'Group_';
export const ACTION_REQUEST_TYPES = {
  VIRTUAL_SCROLL: 'virtualscroll',
  SAVE: 'save',
  SORTING: 'sorting',
  DELETE: 'delete',
};

@Injectable()
export class SyncfusionGenericUtilityService {
  private readonly renderer: Renderer2;

  constructor(
    private readonly conditionalFormattingService: ConditionalFormattingService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  onRowDataBound(event: any, grid: TreeGridComponent) {
    // if (event?.data?.itemPermission?.permission === PermissionKey.ViewTask) {
    //   event?.row?.classList.add('view-item-permission');
    // }
    if (event.row) {
      event?.row?.setAttribute(
        'data-row-id',
        `${event.data?.groupId}_ROW_${event.data?.id}`
      );
      event?.row?.setAttribute('data-depth', `ROW_${event.data?.depth}`);
      event?.row?.setAttribute(
        'data-row-id',
        `${event.data?.groupId}_ROW_${event.data.id}`
      );
    }
  }

  getClosest(elem: any, selector: any) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) {
        return elem;
      }
    }
    return null;
  }

  onColumnDrop(event: any, reorderColumn: EventEmitter<unknown>) {
    let elem = this.getClosest(event.target, '.e-headercell');
    elem = elem.querySelector('label');
    const { sequencenumber, allowreordering, id } = elem?.attributes;
    if (
      allowreordering &&
      allowreordering.value &&
      sequencenumber &&
      id &&
      event.column.allowReordering &&
      !event.column.collapse
    ) {
      const fromData = {
        sequenceNumber: Number(sequencenumber.value),
        id: event.column.field,
      };
      const toData = {
        sequenceNumber: event.column.sequenceNumber,
        id: id.value,
      };

      if (fromData.sequenceNumber !== toData.sequenceNumber) {
        reorderColumn.emit({
          from: fromData,
          to: toData,
          groupId: event.groupId,
        });
      }
    }
  }

  onActionBegin(event: any) {
    if (event.requestType === ACTION_REQUEST_TYPES.SORTING) {
      if (event?.target?.classList?.contains('sort-action')) {
        event.cancel = false;
      } else {
        event.cancel = true;
      }
    }
  }

  onHeaderCellInfo(args: any) {
    let tooltip: any;
    tooltip?.close();
    if (args.cell.column.headerText.length >= COLUMN_HEADER_TEXT_LENGTH) {
      const tooltipContent = args.cell.column.headerText;
      tooltip = new Tooltip({
        content: tooltipContent,
      });
      tooltip.appendTo(args.node);
    } else {
      // do nothing
    }
  }

  applyStyle(style: any, element: Element, applyLeftPadding = false) {
    if (applyLeftPadding) {
      this.renderer.setStyle(element, 'padding-left', '30px');
    }
    if (!style) {
      return;
    }
    if (style.backgroundColor) {
      this.renderer.setStyle(
        element,
        'background-color',
        style.backgroundColor
      );
    } else {
      this.renderer.setStyle(element, 'background-color', 'white');
    }

    this.renderer.setStyle(element, 'color', style.textColor);
    this.renderer.setStyle(
      element,
      'font-weight',
      style.bold ? 'bold' : 'normal'
    );
    this.renderer.setStyle(
      element,
      'font-style',
      style.italic ? 'italic' : 'normal'
    );
    this.renderer.setStyle(
      element,
      'text-decoration',
      style.underline ? 'underline' : 'none'
    );
  }

  findAncestor(ref: Element) {
    return ref?.closest('.e-templatecell');
  }

  computeStyle(
    formattingRules: FormattingRule[],
    formatData: FormatData[],
    taskData: GenericTask,
    field: string
  ) {
    type NewType = FormattingStyle;

    const style: NewType = new FormattingStyle();
    if (formatData?.length) {
      const columnFormat = formatData.find((f) => f.id === field);
      if (columnFormat) {
        style.bold = !!columnFormat.format?.bold?.value;
        style.italic = !!columnFormat.format?.italic?.value;
        style.underline = !!columnFormat.format?.underlined?.value;
        style.textColor =
          columnFormat?.format?.fgColor?.value ?? DEFAULT_CF_TEXT_COLOR;
        style.backgroundColor = columnFormat?.format?.bgColor?.value;
      }
    }
    if (formattingRules?.length) {
      const latestRule = this.conditionalFormattingService.getStyle(
        formattingRules,
        taskData,
        field
      );
      const conditionalstyle = latestRule.style;
      if (conditionalstyle) {
        style.bold = conditionalstyle.bold || style.bold;
        style.italic = conditionalstyle.italic || style.italic;
        style.underline = conditionalstyle.underline || style.underline;
        style.textColor = this.computeTextColor(
          conditionalstyle.textColor as string,
          style.textColor as string
        );
        style.backgroundColor =
          conditionalstyle.backgroundColor || style.backgroundColor;
      }
      // latestRule.timestamp for date
    }

    return style.isDefault() ? undefined : style;
  }

  computeTextColor(conditionalColor: string, formatColor: string) {
    if (conditionalColor && formatColor) {
      return !conditionalColor.includes(DEFAULT_CF_TEXT_COLOR)
        ? conditionalColor
        : formatColor;
    } else if (conditionalColor) {
      return conditionalColor;
    } else {
      return;
    }
  }
}
