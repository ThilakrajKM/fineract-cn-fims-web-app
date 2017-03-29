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

import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as caseActions from '../case.actions';
import {PortfolioService} from '../../../../../services/portfolio/portfolio.service';

@Injectable()
export class CaseApiEffects {

  constructor(private actions$: Actions, private portfolioService: PortfolioService) { }

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(caseActions.SEARCH)
    .debounceTime(300)
    .map((action: caseActions.SearchAction) => action.payload)
    .switchMap(payload => {
      const nextSearch$ = this.actions$.ofType(caseActions.SEARCH).skip(1);

      return this.portfolioService.getAllCasesForCustomer(payload.customerId, payload.fetchRequest)
        .takeUntil(nextSearch$)
        .map(customerPage => new caseActions.SearchCompleteAction(customerPage))
        .catch(() => of(new caseActions.SearchCompleteAction({
          totalElements: 0,
          totalPages: 0,
          elements: []
        })));
    });


  @Effect()
  createCase$: Observable<Action> = this.actions$
    .ofType(caseActions.CREATE)
    .map((action: caseActions.CreateCaseAction) => action.payload)
    .mergeMap(payload =>
      this.portfolioService.createCase(payload.productId, payload.case)
        .map(() => new caseActions.CreateCaseSuccessAction(payload))
        .catch((error) => of(new caseActions.CreateCaseFailAction(error)))
    );

  @Effect()
  updateCase$: Observable<Action> = this.actions$
    .ofType(caseActions.UPDATE)
    .map((action: caseActions.UpdateCaseAction) => action.payload)
    .mergeMap(payload =>
        this.portfolioService.changeCase(payload.productId, payload.case)
          .map(() => new caseActions.UpdateCaseSuccessAction(payload))
          .catch((error) => of(new caseActions.UpdateCaseFailAction(error)))

    );

}
