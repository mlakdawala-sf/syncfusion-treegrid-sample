import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  DEFAULT_CF_TEXT_COLOR,
  FormatData,
  FormattingRule,
  FormattingStyle,
} from '../models/conditional-formatting.model';
import { GenericTask } from '../models/generic-task.model';
import { ConditionalFormattingService } from '../services/conditional-formatting.service';

@Directive({
  selector: '[rpmsConditionalFormatting]',
})
export class ConditionalFormattingDirective implements OnChanges {
  @Input('rpmsConditionalFormatting') formattingRules: FormattingRule[];
  // tslint:disable-next-line:no-input-rename
  @Input('data') taskData: GenericTask;
  @Input() formatData: FormatData[] = [];
  constructor(
    private readonly conditionalFormattingService: ConditionalFormattingService,
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (
      (this.taskData && this.formattingRules?.length) ||
      this.formatData?.length
    ) {
      this.applyStyleHelper();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes?.formattingRules?.firstChange ||
      !changes?.taskData?.firstChange ||
      !changes?.formatData?.firstChange
    ) {
      this.applyStyleHelper();
    }
  }
  applyStyleHelper() {
    if (this.taskData) {
      const style = this.computeStyle();
      this.applyStyle(style);
    }
  }

  applyStyle(style: FormattingStyle) {
    const eCellRef = this.findAncestor(this.el);

    if (eCellRef) {
      if (style.backgroundColor) {
        this.renderer.setStyle(
          eCellRef,
          'background-color',
          style.backgroundColor
        );
      } else {
        this.renderer.setStyle(eCellRef, 'background-color', 'white');
      }
    }
    this.renderer.setStyle(this.el.nativeElement, 'color', style.textColor);
    this.renderer.setStyle(
      this.el.nativeElement,
      'font-weight',
      style.bold ? 'bold' : 'normal'
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'font-style',
      style.italic ? 'italic' : 'normal'
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'text-decoration',
      style.underline ? 'underline' : 'none'
    );
  }

  findAncestor(ref: ElementRef) {
    return ref?.nativeElement?.closest('.e-templatecell');
  }

  computeStyle() {
    const style: FormattingStyle = new FormattingStyle();
    if (this.formatData?.length) {
      const columnFormat = this.formatData.find(
        (f) => f.id === this.taskData?.column?.field
      );
      if (columnFormat) {
        style.bold = !!columnFormat.format?.bold?.value;
        style.italic = !!columnFormat.format?.italic?.value;
        style.underline = !!columnFormat.format?.underlined?.value;
        style.textColor =
          columnFormat?.format?.fgColor?.value ?? DEFAULT_CF_TEXT_COLOR;
        style.backgroundColor = columnFormat?.format?.bgColor?.value;
      }
    }
    if (this.formattingRules?.length) {
      const latestRule = this.conditionalFormattingService.getStyle(
        this.formattingRules,
        this.taskData
      );
      const conditionalstyle = latestRule.style;
      if (conditionalstyle) {
        style.bold = conditionalstyle.bold || style.bold;
        style.italic = conditionalstyle.italic || style.italic;
        style.underline = conditionalstyle.underline || style.underline;
        style.textColor = this.computeTextColor(
          conditionalstyle.textColor,
          style.textColor
        );
        style.backgroundColor =
          conditionalstyle.backgroundColor || style.backgroundColor;
      }
      // latestRule.timestamp for date
    }

    return style;
  }

  computeTextColor(conditionalColor: string, formatColor: string) {
    if (conditionalColor && formatColor) {
      return !conditionalColor.includes(DEFAULT_CF_TEXT_COLOR)
        ? conditionalColor
        : formatColor;
    } else if (conditionalColor) {
      return conditionalColor;
    } else {
      return DEFAULT_CF_TEXT_COLOR;
    }
  }
}
