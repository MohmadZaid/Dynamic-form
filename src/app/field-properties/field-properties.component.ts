import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-field-properties',
  templateUrl: './field-properties.component.html',
  styleUrls: ['./field-properties.component.scss'],
})
export class FieldPropertiesComponent implements OnInit {
  @Input() fieldType!: string;
  fieldForm!: FormGroup;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fieldForm = this.fb.group({
      label: ['', Validators.required],
      placeholder: [''],
      validationMessage: [''],
      options:
        this.fieldType === 'dropdown' || this.fieldType === 'radio'
          ? this.fb.array([this.fb.group({ option: [] })])
          : null,
    });
  }

  get optionsOfForm(): FormArray {
    return this.fieldForm.get('options') as FormArray;
  }

  addType() {
    this.optionsOfForm.push(
      this.fb.group({
        option: ['', Validators.required],
      })
    );
  }

  removeType(i: number) {
    this.optionsOfForm.removeAt(i);
    this.cdRef.detectChanges();
  }

  getFieldData() {
    return this.fieldForm.value;
  }
}
