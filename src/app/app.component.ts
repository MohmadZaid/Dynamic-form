import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FieldPropertiesComponent } from './field-properties/field-properties.component';

interface FormField {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  validationMessage?: string;
  options?: { option: string }[];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dynamicForm!: FormGroup;
  formFields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.dynamicForm = this.fb.group({});
    console.log(this.dynamicForm.value);
  }

  addField(type: string) {
    const modal = this.modal.create({
      nzTitle: 'Field Details',
      nzContent: FieldPropertiesComponent,
      nzComponentParams: { fieldType: type },
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          const instance = modal.getContentComponent();
          if (instance?.fieldForm.valid) {
            const fieldData = instance.getFieldData();
            this.createField(type, fieldData);
            resolve(true);
          } else {
            reject(false);
          }
        }),
    });
  }

  private createField(type: string, fieldData: any) {
    const fieldName = fieldData.label;
    const newField: FormField = {
      type,
      label: fieldData.label,
      name: fieldName,
      placeholder: fieldData.placeholder,
      validationMessage: fieldData.validationMessage,
      options: fieldData.options,
    };

    this.formFields.push(newField);
    this.dynamicForm.addControl(
      fieldName,
      this.fb.control('', Validators.required)
    );
  }

  removeField(index: number) {
    const field = this.formFields[index];
    this.dynamicForm.removeControl(field.name);
    this.formFields.splice(index, 1);
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      this.message.success('Form Submit Successfully');
      console.log(this.dynamicForm.value);
      this.dynamicForm.reset();
      this.formFields.forEach((field) => {
        this.dynamicForm.removeControl(field.name);
      });
      this.formFields = [];
    }
  }
}
