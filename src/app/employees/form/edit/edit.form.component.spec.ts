/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {TranslateModule} from 'ng2-translate';
import {ReactiveFormsModule} from '@angular/forms';
import {CovalentCoreModule} from '@covalent/core';
import {EditEmployeeFormComponent} from './edit.form.component';
import {EmployeeFormComponent} from '../form.component';
import {SelectListComponent} from '../../../../components/select-list/select-list.component';
import {IdInputComponent} from '../../../../components/id-input/id-input.component';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutCardOverComponent} from '../../../../components/layout-card-over/layout-card-over.component';
import {User} from '../../../../services/identity/domain/user.model';
import {Employee} from '../../../../services/office/domain/employee.model';
import {Observable} from 'rxjs';
import {Password} from '../../../../services/identity/domain/password.model';
import {RoleIdentifier} from '../../../../services/identity/domain/role-identifier.model';
import {EmployeesStore} from '../../store/index';
import {Store} from '@ngrx/store';
import {UPDATE} from '../../store/employee.actions';
import * as fromEmployees from '../../store';

let userMock: User = {
  identifier: 'test',
  role: 'test'
};

let employeeMock: Employee = {
  identifier: 'test',
  assignedOffice: 'test',
  givenName: 'test',
  middleName: 'test',
  surname: 'test',
  contactDetails: [
    {
      group: 'BUSINESS',
      type: 'EMAIL',
      value: 'test',
      preferenceLevel: 1
    }
  ]
};

let activatedRoute = {
  data: Observable.of({
    user: userMock
  })
};
let router: Router;

describe('Test employee form component', () => {

  let fixture: ComponentFixture<EditEmployeeFormComponent>;

  let testComponent: EditEmployeeFormComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        LayoutCardOverComponent,
        IdInputComponent,
        SelectListComponent,
        EmployeeFormComponent,
        EditEmployeeFormComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CovalentCoreModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: router},
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: Store, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.returnValue(Observable.empty())
          }
        },
        {
          provide: EmployeesStore, useClass: class {
            dispatch = jasmine.createSpy('dispatch');
            select = jasmine.createSpy('select').and.callFake(selector => {
              if(selector === fromEmployees.getSelectedEmployee) return Observable.of(employeeMock);

              return Observable.empty();
            })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(EditEmployeeFormComponent);
    testComponent = fixture.componentInstance;
  });

  it('should test if employee is updated', async(inject([EmployeesStore], (store: EmployeesStore) => {
    fixture.detectChanges();

    testComponent.formComponent.detailForm.get('password').setValue('newPassword');

    fixture.detectChanges();

    testComponent.formComponent.save();

    fixture.whenStable().then(() => {
      expect(store.dispatch).toHaveBeenCalledWith({ type: UPDATE, payload: {
        employee: employeeMock,
        contactDetails: employeeMock.contactDetails,
        role: userMock.role,
        password: 'newPassword',
        activatedRoute: activatedRoute
      }});
    })

  })));
});
