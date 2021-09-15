import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {
  CFColumnTypes,
  Conditions,
  CUSTOM_DROPDOWN_CRITERIA,
  DATE_COMPARE_TYPE,
  DATE_FORMAT,
  FormattingRule,
  FormattingStyle,
  VIEW_TYPE,
} from '../models/conditional-formatting.model';
import { GenericTask } from '../models/generic-task.model';

@Injectable()
export class ConditionalFormattingService {
  getStyle(rules: FormattingRule[], task: GenericTask, field?: string) {
    const columnField = field ?? task.column.field;
    const latestRules = [...rules];
    let style = new FormattingStyle();
    let timestamp;
    latestRules.reverse();
    latestRules.forEach((newRule) => {
      if (
        newRule?.appliedColumns.includes('Entire Row') ||
        newRule.appliedColumns.includes(columnField)
      ) {
        let flag;
        if (
          newRule.conditions.groupId &&
          task.groupId === newRule.conditions.groupId
        ) {
          flag = this.checkForConditionViewType(newRule, task);
        } else if (!newRule.conditions.groupId) {
          flag = this.checkForConditionViewType(newRule, task);
        } else {
          // do nothing
        }
        if (flag) {
          style = newRule.style;
          timestamp = newRule.timestamp;
        }
      }
    });
    return { style, timestamp };
  }

  checkForConditionViewType(rules: FormattingRule, task: GenericTask) {
    if (rules?.conditions?.rule.length) {
      if (rules.conditions.viewType === VIEW_TYPE.SELECT_FORM_LIST) {
        return this.checkSelectedList(rules.conditions, task);
      } else {
        return this.checkCustomCriteria(rules.conditions, task);
      }
    } else {
      return false;
    }
  }

  checkSelectedList(rules: Conditions, task: GenericTask) {
    switch (rules.columnType) {
      case 'status':
      case 'priority':
      case 'dropdown':
      case 'number':
      case 'percentage':
      case 'currency':
      case 'text':
        return this.textHandler(rules, task);
      case 'people':
        return this.peopleHandler(rules, task);
      case 'dependency':
        return this.dependencyHandler(rules, task);
      case 'checkbox':
        return this.checkBoxHandler(rules, task);
      default:
        return false;
    }
  }

  checkBoxHandler(rule: Conditions, task: GenericTask) {
    const selectedValue = rule.rule.map((e) => e.value === true);
    {
      return true;
    }
  }

  textHandler(rule: Conditions, task: GenericTask) {
    const selectedValue = rule.rule.map((e) => e.value);
    // if (rule.id === 'name') {
    //   return true;
    // } else {
    //   if (
    //     selectedValue.includes(task.fieldValues[rule?.id]?.value?.displayValue)
    //   ) {
    //     return true;
    //   }
    //   return false;
    // }
    return true;
  }

  peopleHandler(rule: Conditions, task: GenericTask) {
    // const selectedValue = rule.rule.map((e) => e.value);
    // let flag = false;
    // if (task.fieldValues[rule.id]?.value?.value?.length) {
    //   task.fieldValues[rule.id]?.value?.value.forEach((element) => {
    //     if (selectedValue.includes(element.text)) {
    //       flag = true;
    //     }
    //   });
    // }
    return false;
  }

  dependencyHandler(rule: Conditions, task: GenericTask) {
    // const selectedValue = rule.rule.map((e) => e.value);
    // let flag = false;
    // if (task.fieldValues[rule.id]?.value?.displayValue?.length) {
    //   task.fieldValues[rule.id]?.value?.displayValue.forEach((element) => {
    //     if (selectedValue.includes(element)) {
    //       flag = true;
    //     }
    //   });
    // }
    return false;
  }

  checkCustomCriteria(rules: Conditions, task: GenericTask) {
    switch (rules.columnType) {
      case CFColumnTypes.STATUS:
      case CFColumnTypes.PRIORITY:
      case CFColumnTypes.DROPDOWN:
        return this.customTextHandler(
          rules,
          (task as any).fieldValues[rules.id].value?.displayValue
        );
      case CFColumnTypes.TEXT:
        return this.customTextHandler(
          rules,
          (task as any).fieldValues[rules.id].value?.value
        );
      case CFColumnTypes.NUMBER:
      case CFColumnTypes.PERCENTAGE:
      case CFColumnTypes.CURRENCY:
        return this.customNumberHandler(rules, task);
      case CFColumnTypes.DATE:
      case CFColumnTypes.DATETIME:
        return this.customDateHandler(rules, task);
      case CFColumnTypes.PEOPLE:
      case CFColumnTypes.DEPENDENCY:
        return this.multiSelectHandler(rules, task);
      case CFColumnTypes.TIMELINE:
        return this.customTimelineHandler(rules, task);
      default:
        return false;
    }
  }

  customTextHandler(rule: Conditions, currentTaskValue: string) {
    let flag = false;
    for (const item of rule.rule) {
      flag = this.checkTextCriteria(item, currentTaskValue);
      if (!flag) {
        break;
      }
    }
    return flag;
  }

  checkTextCriteria(item: any, currentTaskValue: string) {
    if (item.condition === CUSTOM_DROPDOWN_CRITERIA.EQUALS) {
      return currentTaskValue?.toLowerCase() === item.value.toLowerCase();
    } else if (
      item.condition === CUSTOM_DROPDOWN_CRITERIA.CONTAINS &&
      item.value?.length
    ) {
      return currentTaskValue?.toLowerCase().includes(item.value.toLowerCase());
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_EQUALS) {
      return currentTaskValue !== item.value;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_BLANK) {
      return !currentTaskValue && !currentTaskValue?.length;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_BLANK) {
      return currentTaskValue && currentTaskValue.length ? true : false;
    } else {
      return false;
    }
  }

  multiSelectHandler(rule: Conditions, task: GenericTask) {
    let flag = false;
    let currentTaskValue;
    if (CFColumnTypes.PEOPLE === rule.columnType) {
      currentTaskValue = (task as any).fieldValues[rule.id]?.value?.value?.map(
        (e: any) => e.text
      );
    } else if (CFColumnTypes.DEPENDENCY === rule.columnType) {
      currentTaskValue = (task as any).fieldValues[
        rule.id
      ]?.value?.displayValue?.map((e: any) => e);
    } else {
      return flag;
    }

    for (const item of rule.rule) {
      flag = this.checkMultiselectCriteria(item, currentTaskValue);
      if (!flag) {
        break;
      }
    }
    return flag;
  }

  checkMultiselectCriteria(item: any, currentTaskValue: any) {
    if (item.condition === CUSTOM_DROPDOWN_CRITERIA.EQUALS) {
      return currentTaskValue.find((e: any) => e === item.value);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.CONTAINS) {
      let valueExist = false;
      currentTaskValue?.forEach((element: any) => {
        if (element?.toLowerCase().includes(item.value.toLowerCase())) {
          valueExist = true;
        }
      });
      return valueExist;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_EQUALS) {
      return currentTaskValue.find((e: any) => e !== item.value);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_BLANK) {
      return !currentTaskValue?.length;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_BLANK) {
      return currentTaskValue && currentTaskValue.length;
    } else {
      return false;
    }
  }

  customNumberHandler(rule: Conditions, task: GenericTask) {
    let flag = false;
    const currentTaskValue = (task as any).fieldValues[rule?.id]?.value?.value;
    for (const item of rule.rule) {
      flag = this.checkNumberCriteria(item, currentTaskValue);
      if (!flag) {
        break;
      }
    }
    return flag;
  }

  checkNumberCriteria(item: any, currentTaskValue: any) {
    if (item.condition === CUSTOM_DROPDOWN_CRITERIA.EQUALS) {
      return currentTaskValue === item.value;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_EQUALS) {
      return currentTaskValue !== item.value;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.GREATER_THAN) {
      return currentTaskValue > item.value;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.LESS_THAN) {
      return currentTaskValue ? currentTaskValue < item.value : false;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.BETWEEN) {
      return currentTaskValue > item.start && currentTaskValue < item.end;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_BLANK) {
      return !currentTaskValue ? true : false;
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_BLANK) {
      return currentTaskValue ? true : false;
    } else {
      return false;
    }
  }

  customDateHandler(rule: Conditions, task: GenericTask) {
    let flag = false;
    for (const item of rule.rule) {
      if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_BLANK) {
        flag = !(task as any).fieldValues[rule?.id]?.value?.value;
      } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_BLANK) {
        flag = (task as any).fieldValues[rule?.id]?.value?.value;
      } else {
        const currentTaskValue = (task as any).fieldValues[rule?.id]?.value
          ?.value
          ? moment((task as any).fieldValues[rule?.id]?.value?.value)
          : null;

        flag = currentTaskValue
          ? this.checkDateCriteria(item, currentTaskValue)
          : false;
      }

      if (!flag) {
        break;
      }
    }
    return flag;
  }

  checkDateCriteria(item: any, currentTaskValue: any) {
    if (item.condition === CUSTOM_DROPDOWN_CRITERIA.EQUALS) {
      const incomingValue = moment(item.value);

      return currentTaskValue.isSame(incomingValue, DATE_COMPARE_TYPE.DAY);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_EQUALS) {
      const incomingValue = moment(item.value);

      return !currentTaskValue.isSame(incomingValue, DATE_COMPARE_TYPE.DAY);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.GREATER_THAN) {
      const incomingValue = moment(item.value);

      return currentTaskValue.isAfter(incomingValue, DATE_COMPARE_TYPE.DAY);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.LESS_THAN) {
      const incomingValue = moment(item.value);

      return currentTaskValue.isBefore(incomingValue, DATE_COMPARE_TYPE.DAY);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.BETWEEN) {
      const startDate = moment(item.start);
      const endDate = moment(item.end);

      return currentTaskValue.isBetween(
        startDate,
        endDate,
        DATE_COMPARE_TYPE.DAY
      );
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_IN_LAST) {
      return currentTaskValue.isBetween(
        moment().subtract(item.value, 'days'),
        moment(),
        DATE_COMPARE_TYPE.DAY
      );
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_IN_NEXT) {
      return currentTaskValue.isBetween(
        moment(),
        moment().add(item.value, 'days'),
        DATE_COMPARE_TYPE.DAY
      );
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_TODAY) {
      return currentTaskValue.isSame(moment().format(DATE_FORMAT));
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_IN_PAST) {
      return currentTaskValue.isBefore(moment().format(DATE_FORMAT));
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_IN_FUTURE) {
      return currentTaskValue.isAfter(moment().format(DATE_FORMAT));
    } else {
      return false;
    }
  }

  customTimelineHandler(rule: Conditions, task: GenericTask) {
    let flag = false;

    for (const item of rule.rule) {
      const startDate = (task as any).fieldValues[rule.id].value?.from
        ? moment((task as any).fieldValues[rule.id].value?.from)
        : null;
      const endDate = (task as any).fieldValues[rule.id].value?.to
        ? moment((task as any).fieldValues[rule.id].value?.to)
        : null;

      if (item.condition === CUSTOM_DROPDOWN_CRITERIA.IS_BLANK) {
        flag = !(task as any).fieldValues[rule.id].value?.value;
      } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.NOT_BLANK) {
        flag = (task as any).fieldValues[rule.id].value?.value;
      } else {
        flag = this.checkTimelineCriteria(item, startDate, endDate);
      }
      if (!flag) {
        break;
      }
    }
    return flag;
  }

  checkTimelineCriteria(item: any, startDate: any, endDate: any) {
    if (item.condition === CUSTOM_DROPDOWN_CRITERIA.START_ON) {
      const incomingValue = moment(item.value);
      return (
        startDate && startDate.isSame(incomingValue, DATE_COMPARE_TYPE.DAY)
      );
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.START_AFTER) {
      const incomingValue = moment(item.value);
      return (
        startDate && startDate.isAfter(incomingValue, DATE_COMPARE_TYPE.DAY)
      );
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.START_BEFORE) {
      const incomingValue = moment(item.value);
      return (
        startDate && startDate.isBefore(incomingValue, DATE_COMPARE_TYPE.DAY)
      );
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.END_ON) {
      const incomingValue = moment(item.value);

      return endDate && endDate.isSame(incomingValue, 'day');
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.END_AFTER) {
      const incomingValue = moment(item.value);

      return endDate && endDate.isAfter(incomingValue, DATE_COMPARE_TYPE.DAY);
    } else if (item.condition === CUSTOM_DROPDOWN_CRITERIA.END_BEFORE) {
      const incomingValue = moment(item.value);

      return endDate && endDate.isBefore(incomingValue, DATE_COMPARE_TYPE.DAY);
    } else {
      return false;
    }
  }
}
