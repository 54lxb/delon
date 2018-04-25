import { Component } from '@angular/core';
import { ControlWidget } from '../../widget';
import { getData } from '../../utils';
import { SFSchemaEnum } from '../../schema';

@Component({
    selector: 'sf-checkbox',
    template: `
    <ng-template #all>
        <label *ngIf="ui.checkAll" nz-checkbox class="mr-sm"
            [(ngModel)]="allChecked"
            [nzIndeterminate]="indeterminate"
            (click)="onAllChecked($event)">
            {{ ui.checkAllText || '全选' }}
        </label>
    </ng-template>
    <nz-form-item>
        <nz-form-label *ngIf="data.length > 0" [nzSpan]="label" [nzRequired]="ui._required">
            {{ schema.title }}
            <span class="optional">
                {{ ui.optional }}
                <nz-tooltip *ngIf="ui.optional_help" [nzTitle]="ui.optional_help">
                    <i nz-tooltip class="anticon anticon-question-circle-o"></i>
                </nz-tooltip>
            </span>
        </nz-form-label>
        <nz-col class="ant-form-item-control-wrapper" [nzSpan]="control" [nzOffset]="offset">
            <div class="ant-form-item-control" [class.has-error]="showError">

                <ng-container *ngIf="data.length === 0">
                    <label nz-checkbox
                        [nzDisabled]="disabled"
                        [ngModel]="value"
                        (ngModelChange)="setValue($event)">
                        <span [innerHTML]="schema.title"></span>
                        <span class="optional">
                            {{ ui.optional }}
                            <nz-tooltip *ngIf="ui.optional_help" [nzTitle]="ui.optional_help">
                                <i nz-tooltip class="anticon anticon-question-circle-o"></i>
                            </nz-tooltip>
                        </span>
                    </label>
                </ng-container>
                <ng-container *ngIf="data.length > 0">
                    <ng-container *ngIf="grid_span === 0">
                        <ng-template [ngTemplateOutlet]="all"></ng-template>
                        <nz-checkbox-group [ngModel]="data" (ngModelChange)="notifySet()"></nz-checkbox-group>
                    </ng-container>
                    <ng-container *ngIf="grid_span !== 0">
                        <nz-checkbox-wrapper class="checkbox-grid-list" (nzOnChange)="groupInGridChange($event)">
                            <nz-row>
                                <nz-col [nzSpan]="grid_span" *ngIf="ui.checkAll">
                                    <ng-template [ngTemplateOutlet]="all"></ng-template>
                                </nz-col>
                                <nz-col [nzSpan]="grid_span" *ngFor="let i of data">
                                    <label nz-checkbox [nzValue]="i.value" [ngModel]="i.checked" [nzDisabled]="i.disabled">{{i.label}}</label>
                                </nz-col>
                            </nz-row>
                        </nz-checkbox-wrapper>
                    </ng-container>
                </ng-container>

                <nz-form-extra *ngIf="schema.description" [innerHTML]="schema.description"></nz-form-extra>
                <nz-form-explain *ngIf="!ui.only_visual && showError">{{error}}</nz-form-explain>
            </div>
        </nz-col>
    </nz-form-item>
    `,
    preserveWhitespaces: false
})
export class CheckboxWidget extends ControlWidget {
    data: SFSchemaEnum[] = [];
    allChecked = false;
    indeterminate = false;
    grid_span: number;
    label: number;
    control: number;
    offset: number;

    reset(value: any) {
        getData(this.schema, this.ui, this.formProperty.formData).subscribe(list => {
            this.data = list;

            this.label = this.ui.span_label;
            this.control = this.ui.span_control;
            if (list.length === 0) {
                this.label = null;
                this.offset = this.ui.span_label;
            }
            this.grid_span = this.ui.grid && this.ui.grid.span > 0 ? this.ui.grid.span : 0;
            this.updateAllChecked();
        });
    }

    notifySet() {
        this.updateAllChecked().setValue(this.data.filter(w => w.checked).map(item => item.value));
    }

    groupInGridChange(values: any[]) {
        this.data.forEach(item => item.checked = values.indexOf(item.value) !== -1);
        this.notifySet();
    }

    onAllChecked(e: Event) {
        e.stopPropagation();
        this.data.forEach(item => item.checked = this.allChecked);
        this.notifySet();
    }

    updateAllChecked(): this {
        if (this.data.every(item => item.checked === false)) {
            this.allChecked = false;
            this.indeterminate = false;
        } else if (this.data.every(item => item.checked === true)) {
            this.allChecked = true;
            this.indeterminate = false;
        } else {
            this.indeterminate = true;
        }
        this.detectChanges();
        return this;
    }
}
