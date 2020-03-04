// Copyright 2018 Energy Web Foundation
// This file is part of the snarthub Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector,
// incorporated in Zug, Switzerland.
//
// The snarthub Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: slock.it GmbH; Heiko Burkhardt, heiko.burkhardt@slock.it; Martin Kuechler, martin.kuchler@slock.it

import { ProducingAsset, ConsumingAsset } from 'nordicenergy-asset-registry-lib';
import { User } from 'nordicenergy-user-registry-lib';
import { Certificate } from 'nordicenergy-smarthub-lib';
import { Configuration } from 'nordicenergy-utils-general-lib';
import { Demand } from 'nordicenergy-market-lib';
import { IGeneralState } from '../features/general/reducer';

export interface IStoreState {
    configuration: Configuration.Entity;
    producingAssets: ProducingAsset.Entity[];
    consumingAssets: ConsumingAsset.Entity[];
    certificates: Certificate.Entity[];
    demands: Demand.Entity[];
    currentUser: User;
    general: IGeneralState;
}

export interface IActions {
    certificateCreatedOrUpdated: Function;
    currentUserUpdated: Function;
    consumingAssetCreatedOrUpdated: Function;
    demandCreatedOrUpdated: Function;
    demandDeleted: Function;
    producingAssetCreatedOrUpdated: Function;
    configurationUpdated: Function;
}
