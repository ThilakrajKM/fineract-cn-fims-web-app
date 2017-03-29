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

import * as customer from './customer.actions';
import {FetchRequest} from '../../../services/domain/paging/fetch-request.model';
import {Customer} from '../../../services/customer/domain/customer.model';

export interface State {
  customers: Customer[];
  totalPages: number,
  totalElements: number,
  loading: boolean;
  fetchRequest: FetchRequest;
}

const initialState: State = {
  customers: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  fetchRequest: null
};

export function reducer(state = initialState, action: customer.Actions): State {

  switch (action.type) {

    case customer.SEARCH: {
      const fetchRequest: FetchRequest = action.payload;

      return Object.assign({}, state, {
        fetchRequest,
        loading: true
      });
    }

    case customer.SEARCH_COMPLETE: {
      const customerPage = action.payload;

      return {
        customers: customerPage.customers,
        loading: false,
        fetchRequest: state.fetchRequest,
        totalElements: customerPage.totalElements,
        totalPages: customerPage.totalPages
      };
    }

    default: {
      return state;
    }
  }
}


export const getCustomers = (state: State) => state.customers;

export const getFetchRequest = (state: State) => state.fetchRequest;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;
